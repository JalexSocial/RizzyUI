using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using RizzyUI.Charts;

namespace RizzyUI.Components.Display.RzChart;

public class ChartEnumSerializationTests
{
    [Fact]
    public void AllChartEnumsSerializeUsingEnumMemberValues()
    {
        var enumTypes = typeof(JoinStyle).Assembly
            .GetTypes()
            .Where(t => t.Namespace == "RizzyUI.Charts" && t.IsEnum)
            .ToList();

        var failures = new List<string>();

        foreach (var enumType in enumTypes)
        {
            var values = Enum.GetValues(enumType).Cast<Enum>();
            foreach (var value in values)
            {
                var name = value.ToString();
                var field = enumType.GetField(name)!;
                var enumMember = field.GetCustomAttribute<EnumMemberAttribute>();
                var expected = enumMember?.Value ?? name.ToLowerInvariant();

                var json = JsonSerializer.Serialize(value, enumType);
                var actual = JsonSerializer.Deserialize<string>(json)!;

                if (!string.Equals(expected, actual, StringComparison.Ordinal))
                    failures.Add($"{enumType.Name}.{name}: expected '{expected}' but was '{actual}'");
            }
        }

        Assert.True(failures.Count == 0, string.Join(Environment.NewLine, failures));
    }

    [Fact]
    public void AllChartEnumsSerializeUsingEnumMemberValuesWhenBoxedAsObject()
    {
        var enumTypes = typeof(JoinStyle).Assembly
            .GetTypes()
            .Where(t => t.Namespace == "RizzyUI.Charts" && t.IsEnum)
            .ToList();

        var failures = new List<string>();

        foreach (var enumType in enumTypes)
        {
            var values = Enum.GetValues(enumType).Cast<Enum>();
            foreach (var value in values)
            {
                var name = value.ToString();
                var field = enumType.GetField(name)!;
                var enumMember = field.GetCustomAttribute<EnumMemberAttribute>();
                var expected = enumMember?.Value ?? name.ToLowerInvariant();

                var json = JsonSerializer.Serialize(new BoxedEnumHolder { Value = value });
                using var doc = JsonDocument.Parse(json);
                var actual = doc.RootElement.GetProperty("Value").GetString();

                if (!string.Equals(expected, actual, StringComparison.Ordinal))
                    failures.Add($"{enumType.Name}.{name}: expected '{expected}' but was '{actual}'");
            }
        }

        Assert.True(failures.Count == 0, string.Join(Environment.NewLine, failures));
    }


    [Fact]
    public void EnumBackedBuilderMethodsSerializeExpectedStringValues()
    {
        var builder = new ChartBuilder();
        builder.Options(options => options
            .Plugins(plugins => plugins.Tooltip(tooltip => tooltip.Position(TooltipPosition.Average)))
            .Animation(animation => animation.Easing(AnimationEasing.EaseInOutBounce))
            .Interaction(interaction => interaction.Mode(InteractionMode.Index).Axis(Axis.XY)));

        var json = JsonSerializer.Serialize(builder.Chart, CreateChartSerializerOptions());

        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.Equal("average", root.GetProperty("options").GetProperty("plugins").GetProperty("tooltip").GetProperty("position").GetString());
        Assert.Equal("easeInOutBounce", root.GetProperty("options").GetProperty("animation").GetProperty("easing").GetString());
        Assert.Equal("index", root.GetProperty("options").GetProperty("interaction").GetProperty("mode").GetString());
        Assert.Equal("xy", root.GetProperty("options").GetProperty("interaction").GetProperty("axis").GetString());
    }


    [Fact]
    public void ObjectBackedPropertiesSerializeBooleansEnumsAndObjectsCorrectly()
    {
        var builder = new ChartBuilder();
        builder.Data(data => data.Datasets(datasets =>
        {
            datasets.Bar()
                .Data(1, 2)
                .PointStyle(PointStyle.CrossRot)
                .BorderSkipped(Skipped.Start);

            datasets.Bar()
                .Data(3, 4)
                .PointStyle(true)
                .BorderSkipped(false);

            datasets.Line()
                .Data(5, 6)
                .Fill(fill => fill.Target("origin").Above("#00ff00"));
        }));

        var json = JsonSerializer.Serialize(builder.Chart, CreateChartSerializerOptions());

        using var doc = JsonDocument.Parse(json);
        var datasetsElement = doc.RootElement.GetProperty("data").GetProperty("datasets");

        Assert.Equal("crossRot", datasetsElement[0].GetProperty("pointStyle").GetString());
        Assert.Equal("start", datasetsElement[0].GetProperty("borderSkipped").GetString());
        Assert.True(datasetsElement[1].GetProperty("pointStyle").GetBoolean());
        Assert.False(datasetsElement[1].GetProperty("borderSkipped").GetBoolean());
        Assert.Equal("origin", datasetsElement[2].GetProperty("fill").GetProperty("target").GetString());
        Assert.Equal("#00ff00", datasetsElement[2].GetProperty("fill").GetProperty("above").GetString());
    }

    private static JsonSerializerOptions CreateChartSerializerOptions() => new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        Converters = { new ChartJsObjectValueConverter() }
    };
    private sealed class BoxedEnumHolder
    {
        public object? Value { get; set; }
    }
}
