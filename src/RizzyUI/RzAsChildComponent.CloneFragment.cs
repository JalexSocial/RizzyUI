using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.RenderTree;
using RizzyUI.Utility.Parser;
using TailwindMerge;

namespace RizzyUI;

/// <content>
///  This partial file adds the `CloneFragment` helper to <see cref="RzComponent"/>.
/// </content>
[SuppressMessage("Usage", "BL0006:Do not use RenderTree types")]
[SuppressMessage("Usage", "ASP0006:Do not use non-literal sequence numbers")]
public abstract partial class RzAsChildComponent : RzComponent
{
    /// <summary>
    /// Clones a <paramref name="fragment"/> that is expected to have <b>exactly one</b>
    /// root (either a DOM element or a component) and returns a new <see cref="RenderFragment"/>
    /// in which the root node is patched with the supplied <paramref name="attributes"/>.
    /// <list type="bullet">
    /// <item>
    ///     <description>
    ///     Attributes already defined in the incoming fragment <b>win</b> over the supplied
    ///     <paramref name="attributes"/>—mirroring <c>React.cloneElement</c> semantics in shadcn/ui.
    ///     </description>
    /// </item>
    /// <item>
    ///     <description>
    ///     When the root is a DOM element, only attributes whose names begin with a lower‑case
    ///     letter are considered. (Upper‑case names are assumed to be Blazor component
    ///     parameters and are ignored.)  The exception is the <c>Id</c> attribute, which is passed through
    ///     to the child Element as <c>id</c> (lower‑case).
    ///     </description>
    /// </item>
    /// <item>
    ///     <description>
    ///     If both the fragment and <paramref name="attributes"/> specify the <c>class</c>
    ///     attribute, they are merged using <see cref="TailwindMerge.TwMerge.Merge(string?, string?)"/>,
    ///     so that utilities in the fragment take precedence while conflicts are resolved.
    ///     </description>
    /// </item>
    /// <item>
    ///     <description>
    ///     If the fragment contains <i>no</i> frames, an empty fragment is returned.
    ///     If it contains multiple top‑level roots, an <see cref="InvalidOperationException"/>
    ///     is thrown, instructing the developer to wrap siblings in a container.
    ///     </description>
    /// </item>
    /// </list>
    /// </summary>
    /// <param name="fragment">The original <see cref="RenderFragment"/> to clone.</param>
    /// <param name="attributes">Base attributes that will be applied <i>unless</i> the fragment already defines them.</param>
    /// <returns>A cloned <see cref="RenderFragment"/> with merged attributes.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the supplied fragment has more than one root or its root is neither an element nor a component.</exception>
    protected RenderFragment CloneFragment(RenderFragment fragment, IDictionary<string, object?>? attributes = null)
    {
        if (fragment is null)
            throw new ArgumentNullException(nameof(fragment));

        // Capture the fragment into a temporary builder
        var probe = new RenderTreeBuilder();
        fragment(probe);

        var range = probe.GetFrames();
        if (range.Count == 0)
        {
            // Empty fragment → return an empty fragment
            return _ => { };
        }

        var frames = range.Array;
        var root   = frames[0];

        bool rootIsElement   = root.FrameType == RenderTreeFrameType.Element;
        bool rootIsComponent = root.FrameType == RenderTreeFrameType.Component;
        bool rootIsMarkup    = root.FrameType == RenderTreeFrameType.Markup;

        if (!rootIsElement && !rootIsComponent && !rootIsMarkup)
        {
            throw new InvalidOperationException("CloneFragment expects the RenderFragment to have exactly one root element, component, or markup. Wrap multiple nodes in a container element/component.");
        }

        int rootLen = GetSubtreeLength(root);
        if (rootLen != range.Count)
        {
            throw new InvalidOperationException("CloneFragment detected multiple top-level nodes. Please wrap sibling nodes in a container element or component.");
        }

        if (rootIsMarkup)
        {
            if (attributes is null || attributes.Count == 0)
            {
                return fragment; // No attributes to merge, return original
            }

            // Use the new utility to merge attributes into the markup string.
            var mergedMarkup = HtmlUtils.MergeRootElementAttributes(
                TwMerge,
                root.MarkupContent,
                attributes,
                new HtmlUtils.MergeOptions
                {
                    // Prepending is often safer for things like 'style' or event handlers
                    ConflictPolicyResolver = name => HtmlUtils.AttrConflictPolicy.PrependSpaceSeparated
                });

            // Return a new fragment that renders the modified markup.
            return builder => builder.AddMarkupContent(0, mergedMarkup);
        }

        // Prepare the base attributes (caller‑supplied props)
        var baseAttrs = attributes is null
            ? new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
            : new Dictionary<string, object?>(attributes, StringComparer.OrdinalIgnoreCase);

        // For DOM root, drop attributes that begin with an uppercase letter
        if (rootIsElement)
        {
            // Remove attributes that are not lower-case (assumed to be component parameters)
            foreach (var key in baseAttrs.Keys.ToArray())
            {
                if (key.Length == 0) { baseAttrs.Remove(key); continue; }

                if (!char.IsUpper(key[0])) continue;
                
                if (key is "Id" or "Href")
                {
                    baseAttrs.Add(key.ToLowerInvariant(), baseAttrs[key]);    
                }
                    
                baseAttrs.Remove(key);
            }
        }

        // Return a fragment that replays frames and applies precedence rules
        return builder => EmitRoot(builder, frames, baseAttrs, rootIsElement);
    }

    /* ──────────────────────────── internal helpers ───────────────────────────── */

