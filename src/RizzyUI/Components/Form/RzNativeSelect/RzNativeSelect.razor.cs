
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A form component that renders a native &lt;select&gt; element with custom styling matching the design system.
/// Supports generic value binding.
/// </summary>
/// <typeparam name="TValue">The type of the value being bound (e.g., string, int, enum).</typeparam>
public partial class RzNativeSelect<TValue> : InputBase<TValue, RzNativeSelectSlots>, IHasRzNativeSelectStylingProperties
{
    /// <summary>
    /// Gets or sets the child content, typically <see cref="RzNativeSelectOption"/> or <see cref="RzNativeSelectOptGroup"/> components,
    /// or standard HTML &lt;option&gt; elements.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets an event callback that is invoked when the value changes.
    /// </summary>
    [Parameter] public EventCallback<TValue> ValueChanged { get; set; }

    /// <summary>
    /// Gets the input attributes with 'class' and 'style' removed to prevent duplication on the inner select element,
    /// as these are applied to the wrapper via AdditionalAttributes.
    /// </summary>
    protected Dictionary<string, object?> SanitizedInputAttributes
    {
        get
        {
            var attrs = new Dictionary<string, object?>(InputAttributes);
            attrs.Remove("class");
            attrs.Remove("style");
            return attrs;
        }
    }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        // No specific AriaLabel default needed as InputBase doesn't enforce it, but we can set one if desired.
        // If specific ARIA handling is needed, it can be added here.
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzNativeSelectSlots>, RzNativeSelectSlots> GetDescriptor() => Theme.RzNativeSelect;
}