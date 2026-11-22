
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A set of layered sections of content, known as tab panels, that are displayed one at a time.
/// This is the root component that manages the state for all child tab components.
/// </summary>
public partial class RzTabs : RzComponent<RzTabs.Slots>
{
    /// <summary>
    /// Ids of <c>AsChild</c> triggers' children by tab value, when they declare one (decision D-26);
    /// each panel references its trigger's id.
    /// </summary>
    internal Dictionary<string, string> AsChildTriggerIds { get; } = new(StringComparer.Ordinal);

    private readonly List<TabsContent> _contents = [];

    internal void RegisterContent(TabsContent content) => _contents.Add(content);

    /// <summary>
    /// Records an <c>AsChild</c> trigger's child id. Triggers sit inside TabsList and initialize after
    /// the panels have rendered, so the panels render again to reference it.
    /// </summary>
    internal void SetAsChildTriggerId(string value, string id)
    {
        AsChildTriggerIds[value] = id;
        foreach (var content in _contents)
        {
            if (string.Equals(content.Value, value, StringComparison.Ordinal))
                content.Refresh();
        }
    }

    /// <summary>
    /// Defines the default styling for the RzTabs component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-2"
    );

    /// <summary>
    /// The value of the tab that should be active when the component is first rendered.
    /// If not provided, the first tab will be selected.
    /// </summary>
    [Parameter]
    public string? DefaultValue { get; set; }

    /// <summary>
    /// The content of the tabs component, which should include a <see cref="TabsList"/> and one or more <see cref="TabsContent"/> components.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTabs;

    /// <summary>
    /// Defines the slots available for styling in the RzTabs component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("tabs")]
        public string? Base { get; set; }
    }

    /// <summary>
    /// Turns a tab value into a segment that is safe inside an HTML id and an ID reference list
    /// (RZUI-049). Values made of letters, digits, '-' and '_' are used as they are; any other
    /// character becomes '-', followed by a short hash of the original value so that different
    /// values cannot produce the same id.
    /// </summary>
    internal static string IdSegment(string? value)
    {
        if (string.IsNullOrEmpty(value))
            return "tab";

        var safe = true;
        foreach (var c in value)
        {
            if (!char.IsAsciiLetterOrDigit(c) && c != '-' && c != '_')
            {
                safe = false;
                break;
            }
        }

        if (safe)
            return value;

        var builder = new System.Text.StringBuilder(value.Length + 9);
        foreach (var c in value)
            builder.Append(char.IsAsciiLetterOrDigit(c) || c == '-' || c == '_' ? c : '-');

        // FNV-1a: stable across processes (string.GetHashCode is randomized per process).
        var hash = 2166136261u;
        foreach (var c in value)
            hash = (hash ^ c) * 16777619u;

        return builder.Append('-').Append(hash.ToString("x8", System.Globalization.CultureInfo.InvariantCulture)).ToString();
    }
}
