
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A layout component for a single form field, controlling the orientation of its parts (label, content, description).
/// </summary>
public partial class Field : RzComponent<FieldSlots>, IHasFieldStylingProperties
{
    /// <summary>
    /// Gets or sets the content of the field, typically a `FieldLabel`, `FieldContent`, and `FieldDescription`.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the layout orientation of the field's children.
    /// Defaults to <see cref="FieldOrientation.Vertical"/>.
    /// </summary>
    [Parameter]
    public FieldOrientation Orientation { get; set; } = FieldOrientation.Vertical;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<FieldSlots>, FieldSlots> GetDescriptor() => Theme.Field;
}

/// <summary>
/// Specifies the layout orientation for a Field component.
/// </summary>
public enum FieldOrientation
{
    /// <summary>
    /// Arranges field elements vertically.
    /// </summary>
    Vertical,
    /// <summary>
    /// Arranges field elements horizontally.
    /// </summary>
    Horizontal,
    /// <summary>
    /// Arranges field elements vertically on small screens and horizontally on larger screens.
    /// </summary>
    Responsive
}