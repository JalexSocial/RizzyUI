
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Rizzy.Utility;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

interface IHasCheckboxGroupIcon
{
    /// <summary> Gets or sets the custom Blazicon SVG icon to display when a checkbox is checked. Defaults to MdiIcon.CheckBold. </summary>
    public SvgIcon CheckedIcon { get; set; }    
}

/// <xmldoc>
///     Represents a group of checkbox items (<see cref="RzCheckboxGroupItem" />) that support multiple selection.
///     This component must be used within an EditForm.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCheckboxGroup<TValue> : RzComponent<RzCheckboxGroupSlots>, IHasCheckboxGroupStylingProperties, IHasCheckboxGroupIcon
{
    private FieldIdentifier _fieldIdentifier;
    private readonly string _legendId = IdGenerator.UniqueId("rz-cbg-legend");

    [CascadingParameter] private EditContext? EditContext { get; set; }

    /// <summary> Gets or sets the expression for the bound value, used for validation. </summary>
    [Parameter, EditorRequired] public Expression<Func<IList<TValue>>> For { get; set; } = default!;

    /// <summary> Gets or sets the child content, expected to be <see cref="RzCheckboxGroupItem" /> components. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets the name attribute for the checkbox group inputs. If not set, it's inferred from the `For` expression. </summary>
    [Parameter] public string Name { get; set; } = string.Empty;

    /// <summary> Gets or sets the display name for the fieldset, rendered as a screen-reader-only legend. </summary>
    [Parameter] public string? DisplayName { get; set; }

    /// <summary> Gets or sets the orientation of the checkbox group (Vertical or Horizontal). Defaults to Vertical. </summary>
    [Parameter] public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary> Gets or sets the custom Blazicon SVG icon to display when a checkbox is checked. Defaults to MdiIcon.CheckBold. </summary>
    [Parameter] public SvgIcon CheckedIcon { get; set; } = MdiIcon.CheckBold;

    /// <summary> Gets or sets a value indicating whether to show the indicators for each checkbox item. Defaults to true. </summary>
    [Parameter] public bool ShowIndicators { get; set; } = true;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "fieldset";
        if (For == null) throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null) throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);

        if (string.IsNullOrEmpty(Name))
        {
            Name = _fieldIdentifier.FieldName;
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<RzCheckboxGroupSlots>, RzCheckboxGroupSlots> GetDescriptor() => Theme.RzCheckboxGroup;
}