
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Organizes form content into sections with an optional title and description, supporting different layouts.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzFormSection : RzComponent<RzFormSection.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzFormSection component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.Title] = "text-base/7 font-semibold text-foreground",
            [s => s.Description] = "text-sm text-foreground"
        },
        variants: new()
        {
            [s => ((RzFormSection)s).Layout] = new Variant<SectionLayout, Slots>
            {
                [SectionLayout.TwoColumn] = new()
                {
                    [s => s.Base] = "md:flex md:space-x-5",
                    [s => s.DescriptionContainer] = "md:w-1/3 md:flex-none",
                    [s => s.ContentContainer] = "space-y-6 md:w-1/2"
                },
                [SectionLayout.Stacked] = new()
                {
                    [s => s.Base] = "mb-5",
                    [s => s.DescriptionContainer] = "pb-5 mb-10 border-b border-outline"
                }
            }
        }
    );

    /// <summary> The title of the form section. Required. </summary>
    [Parameter]
    [EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary> Optional descriptive content for the section. </summary>
    [Parameter]
    public RenderFragment? Description { get; set; }

    /// <summary> The main content of the form section (e.g., input fields). </summary>
    [Parameter]
    public RenderFragment? Content { get; set; }

    /// <summary> The layout style for the section (Stacked or TwoColumn). Defaults to TwoColumn. </summary>
    [Parameter]
    public SectionLayout Layout { get; set; } = SectionLayout.TwoColumn;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzFormSection;

    /// <summary>
    /// Defines the slots available for styling in the RzFormSection component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main section container.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the container of the title and description.
        /// </summary>
        public string? DescriptionContainer { get; set; }
        /// <summary>
        /// The slot for the title element.
        /// </summary>
        public string? Title { get; set; }
        /// <summary>
        /// The slot for the description element.
        /// </summary>
        public string? Description { get; set; }
        /// <summary>
        /// The slot for the main content container.
        /// </summary>
        public string? ContentContainer { get; set; }
    }
}