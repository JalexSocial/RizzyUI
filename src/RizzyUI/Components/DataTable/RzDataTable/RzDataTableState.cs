using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace RizzyUI;

/// <summary>
/// The state of an <see cref="RzDataTable{TItem}"/> as the browser holds it: sorting, pagination,
/// column filters, the global filter, column visibility and (opt-in) row selection (decision D-31,
/// Summit SF-001). With <c>StateInputName</c> the table keeps one hidden input with this state as
/// versioned JSON; include it in requests (<c>hx-include</c>) and bind it with a parameter of this
/// type, then rebuild the table from <see cref="ToInitialState"/> so it starts where the user left it.
/// </summary>
/// <remarks>
/// MVC binds it from a form or query value with the parameter's name (<c>[FromForm(Name = "TableState")]</c>);
/// minimal APIs bind it through <see cref="TryParse(string?, out RzDataTableState?)"/>. What the application
/// does with the state (validate the page size, ignore unknown columns) is its decision.
/// </remarks>
[ModelBinder(typeof(RzDataTableStateModelBinder))]
public sealed class RzDataTableState
{
    /// <summary>The JSON format version this library writes and reads.</summary>
    public const int CurrentVersion = 1;

    internal static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    /// <summary>The format version (<c>v</c> in the JSON).</summary>
    [JsonPropertyName("v")]
    public int Version { get; init; } = CurrentVersion;

    /// <summary>The sort columns, in order.</summary>
    public IReadOnlyList<RzSortDescriptor> Sorting { get; init; } = [];

    /// <summary>The page, when the table pages.</summary>
    public RzPaginationState? Pagination { get; init; }

    /// <summary>The column filters.</summary>
    public IReadOnlyList<RzColumnFilter> ColumnFilters { get; init; } = [];

    /// <summary>The global filter (search) text.</summary>
    public string? GlobalFilter { get; init; }

    /// <summary>Column visibility by column id (<c>false</c> for hidden columns).</summary>
    public Dictionary<string, bool> ColumnVisibility { get; init; } = [];

    /// <summary>Selected rows by row id; only when the table includes selection (<c>IncludeSelectionInState</c>).</summary>
    public Dictionary<string, bool>? RowSelection { get; init; }

    /// <summary>The ids of the selected rows.</summary>
    [JsonIgnore]
    public IReadOnlyList<string> SelectedRowIds =>
        RowSelection?.Where(entry => entry.Value).Select(entry => entry.Key).ToArray() ?? [];

    /// <summary>
    /// The state as the table's initial state, to rebuild the table where the user left it.
    /// </summary>
    /// <param name="includeSelection">Whether the rebuilt table keeps the selection (usually not after a bulk action).</param>
    public RzDataTableInitialState ToInitialState(bool includeSelection = false) => new()
    {
        Sorting = Sorting,
        Pagination = Pagination,
        ColumnFilters = ColumnFilters,
        GlobalFilter = string.IsNullOrEmpty(GlobalFilter) ? null : GlobalFilter,
        ColumnVisibility = ColumnVisibility,
        RowSelection = includeSelection ? RowSelection : null,
    };

    /// <summary>The state as JSON, the format the table's hidden input holds.</summary>
    public string ToJson() => JsonSerializer.Serialize(this, JsonOptions);

    /// <summary>The state an initial state describes (what the hidden input holds before the user acts).</summary>
    public static RzDataTableState From(RzDataTableInitialState initial, bool includeSelection = false) => new()
    {
        Sorting = initial.Sorting ?? [],
        Pagination = initial.Pagination,
        ColumnFilters = initial.ColumnFilters ?? [],
        GlobalFilter = initial.GlobalFilter?.ToString(),
        ColumnVisibility = initial.ColumnVisibility ?? [],
        RowSelection = includeSelection ? initial.RowSelection ?? [] : null,
    };

    /// <summary>
    /// Reads the JSON the table's hidden input holds. Empty input, invalid JSON or a newer format
    /// version gives <see langword="false"/>.
    /// </summary>
    public static bool TryParse(string? value, [NotNullWhen(true)] out RzDataTableState? state)
    {
        state = null;
        if (string.IsNullOrWhiteSpace(value))
            return false;
        try
        {
            var parsed = JsonSerializer.Deserialize<RzDataTableState>(value, JsonOptions);
            if (parsed is null || parsed.Version < 1 || parsed.Version > CurrentVersion)
                return false;
            state = parsed;
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    /// <summary>Minimal API binding: <c>TryParse(string, IFormatProvider, out T)</c>.</summary>
    public static bool TryParse(string? value, IFormatProvider? provider, [NotNullWhen(true)] out RzDataTableState? state) =>
        TryParse(value, out state);
}

/// <summary>
/// Binds an <see cref="RzDataTableState"/> from the form or query value with the parameter's name. A
/// missing or unreadable value binds <see langword="null"/>, so the action falls back to its defaults.
/// </summary>
public sealed class RzDataTableStateModelBinder : IModelBinder
{
    /// <inheritdoc />
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        ArgumentNullException.ThrowIfNull(bindingContext);
        var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName).FirstValue;
        bindingContext.Result = RzDataTableState.TryParse(value, out var state)
            ? ModelBindingResult.Success(state)
            : ModelBindingResult.Success(null);
        return Task.CompletedTask;
    }
}
