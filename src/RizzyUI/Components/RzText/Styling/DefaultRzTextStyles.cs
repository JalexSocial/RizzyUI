using RizzyUI.Styling;

namespace RizzyUI.Components.RzText.Styling;

/// <summary> Provides default styles for RzTextEdit. </summary>
public  class DefaultRzTextEditStyles : RzStylesBase.RzTextEditStylesBase
{
    public DefaultRzTextEditStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string InputWrapper => "relative";

    /// <inheritdoc/>
    public override string PrependElement => $"pointer-events-none absolute inset-y-0 left-0 my-px ml-px flex items-center rounded-l-{Theme.BorderRadiusTokenName} border-r border-{Theme.Light.Outline.TailwindClassName} bg-{Theme.Light.SurfaceAlt.TailwindClassName} px-3 text-{Theme.Light.OnSurface.TailwindClassName} dark:border-{Theme.Dark.Outline.TailwindClassName} dark:bg-{Theme.Dark.SurfaceAlt.TailwindClassName} dark:text-{Theme.Dark.OnSurface.TailwindClassName}"; // Adjusted padding slightly, used theme tokens

    /// <inheritdoc/>
    public override string PrependIconContainer => "text-xl";

    /// <inheritdoc/>
    // Note: text-primary-500/etc. for focus rings are often defined in @tailwindcss/forms plugin or base styles, check if these need tokenization
    public override string Input => $"block w-full rounded-{Theme.BorderRadiusTokenName} border border-{Theme.Outline.TailwindClassName} px-3 py-2 leading-6 placeholder-{Theme.Light.OnSurfaceMuted.TailwindClassName} focus:border-{Theme.Light.Primary.TailwindClassName} focus:ring focus:ring-{Theme.Light.Primary.TailwindClassName}/50 dark:border-{Theme.Dark.Outline.TailwindClassName} dark:bg-{Theme.Dark.SurfaceAlt.TailwindClassName} dark:placeholder-{Theme.Dark.OnSurfaceMuted.TailwindClassName} dark:focus:border-{Theme.Dark.Primary.TailwindClassName} transition-opacity text-transparent"; // text-transparent initially for rzPrependInput
}

/// <summary> Provides default styles for RzTextField. </summary>
public  class DefaultRzTextFieldStyles : RzStylesBase.RzTextFieldStylesBase
{
     public DefaultRzTextFieldStyles(RzTheme theme) : base(theme) { }
     /// <inheritdoc/>
     public override string Field => ""; // Handled by RzField component
}

