
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a styled link component that renders an anchor (<c>a</c>) element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzLink : RzComponent<RzLink.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzLink component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "font-medium underline-offset-2 focus:outline-hidden",
        variants: new()
        {
            [l => ((RzLink)l).Color] = new Variant<SemanticColor, Slots>
            {
                [SemanticColor.Primary] = "text-primary",
                [SemanticColor.Secondary] = "text-secondary",
                [SemanticColor.Success] = "text-success",
                [SemanticColor.Warning] = "text-warning",
                [SemanticColor.Destructive] = "text-destructive",
                [SemanticColor.Info] = "text-info",
                [SemanticColor.Foreground] = "text-foreground",
                [SemanticColor.None] = ""
            },
            [l => ((RzLink)l).Underline] = new Variant<bool, Slots>
            {
                [true] = "hover:underline focus:underline"
            }
        }
    );

    /// <summary> Gets or sets the URL to which the link navigates. If null or empty, defaults to "#". </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Gets or sets the color of the link. Defaults to <see cref="SemanticColor.Primary" />.
    /// </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.Primary; 

    /// <summary> Gets or sets whether the link should be underlined on hover and focus. Defaults to true. </summary>
    [Parameter]
    public bool Underline { get; set; } = true;

    /// <summary> Gets or sets the content to be displayed inside the link (e.g., text or icons). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Sets default element to <c>a</c> for the link component.
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "a";
    }

    /// <summary>
    /// Invoked when a component's parameters have been set or updated.
    /// Updates the <c>Href</c> parameter to a default value if it has not been specified.
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Href ??= "#";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzLink;

    /// <summary>
    /// Defines the slots available for styling in the RzLink component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}