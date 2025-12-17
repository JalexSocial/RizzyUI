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
    /// Matches shadcn/ui calendar styles by overriding VCP class names and targeting VCP data attributes.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "p-3",
        slots: new()
        {
            // Root container
            // Use !important to override VCP's default theme styles since we are hijacking them with CSS vars
            [s => s.Root] = "w-fit !bg-card border !border-border rounded-md shadow-sm p-3 !text-card-foreground",
            
            // Header & Navigation
            [s => s.Header] = "flex justify-center pt-1 relative items-center gap-1 mb-4",
            [s => s.HeaderContent] = "text-sm font-medium", 
            [s => s.Month] = "text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            [s => s.Year] = "text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            
            // Arrows (Absolute positioning to match Shadcn)
            [s => s.ArrowPrev] = "absolute left-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            [s => s.ArrowNext] = "absolute right-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            
            // Grid Layouts
            [s => s.Grid] = "w-full border-collapse space-y-1",
            [s => s.Weekdays] = "flex",
            [s => s.Weekday] = "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex justify-center items-center",
            [s => s.Dates] = "grid grid-cols-7 gap-y-1 w-full",
            [s => s.Months] = "grid grid-cols-3 gap-2 w-full sm:w-64",
            [s => s.Years] = "grid grid-cols-4 gap-2 w-full sm:w-64",

            // Day Cell (Wrapper)
            // 'group' class allows the button to style itself based on this cell's attributes (e.g. data-vc-date-today)
            [s => s.DayCell] = "group relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            
            // Day Button (Interactive)
            // We use group-data-* modifiers to target the attributes VCP applies to the parent DayCell or self
            [s => s.DayButton] = 
                // Base
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " +
                // Hover (when not selected)
                "hover:bg-accent hover:text-accent-foreground " +
                // Today (parent has data-vc-date-today)
                "group-data-[vc-date-today]:bg-accent group-data-[vc-date-today]:text-accent-foreground " +
                // Selected (self has aria-selected="true")
                "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground aria-selected:focus:bg-primary aria-selected:focus:text-primary-foreground " +
                // Outside Month (parent has data-vc-date-month="prev" or "next")
                "group-data-[vc-date-month=prev]:text-muted-foreground group-data-[vc-date-month=prev]:opacity-50 " +
                "group-data-[vc-date-month=next]:text-muted-foreground group-data-[vc-date-month=next]:opacity-50 " +
                // Disabled
                "group-data-[vc-date-disabled]:text-muted-foreground group-data-[vc-date-disabled]:opacity-50 group-data-[vc-date-disabled]:line-through " +
                // Range Middle
                "group-data-[vc-date-selected=middle]:bg-accent group-data-[vc-date-selected=middle]:text-accent-foreground group-data-[vc-date-selected=middle]:rounded-none " +
                // Range Start/End
                "group-data-[vc-date-selected=first]:bg-primary group-data-[vc-date-selected=first]:text-primary-foreground group-data-[vc-date-selected=first]:rounded-l-md group-data-[vc-date-selected=first]:rounded-r-none " +
                "group-data-[vc-date-selected=last]:bg-primary group-data-[vc-date-selected=last]:text-primary-foreground group-data-[vc-date-selected=last]:rounded-r-md group-data-[vc-date-selected=last]:rounded-l-none " + 
                "group-data-[vc-date-selected=first-and-last]:rounded-md",

            // Months/Years View Items
            [s => s.MonthsMonth] = "flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm aria-selected:bg-primary aria-selected:text-primary-foreground",
            [s => s.YearsYear] = "flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm aria-selected:bg-primary aria-selected:text-primary-foreground",

            // Time Picker
            [s => s.Time] = "flex flex-col items-center justify-center border-t border-border mt-3 pt-3 gap-2",
            [s => s.TimeContent] = "flex items-center gap-1",
            [s => s.TimeHour] = "bg-transparent p-1 rounded-md border border-input focus:ring-1 focus:ring-ring text-sm w-8 text-center appearance-none",
            [s => s.TimeMinute] = "bg-transparent p-1 rounded-md border border-input focus:ring-1 focus:ring-ring text-sm w-8 text-center appearance-none",
            [s => s.TimeKeeping] = "ml-2 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium cursor-pointer hover:bg-secondary/80",
            [s => s.TimeRanges] = "w-full space-y-2",
            [s => s.TimeRange] = "w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
        }
    );

    [Inject] private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    private string _serializedConfig = "{}";
    private string _assets = "[]";
    private string _cssVariables = string.Empty;
    private readonly string _calendarId = IdGenerator.UniqueId("vc");
    
    protected string CalendarId => _calendarId;
    protected string ConfigScriptId => $"{Id}-config";

    [Parameter] public SelectionDatesMode Mode { get; set; } = SelectionDatesMode.Single;
    [Parameter] public DateOnly? Value { get; set; }
    [Parameter] public EventCallback<DateOnly?> ValueChanged { get; set; }
    [Parameter] public List<DateOnly>? Values { get; set; }
    [Parameter] public EventCallback<List<DateOnly>> ValuesChanged { get; set; }
    [Parameter] public CalendarDateRange? Range { get; set; }
    [Parameter] public EventCallback<CalendarDateRange?> RangeChanged { get; set; }
    [Parameter] public bool? ShowOutsideDays { get; set; }
    [Parameter] public DateOnly? MinDate { get; set; }
    [Parameter] public DateOnly? MaxDate { get; set; }
    [Parameter] public CalendarType Type { get; set; } = CalendarType.Default;
    [Parameter] public VanillaCalendarOptions? Options { get; set; }
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["VanillaCalendarPro", "VanillaCalendarCss"];
    [Parameter] public string? AriaLabel { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzCalendar.DefaultAriaLabel"];
        BuildCssVariables();
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCalendar.DefaultAriaLabel"];
        BuildCssVariables();

        var config = new VanillaCalendarOptions
        {
            Type = Type,
            InputMode = false,
            SelectionDatesMode = SelectionDatesMode.Single,
            DisplayDatesOutside = true,
            // FORCE light theme mode to prevent VCP from using its own OS detection.
            // Our CSS variables will handle the actual light/dark switching because 
            // RizzyUI themes update CSS variables on the :root/.dark element.
            SelectedTheme = "light", 
            ThemeAttrDetect = "" 
        };

        if (Options != null)
        {
            if (Options.Type != CalendarType.Default) config = config with { Type = Options.Type };
            if (Options.SelectionDatesMode != SelectionDatesMode.Single) config = config with { SelectionDatesMode = Options.SelectionDatesMode };
            if (Options.DisplayMonthsCount > 1) config = config with { DisplayMonthsCount = Options.DisplayMonthsCount };
            if (Options.FirstWeekday != DayOfWeek.Sunday) config = config with { FirstWeekday = Options.FirstWeekday };
            if (!string.IsNullOrEmpty(Options.Locale)) config = config with { Locale = Options.Locale };
            if (Options.DisableWeekdays != null) config = config with { DisableWeekdays = Options.DisableWeekdays };
            if (Options.EnableWeekNumbers) config = config with { EnableWeekNumbers = Options.EnableWeekNumbers };
            if (!string.IsNullOrEmpty(Options.SelectedTheme)) config = config with { SelectedTheme = Options.SelectedTheme };
            if (!string.IsNullOrEmpty(Options.ThemeAttrDetect)) config = config with { ThemeAttrDetect = Options.ThemeAttrDetect };
        }

        config = config with { SelectionDatesMode = Mode };
        
        if (ShowOutsideDays.HasValue) 
            config = config with { DisplayDatesOutside = ShowOutsideDays.Value };

        if (MinDate.HasValue) 
            config = config with { DateMin = MinDate.Value };
        
        if (MaxDate.HasValue) 
            config = config with { DateMax = MaxDate.Value };

        var selectedDates = new List<DateOnly>();
        if (Mode == SelectionDatesMode.Single && Value.HasValue)
        {
            selectedDates.Add(Value.Value);
        }
        else if (Mode == SelectionDatesMode.Multiple && Values != null)
        {
            selectedDates.AddRange(Values);
        }
        else if (Mode == SelectionDatesMode.MultipleRanged && Range != null)
        {
            selectedDates.Add(DateOnly.FromDateTime(Range.From));
            if (Range.To.HasValue)
            {
                var end = DateOnly.FromDateTime(Range.To.Value);
                selectedDates.Add(end); 
            }
        }
        
        if (selectedDates.Count > 0)
        {
            config = config with { SelectedDates = selectedDates };
        }

        if (config.Type == CalendarType.Multiple)
        {
            if (config.DisplayMonthsCount < 2 && Options?.DisplayMonthsCount == null)
                config = config with { DisplayMonthsCount = 2 };
        }

        config.Validate();

        // Map Styling to VCP CSSClasses using the SlotClasses
        // These keys match the VCP `styles.ts` source exactly
        var cssClasses = new Dictionary<string, string?>
        {
            { "calendar", SlotClasses.GetRoot() },
            { "header", SlotClasses.GetHeader() },
            { "headerContent", SlotClasses.GetHeaderContent() },
            { "month", SlotClasses.GetMonth() },
            { "year", SlotClasses.GetYear() },
            { "arrowPrev", SlotClasses.GetArrowPrev() },
            { "arrowNext", SlotClasses.GetArrowNext() },
            { "grid", SlotClasses.GetGrid() },
            { "weekdays", SlotClasses.GetWeekdays() },
            { "weekday", SlotClasses.GetWeekday() },
            { "dates", SlotClasses.GetDates() }, // Renamed from Days to Dates to match VCP
            { "date", SlotClasses.GetDayCell() },
            { "dateBtn", SlotClasses.GetDayButton() },
            
            { "months", SlotClasses.GetMonths() },
            { "monthsMonth", SlotClasses.GetMonthsMonth() },
            { "years", SlotClasses.GetYears() },
            { "yearsYear", SlotClasses.GetYearsYear() },
            
            // Time Picker
            { "time", SlotClasses.GetTime() },
            { "timeContent", SlotClasses.GetTimeContent() },
            { "timeHour", SlotClasses.GetTimeHour() },
            { "timeMinute", SlotClasses.GetTimeMinute() },
            { "timeKeeping", SlotClasses.GetTimeKeeping() },
            { "timeRanges", SlotClasses.GetTimeRanges() },
            { "timeRange", SlotClasses.GetTimeRange() }
        };
        
        var cleanCssClasses = cssClasses.Where(kv => !string.IsNullOrEmpty(kv.Value))
                                        .ToDictionary(kv => kv.Key, kv => kv.Value);

        var configWrapper = new { 
            options = config, 
            styles = cleanCssClasses // Renamed from cssClasses to styles to match VCP config structure
        };

        _serializedConfig = JsonSerializer.Serialize(configWrapper, new JsonSerializerOptions 
        { 
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });

        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();
        _assets = JsonSerializer.Serialize(assetUrls);
    }

    private void BuildCssVariables()
    {
        // Inject CSS variables to override VCP defaults.
        // We map VCP internal variables to RizzyUI/Shadcn theme variables.
        _cssVariables = string.Join(";", new[]
        {
            "--vc-bg: var(--card)",
            "--vc-color: var(--card-foreground)",
            "--vc-shadow: var(--shadow)",
            "--vc-weekday-color: var(--muted-foreground)",
            "--vc-year-color: var(--primary)",
            "--vc-month-color: var(--primary)",
            "--vc-arrow-color: var(--primary)",
            "--vc-time-range: var(--primary)",
            "--vc-time-range-thumb: var(--primary)",
            
            // Legacy/Alternative variable names sometimes used in VCP themes
            "--vanilla-calendar-bg: var(--card)",
            "--vanilla-calendar-color: var(--card-foreground)",
            "--vanilla-calendar-surface: var(--muted)",
            "--vanilla-calendar-text: var(--foreground)"
        });
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCalendar;

    public sealed partial class Slots : ISlots
    {
        [Slot("calendar")]
        public string? Base { get; set; }

        [Slot("calendar-container")]
        public string? CalendarContainer { get; set; }

        // --- VCP Mapped Slots ---
        
        [Slot("root")]
        public string? Root { get; set; }

        [Slot("header")]
        public string? Header { get; set; }

        [Slot("header-content")]
        public string? HeaderContent { get; set; }

        [Slot("month")]
        public string? Month { get; set; }

        [Slot("year")]
        public string? Year { get; set; }

        [Slot("arrow-prev")]
        public string? ArrowPrev { get; set; }

        [Slot("arrow-next")]
        public string? ArrowNext { get; set; }

        [Slot("grid")]
        public string? Grid { get; set; }

        [Slot("weekdays")]
        public string? Weekdays { get; set; }

        [Slot("weekday")]
        public string? Weekday { get; set; }

        [Slot("dates")]
        public string? Dates { get; set; } // "vc-dates"

        [Slot("day-cell")]
        public string? DayCell { get; set; } // "vc-date"

        [Slot("day-button")]
        public string? DayButton { get; set; } // "vc-date__btn"

        [Slot("months")]
        public string? Months { get; set; }

        [Slot("months-month")]
        public string? MonthsMonth { get; set; }

        [Slot("years")]
        public string? Years { get; set; }

        [Slot("years-year")]
        public string? YearsYear { get; set; }

        // --- Time Picker ---

        [Slot("time")]
        public string? Time { get; set; }

        [Slot("time-content")]
        public string? TimeContent { get; set; }

        [Slot("time-hour")]
        public string? TimeHour { get; set; }

        [Slot("time-minute")]
        public string? TimeMinute { get; set; }

        [Slot("time-keeping")]
        public string? TimeKeeping { get; set; }

        [Slot("time-ranges")]
        public string? TimeRanges { get; set; }

        [Slot("time-range")]
        public string? TimeRange { get; set; }
    }
}