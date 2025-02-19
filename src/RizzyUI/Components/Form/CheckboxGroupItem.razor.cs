using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a single checkbox item within a checkbox group.
/// </summary>
public partial class CheckboxGroupItem<TValue> : RizzyComponent
{
    private static readonly string BaseStyle = "inline-flex items-center";
    private static readonly string CheckboxBaseClass = "size-4 rounded-sm border border-outline text-primary-500 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/50 dark:border-outline-dark dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:border-transparent dark:checked:bg-primary-500 dark:focus:border-primary-500";

    /// <summary>
    /// Gets or sets the parent checkbox group context.
    /// </summary>
    [CascadingParameter]
    public CheckboxGroup<TValue>? Parent { get; set; }

    /// <summary>
    /// Gets or sets the value associated with this checkbox item.
    /// </summary>
    [Parameter, EditorRequired]
    public TValue? Value { get; set; }

    /// <summary>
    /// Gets or sets the display title for this checkbox item.
    /// </summary>
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets optional child content.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the checked state of the checkbox.
    /// This property binds to the parent group's selection.
    /// </summary>
    private bool isChecked
    {
        get => Parent != null && Parent.IsSelected(Value!);
        set => Parent?.ToggleValueAsync(Value!, value);
    }

    /// <summary>
    /// Computes the root CSS class for the checkbox group item.
    /// </summary>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, BaseStyle);

    /// <summary>
    /// Gets the CSS class for the checkbox input element.
    /// </summary>
    public string CheckboxClass => CheckboxBaseClass;
}
