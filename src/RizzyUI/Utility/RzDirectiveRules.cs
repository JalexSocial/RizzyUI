using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace RizzyUI;

/// <summary>
/// The rules for Alpine directives that callers pass to a RizzyUI component (decisions D-24 and D-27):
/// <list type="bullet">
/// <item><c>x-data</c>, <c>x-init</c> and <c>x-load</c> are reserved: the component owns its Alpine scope,
/// and application state belongs on an ancestor element. Supplying one throws, unless a RizzyUI
/// component forwarded it (<c>AsChild</c> on a component child, decision D-25).</item>
/// <item><c>x-on:*</c> is allowed and runs alongside the component's own handlers: it is rendered as
/// Alpine's equivalent <c>@event</c> form, so it never collides with the component's
/// <c>x-on:event</c> on the same element.</item>
/// <item><c>x-model</c> is allowed only on components that hold a value (form inputs,
/// <c>RzColorSwatch</c>); elsewhere it throws.</item>
/// <item><c>x-show</c>, <c>x-cloak</c> and <c>x-transition</c> throw on components that manage their own
/// visibility (overlays, collapsible content).</item>
/// <item><c>x-ref</c> is allowed, except the ref names the component uses itself.</item>
/// <item><c>x-bind:attr</c> (or <c>:attr</c>) for an attribute the component computes is dropped (the
/// component wins, decision D-20) with a Development warning that names it.</item>
/// </list>
/// The per-component facts come from the components' markup (<see cref="Generated"/>).
/// </summary>
internal static partial class RzDirectiveRules
{
    /// <summary>
    /// Attribute <c>CloneFragment</c> adds when it forwards a RizzyUI component's own directives to a
    /// component child; its value lists the forwarded names. Removed before rendering.
    /// </summary>
    internal const string ForwardedAttribute = "data-rz-forwarded-directives";

    /// <param name="ManagesVisibility">The root element binds x-show or x-transition.</param>
    /// <param name="Computed">Attributes the root element binds with x-bind.</param>
    /// <param name="Refs">x-ref names the component uses.</param>
    internal sealed record Rule(bool ManagesVisibility, string[] Computed, string[] Refs);

    private static readonly Rule None = new(false, [], []);

    internal static Rule For(Type componentType) =>
        Generated.TryGetValue(StripGenericArity(componentType.Name), out var rule) ? rule : None;

    /// <summary>The generated rule for a component name, or null (for tests).</summary>
    internal static Rule? ForName(string name) => Generated.GetValueOrDefault(name);

    /// <summary>The number of components with a rule (for tests).</summary>
    internal static int Count => Generated.Count;

    private static string StripGenericArity(string name)
    {
        var tick = name.IndexOf('`');
        return tick < 0 ? name : name[..tick];
    }

    /// <summary>
    /// Applies the rules to a component's unmatched attributes: throws for reserved directives, drops
    /// bindings of computed attributes, and renders caller <c>x-on:*</c> as <c>@*</c>. Returns the
    /// attributes to render (the input when nothing changes).
    /// </summary>
    internal static Dictionary<string, object>? Apply(RzComponent component, Dictionary<string, object>? attributes, IServiceProvider? services)
    {
        if (attributes is null || attributes.Count == 0)
            return attributes;

        HashSet<string>? forwarded = null;
        if (attributes.TryGetValue(ForwardedAttribute, out var marker))
        {
            forwarded = new HashSet<string>(
                (marker?.ToString() ?? string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
                StringComparer.OrdinalIgnoreCase);
        }

        Dictionary<string, object>? result = null;
        Dictionary<string, object> Result() => result ??= new Dictionary<string, object>(attributes, attributes.Comparer);
        if (forwarded is not null)
            Result().Remove(ForwardedAttribute);

        var type = component.GetType();
        Rule? rule = null;

        foreach (var (key, value) in attributes)
        {
            if (key.Length < 2 || forwarded?.Contains(key) == true)
                continue;

            var name = key.ToLowerInvariant();
            var directive = DirectiveName(name);

            if (directive is "x-data" or "x-init" or "x-load" || name.StartsWith("x-load-", StringComparison.Ordinal))
            {
                throw new InvalidOperationException(
                    $"{ComponentName(type)}: '{key}' is reserved. A RizzyUI component owns its Alpine scope (x-data, x-init, x-load); " +
                    "put application state on an ancestor element (<div x-data=\"...\">) and reach the component's state with x-syncprop " +
                    "or its rz:* events. See the docs page \"Parent property synchronization\".");
            }

            if (directive == "x-model" && !component.AcceptsXModel)
            {
                throw new InvalidOperationException(
                    $"{ComponentName(type)}: '{key}' is not supported on this component, which has no model value. " +
                    "Use x-syncprop to sync its state with an ancestor, or listen for its rz:* events.");
            }

            if (directive is "x-show" or "x-cloak" or "x-transition" && (rule ??= For(type)).ManagesVisibility)
            {
                throw new InvalidOperationException(
                    $"{ComponentName(type)}: '{key}' is reserved: this component manages its own visibility. " +
                    "Open and close it through its parent component (or its events) instead.");
            }

            if (directive == "x-ref" && Array.IndexOf((rule ??= For(type)).Refs, value?.ToString()) >= 0)
            {
                throw new InvalidOperationException(
                    $"{ComponentName(type)}: x-ref=\"{value}\" is reserved: the component uses that ref itself. Choose another name.");
            }

            var bound = BoundAttribute(name);
            if (bound is not null && Array.IndexOf((rule ??= For(type)).Computed, bound) >= 0)
            {
                Result().Remove(key);
                Warn(services, type, key, bound);
                continue;
            }

            // Caller handlers run alongside the component's: x-on:click and @click are separate
            // attributes for the browser and the same directive for Alpine.
            if (name.StartsWith("x-on:", StringComparison.Ordinal))
            {
                var shorthand = "@" + key["x-on:".Length..];
                if (!attributes.ContainsKey(shorthand))
                {
                    var map = Result();
                    map.Remove(key);
                    map[shorthand] = value;
                }
            }
        }

        return result ?? attributes;
    }

    /// <summary>The directive part of an attribute name: <c>x-on:click.prevent</c> → <c>x-on</c>, <c>x-model.lazy</c> → <c>x-model</c>.</summary>
    private static string DirectiveName(string name)
    {
        var end = name.IndexOfAny([':', '.']);
        return end < 0 ? name : name[..end];
    }

    /// <summary>The attribute an <c>x-bind:attr</c> or <c>:attr</c> binding sets, or null.</summary>
    private static string? BoundAttribute(string name)
    {
        string? bound = name.StartsWith("x-bind:", StringComparison.Ordinal) ? name["x-bind:".Length..]
            : name.StartsWith(':') ? name[1..]
            : null;
        if (bound is null) return null;
        var dot = bound.IndexOf('.');
        return dot < 0 ? bound : bound[..dot];
    }

    private static string ComponentName(Type type) => StripGenericArity(type.Name);

    private static void Warn(IServiceProvider? services, Type type, string key, string attribute)
    {
        if (services?.GetService<IHostEnvironment>()?.IsDevelopment() != true)
            return;

        services.GetService<ILoggerFactory>()?.CreateLogger("RizzyUI.Directives").LogWarning(
            "{Component}: the binding {Binding} was dropped. The component computes '{Attribute}' itself (D-20); " +
            "set it through the component's parameters or state instead.",
            ComponentName(type), key, attribute);
    }
}
