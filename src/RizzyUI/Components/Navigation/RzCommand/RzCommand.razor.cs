
using Microsoft.AspNetCore.Components;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines when the data for the command menu should be fetched.
/// </summary>
public enum FetchTrigger
{
    /// <summary>
    /// Fetch the data as soon as the component is initialized.
    /// </summary>
    Immediate,
    /// <summary>
    /// Fetch the data only when the user first interacts with (opens) the command menu.
    /// </summary>
    OnOpen
}

/// <summary>
/// A highly interactive and accessible command menu component, inspired by cmdk and shadcn/ui.
/// It serves as the root container and state manager for the entire command menu family.
/// </summary>
public partial class RzCommand : RzComponent<RzCommand.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCommand component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground"
    );

    private string _serializedItems = "[]";

    /// <summary>
    /// Gets the unique ID for the JSON data script tag.
    /// </summary>
    protected string DataScriptId => $"{Id}-data";

    /// <summary>
    /// Internal property to hold the ID of the CommandItemTemplate.
    /// </summary>
    internal string? DataItemTemplateId { get; set; }

    /// <summary>
    /// Gets or sets the child content, which should include the various Command components like CommandInput and CommandList.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a collection of command items to be rendered dynamically from a data source.
    /// These items are rendered on the client side by Alpine.js. The objects in the collection will be serialized to JSON.
    /// </summary>
    [Parameter]
    public IEnumerable<ICommandItemData> Items { get; set; } = [];

    /// <summary>
    /// Gets or sets a URL from which to fetch the command items as a JSON array.
    /// If this is set, the `Items` parameter is ignored.
    /// </summary>
    [Parameter]
    public string? ItemsUrl { get; set; }

    /// <summary>
    /// Gets or sets when to trigger the data fetch if `ItemsUrl` is provided.
    /// Defaults to `FetchTrigger.Immediate`.
    /// </summary>
    [Parameter]
    public FetchTrigger FetchTrigger { get; set; } = FetchTrigger.Immediate;

    /// <summary>
    /// Gets or sets a value indicating whether filtering should be performed on the server.
    /// If true, the search query will be appended to the `ItemsUrl` as `?q={query}`.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool ServerFiltering { get; set; }

    /// <summary>
    /// Gets or sets the accessible name for the command menu.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the component should automatically filter and sort items based on the search query.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool ShouldFilter { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether keyboard navigation should wrap around from the last item to the first, and vice-versa.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool Loop { get; set; }

    /// <summary>
    /// Gets or sets the maximum number of filtered items rendered in the list at once.
    /// Defaults to 100.
    /// </summary>
    [Parameter]
    public int MaxRender { get; set; } = 100;

    /// <summary>
    /// Gets or sets the currently selected value. This can be used to programmatically control the selection.
    /// </summary>
    [Parameter]
    public string? SelectedValue { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzCommand.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCommand.DefaultAriaLabel"];

        if (string.IsNullOrEmpty(ItemsUrl) && Items.Any())
        {
            _serializedItems = JsonSerializer.Serialize(Items, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }
        else
        {
            _serializedItems = "[]";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommand;

    /// <summary>
    /// Defines the slots available for styling in the RzCommand component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main command container.
        /// </summary>
        [Slot("command")]
        public string? Base { get; set; }
    }
}