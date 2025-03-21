﻿using Microsoft.AspNetCore.Components;
using System.Diagnostics.CodeAnalysis;
using Rizzy;
using Rizzy.Htmx;
using TailwindMerge;

namespace RizzyUI;

/// <summary>
/// Base class for all RizzyUI components
/// </summary>
public class RizzyComponent : ComponentBase
{
    private string? _nonce;

    /// <summary>
    /// Reference to Tailwind Merge service
    /// </summary>
    [Inject] protected TwMerge TwMerge { get; set; } = default!;

    /// <summary>
    /// NonceProvider service that provides scoped per-request nonce values to RizzyUI
    /// components
    /// </summary>
    [Inject] protected IRizzyNonceProvider RizzyNonceProvider { get; set; } = default!;

    /// <summary>
    /// Specifies the root HTML element to render (e.g., "div", "a", "button").
    /// If not set, defaults to "div".
    /// </summary>
    [Parameter]
    public string Element { get; set; } = "div";

    /// <summary>
    /// Captures any additional unmatched attributes
    /// </summary>
    [SuppressMessage("Usage", "CA2227:Collection properties should be read only", Justification = "False positive. This is a parameter.")]
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Nonce values used if component requires dynamic script loading.  If needed, Nonce
    /// should be updated by calling Nonce = RizzyNonceProvider.GetNonce() in OnParametersSet
    /// to match scoped nonce value
    /// </summary>
    protected string Nonce => _nonce ??= RizzyNonceProvider.GetNonce();

    /// <summary>
    /// Method that provides a set of CSS root classes to the component
    /// </summary>
    /// <returns></returns>
    protected virtual string? RootClass() => AdditionalAttributes?.GetValueOrDefault("class", string.Empty).ToString();
}