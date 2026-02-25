
namespace RizzyUI.Charts;

/// <summary>
/// The top-level configuration object for a Chart.js instance.
/// </summary>
public class Chart
{
    /// <summary>
    /// Gets or sets the data object containing labels and datasets.
    /// </summary>
    public Data? Data { get; set; }

    /// <summary>
    /// Gets or sets the options object containing chart behavior and plugin settings.
    /// </summary>
    public Options? Options { get; set; }
}

/// <summary>
/// Contains labels for the index axis and the collection of datasets to render.
/// </summary>
public class Data
{
    /// <summary>
    /// Labels for the index axis (typically the X-axis).
    /// </summary>
    public string[]? Labels { get; set; }

    /// <summary>
    /// The collection of datasets to be displayed.
    /// </summary>
    public IList<BaseDataset> Datasets { get; set; } = new List<BaseDataset>();
}

/// <summary>
/// Defines how the dataset is clipped relative to the chart area.
/// </summary>
public class Clip
{
    /// <summary> Left clipping. Can be numeric pixels or boolean. </summary>
    public object Left { get; set; } = 0;
    /// <summary> Right clipping. Can be numeric pixels or boolean. </summary>
    public object Right { get; set; } = 0;
    /// <summary> Top clipping. Can be numeric pixels or boolean. </summary>
    public object Top { get; set; } = 0;
    /// <summary> Bottom clipping. Can be numeric pixels or boolean. </summary>
    public object Bottom { get; set; } = 0;
}

/// <summary>
/// Configures how the area under a line or between radar lines is filled.
/// </summary>
public class Fill
{
    /// <summary> Absolute dataset index or numerical value for the fill boundary. </summary>
    public int? Value { get; set; }
    /// <summary> The target to fill to. Can be index ('-1', '2') or boundary ('origin', 'start', 'end'). </summary>
    public object? Target { get; set; }
    /// <summary> Color to use for the area above the target. </summary>
    public string? Above { get; set; }
    /// <summary> Color to use for the area below the target. </summary>
    public string? Below { get; set; }
}

/// <summary>
/// Configures the keys used when parsing complex data objects.
/// </summary>
public class Parsing
{
    /// <summary> The key used for values in single-axis charts (Pie, Doughnut). </summary>
    public string? Key { get; set; }
    /// <summary> The key used for X-axis values. </summary>
    public string? XAxisKey { get; set; }
    /// <summary> The key used for Y-axis values. </summary>
    public string? YAxisKey { get; set; }
}

/// <summary>
/// Configures the border radius for each corner of a rectangle element (e.g. bars).
/// </summary>
public class BorderRadius
{
    /// <summary> Radius for the top-left corner. </summary>
    public int? TopLeft { get; set; }
    /// <summary> Radius for the top-right corner. </summary>
    public int? TopRight { get; set; }
    /// <summary> Radius for the bottom-left corner. </summary>
    public int? BottomLeft { get; set; }
    /// <summary> Radius for the bottom-right corner. </summary>
    public int? BottomRight { get; set; }
}

/// <summary>
/// Configures specific border widths for each side of an element.
/// </summary>
public class BorderWidth
{
    /// <summary> Left border width. </summary>
    public int? Left { get; set; }
    /// <summary> Right border width. </summary>
    public int? Right { get; set; }
    /// <summary> Top border width. </summary>
    public int? Top { get; set; }
    /// <summary> Bottom border width. </summary>
    public int? Bottom { get; set; }
}