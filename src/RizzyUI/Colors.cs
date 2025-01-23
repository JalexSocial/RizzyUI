namespace RizzyUI;

/// <summary>
/// Provides static readonly properties to access each Tailwind color palette.
/// Example: Colors.Rose.L500 or Colors.Rose["500"]
/// </summary>
public static class Colors
{
    /// <summary>
    /// The color white.
    /// </summary>
    public static readonly Oklch White = new (1, 0, 0);

    /// <summary>
    /// The color black.
    /// </summary>
    public static readonly Oklch Black = new (0, 0, 0);

    /// <summary>
    /// Red color scale.
    /// </summary>
    public static readonly ColorScale Red = new Red();
    /// <summary>
    /// Orange color scale.
    /// </summary>
    public static readonly ColorScale Orange = new Orange();
    /// <summary>
    /// Amber color scale.
    /// </summary>
    public static readonly ColorScale Amber = new Amber();
    /// <summary>
    /// Yellow color scale.
    /// </summary>
    public static readonly ColorScale Yellow = new Yellow();
    /// <summary>
    /// Lime color scale.
    /// </summary>
    public static readonly ColorScale Lime = new Lime();
    /// <summary>
    /// Green color scale.
    /// </summary>
    public static readonly ColorScale Green = new Green();
    /// <summary>
    /// Emerald color scale.
    /// </summary>
    public static readonly ColorScale Emerald = new Emerald();
    /// <summary>
    /// Teal color scale.
    /// </summary>
    public static readonly ColorScale Teal = new Teal();
    /// <summary>
    /// Cyan color scale.
    /// </summary>
    public static readonly ColorScale Cyan = new Cyan();
    /// <summary>
    /// Sky color scale.
    /// </summary>
    public static readonly ColorScale Sky = new Sky();
    /// <summary>
    /// Blue color scale.
    /// </summary>
    public static readonly ColorScale Blue = new Blue();
    /// <summary>
    /// Indigo color scale.
    /// </summary>
    public static readonly ColorScale Indigo = new Indigo();
    /// <summary>
    /// Violet color scale.
    /// </summary>
    public static readonly ColorScale Violet = new Violet();
    /// <summary>
    /// Purple color scale.
    /// </summary>
    public static readonly ColorScale Purple = new Purple();
    /// <summary>
    /// Fuchsia color scale.
    /// </summary>
    public static readonly ColorScale Fuchsia = new Fuchsia();
    /// <summary>
    /// Pink color scale.
    /// </summary>
    public static readonly ColorScale Pink = new Pink();
    /// <summary>
    /// Rose color scale.
    /// </summary>
    public static readonly ColorScale Rose = new Rose();
    /// <summary>
    /// Stone color scale.
    /// </summary>
    public static readonly ColorScale Stone = new Stone();
    /// <summary>
    /// Neutral color scale.
    /// </summary>
    public static readonly ColorScale Neutral = new Neutral();
    /// <summary>
    /// Zinc color scale.
    /// </summary>
    public static readonly ColorScale Zinc = new Zinc();
    /// <summary>
    /// Gray color scale.
    /// </summary>
    public static readonly ColorScale Gray = new Gray();
    /// <summary>
    /// Slate color scale.
    /// </summary>
    public static readonly ColorScale Slate = new Slate();

