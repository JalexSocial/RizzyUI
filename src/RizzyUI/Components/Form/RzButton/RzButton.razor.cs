using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a clickable button with customizable styling, variant, and size. Styling is handled by the active theme.
/// </summary>
public partial class RzButton : RzComponent<RzButton.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzButton component.
    /// This is used by themes as the base definition and can be overridden.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer rounded-md",
        variants: new()
        {
            [b => ((RzButton)b).Variant] = new Variant<ButtonVariant, Slots>
            {
                [ButtonVariant.Primary] = "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                [ButtonVariant.Secondary] = "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90",
                [ButtonVariant.Destructive] = "bg-destructive text-white shadow-xs hover:bg-destructive/90",
                [ButtonVariant.Ghost] = "shadow-none hover:bg-accent hover:text-accent-foreground",
                [ButtonVariant.Accent] = "bg-accent text-accent-foreground shadow-xs hover:bg-accent/90",
                [ButtonVariant.Inverse] = "bg-foreground text-background shadow-xs hover:bg-foreground/90",
                [ButtonVariant.Information] = "bg-info text-info-foreground shadow-xs hover:bg-info/90",
                [ButtonVariant.Warning] = "bg-warning text-warning-foreground shadow-xs hover:bg-warning/90",
                [ButtonVariant.Success] = "bg-success text-success-foreground shadow-xs hover:bg-success/90"
            },
            [b => ((RzButton)b).Size] = new Variant<Size, Slots>
            {
                [Size.ExtraSmall] = "gap-1 h-7 px-2.5 text-xs",
                [Size.Small] = "gap-1.5 h-8 px-3",
                [Size.Medium] = "gap-2 h-9 px-4 py-2",
                [Size.Large] = "gap-2 h-10 px-6",
                [Size.ExtraLarge] = "gap-2.5 h-12 px-8 text-lg"
            },
            [b => ((RzButton)b).Animate] = new Variant<bool, Slots>
            {
                [true] = "transform active:scale-95 motion-reduce:transition-none transition-transform"
            }
        },
        compoundVariants: new()
        {
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Primary) { Class = "border border-primary text-primary bg-transparent hover:bg-primary/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Secondary) { Class = "border border-secondary text-foreground bg-transparent hover:bg-secondary/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Destructive) { Class = "border border-destructive text-destructive bg-transparent hover:bg-destructive/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Accent) { Class = "border border-accent text-foreground bg-transparent hover:bg-accent/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Inverse) { Class = "border border-foreground text-foreground bg-transparent hover:bg-foreground/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Information) { Class = "border border-info text-info bg-transparent hover:bg-info/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Warning) { Class = "border border-warning text-warning bg-transparent hover:bg-warning/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Success) { Class = "border border-success text-success bg-transparent hover:bg-success/10" },
            new(b => ((RzButton)b).Outline && ((RzButton)b).Variant == ButtonVariant.Ghost) { Class = "border border-transparent" }
        }
    );

    /// <summary>
    /// Gets or sets the parent <see cref="RzButtonGroup"/> this component belongs to, if any.
    /// This is provided via a cascading parameter.
    /// </summary>
    [CascadingParameter]
    public RzButtonGroup? Group { get; set; }

    /// <summary>
    /// Gets or sets the accessible label for the button, used for screen readers.
    /// If not provided, it defaults to a localized value.
    /// </summary>
    [Parameter]
    public string? AssistiveLabel { get; set; }

    /// <summary>
    /// Gets or sets the visual style variant of the button. Defaults to <see cref="ButtonVariant.Primary"/>.
    /// </summary>
    [Parameter]
    public ButtonVariant Variant { get; set; } = ButtonVariant.Primary;

    /// <summary>
    /// Gets or sets the size of the button. Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets a value indicating whether the button should have an outline style. Defaults to false.
    /// </summary>
    [Parameter]
    public bool Outline { get; set; }

    /// <summary>
    /// Gets or sets the text label displayed on the button. Used if <see cref="ChildContent"/> is not provided.
    /// </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets a value indicating whether to enable the button's click animation. Defaults to true.
    /// </summary>
    [Parameter]
    public bool Animate { get; set; } = true;

    /// <summary>
    /// Gets or sets the optional content to be rendered inside the button element. Overrides the <see cref="Label"/> property.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the effective assistive label for the `aria-label` attribute.
    /// </summary>
    protected string EffectiveAssistiveLabel => AssistiveLabel ?? Localizer["RzButton.AssistiveLabelDefault"];

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "button";
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Group?.AddButton(this);
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzButton;

    /// <summary>
    /// Defines the slots available for styling in the RzButton component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root element of the button.
        /// </summary>
        public string? Base { get; set; }
    }
}