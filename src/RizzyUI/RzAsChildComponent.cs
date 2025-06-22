using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace RizzyUI;

/// <summary>
/// Base class for RizzyUI components that implement the "asChild" composition pattern from shadcn/ui.
/// This pattern allows components to either render their own wrapper element or merge their behavior
/// and styling onto a child element, providing maximum flexibility for component consumers.
/// </summary>
/// <remarks>
/// <para>
/// The asChild pattern is particularly useful for creating highly composable component libraries where
/// components need to work with various element types (e.g., a Button component that can render as a
/// button, anchor, or any other element).
/// </para>
/// <para>
/// When <see cref="AsChild"/> is <c>false</c> (default), the component renders normally using its
/// .razor template. When <see cref="AsChild"/> is <c>true</c>, the component extracts its child content,
/// merges its attributes/behavior onto that child, and renders the child directly.
/// </para>
/// <para>
/// Derived components must implement <see cref="GetAsChildContent"/> to specify which RenderFragment
/// should be used for the asChild pattern, and <see cref="GetComponentAttributes"/> to define which
/// attributes should be merged onto the child element.
/// </para>
/// </remarks>
/// <example>
/// <code>
/// // Normal usage - renders as button
/// &lt;MyButton OnClick="@HandleClick"&gt;Click me&lt;/MyButton&gt;
/// 
/// // AsChild usage - renders as anchor with button behavior
/// &lt;MyButton AsChild="true" OnClick="@HandleClick"&gt;
///     &lt;a href="/home"&gt;Go Home&lt;/a&gt;
/// &lt;/MyButton&gt;
/// </code>
/// </example>
public abstract partial class RzAsChildComponent : RzComponent
{
    /// <summary>
    /// Gets or sets whether the component should render its child content directly with merged attributes
    /// instead of wrapping it in the component's default element.
    /// </summary>
    /// <value>
    /// <c>true</c> to render the child element directly with merged component attributes;
    /// <c>false</c> to render the component normally with its own wrapper element.
    /// Default is <c>false</c>.
    /// </value>
    /// <remarks>
    /// When set to <c>true</c>, the content returned by <see cref="GetAsChildContent"/> must contain
    /// exactly one root element or component. Multiple root elements will cause the component to throw
    /// an <see cref="InvalidOperationException"/> during rendering.
    /// </remarks>
    [Parameter] public bool AsChild { get; set; }

    /// <summary>
    /// Renders the component in asChild mode by cloning the specified child content and merging component attributes onto it.
    /// Throws an <see cref="InvalidOperationException"/> if <see cref="AsChild"/> is <c>false</c> or if the required content is missing.
    /// </summary>
    /// <returns>
    /// A <see cref="RenderFragment"/> that renders the child element with merged attributes when <see cref="AsChild"/> is <c>true</c>.
    /// </returns>
    protected RenderFragment RenderAsChild() => builder =>
    {
        if (!AsChild) 
            throw new InvalidOperationException($"{GetType().Name}: RenderAsChild should not be called when AsChild is false.");
       
        var asChildContent = GetAsChildContent();
        if (asChildContent != null)
        {
            var attributes = GetComponentAttributes();
            var cloned = CloneFragment(asChildContent, attributes);
            builder.AddContent(0, cloned);
        }
        else
        {
            var contentProp = GetType()
                .GetProperties()
                .Where(p => p.PropertyType == typeof(RenderFragment) && p.GetValue(this) == null)
                .Select(p => p.Name)
                .FirstOrDefault() ?? "ChildContent";

            throw new InvalidOperationException(
                $"{GetType().Name}: AsChild requires {contentProp} to be provided with exactly one root element.");
        }
    };

    /// <summary>
    /// When overridden in a derived class, returns the <see cref="RenderFragment"/> that should be used
    /// when the component is rendered in asChild mode.
    /// </summary>
    /// <returns>
    /// The <see cref="RenderFragment"/> to be cloned and enhanced with component attributes when
    /// <see cref="AsChild"/> is <c>true</c>. Typically returns a component's main content parameter
    /// (e.g., ChildContent). May return <c>null</c> if no appropriate content is available.
    /// </returns>
    /// <remarks>
    /// <para>
    /// This method determines which content the asChild pattern operates on. For components with multiple
    /// RenderFragment parameters (e.g., Header, Body, Footer), this typically returns the "main" content fragment.
    /// </para>
    /// <para>
    /// The returned RenderFragment must contain exactly one root element when <see cref="AsChild"/> is <c>true</c>.
    /// Multiple root elements will cause an <see cref="InvalidOperationException"/> during rendering.
    /// </para>
    /// </remarks>
    /// <example>
    /// <code>
    /// // Simple implementation for a component with single content
    /// protected override RenderFragment? GetAsChildContent() => ChildContent;
    /// 
    /// // For a component with multiple fragments
    /// protected override RenderFragment? GetAsChildContent() => Body ?? ChildContent;
    /// </code>
    /// </example>
    protected abstract RenderFragment? GetAsChildContent();
    
    /// <summary>
    /// When overridden in a derived class, returns the attributes that should be applied to either
    /// the component's root element (when <see cref="AsChild"/> is <c>false</c>) or merged onto
    /// the child element (when <see cref="AsChild"/> is <c>true</c>).
    /// </summary>
    /// <returns>
    /// A dictionary of attribute names and values to be applied. Values may be <c>null</c>, in which
    /// case they will be omitted from the rendered output. The dictionary should use case-insensitive
    /// key comparison for consistency with HTML attributes.
    /// </returns>
    /// <remarks>
    /// <para>
    /// This method should return all behavioral and styling attributes that define the component's
    /// functionality, such as CSS classes, event handlers, ARIA attributes, and data attributes.
    /// </para>
    /// <para>
    /// For DOM elements, use lowercase attribute names (e.g., "class", "onclick", "aria-label").
    /// The <see cref="RzComponent.CloneFragment"/> method will handle filtering inappropriate attributes
    /// when applying them to DOM elements versus Blazor components.
    /// </para>
    /// <para>
    /// Consider using <see cref="RzComponent.TwMerge"/> to intelligently merge Tailwind CSS classes
    /// with any additional classes from <see cref="RzComponent.AdditionalAttributes"/>.
    /// </para>
    /// </remarks>
    /// <example>
    /// <code>
    /// protected override Dictionary&lt;string, object?&gt; GetComponentAttributes()
    /// {
    ///     return new Dictionary&lt;string, object?&gt;(StringComparer.OrdinalIgnoreCase)
    ///     {
    ///         ["class"] = TwMerge.Merge("btn btn-primary", AdditionalAttributes?.GetValueOrDefault("class")?.ToString()),
    ///         ["disabled"] = IsDisabled ? true : null,
    ///         ["onclick"] = OnClick.HasDelegate ? OnClick : null,
    ///         ["aria-pressed"] = IsPressed.ToString().ToLowerInvariant()
    ///     };
    /// }
    /// </code>
    /// </example>
    protected abstract Dictionary<string, object?> GetComponentAttributes();
}