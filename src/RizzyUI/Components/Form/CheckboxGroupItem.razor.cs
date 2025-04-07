using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
///     Represents a single checkbox item within a checkbox group.
/// </summary>
public partial class CheckboxGroupItem<TValue> : RzComponent
{
    private static readonly string BaseStyle = "inline-flex items-center";

    private static readonly string CheckboxBaseClass =
        "size-4 rounded-sm border border-outline text-primary-500 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/50  dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:border-transparent dark:checked:bg-primary-500 dark:focus:border-primary-500";

    /// <summary>
    ///     Gets or sets the parent checkbox group context.
    /// </summary>
    [CascadingParameter]
    public CheckboxGroup<TValue>? Parent { get; set; }

    /// <summary>
    ///     Gets or sets the value associated with this checkbox item.
    /// </summary>
    [Parameter]
    [EditorRequired]
    public TValue? Value { get; set; }

    /// <summary>
    ///     Gets or sets the display title for this checkbox item.
    /// </summary>
    [Parameter]
    [EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    ///     Gets or sets optional child content.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     Gets or sets the custom icon to display when a checkbox is checked.
    ///     Defaults to the icon set by the CheckboxGroup it is contained within followed by MdiIcon.CheckBold.
    /// </summary>
    [Parameter]
    public SvgIcon? CheckedIcon { get; set; }

    /// <summary>
    ///     Gets or sets the checked state of the checkbox.
    ///     This property binds to the parent group's selection.
    /// </summary>
    private bool IsChecked
    {
        get => Parent != null && Parent.IsSelected(Value!);
        set => Parent?.ToggleValueAsync(Value!, value);
    }

    /// <summary>
    ///     Gets the CSS class for the checkbox input element.
    /// </summary>
    public string CheckboxClass => CheckboxBaseClass;

    /// <summary>
    ///     Initializes the root element
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        Element = "label";
    }

    /// <summary>
    ///     Initialize correct checkbox icon
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        CheckedIcon = Parent?.CheckedIcon ?? MdiIcon.CheckBold;
    }

    /// <summary>
    ///     Computes the root CSS class for the checkbox group item.
    /// </summary>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, BaseStyle);
    }
}