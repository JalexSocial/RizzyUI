
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;

// For Task

namespace RizzyUI;

/// <xmldoc>
///     Renders child content within an isolated iframe, optionally applying a specified Blazor layout component.
///     Useful for previewing components or content in a sandboxed environment. Includes Alpine.js logic
///     for dynamic iframe resizing and dark mode synchronization.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzEmbeddedPreview : RzComponent
{
    private readonly string Id = IdGenerator.UniqueId("rzpreview");
    // Theme is inherited from RzComponent

    private string? _content;

    /// <summary> ServiceProvider reference needed to render components to string correctly. </summary>
    [Inject] private IServiceProvider ServiceProvider { get; set; } = default!;

    /// <summary> The content (markup or components) to render inside the iframe. Required. </summary>
    [Parameter] [EditorRequired] public required RenderFragment ChildContent { get; set; }

    /// <summary> An optional Blazor layout component type to wrap the <see cref="ChildContent" /> within the iframe. </summary>
    [Parameter] public Type? Layout { get; set; }

    /// <inheritdoc />
    protected override async Task OnParametersSetAsync() // Use async version for RenderHtmlAsync
    {
        await base.OnParametersSetAsync(); // Ensure base class logic runs

        // Wrap the ChildContent inside the Layout if specified
        RenderFragment fragment = builder =>
        {
            if (Layout != null)
            {
                builder.OpenComponent(0, Layout);
                builder.AddAttribute(1, nameof(LayoutComponentBase.Body), ChildContent);
                builder.CloseComponent();
            }
            else
            {
                builder.AddContent(2, ChildContent);
            }
        };

        // Use the async RenderHtml extension method to render the fragment
        // Be mindful of potential deadlocks if not done correctly in all scenarios.
        // Consider making this truly async if rendering becomes complex.
        _content = await fragment.RenderHtmlAsync(ServiceProvider);
    }
}