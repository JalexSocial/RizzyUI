
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.Json.Serialization;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A calendar component for selecting dates, ranges, and times.
/// Replicates shadcn/ui visual style while using Vanilla Calendar Pro for logic.
/// </summary>
public partial class RzCalendar : RzComponent<RzCalendar.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCalendar component.
    /// Matches shadcn/ui calendar styles.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "p-3",
        slots: new()
        {
            [s => s.Root] = "w-fit bg-card border border-border rounded-md shadow-sm p-3 text-card-foreground",
            [s => s.Header] = "flex items-center justify-between p-2 pt-1 relative",
            [s => s.NavButton] = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute z-10",
            [s => s.Grid] = "w-full border-collapse space-y-1",
            [s => s.Weekdays] = "flex",
            [s => s.Weekday] = "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            [s => s.DayCell] = "text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            [s => s.DayButton] = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            
            // State Modifiers (applied by VCP logic, mapped here for consistency)
            [s => s.DayToday] = "bg-accent text-accent-foreground",
            [s => s.DaySelected] = "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            [s => s.DayOutside] = "text-muted-foreground opacity-50",
            [s => s.DayDisabled] = "text-muted-foreground opacity-50",
            [s => s.DayRangeMiddle] = "bg-accent text-accent-foreground rounded-none",
            [s => s.DayRangeStart] = "bg-primary text-primary-foreground rounded-l-md",
            [s => s.DayRangeEnd] = "bg-primary text-primary-foreground rounded-r-md"
        }
    );

    [Inject] private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    private string _serializedConfig = "{}";
    private string _assets = "[]";
    private readonly string _calendarId = IdGenerator.UniqueId("vc");
    
    /// <summary>
    /// Gets the unique ID used for the calendar instance element.
    /// </summary>
    protected string CalendarId => _calendarId;

    /// <summary>
    /// Gets the ID of the script tag containing the configuration.
    /// </summary>
    protected string ConfigScriptId => $"{Id}-config";

    /// <summary>
    /// Gets or sets the selection mode (Single, Multiple, MultipleRanged).
    /// Defaults to <see cref="SelectionDatesMode.Single"/>.
    /// </summary>
    [Parameter] public SelectionDatesMode Mode { get; set; } = SelectionDatesMode.Single;

    /// <summary>
    /// Gets or sets the currently selected single date.
    /// </summary>
    [Parameter] public DateOnly? Value { get; set; }
    
    /// <summary>
    /// Event callback for when the selected date changes.
    /// </summary>
    [Parameter] public EventCallback<DateOnly?> ValueChanged { get; set; }

    /// <summary>
    /// Gets or sets the list of selected dates (for Multiple mode).
    /// </summary>
    [Parameter] public List<DateOnly>? Values { get; set; }

    /// <summary>
    /// Event callback for when the list of selected dates changes.
    /// </summary>
    [Parameter] public EventCallback<List<DateOnly>> ValuesChanged { get; set; }

    /// <summary>
    /// Show days from previous/next months. Defaults to true.
    /// </summary>
    [Parameter] public bool? ShowOutsideDays { get; set; }

    /// <summary>
    /// Disables all dates before this date.
    /// </summary>
    [Parameter] public DateOnly? MinDate { get; set; }

    /// <summary>
    /// Disables all dates after this date.
    /// </summary>
    [Parameter] public DateOnly? MaxDate { get; set; }

    /// <summary>
    /// Optional configuration object. Non-null properties here will override internal defaults.
    /// </summary>
    [Parameter] public VanillaCalendarOptions? Options { get; set; }

    /// <summary>
    /// Keys for assets to load. Defaults to ["VanillaCalendarPro", "VanillaCalendarCss"].
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = ["VanillaCalendarPro", "VanillaCalendarCss"];

    /// <summary>
    /// Gets or sets the accessible label for the calendar container.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzCalendar.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCalendar.DefaultAriaLabel"];

        // 1. Base Defaults (mimic shadcn/ui behavior)
        var config = new VanillaCalendarOptions
        {
            Type = CalendarType.Default,
            InputMode = false,
            SelectionDatesMode = SelectionDatesMode.Single,
            DisplayDatesOutside = true,
            Settings = new {
                 visibility = new {
                     theme = "light" // Force light or handle via RizzyTheme later if needed
                 }
            }
        };

        // 2. Merge User Options (if provided)
        if (Options != null)
        {
            // Simple property copy for non-nulls. 
            // In a real scenario, this might need a deeper merge utility or mapping.
            // For now, we apply explicit overrides from component parameters *after* this.
            if (Options.Type != CalendarType.Default) config = config with { Type = Options.Type };
            if (Options.SelectionDatesMode != SelectionDatesMode.Single) config = config with { SelectionDatesMode = Options.SelectionDatesMode };
            // ... (apply other non-default properties from Options if needed)
        }

        // 3. Apply Component Parameters (Highest Priority)
        config = config with { SelectionDatesMode = Mode };
        
        if (ShowOutsideDays.HasValue) 
            config = config with { DisplayDatesOutside = ShowOutsideDays.Value };

        if (MinDate.HasValue) 
            config = config with { DateMin = MinDate.Value };
        
        if (MaxDate.HasValue) 
            config = config with { DateMax = MaxDate.Value };

        // Handle initial value selection
        var selectedDates = new List<DateOnly>();
        if (Mode == SelectionDatesMode.Single && Value.HasValue)
        {
            selectedDates.Add(Value.Value);
        }
        else if (Mode == SelectionDatesMode.Multiple && Values != null)
        {
            selectedDates.AddRange(Values);
        }
        
        if (selectedDates.Count > 0)
        {
            config = config with { SelectedDates = selectedDates };
        }

        // Validate options before serialization
        config.Validate();

        // 4. Map Styling to VCP CSSClasses
        // Vanilla Calendar Pro allows overriding internal classes.
        // We map our SlotClasses results to VCP's expected class keys.
        var cssClasses = new Dictionary<string, string?>
        {
            { "calendar", SlotClasses.GetRoot() },
            { "header", SlotClasses.GetHeader() },
            { "arrow", SlotClasses.GetNavButton() },
            { "grid", SlotClasses.GetGrid() },
            { "weekdays", SlotClasses.GetWeekdays() },
            { "weekday", SlotClasses.GetWeekday() },
            { "day", SlotClasses.GetDayCell() },
            { "dayBtn", SlotClasses.GetDayButton() },
            { "dayBtnSelected", SlotClasses.GetDaySelected() },
            { "dayBtnToday", SlotClasses.GetDayToday() },
            { "dayBtnNotInMonth", SlotClasses.GetDayOutside() },
            { "dayBtnDisabled", SlotClasses.GetDayDisabled() },
            { "dayBtnRangeStart", SlotClasses.GetDayRangeStart() },
            { "dayBtnRangeEnd", SlotClasses.GetDayRangeEnd() },
            { "dayBtnRangeIntermediate", SlotClasses.GetDayRangeMiddle() },
        };
        
        // Remove nulls to avoid serialization issues
        var cleanCssClasses = cssClasses.Where(kv => !string.IsNullOrEmpty(kv.Value))
                                        .ToDictionary(kv => kv.Key, kv => kv.Value);

        // Serialize everything using Standard Options, not Context, because we have dynamic dictionary and structure
        var configWrapper = new { 
            options = config, 
            cssClasses = cleanCssClasses 
        };

        _serializedConfig = JsonSerializer.Serialize(configWrapper, new JsonSerializerOptions 
        { 
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });

        // Load Assets
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();
        _assets = JsonSerializer.Serialize(assetUrls);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCalendar;

    /// <summary>
    /// Defines the slots available for styling in the RzCalendar component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>The base slot for the component wrapper.</summary>
        [Slot("calendar")]
        public string? Base { get; set; }

        /// <summary>The slot for the container where the calendar renders.</summary>
        [Slot("calendar-container")]
        public string? CalendarContainer { get; set; }

        // --- Mapped Vanilla Calendar Classes ---

        /// <summary>The root element of the calendar.</summary>
        [Slot("root")]
        public string? Root { get; set; }

        /// <summary>The header containing month/year and navigation.</summary>
        [Slot("header")]
        public string? Header { get; set; }

        /// <summary>The navigation arrow buttons.</summary>
        [Slot("nav-button")]
        public string? NavButton { get; set; }

        /// <summary>The main grid of days.</summary>
        [Slot("grid")]
        public string? Grid { get; set; }

        /// <summary>The row of weekday labels.</summary>
        [Slot("weekdays")]
        public string? Weekdays { get; set; }

        /// <summary>An individual weekday label.</summary>
        [Slot("weekday")]
        public string? Weekday { get; set; }

        /// <summary>The wrapper cell for a day.</summary>
        [Slot("day-cell")]
        public string? DayCell { get; set; }

        /// <summary>The interactive button for a day.</summary>
        [Slot("day-button")]
        public string? DayButton { get; set; }

        /// <summary>Style for the 'today' state.</summary>
        [Slot("day-today")]
        public string? DayToday { get; set; }

        /// <summary>Style for the 'selected' state.</summary>
        [Slot("day-selected")]
        public string? DaySelected { get; set; }

        /// <summary>Style for dates outside the current month.</summary>
        [Slot("day-outside")]
        public string? DayOutside { get; set; }

        /// <summary>Style for disabled dates.</summary>
        [Slot("day-disabled")]
        public string? DayDisabled { get; set; }

        /// <summary>Style for range start date.</summary>
        [Slot("day-range-start")]
        public string? DayRangeStart { get; set; }

        /// <summary>Style for range end date.</summary>
        [Slot("day-range-end")]
        public string? DayRangeEnd { get; set; }

        /// <summary>Style for dates in the middle of a range.</summary>
        [Slot("day-range-middle")]
        public string? DayRangeMiddle { get; set; }
    }
}