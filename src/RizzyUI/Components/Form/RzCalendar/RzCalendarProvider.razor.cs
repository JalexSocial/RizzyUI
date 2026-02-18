
using Microsoft.AspNetCore.Components;
using System.Text.Json;
using System.Linq;
using System.Globalization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A renderless orchestration component for <c>RzCalendar</c>.
/// It establishes a reactive Alpine.js scope to manage calendar state, synchronization, and events 
/// for client-side interactions (e.g., syncing with inputs, presets, or popovers) without server round-trips.
/// </summary>
public partial class RzCalendarProvider : RzComponent<RzCalendarProvider.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCalendarProvider component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "contents" // Uses contents to avoid affecting layout flow where possible
    );

    private string _serializedDates = "[]";
    private string _serializedFormatOptions = "{}";

    /// <summary>
    /// Gets or sets the child content to be rendered within the provider's scope.
    /// This should typically include an <c>RzCalendar</c> and other interactive elements.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the selection mode. This MUST match the Mode set on the child <c>RzCalendar</c>.
    /// </summary>
    [Parameter] public SelectionDatesMode Mode { get; set; } = SelectionDatesMode.Single;

    /// <summary>
    /// Gets or sets the initial single date value. Used when Mode is Single.
    /// </summary>
    [Parameter] public DateOnly? Value { get; set; }

    /// <summary>
    /// Gets or sets the initial list of date values. Used when Mode is Multiple.
    /// </summary>
    [Parameter] public List<DateOnly>? Values { get; set; }

    /// <summary>
    /// Gets or sets the initial date range. Used when Mode is MultipleRanged.
    /// </summary>
    [Parameter] public CalendarDateRange? Range { get; set; }

    /// <summary>
    /// The BCP 47 language tag to use for client-side date formatting (e.g., "en-US", "fr-FR").
    /// Defaults to "en-US".
    /// </summary>
    [Parameter] public string? Locale { get; set; }

    /// <summary>
    /// Configuration object for Intl.DateTimeFormat.
    /// Used by the 'formattedDate' and 'formattedRange' JS properties.
    /// </summary>
    [Parameter] public IntlDateTimeFormatOptions? FormatOptions { get; set; }

    /// <summary>
    /// Maps the enum to the exact string expected by VanillaCalendarPro.
    /// </summary>
    private static string ToVcpMode(SelectionDatesMode mode) => mode switch
    {
        SelectionDatesMode.Single => "single",
        SelectionDatesMode.Multiple => "multiple",
        SelectionDatesMode.MultipleRanged => "multiple-ranged",
        _ => "single"
    };

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        // Validate parameter exclusivity to assist developers in debugging
        ValidateParameters();

        // Normalize all C# date inputs into a flat list of "YYYY-MM-DD" strings for JS
        var dateList = new List<string>();

        if (Mode == SelectionDatesMode.Single && Value.HasValue)
        {
            dateList.Add(Value.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
        }
        else if (Mode == SelectionDatesMode.Multiple && Values != null)
        {
            // Dedup and sort for consistency with JS normalization
            dateList.AddRange(Values.Distinct().OrderBy(d => d).Select(d => d.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)));
        }
        else if (Mode == SelectionDatesMode.MultipleRanged && Range != null)
        {
            // Check if the range is actually populated (non-default)
            var isPopulated = Range.From != default || Range.To.HasValue;
            
            if (isPopulated)
            {
                var start = Range.From;
                
                if (Range.To.HasValue)
                {
                    var end = Range.To.Value;
                    // Normalize order server-side to match client-side expectations
                    if (end < start)
                    {
                        (start, end) = (end, start);
                    }
                    
                    dateList.Add(start.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                    dateList.Add(end.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                }
                else
                {
                    // Only start date provided
                    dateList.Add(start.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                }
            }
        }

        _serializedDates = JsonSerializer.Serialize(dateList);

        var effectiveFormatOptions = FormatOptions ?? new IntlDateTimeFormatOptions
        {
            Month = MonthStyle.Short,
            Day = Numeric2Digit.Numeric,
            Year = Numeric2Digit.Numeric
        };

        _serializedFormatOptions = IntlJson.SerializeOptions(effectiveFormatOptions);
    }

    private void ValidateParameters()
    {
        // Forgiving validation: Only throw if 'wrong' parameters are explicitly populated/non-empty.
        // This allows developers to pass empty lists or nulls without crashing.

        bool isValuesPopulated = Values != null && Values.Count > 0;
        bool isRangePopulated = Range != null && (Range.From != default || Range.To != null);

        if (Mode == SelectionDatesMode.Single && (isValuesPopulated || isRangePopulated))
        {
            throw new InvalidOperationException($"RzCalendarProvider: Mode is '{Mode}' but 'Values' (count: {Values?.Count}) or 'Range' parameters were provided. Please use 'Value'.");
        }
        if (Mode == SelectionDatesMode.Multiple && (Value != null || isRangePopulated))
        {
            throw new InvalidOperationException($"RzCalendarProvider: Mode is '{Mode}' but 'Value' or 'Range' parameters were provided. Please use 'Values'.");
        }
        if (Mode == SelectionDatesMode.MultipleRanged && (Value != null || isValuesPopulated))
        {
            throw new InvalidOperationException($"RzCalendarProvider: Mode is '{Mode}' but 'Value' or 'Values' (count: {Values?.Count}) parameters were provided. Please use 'Range'.");
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCalendarProvider;

    /// <summary>
    /// Defines the slots available for styling in the RzCalendarProvider component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("calendar-provider")]
        public string? Base { get; set; }
    }
}
