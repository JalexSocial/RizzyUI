using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The filled part of an <see cref="RzProgress"/>. <see cref="RzProgress"/> renders one by default;
/// add it yourself to style the bar per instance (<c>class="bg-success"</c>). Its position is set
/// with the CSS <c>translate</c> property by the progress bar's runtime, so it needs no width.
/// </summary>
public partial class ProgressIndicator : RzComponent<ProgressIndicator.Slots>
{
    /// <summary>
    /// Defines the default styling for the ProgressIndicator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        // Indeterminate styling follows the track's data-state, so it also applies when the value
        // is cleared from JavaScript (setIndeterminate()).
        @base: "h-full w-full flex-1 -translate-x-full transition-transform duration-300 ease-out motion-reduce:transition-none " +
               "in-data-[state=indeterminate]:w-1/3 in-data-[state=indeterminate]:animate-progress-indeterminate in-data-[state=indeterminate]:transition-none " +
               "motion-reduce:in-data-[state=indeterminate]:animate-none motion-reduce:in-data-[state=indeterminate]:w-full " +
               "motion-reduce:in-data-[state=indeterminate]:translate-x-0 motion-reduce:in-data-[state=indeterminate]:opacity-60",
        variants: new()
        {
            [c => ((ProgressIndicator)c).Variant] = new Variant<StatusColor, Slots>
            {
                [StatusColor.Primary] = "bg-primary",
                [StatusColor.Secondary] = "bg-secondary-foreground",
                [StatusColor.Success] = "bg-success",
                [StatusColor.Info] = "bg-info",
                [StatusColor.Warning] = "bg-warning",
                [StatusColor.Destructive] = "bg-destructive",
            },
        }
    );

    /// <summary> The progress bar this indicator belongs to. </summary>
    [CascadingParameter]
    public RzProgress? ParentProgress { get; set; }

    /// <summary> The bar color from the parent's <see cref="RzProgress.Variant"/>. </summary>
    public StatusColor Variant => ParentProgress?.Variant ?? StatusColor.Primary;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentProgress is null)
            throw new InvalidOperationException($"{nameof(ProgressIndicator)} must be used inside {nameof(RzProgress)}.");
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ProgressIndicator;

    /// <summary>
    /// Defines the slots available for styling in the ProgressIndicator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The indicator element.
        /// </summary>
        [Slot("progress-indicator")]
        public string? Base { get; set; }
    }
}
