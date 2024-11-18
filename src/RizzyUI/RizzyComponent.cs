using Microsoft.AspNetCore.Components;
using System.Diagnostics.CodeAnalysis;
using System.Collections.Generic;
using TailwindMerge;
using RizzyUI.Extensions;

namespace RizzyUI;

public class RizzyComponent : ComponentBase
{
    [Inject] protected TwMerge TwMerge { get; set; } = default!;

    /// <summary>
    /// Specifies the root HTML element to render (e.g., "div", "a", "button").
    /// If not set, defaults to "div".
    /// </summary>
    [Parameter]
    public string Element { get; set; } = "div";

    [SuppressMessage("Usage", "CA2227:Collection properties should be read only", Justification = "False positive. This is a parameter.")]
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    protected virtual string? RootClass () => AdditionalAttributes?.GetValueOrDefault("class", string.Empty).ToString();
}