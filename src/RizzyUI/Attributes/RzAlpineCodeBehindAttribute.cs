using System.Runtime.CompilerServices;

namespace RizzyUI;

/// <summary>
/// An attribute that marks a Blazor component as having a co-located JavaScript module for Alpine.js interactivity.
/// This enables the "Alpine Code-Behind" feature, which automatically discovers and registers a `.razor.js` file
/// associated with the component.
/// </summary>
[AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
public sealed class RzAlpineCodeBehindAttribute([CallerFilePath] string? razorFilePath = null) : Attribute
{
    /// <summary>
    /// Gets the full file path of the Razor component to which this attribute is applied.
    /// This path is captured automatically by the compiler using the <see cref="CallerFilePathAttribute"/>.
    /// </summary>
    public string? RazorFilePath { get; } = razorFilePath;
}