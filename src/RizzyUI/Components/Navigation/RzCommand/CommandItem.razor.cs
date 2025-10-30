
using Microsoft.AspNetCore.Components;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a single selectable item within a command menu. Its content is defined as a template
/// and it registers itself with the parent <see cref="RzCommand"/> component.
/// </summary>
public partial class CommandItem : RzComponent<CommandItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    );

    private string _serializedKeywords = "[]";

    /// <summary>
    /// Gets the parent <see cref="RzCommand"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzCommand? ParentCommand { get; set; }

    /// <summary>
    /// Gets the parent <see cref="CommandGroup"/> component, if this item is nested within one.
    /// </summary>
    [CascadingParameter]
    protected CommandGroup? ParentGroup { get; set; }

    /// <summary>
    /// Gets or sets the unique value for this item, used for selection and filtering. If not provided, it will be inferred from the text content.
    /// </summary>
    [Parameter]
    public string? Value { get; set; }

    /// <summary>
    /// Gets or sets a collection of keywords to assist with filtering.
    /// </summary>
    [Parameter]
    public IEnumerable<string> Keywords { get; set; } = Enumerable.Empty<string>();

    /// <summary>
    /// Gets or sets the content to be rendered inside the item.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this item is disabled and cannot be selected.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this item should always be rendered, regardless of the search query.
    /// </summary>
    [Parameter]
    public bool ForceMount { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCommand == null)
            throw new InvalidOperationException($"{nameof(CommandItem)} must be used within an {nameof(RzCommand)}.");
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        _serializedKeywords = JsonSerializer.Serialize(Keywords);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandItem;

    /// <summary>
    /// Defines the slots available for styling in the CommandItem component.
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