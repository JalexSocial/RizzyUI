using RizzyUI.Styling;

namespace RizzyUI.Components.RzBreadcrumb.Styling;

/// <summary>
/// Provides the default styles for the RzBreadcrumb component.
/// </summary>
public  class DefaultRzBreadcrumbStyles : RzStylesBase.RzBreadcrumbStylesBase
{
    public DefaultRzBreadcrumbStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Container => $"text-sm font-medium text-on-primary mb-4"; // Adjusted color

    /// <inheritdoc/>
    public override string List => "flex flex-wrap items-center gap-1";
}

/// <summary>
/// Provides the default styles for the RzBreadcrumbItem component.
/// </summary>
public  class DefaultRzBreadcrumbItemStyles : RzStylesBase.RzBreadcrumbItemStylesBase
{
     public DefaultRzBreadcrumbItemStyles(RzTheme theme) : base(theme) { }

     /// <inheritdoc/>
     public override string ListItem => $"flex items-center gap-1 text-on-surface";

     /// <inheritdoc/>
     public override string Link => $"text-on-surface hover:text-{Theme.Light.OnSurfaceStrong.TailwindClassName} dark:hover:text-{Theme.Dark.OnSurfaceStrong.TailwindClassName}";

     /// <inheritdoc/>
     public override string ActiveSpan => $"font-bold text-on-surface";

     /// <inheritdoc/>
     public override string IconSpan => "text-xl";
}