    /// <summary>
    /// A dictionary where the key is an Oklch from <see cref="Colors"/>,
    /// and the value is the matching Tailwind CSS variable string.
    /// </summary>
    internal static readonly Dictionary<Oklch, string> ColorMap = new()
    {
        // White & Black
        [Colors.White] = "--color-white",
        [Colors.Black] = "--color-black",

        // RED
        [Colors.Red.L50] = "--color-red-50",
        [Colors.Red.L100] = "--color-red-100",
        [Colors.Red.L200] = "--color-red-200",
        [Colors.Red.L300] = "--color-red-300",
        [Colors.Red.L400] = "--color-red-400",
        [Colors.Red.L500] = "--color-red-500",
        [Colors.Red.L600] = "--color-red-600",
        [Colors.Red.L700] = "--color-red-700",
        [Colors.Red.L800] = "--color-red-800",
        [Colors.Red.L900] = "--color-red-900",
        [Colors.Red.L950] = "--color-red-950",

        // ORANGE
        [Colors.Orange.L50] = "--color-orange-50",
        [Colors.Orange.L100] = "--color-orange-100",
        [Colors.Orange.L200] = "--color-orange-200",
        [Colors.Orange.L300] = "--color-orange-300",
        [Colors.Orange.L400] = "--color-orange-400",
        [Colors.Orange.L500] = "--color-orange-500",
        [Colors.Orange.L600] = "--color-orange-600",
        [Colors.Orange.L700] = "--color-orange-700",
        [Colors.Orange.L800] = "--color-orange-800",
        [Colors.Orange.L900] = "--color-orange-900",
        [Colors.Orange.L950] = "--color-orange-950",

        // AMBER
        [Colors.Amber.L50] = "--color-amber-50",
        [Colors.Amber.L100] = "--color-amber-100",
        [Colors.Amber.L200] = "--color-amber-200",
        [Colors.Amber.L300] = "--color-amber-300",
        [Colors.Amber.L400] = "--color-amber-400",
        [Colors.Amber.L500] = "--color-amber-500",
        [Colors.Amber.L600] = "--color-amber-600",
        [Colors.Amber.L700] = "--color-amber-700",
        [Colors.Amber.L800] = "--color-amber-800",
        [Colors.Amber.L900] = "--color-amber-900",
        [Colors.Amber.L950] = "--color-amber-950",

        // YELLOW
        [Colors.Yellow.L50] = "--color-yellow-50",
        [Colors.Yellow.L100] = "--color-yellow-100",
        [Colors.Yellow.L200] = "--color-yellow-200",
        [Colors.Yellow.L300] = "--color-yellow-300",
        [Colors.Yellow.L400] = "--color-yellow-400",
        [Colors.Yellow.L500] = "--color-yellow-500",
        [Colors.Yellow.L600] = "--color-yellow-600",
        [Colors.Yellow.L700] = "--color-yellow-700",
        [Colors.Yellow.L800] = "--color-yellow-800",
        [Colors.Yellow.L900] = "--color-yellow-900",
        [Colors.Yellow.L950] = "--color-yellow-950",

        // LIME
        [Colors.Lime.L50] = "--color-lime-50",
        [Colors.Lime.L100] = "--color-lime-100",
        [Colors.Lime.L200] = "--color-lime-200",
        [Colors.Lime.L300] = "--color-lime-300",
        [Colors.Lime.L400] = "--color-lime-400",
        [Colors.Lime.L500] = "--color-lime-500",
        [Colors.Lime.L600] = "--color-lime-600",
        [Colors.Lime.L700] = "--color-lime-700",
        [Colors.Lime.L800] = "--color-lime-800",
        [Colors.Lime.L900] = "--color-lime-900",
        [Colors.Lime.L950] = "--color-lime-950",

        // GREEN
        [Colors.Green.L50] = "--color-green-50",
        [Colors.Green.L100] = "--color-green-100",
        [Colors.Green.L200] = "--color-green-200",
        [Colors.Green.L300] = "--color-green-300",
        [Colors.Green.L400] = "--color-green-400",
        [Colors.Green.L500] = "--color-green-500",
        [Colors.Green.L600] = "--color-green-600",
        [Colors.Green.L700] = "--color-green-700",
        [Colors.Green.L800] = "--color-green-800",
        [Colors.Green.L900] = "--color-green-900",
        [Colors.Green.L950] = "--color-green-950",

        // EMERALD
        [Colors.Emerald.L50] = "--color-emerald-50",
        [Colors.Emerald.L100] = "--color-emerald-100",
        [Colors.Emerald.L200] = "--color-emerald-200",
        [Colors.Emerald.L300] = "--color-emerald-300",
        [Colors.Emerald.L400] = "--color-emerald-400",
        [Colors.Emerald.L500] = "--color-emerald-500",
        [Colors.Emerald.L600] = "--color-emerald-600",
        [Colors.Emerald.L700] = "--color-emerald-700",
        [Colors.Emerald.L800] = "--color-emerald-800",
        [Colors.Emerald.L900] = "--color-emerald-900",
        [Colors.Emerald.L950] = "--color-emerald-950",

        // TEAL
        [Colors.Teal.L50] = "--color-teal-50",
        [Colors.Teal.L100] = "--color-teal-100",
        [Colors.Teal.L200] = "--color-teal-200",
        [Colors.Teal.L300] = "--color-teal-300",
        [Colors.Teal.L400] = "--color-teal-400",
        [Colors.Teal.L500] = "--color-teal-500",
        [Colors.Teal.L600] = "--color-teal-600",
        [Colors.Teal.L700] = "--color-teal-700",
        [Colors.Teal.L800] = "--color-teal-800",
        [Colors.Teal.L900] = "--color-teal-900",
        [Colors.Teal.L950] = "--color-teal-950",

        // CYAN
        [Colors.Cyan.L50] = "--color-cyan-50",
        [Colors.Cyan.L100] = "--color-cyan-100",
        [Colors.Cyan.L200] = "--color-cyan-200",
        [Colors.Cyan.L300] = "--color-cyan-300",
        [Colors.Cyan.L400] = "--color-cyan-400",
        [Colors.Cyan.L500] = "--color-cyan-500",
        [Colors.Cyan.L600] = "--color-cyan-600",
        [Colors.Cyan.L700] = "--color-cyan-700",
        [Colors.Cyan.L800] = "--color-cyan-800",
        [Colors.Cyan.L900] = "--color-cyan-900",
        [Colors.Cyan.L950] = "--color-cyan-950",

        // SKY
        [Colors.Sky.L50] = "--color-sky-50",
        [Colors.Sky.L100] = "--color-sky-100",
        [Colors.Sky.L200] = "--color-sky-200",
        [Colors.Sky.L300] = "--color-sky-300",
        [Colors.Sky.L400] = "--color-sky-400",
        [Colors.Sky.L500] = "--color-sky-500",
        [Colors.Sky.L600] = "--color-sky-600",
        [Colors.Sky.L700] = "--color-sky-700",
        [Colors.Sky.L800] = "--color-sky-800",
        [Colors.Sky.L900] = "--color-sky-900",
        [Colors.Sky.L950] = "--color-sky-950",

        // BLUE
        [Colors.Blue.L50] = "--color-blue-50",
        [Colors.Blue.L100] = "--color-blue-100",
        [Colors.Blue.L200] = "--color-blue-200",
        [Colors.Blue.L300] = "--color-blue-300",
        [Colors.Blue.L400] = "--color-blue-400",
        [Colors.Blue.L500] = "--color-blue-500",
        [Colors.Blue.L600] = "--color-blue-600",
        [Colors.Blue.L700] = "--color-blue-700",
        [Colors.Blue.L800] = "--color-blue-800",
        [Colors.Blue.L900] = "--color-blue-900",
        [Colors.Blue.L950] = "--color-blue-950",

        // INDIGO
        [Colors.Indigo.L50] = "--color-indigo-50",
        [Colors.Indigo.L100] = "--color-indigo-100",
        [Colors.Indigo.L200] = "--color-indigo-200",
        [Colors.Indigo.L300] = "--color-indigo-300",
        [Colors.Indigo.L400] = "--color-indigo-400",
        [Colors.Indigo.L500] = "--color-indigo-500",
        [Colors.Indigo.L600] = "--color-indigo-600",
        [Colors.Indigo.L700] = "--color-indigo-700",
        [Colors.Indigo.L800] = "--color-indigo-800",
        [Colors.Indigo.L900] = "--color-indigo-900",
        [Colors.Indigo.L950] = "--color-indigo-950",

        // VIOLET
        [Colors.Violet.L50] = "--color-violet-50",
        [Colors.Violet.L100] = "--color-violet-100",
        [Colors.Violet.L200] = "--color-violet-200",
        [Colors.Violet.L300] = "--color-violet-300",
        [Colors.Violet.L400] = "--color-violet-400",
        [Colors.Violet.L500] = "--color-violet-500",
        [Colors.Violet.L600] = "--color-violet-600",
        [Colors.Violet.L700] = "--color-violet-700",
        [Colors.Violet.L800] = "--color-violet-800",
        [Colors.Violet.L900] = "--color-violet-900",
        [Colors.Violet.L950] = "--color-violet-950",

        // PURPLE
        [Colors.Purple.L50] = "--color-purple-50",
        [Colors.Purple.L100] = "--color-purple-100",
        [Colors.Purple.L200] = "--color-purple-200",
        [Colors.Purple.L300] = "--color-purple-300",
        [Colors.Purple.L400] = "--color-purple-400",
        [Colors.Purple.L500] = "--color-purple-500",
        [Colors.Purple.L600] = "--color-purple-600",
        [Colors.Purple.L700] = "--color-purple-700",
        [Colors.Purple.L800] = "--color-purple-800",
        [Colors.Purple.L900] = "--color-purple-900",
        [Colors.Purple.L950] = "--color-purple-950",

        // FUCHSIA
        [Colors.Fuchsia.L50] = "--color-fuchsia-50",
        [Colors.Fuchsia.L100] = "--color-fuchsia-100",
        [Colors.Fuchsia.L200] = "--color-fuchsia-200",
        [Colors.Fuchsia.L300] = "--color-fuchsia-300",
        [Colors.Fuchsia.L400] = "--color-fuchsia-400",
        [Colors.Fuchsia.L500] = "--color-fuchsia-500",
        [Colors.Fuchsia.L600] = "--color-fuchsia-600",
        [Colors.Fuchsia.L700] = "--color-fuchsia-700",
        [Colors.Fuchsia.L800] = "--color-fuchsia-800",
        [Colors.Fuchsia.L900] = "--color-fuchsia-900",
        [Colors.Fuchsia.L950] = "--color-fuchsia-950",

        // PINK
        [Colors.Pink.L50] = "--color-pink-50",
        [Colors.Pink.L100] = "--color-pink-100",
        [Colors.Pink.L200] = "--color-pink-200",
        [Colors.Pink.L300] = "--color-pink-300",
        [Colors.Pink.L400] = "--color-pink-400",
        [Colors.Pink.L500] = "--color-pink-500",
        [Colors.Pink.L600] = "--color-pink-600",
        [Colors.Pink.L700] = "--color-pink-700",
        [Colors.Pink.L800] = "--color-pink-800",
        [Colors.Pink.L900] = "--color-pink-900",
        [Colors.Pink.L950] = "--color-pink-950",

        // ROSE
        [Colors.Rose.L50] = "--color-rose-50",
        [Colors.Rose.L100] = "--color-rose-100",
        [Colors.Rose.L200] = "--color-rose-200",
        [Colors.Rose.L300] = "--color-rose-300",
        [Colors.Rose.L400] = "--color-rose-400",
        [Colors.Rose.L500] = "--color-rose-500",
        [Colors.Rose.L600] = "--color-rose-600",
        [Colors.Rose.L700] = "--color-rose-700",
        [Colors.Rose.L800] = "--color-rose-800",
        [Colors.Rose.L900] = "--color-rose-900",
        [Colors.Rose.L950] = "--color-rose-950",

        // SLATE
        [Colors.Slate.L50] = "--color-slate-50",
        [Colors.Slate.L100] = "--color-slate-100",
        [Colors.Slate.L200] = "--color-slate-200",
        [Colors.Slate.L300] = "--color-slate-300",
        [Colors.Slate.L400] = "--color-slate-400",
        [Colors.Slate.L500] = "--color-slate-500",
        [Colors.Slate.L600] = "--color-slate-600",
        [Colors.Slate.L700] = "--color-slate-700",
        [Colors.Slate.L800] = "--color-slate-800",
        [Colors.Slate.L900] = "--color-slate-900",
        [Colors.Slate.L950] = "--color-slate-950",

        // GRAY
        [Colors.Gray.L50] = "--color-gray-50",
        [Colors.Gray.L100] = "--color-gray-100",
        [Colors.Gray.L200] = "--color-gray-200",
        [Colors.Gray.L300] = "--color-gray-300",
        [Colors.Gray.L400] = "--color-gray-400",
        [Colors.Gray.L500] = "--color-gray-500",
        [Colors.Gray.L600] = "--color-gray-600",
        [Colors.Gray.L700] = "--color-gray-700",
        [Colors.Gray.L800] = "--color-gray-800",
        [Colors.Gray.L900] = "--color-gray-900",
        [Colors.Gray.L950] = "--color-gray-950",

        // ZINC
        [Colors.Zinc.L50] = "--color-zinc-50",
        [Colors.Zinc.L100] = "--color-zinc-100",
        [Colors.Zinc.L200] = "--color-zinc-200",
        [Colors.Zinc.L300] = "--color-zinc-300",
        [Colors.Zinc.L400] = "--color-zinc-400",
        [Colors.Zinc.L500] = "--color-zinc-500",
        [Colors.Zinc.L600] = "--color-zinc-600",
        [Colors.Zinc.L700] = "--color-zinc-700",
        [Colors.Zinc.L800] = "--color-zinc-800",
        [Colors.Zinc.L900] = "--color-zinc-900",
        [Colors.Zinc.L950] = "--color-zinc-950",

        // NEUTRAL
        [Colors.Neutral.L50] = "--color-neutral-50",
        [Colors.Neutral.L100] = "--color-neutral-100",
        [Colors.Neutral.L200] = "--color-neutral-200",
        [Colors.Neutral.L300] = "--color-neutral-300",
        [Colors.Neutral.L400] = "--color-neutral-400",
        [Colors.Neutral.L500] = "--color-neutral-500",
        [Colors.Neutral.L600] = "--color-neutral-600",
        [Colors.Neutral.L700] = "--color-neutral-700",
        [Colors.Neutral.L800] = "--color-neutral-800",
        [Colors.Neutral.L900] = "--color-neutral-900",
        [Colors.Neutral.L950] = "--color-neutral-950",

        // STONE
        [Colors.Stone.L50] = "--color-stone-50",
        [Colors.Stone.L100] = "--color-stone-100",
        [Colors.Stone.L200] = "--color-stone-200",
        [Colors.Stone.L300] = "--color-stone-300",
        [Colors.Stone.L400] = "--color-stone-400",
        [Colors.Stone.L500] = "--color-stone-500",
        [Colors.Stone.L600] = "--color-stone-600",
        [Colors.Stone.L700] = "--color-stone-700",
        [Colors.Stone.L800] = "--color-stone-800",
        [Colors.Stone.L900] = "--color-stone-900",
        [Colors.Stone.L950] = "--color-stone-950",
    };

}
