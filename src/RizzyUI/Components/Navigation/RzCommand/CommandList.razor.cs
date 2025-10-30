
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The container that dynamically renders the list of filtered and sorted command items.
/// </summary>
public partial class CommandList : RzComponent<CommandList.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandList component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto"
    );

    /// <summary>
    /// Gets the parent <see cref="RzCommand"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzCommand? ParentCommand { get; set; }

    /// <summary>
    /// Gets or sets the child content, which should include <see cref="CommandItem"/>, <see cref="CommandGroup"/>, and <see cref="CommandEmpty"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCommand == null)
            throw new InvalidOperationException($"{nameof(CommandList)} must be used within an {nameof(RzCommand)}.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandList;

    /// <summary>
    /// Defines the slots available for styling in the CommandList component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the list container.
        /// </summary>
        [Slot("command-list")]
        public string? Base { get; set; }
    }
}