using RizzyUI.Styling;

namespace RizzyUI.Components.RzAccordion.Styling;

public  class DefaultRzAccordionStyles : RzStylesBase.RzAccordionStylesBase
{
    public DefaultRzAccordionStyles(RzTheme theme) : base(theme) { }

    public override string Container => $"w-full divide-y divide-{Theme.Outline.TailwindClassName} overflow-hidden rounded-{Theme.BorderRadiusTokenName} border border-{Theme.Outline.TailwindClassName} bg-{Theme.Light.SurfaceAlt.TailwindClassName}/40 text-{Theme.Light.OnSurface.TailwindClassName} dark:divide-{Theme.Dark.Outline.TailwindClassName}";
}

public  class DefaultRzAccordionSectionStyles : RzStylesBase.RzAccordionSectionStylesBase
{
    public DefaultRzAccordionSectionStyles(RzTheme theme) : base(theme) { }

    public override string Button => $"flex w-full items-center justify-between gap-4 bg-{Theme.Light.SurfaceAlt.TailwindClassName} p-4 text-left underline-offset-2 hover:bg-{Theme.Light.SurfaceAlt.TailwindClassName}/75 focus-visible:bg-{Theme.Light.SurfaceAlt.TailwindClassName}/75 focus-visible:underline focus-visible:outline-hidden dark:hover:bg-{Theme.Dark.SurfaceAlt.TailwindClassName}/75 dark:focus-visible:bg-{Theme.Dark.SurfaceAlt.TailwindClassName}/75 text-{Theme.Light.OnSurface.TailwindClassName} font-medium";
    public override string ContentContainer => "p-4 text-sm sm:text-base text-pretty";
    public override string ChevronIcon => "size-5 shrink-0 transition";
    public override string ChevronIconExpanded => "rotate-180";
}

