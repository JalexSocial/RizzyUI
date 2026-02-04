
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A set of layered sections of content, known as tab panels, that are displayed one at a time.
/// This is the root component that manages the state for all child tab components.
/// </summary>
public partial class RzTabs : RzComponent<RzTabs.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzTabs component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-2"
    );

    /// <summary>
    /// The value of the tab that should be active when the component is first rendered.
    /// If not provided, the first tab will be selected.
    /// </summary>
    [Parameter]
    public string? DefaultValue { get; set; }

    /// <summary>
    /// The content of the tabs component, which should include a <see cref="TabsList"/> and one or more <see cref="TabsContent"/> components.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTabs;

    /// <summary>
    /// Defines the slots available for styling in the RzTabs component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("tabs")]
        public string? Base { get; set; }
    }
}