using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Text centered on an <see cref="RzProgress"/> bar, for example the percentage. Positioned with
/// CSS only. It is hidden from assistive technology, which reads the progress bar's value (or its
/// <see cref="RzProgress.ValueText"/>) instead; give the bar a height that fits the text
/// (<c>class="h-4"</c>). Without child content it shows the rounded percentage.
/// </summary>
public partial class ProgressLabel : RzComponent<ProgressLabel.Slots>
{
    /// <summary>
    /// Defines the default styling for the ProgressLabel component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-foreground pointer-events-none absolute inset-0 flex items-center justify-center text-xs leading-none font-medium tabular-nums"
    );

    /// <summary> The progress bar this label belongs to. </summary>
    [CascadingParameter]
    public RzProgress? ParentProgress { get; set; }

    /// <summary> The label content. When null, the rounded percentage is shown and kept up to date. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string DefaultElement => "span";

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentProgress is null)
            throw new InvalidOperationException($"{nameof(ProgressLabel)} must be used inside {nameof(RzProgress)}.");
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ProgressLabel;

    /// <summary>
    /// Defines the slots available for styling in the ProgressLabel component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The label element.
        /// </summary>
        [Slot("progress-label")]
        public string? Base { get; set; }
    }
}
