
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines a client-side template for rendering data-bound items in an <see cref="RzCommand"/> component.
/// The content is rendered by Alpine.js for each item from a data source.
/// </summary>
public partial class CommandItemTemplate : RzComponent<CommandItemTemplate.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandItemTemplate. This styling is applied to the cloned item.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    );

    [CascadingParameter]
    protected RzCommand? ParentCommand { get; set; }

    /// <summary>
    /// Gets or sets the render fragment that defines the template for each item.
    /// The template can use Alpine directives to bind to an `item` object in the scope (e.g., x-text="item.name").
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCommand == null)
            throw new InvalidOperationException($"{nameof(CommandItemTemplate)} must be used within an {nameof(RzCommand)}.");

        // The Id of this component becomes the Id of the template element
        Id = $"{ParentCommand.Id}-data-item-template";
        ParentCommand.DataItemTemplateId = Id;
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandItemTemplate;

    /// <summary>
    /// Defines the slots for styling the CommandItemTemplate.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the item's root element.
        /// </summary>
        [Slot("command-item")]
        public string? Base { get; set; }
    }
}