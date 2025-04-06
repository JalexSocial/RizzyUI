using RizzyUI.Styling;

namespace RizzyUI.Components.RzNumber.Styling;

/// <summary> Provides default styles for RzNumberEdit. </summary>
public class DefaultRzNumberEditStyles : RzStylesBase.RzNumberEditStylesBase // Not sealed
{
    public DefaultRzNumberEditStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string InputWrapper => "relative";

    /// <inheritdoc/>
    public override string PrependElement => $"pointer-events-none absolute inset-y-0 left-0 my-px ml-px flex items-center rounded-l-{Theme.BorderRadiusTokenName} border-r border-{Theme.Outline.TailwindClassName} bg-{Theme.Light.SurfaceAlt.TailwindClassName} pl-3 pr-1 text-{Theme.Light.OnSurface.TailwindClassName} dark:border-{Theme.Dark.Outline.TailwindClassName} dark:bg-{Theme.Dark.SurfaceAlt.TailwindClassName} dark:text-{Theme.Dark.OnSurface.TailwindClassName}";

    /// <inheritdoc/>
    public override string PrependIconContainer => "text-xl";

    /// <inheritdoc/>
    public override string Input => $"block w-full rounded-{Theme.BorderRadiusTokenName} border border-{Theme.Outline.TailwindClassName} px-3 py-2 leading-6 placeholder-{Theme.Light.OnSurfaceMuted.TailwindClassName} focus:border-{Theme.Light.Primary.TailwindClassName} focus:ring focus:ring-{Theme.Light.Primary.TailwindClassName}/50 transition-opacity text-transparent dark:border-{Theme.Dark.Outline.TailwindClassName} dark:bg-{Theme.Dark.SurfaceAlt.TailwindClassName} dark:placeholder-{Theme.Dark.OnSurfaceMuted.TailwindClassName} dark:focus:border-{Theme.Dark.Primary.TailwindClassName}";
}

/// <summary> Provides default styles for RzNumberField. </summary>
public class DefaultRzNumberFieldStyles : RzStylesBase.RzNumberFieldStylesBase // Not sealed
{
     public DefaultRzNumberFieldStyles(RzTheme theme) : base(theme) { }
     /// <inheritdoc/>
     public override string Field => ""; // Handled by RzField component
}