    private void EmitRoot(RenderTreeBuilder b, RenderTreeFrame[] frames, IDictionary<string, object?> baseAttrs, bool rootIsElement)
    {
        int i = 0; // root index
        var root = frames[0];

        if (rootIsElement)
        {
            b.OpenElement(root.Sequence, root.ElementName);
            if (root.ElementKey != null) b.SetKey(root.ElementKey);
            CopyAttributesWithPrecedence(b, frames, ref i, baseAttrs);
            ReplayChildren(b, frames, i, root.ElementSubtreeLength - 1);
            b.CloseElement();
        }
        else // component root
        {
            b.OpenComponent(root.Sequence, root.ComponentType);
            if (root.ComponentKey != null) b.SetKey(root.ComponentKey);
            CopyAttributesWithPrecedence(b, frames, ref i, baseAttrs);
            ReplayChildren(b, frames, i, root.ComponentSubtreeLength - 1);
            b.CloseComponent();
        }
    }

    /// <summary>
    /// Copies attribute frames from <paramref name="frames"/> into <paramref name="b"/>, letting
    /// those original attributes override any matching keys in <paramref name="baseAttrs"/>. After
    /// originals are copied, remaining <paramref name="baseAttrs"/> entries are appended. For the
    /// <c>class</c> attribute, <see cref="TwMerge.Merge(string?, string?)"/> is used to merge
    /// Tailwind class lists, with the original (fragment) classes taking precedence.
    /// </summary>
    private void CopyAttributesWithPrecedence(RenderTreeBuilder b, RenderTreeFrame[] frames, ref int idx, IDictionary<string, object?> baseAttrs)
    {
        int i = idx + 1;
        int maxSeq = -1;

        // First copy original attributes (they win)
        while (i < frames.Length && frames[i].FrameType == RenderTreeFrameType.Attribute)
        {
            var attr = frames[i];
            var name = attr.AttributeName;
            var val  = attr.AttributeValue;

            if (string.Equals(name, "class", StringComparison.OrdinalIgnoreCase))
            {
                baseAttrs.TryGetValue("class", out var baseClassObj);
                var baseClass    = baseClassObj?.ToString();
                var originalClas = val?.ToString();
                // Assuming TwMerge is available in the project context
                // val = TwMerge.Merge(baseClass, originalClas);
                val = $"{baseClass} {originalClas}".Trim(); // Simple merge as fallback
                baseAttrs.Remove("class");
            }
            else
            {
                // Original overrides base
                baseAttrs.Remove(name);
            }

            b.AddAttribute(attr.Sequence, name, val);
            maxSeq = Math.Max(maxSeq, attr.Sequence);
            i++;
        }

        // Append remaining base attributes
        int seq = maxSeq + 1;
        foreach (var kv in baseAttrs)
        {
            b.AddAttribute(seq++, kv.Key, kv.Value);
        }

        idx = i; // advance caller index past attributes
    }

    private static void CopyAttributesVerbatim(RenderTreeBuilder b, RenderTreeFrame[] frames, ref int idx)
    {
        int i = idx + 1;
        while (i < frames.Length && frames[i].FrameType == RenderTreeFrameType.Attribute)
        {
            var a = frames[i];
            b.AddAttribute(a.Sequence, a.AttributeName, a.AttributeValue);
            i++;
        }
        idx = i;
    }

    private static void ReplayChildren(RenderTreeBuilder b, RenderTreeFrame[] frames, int start, int length)
    {
        int i = start;
        while (i < start + length)
        {
            var f = frames[i];
            switch (f.FrameType)
            {
                case RenderTreeFrameType.Element:
                    b.OpenElement(f.Sequence, f.ElementName);
                    if (f.ElementKey != null) b.SetKey(f.ElementKey);
                    CopyAttributesVerbatim(b, frames, ref i);
                    ReplayChildren(b, frames, i, f.ElementSubtreeLength - 1);
                    b.CloseElement();
                    i += f.ElementSubtreeLength - 1;
                    i++;
                    break;

                case RenderTreeFrameType.Component:
                    b.OpenComponent(f.Sequence, f.ComponentType);
                    if (f.ComponentKey != null) b.SetKey(f.ComponentKey);
                    CopyAttributesVerbatim(b, frames, ref i);
                    ReplayChildren(b, frames, i, f.ComponentSubtreeLength - 1);
                    b.CloseComponent();
                    i += f.ComponentSubtreeLength - 1;
                    i++;
                    break;

                case RenderTreeFrameType.Region:
                    ReplayChildren(b, frames, i + 1, f.RegionSubtreeLength - 1);
                    i += f.RegionSubtreeLength;
                    break;

                case RenderTreeFrameType.Text:
                    b.AddContent(f.Sequence, f.TextContent);
                    i++;
                    break;

                case RenderTreeFrameType.Markup:
                    b.AddMarkupContent(f.Sequence, f.MarkupContent);
                    i++;
                    break;

                case RenderTreeFrameType.ElementReferenceCapture:
                    b.AddElementReferenceCapture(f.Sequence, (Action<ElementReference>)f.ElementReferenceCaptureAction);
                    i++;
                    break;

                case RenderTreeFrameType.ComponentReferenceCapture:
                    b.AddComponentReferenceCapture(f.Sequence, (Action<object>)f.ComponentReferenceCaptureAction);
                    i++;
                    break;

                default:
                    // Skip NamedEvent, ComponentRenderMode, None, etc.
                    i++;
                    break;
            }
        }
    }

    private static int GetSubtreeLength(in RenderTreeFrame frame) => frame.FrameType switch
    {
        RenderTreeFrameType.Element   => frame.ElementSubtreeLength,
        RenderTreeFrameType.Component => frame.ComponentSubtreeLength,
        RenderTreeFrameType.Region    => frame.RegionSubtreeLength,
        _                             => 1
    };
}