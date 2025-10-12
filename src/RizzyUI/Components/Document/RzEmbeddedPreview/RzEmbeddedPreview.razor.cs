
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using System.Threading.Tasks;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <xmldoc>
///     Renders child content within an isolated iframe, optionally applying a specified Blazor layout component.
///     Useful for previewing components or content in a sandboxed environment. Includes Alpine.js logic
///     for dynamic iframe resizing and dark mode synchronization.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzEmbeddedPreview : RzComponent<RzEmbeddedPreview.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzEmbeddedPreview component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full",
        slots: new()
        {
            [s => s.IFrame] = "w-full transition-all min-h-28"
        }
    );

    private string? _content;

    /// <summary> ServiceProvider reference needed to render components to string correctly. </summary>
    [Inject] private IServiceProvider ServiceProvider { get; set; } = default!;

    /// <summary> The content (markup or components) to render inside the iframe. Required. </summary>
    [Parameter][EditorRequired] public required RenderFragment ChildContent { get; set; }

    /// <summary> An optional Blazor layout component type to wrap the <see cref="ChildContent" /> within the iframe. </summary>
    [Parameter] public Type? Layout { get; set; }

    /// <summary>
    /// Gets or sets the title attribute for the iframe, providing context for screen readers.
    /// If not set, defaults to a localized "Embedded Content Preview".
    /// </summary>
    [Parameter] public string? IFrameTitle { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        IFrameTitle ??= Localizer["RzEmbeddedPreview.DefaultIFrameTitle"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        IFrameTitle ??= Localizer["RzEmbeddedPreview.DefaultIFrameTitle"];
    }

    /// <inheritdoc />
    protected override async Task OnParametersSetAsync()
    {
        await base.OnParametersSetAsync();

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

        _content = await fragment.RenderHtmlAsync(ServiceProvider);
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzEmbeddedPreview;

    /// <summary>
    /// Defines the slots available for styling in the RzEmbeddedPreview component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? IFrame { get; set; }
    }
}