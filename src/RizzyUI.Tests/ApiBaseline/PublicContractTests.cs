using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI.Tests.ApiBaseline;

/// <summary>
/// RM-2.5: the consumer-facing contract that .NET package validation does not see. Package
/// validation (PackageValidationBaselineVersion in RizzyUI.csproj) fails on removed or changed
/// public members; this test also fails when a property stops being a component parameter, a
/// parameter changes its cascading/capture behavior, an enum value changes, or AddRizzyUI registers
/// a different set of services.
/// </summary>
/// <remarks>
/// When a change is intentional, regenerate the baseline and review the diff:
/// <c>RIZZYUI_UPDATE_API_BASELINE=1 dotnet test src/RizzyUI.Tests --filter PublicContractTests</c>.
/// Removing or renaming anything listed there is a breaking change: record it in CHANGELOG.md.
/// </remarks>
public class PublicContractTests
{
    private const string UpdateVariable = "RIZZYUI_UPDATE_API_BASELINE";

    [Fact]
    public void PublicContract_MatchesTheBaseline()
    {
        var actual = Describe(typeof(RzComponent).Assembly);
        var path = Path.Combine(SourceDirectory(), "public-contract.txt");

        if (Environment.GetEnvironmentVariable(UpdateVariable) == "1")
        {
            File.WriteAllText(path, actual);
            return;
        }

        Assert.True(File.Exists(path), $"Baseline {path} is missing. Generate it with {UpdateVariable}=1.");
        var expected = File.ReadAllText(path).ReplaceLineEndings("\n");
        if (expected == actual)
            return;

        var expectedLines = expected.Split('\n').ToHashSet(StringComparer.Ordinal);
        var actualLines = actual.Split('\n').ToHashSet(StringComparer.Ordinal);
        var removed = expected.Split('\n').Where(l => !actualLines.Contains(l)).ToList();
        var added = actual.Split('\n').Where(l => !expectedLines.Contains(l)).ToList();

        Assert.Fail(
            "The public contract changed. Removed or changed lines are breaking for consumers." + Environment.NewLine +
            string.Join(Environment.NewLine, removed.Select(l => "- " + l)) + Environment.NewLine +
            string.Join(Environment.NewLine, added.Select(l => "+ " + l)) + Environment.NewLine +
            $"If this is intentional, regenerate with {UpdateVariable}=1 and record it in CHANGELOG.md.");
    }

    internal static string Describe(Assembly assembly)
    {
        var sb = new StringBuilder();
        var publicTypes = assembly.GetExportedTypes().OrderBy(t => t.FullName, StringComparer.Ordinal).ToList();

        sb.Append("# Components: [Parameter] and [CascadingParameter] properties\n");
        foreach (var type in publicTypes.Where(t => typeof(IComponent).IsAssignableFrom(t)))
        {
            var parameters = type
                .GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
                .Select(p => (Property: p, Line: DescribeParameter(p)))
                .Where(x => x.Line is not null)
                .OrderBy(x => x.Property.Name, StringComparer.Ordinal)
                .ToList();

            sb.Append(TypeName(type)).Append(type.IsAbstract ? " (abstract)" : string.Empty).Append('\n');
            foreach (var (_, line) in parameters)
                sb.Append("  ").Append(line).Append('\n');
        }

        sb.Append("\n# Enums\n");
        foreach (var type in publicTypes.Where(t => t.IsEnum))
        {
            var values = Enum.GetNames(type)
                .Select(name => $"{name}={Convert.ToInt64(Enum.Parse(type, name), System.Globalization.CultureInfo.InvariantCulture)}");
            sb.Append(TypeName(type)).Append(": ").Append(string.Join(", ", values)).Append('\n');
        }

        sb.Append("\n# Configuration: RizzyUIConfig\n");
        foreach (var property in typeof(RizzyUIConfig).GetProperties(BindingFlags.Public | BindingFlags.Instance).OrderBy(p => p.Name, StringComparer.Ordinal))
            sb.Append("  ").Append(property.Name).Append(": ").Append(TypeName(property.PropertyType)).Append('\n');

        sb.Append("\n# Services registered by AddRizzyUI()\n");
        foreach (var line in DescribeServices())
            sb.Append("  ").Append(line).Append('\n');

        return sb.ToString();
    }

    private static string? DescribeParameter(PropertyInfo property)
    {
        if (property.GetCustomAttribute<ParameterAttribute>() is { } parameter)
        {
            // Only public parameters are part of the contract; Blazor requires them to be public.
            if (property.GetMethod?.IsPublic != true)
                return null;
            var capture = parameter.CaptureUnmatchedValues ? " [CaptureUnmatchedValues]" : string.Empty;
            var required = property.GetCustomAttribute<EditorRequiredAttribute>() is not null ? " [EditorRequired]" : string.Empty;
            return $"{property.Name}: {TypeName(property.PropertyType)}{capture}{required}";
        }

        // Public cascading parameters only: a private cascade (for example the request HttpContext)
        // is an implementation detail.
        if (property.GetCustomAttribute<CascadingParameterAttribute>() is { } cascading && property.GetMethod?.IsPublic == true)
        {
            var name = cascading.Name is null ? string.Empty : $" (Name={cascading.Name})";
            return $"[Cascading] {property.Name}: {TypeName(property.PropertyType)}{name}";
        }

        return null;
    }

    private static IEnumerable<string> DescribeServices()
    {
        var before = new ServiceCollection();
        before.AddLogging();
        var baseline = before.Select(Describe).ToHashSet(StringComparer.Ordinal);

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddRizzyUI();

        return services
            .Select(Describe)
            .Where(line => !baseline.Contains(line))
            .Distinct(StringComparer.Ordinal)
            .OrderBy(line => line, StringComparer.Ordinal);

        static string Describe(ServiceDescriptor descriptor)
        {
            var implementation = descriptor.ImplementationType is { } type ? TypeName(type)
                : descriptor.ImplementationInstance is not null ? "instance"
                : "factory";
            return $"{TypeName(descriptor.ServiceType)} ({descriptor.Lifetime}) -> {implementation}";
        }
    }

    private static string TypeName(Type type)
    {
        if (Nullable.GetUnderlyingType(type) is { } underlying)
            return TypeName(underlying) + "?";
        if (type.IsArray)
            return TypeName(type.GetElementType()!) + "[]";
        if (type.IsGenericParameter)
            return type.Name;

        var name = type.IsNested ? $"{TypeName(type.DeclaringType!)}.{type.Name}" : $"{type.Namespace}.{type.Name}";
        if (!type.IsGenericType)
            return name;

        var tick = name.IndexOf('`');
        var baseName = tick < 0 ? name : name[..tick];
        var arguments = type.GetGenericArguments();
        if (type.IsNested && type.DeclaringType!.IsGenericType)
            arguments = arguments.Skip(type.DeclaringType.GetGenericArguments().Length).ToArray();
        return arguments.Length == 0 ? baseName : $"{baseName}<{string.Join(", ", arguments.Select(TypeName))}>";
    }

    private static string SourceDirectory([CallerFilePath] string path = "") => Path.GetDirectoryName(path)!;
}
