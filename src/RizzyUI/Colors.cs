namespace RizzyUI;

/// <summary>
///     Provides static readonly properties to access each Tailwind color palette.
///     Example: Colors.Rose.L500 or Colors.Rose["500"]
/// </summary>
public static class Colors
{
    /// <summary>
    ///     Transparent
    /// </summary>
    public static readonly Color Transparent = new(new Oklch(0, 0, 0, 0));

    /// <summary>
    ///     The color white.
    /// </summary>
    public static readonly Color White = new("var(--color-white)", "white");

    /// <summary>
    ///     The color black.
    /// </summary>
    public static readonly Color Black = new("var(--color-black)", "black");

    /// <summary>
    ///     Red color scale.
    /// </summary>
    public static readonly ColorScale Red = new Red();

    /// <summary>
    ///     Orange color scale.
    /// </summary>
    public static readonly ColorScale Orange = new Orange();

    /// <summary>
    ///     Amber color scale.
    /// </summary>
    public static readonly ColorScale Amber = new Amber();

    /// <summary>
    ///     Yellow color scale.
    /// </summary>
    public static readonly ColorScale Yellow = new Yellow();

    /// <summary>
    ///     Lime color scale.
    /// </summary>
    public static readonly ColorScale Lime = new Lime();

    /// <summary>
    ///     Green color scale.
    /// </summary>
    public static readonly ColorScale Green = new Green();

    /// <summary>
    ///     Emerald color scale.
    /// </summary>
    public static readonly ColorScale Emerald = new Emerald();

    /// <summary>
    ///     Teal color scale.
    /// </summary>
    public static readonly ColorScale Teal = new Teal();

    /// <summary>
    ///     Cyan color scale.
    /// </summary>
    public static readonly ColorScale Cyan = new Cyan();

    /// <summary>
    ///     Sky color scale.
    /// </summary>
    public static readonly ColorScale Sky = new Sky();

    /// <summary>
    ///     Blue color scale.
    /// </summary>
    public static readonly ColorScale Blue = new Blue();

    /// <summary>
    ///     Indigo color scale.
    /// </summary>
    public static readonly ColorScale Indigo = new Indigo();

    /// <summary>
    ///     Violet color scale.
    /// </summary>
    public static readonly ColorScale Violet = new Violet();

    /// <summary>
    ///     Purple color scale.
    /// </summary>
    public static readonly ColorScale Purple = new Purple();

    /// <summary>
    ///     Fuchsia color scale.
    /// </summary>
    public static readonly ColorScale Fuchsia = new Fuchsia();

    /// <summary>
    ///     Pink color scale.
    /// </summary>
    public static readonly ColorScale Pink = new Pink();

    /// <summary>
    ///     Rose color scale.
    /// </summary>
    public static readonly ColorScale Rose = new Rose();

    /// <summary>
    ///     Stone color scale.
    /// </summary>
    public static readonly ColorScale Stone = new Stone();

    /// <summary>
    ///     Neutral color scale.
    /// </summary>
    public static readonly ColorScale Neutral = new Neutral();

    /// <summary>
    ///     Zinc color scale.
    /// </summary>
    public static readonly ColorScale Zinc = new Zinc();

    /// <summary>
    ///     Gray color scale.
    /// </summary>
    public static readonly ColorScale Gray = new Gray();

    /// <summary>
    ///     Slate color scale.
    /// </summary>
    public static readonly ColorScale Slate = new Slate();
}