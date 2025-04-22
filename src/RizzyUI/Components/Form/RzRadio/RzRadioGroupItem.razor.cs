using Blazicons;
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;

// For RzInputRadio
// For IdGenerator

namespace RizzyUI;

/// <xmldoc>
///     Represents a single radio button item within an <see cref="RzRadioGroup{TValue}" />.
///     Includes support for labels, descriptions, and icons.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroupItem<TValue> : RzComponent
{
    /// <summary> Gets the parent radio group. </summary>
    [CascadingParameter]
    public RzRadioGroup<TValue>? ParentRadioGroup { get; set; }

    /// <summary> Gets or sets the Blazicon SVG icon displayed next to the label (optional). </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Gets or sets the main text label for the radio item. Required. </summary>
    [Parameter]
    [EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary> Gets or sets the value associated with this radio item. </summary>
    [Parameter]
    public TValue? Value { get; set; }

    /// <summary> Gets or sets optional descriptive text displayed below the label. </summary>
    [Parameter]
    public RenderFragment? Description { get; set; }

    /// <summary> Gets or sets the unique ID for the radio input element. Defaults to a generated ID. </summary>
    [Parameter]
    public string Id { get; set; } = IdGenerator.UniqueId("rzrd");

    /// <summary> Optional child content rendered within the text container. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> The effective icon used for the checkmark, determined by the parent group. </summary>
    protected SvgIcon EffectiveCheckboxIcon { get; set; } = default!;

    /// <summary> Gets the CSS classes for the label wrapper element. </summary>
    protected string LabelWrapperClass => Theme.RzRadioGroupItem.LabelWrapper;

    /// <summary> Gets the CSS classes for the radio input element. </summary>
    protected string RadioInputClass => Theme.RzRadioGroupItem.RadioInput;

    /// <summary> Gets the CSS classes for the checkmark icon container span. </summary>
    protected string IconContainerClass => Theme.RzRadioGroupItem.IconContainer;

    /// <summary> Gets the CSS classes for the main clickable container span. </summary>
    protected string ClickableContainerClass => Theme.RzRadioGroupItem.ClickableContainer;

    /// <summary> Gets the CSS classes for the content wrapper div (holding icon and text). </summary>
    protected string ContentWrapperClass => Theme.RzRadioGroupItem.ContentWrapper;

    /// <summary> Gets the CSS classes for the optional leading icon container div. </summary>
    protected string LeadingIconContainerClass => Theme.RzRadioGroupItem.LeadingIconContainer;

    /// <summary> Gets the CSS classes for the text container span (holding label and description). </summary>
    protected string TextContainerClass => Theme.RzRadioGroupItem.TextContainer;

    /// <summary> Gets the CSS classes for the label text span. </summary>
    protected string LabelTextClass => Theme.RzRadioGroupItem.LabelText;

    /// <summary> Gets the CSS classes for the description text span. </summary>
    protected string DescriptionTextClass => Theme.RzRadioGroupItem.DescriptionText;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (ParentRadioGroup == null)
            throw new InvalidOperationException($"{GetType()} must be used within an RzRadioGroup.");

        EffectiveCheckboxIcon = ParentRadioGroup.CheckboxIcon; // Get icon from parent
        ParentRadioGroup.AddRadioItem(this); // Register with parent
    }

    // No RootClass needed as the root is the label with styles applied directly
}