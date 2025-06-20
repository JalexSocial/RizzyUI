using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.RenderTree;
#pragma warning disable BL0006

namespace RizzyUI.Extensions;

/// <summary>
/// Helper extensions to work with RenderFragment
/// </summary>
public static class RenderFragmentExtensions
{
    /// <summary>
    /// Clones a RenderFragment, allowing you to add or override existing attributes.
    /// </summary>
    /// <param name="fragment"></param>
    /// <param name="extra"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public static RenderFragment CloneElementFrames(
        this RenderFragment fragment,
        IDictionary<string, object>? overrides = null)
    {
        if (fragment is null) throw new ArgumentNullException(nameof(fragment));

        /* Capture original frames */
        var probe = new RenderTreeBuilder();
        fragment(probe);

        var range       = probe.GetFrames();
        var frames      = range.Array;
        var frameCount  = range.Count;

        /* Index of first component */
        var firstComp   = Array.FindIndex(frames, 0, frameCount,
                          f => f.FrameType == RenderTreeFrameType.Component);

        if (firstComp < 0)           // nothing to patch
            return fragment;

        overrides ??= new Dictionary<string, object>();

        /* 3Produce cloned fragment */
        return b => EmitSubtree(
            b, frames, 0, frameCount,
            firstComp, overrides);
    }

    /* ----------------------------------------------------------------- */

    private static void EmitSubtree(
        RenderTreeBuilder b,
        RenderTreeFrame[] f,
        int start, int length,
        int firstComp, IDictionary<string, object> overrides)
    {
        int i = start;

        while (i < start + length)
        {
            var frame = f[i];

            switch (frame.FrameType)
            {
                case RenderTreeFrameType.Element:
                    b.OpenElement(frame.Sequence, frame.ElementName);
                    CopyAttributes(b, f, ref i);          // i now points past attrs
                    EmitSubtree(b, f,
                        i, GetSubtreeLength(frame) - 1,
                        firstComp, overrides);
                    i += GetSubtreeLength(frame) - 1;
                    b.CloseElement();
                    i++;
                    break;

                case RenderTreeFrameType.Component:
                    b.OpenComponent(frame.Sequence, frame.ComponentType);
                    bool patch = (i == firstComp);
                    CopyAttributes(b, f, ref i, patch ? overrides : null);
                    EmitSubtree(b, f,
                        i, GetSubtreeLength(frame) - 1,
                        firstComp, overrides);
                    i += GetSubtreeLength(frame) - 1;
                    b.CloseComponent();
                    i++;
                    break;

                case RenderTreeFrameType.Text:
                    b.AddContent(frame.Sequence, frame.TextContent);
                    i++;
                    break;

                case RenderTreeFrameType.Markup:
                    b.AddMarkupContent(frame.Sequence, frame.MarkupContent);
                    i++;
                    break;

                case RenderTreeFrameType.Region:
                    // just recurse through its children
                    EmitSubtree(b, f,
                        i + 1, GetSubtreeLength(frame) - 1,
                        firstComp, overrides);
                    i += GetSubtreeLength(frame);
                    break;

                case RenderTreeFrameType.ElementReferenceCapture:
                    b.AddElementReferenceCapture(
                        frame.Sequence,
                        (Action<ElementReference>)frame.ElementReferenceCaptureAction);
                    i++;
                    break;

                case RenderTreeFrameType.ComponentReferenceCapture:
                    b.AddComponentReferenceCapture(
                        frame.Sequence,
                        (Action<object>)frame.ComponentReferenceCaptureAction);
                    i++;
                    break;

                default:
                    i++;   // skip unknown/None
                    break;
            }
        }
    }

    /* ---------- helpers ------------------------------------------------ */

    private static void CopyAttributes(
        RenderTreeBuilder b,
        RenderTreeFrame[] f,
        ref int index,
        IDictionary<string, object>? patch = null)
    {
        int i = index + 1;
        while (i < f.Length && f[i].FrameType == RenderTreeFrameType.Attribute)
        {
            var attr = f[i];
            object value = attr.AttributeValue;
            if (patch != null && patch.TryGetValue(attr.AttributeName, out var v))
            {
                value = v;
                patch.Remove(attr.AttributeName);
            }

            b.AddAttribute(attr.Sequence, attr.AttributeName, value);
            i++;
        }

        if (patch != null)
            foreach (var kv in patch)
                b.AddAttribute(0 /* auto seq */, kv.Key, kv.Value);

        index = i;    // caller continues after attributes
    }

    private static int GetSubtreeLength(in RenderTreeFrame frame) =>
        frame.FrameType switch
        {
            RenderTreeFrameType.Element    => frame.ElementSubtreeLength,
            RenderTreeFrameType.Component  => frame.ComponentSubtreeLength,
            RenderTreeFrameType.Region     => frame.RegionSubtreeLength,
            _                              => 1   // leaf
        };
}