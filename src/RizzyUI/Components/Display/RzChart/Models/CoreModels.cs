
#pragma warning disable CS1591
namespace RizzyUI.Charts;


public class Chart
{
    public Data? Data { get; set; }
    public Options? Options { get; set; }
}

public class Data
{
    public string[]? Labels { get; set; }
    public IList<BaseDataset> Datasets { get; set; } = new List<BaseDataset>();
}

public class Clip
{
    public object Left { get; set; } = 0;
    public object Right { get; set; } = 0;
    public object Top { get; set; } = 0;
    public object Bottom { get; set; } = 0;
}

public class Fill
{
    public int? Value { get; set; }
    public object? Target { get; set; }
    public string? Above { get; set; }
    public string? Below { get; set; }
}

public class Parsing
{
    public string? Key { get; set; }
    public string? XAxisKey { get; set; }
    public string? YAxisKey { get; set; }
}

public class BorderRadius
{
    public int? TopLeft { get; set; }
    public int? TopRight { get; set; }
    public int? BottomLeft { get; set; }
    public int? BottomRight { get; set; }
}

public class BorderWidth
{
    public int? Left { get; set; }
    public int? Right { get; set; }
    public int? Top { get; set; }
    public int? Bottom { get; set; }
}