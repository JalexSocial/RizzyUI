
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandDialog : RzComponent<RzCommandDialog.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "overflow-hidden p-0",
        slots: new()
        {
            [s => s.Command] = "[&_[data-slot=command-group-heading]]:text-muted-foreground [&_[data-slot=command-group-heading]]:px-2 [&_[data-slot=command-group-heading]]:font-medium [&_[data-slot=command-group]]:px-2 [&_[data-slot=command-group]:not([hidden])_~[data-slot=command-group]]:pt-0 [&_[data-slot=command-input-wrapper]_svg]:h-5 [&_[data-slot=command-input-wrapper]_svg]:w-5 [&_[data-slot=command-input]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5"
        }
    );

    [Parameter]
    public bool Open { get; set; }

    [Parameter]
    public EventCallback<bool> OpenChanged { get; set; }

    [Parameter]
    public string? Title { get; set; }

    [Parameter]
    public string? Description { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public bool ShowCloseButton { get; set; } = true;

    [Parameter]
    public bool ShouldFilter { get; set; } = true;

    [Parameter]
    public bool Loop { get; set; }

    [Parameter]
    public string? SelectedValue { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        Title ??= Localizer["RzCommandDialog.DefaultTitle"];
        Description ??= Localizer["RzCommandDialog.DefaultDescription"];
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Title ??= Localizer["RzCommandDialog.DefaultTitle"];
        Description ??= Localizer["RzCommandDialog.DefaultDescription"];
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandDialog;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Command { get; set; }
    }
}