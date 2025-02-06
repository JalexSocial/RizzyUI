namespace RizzyUI
{
    /// <summary>
    /// Represents a scale of colors with various lightness levels.
    /// </summary>
    public abstract class ColorScale
    {
        /// <summary>
        /// Gets the color shade at level 50.
        /// </summary>
        public abstract Color L50 { get; }

        /// <summary>
        /// Gets the color shade at level 100.
        /// </summary>
        public abstract Color L100 { get; }

        /// <summary>
        /// Gets the color shade at level 200.
        /// </summary>
        public abstract Color L200 { get; }

        /// <summary>
        /// Gets the color shade at level 300.
        /// </summary>
        public abstract Color L300 { get; }

        /// <summary>
        /// Gets the color shade at level 400.
        /// </summary>
        public abstract Color L400 { get; }

        /// <summary>
        /// Gets the color shade at level 500.
        /// </summary>
        public abstract Color L500 { get; }

        /// <summary>
        /// Gets the color shade at level 600.
        /// </summary>
        public abstract Color L600 { get; }

        /// <summary>
        /// Gets the color shade at level 700.
        /// </summary>
        public abstract Color L700 { get; }

        /// <summary>
        /// Gets the color shade at level 800.
        /// </summary>
        public abstract Color L800 { get; }

        /// <summary>
        /// Gets the color shade at level 900.
        /// </summary>
        public abstract Color L900 { get; }

        /// <summary>
        /// Gets the color shade at level 950.
        /// </summary>
        public abstract Color L950 { get; }
    }

    /// <summary>
    /// Represents the red color scale.
    /// </summary>
    public sealed class Red : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-red-50", "red-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-red-100", "red-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-red-200", "red-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-red-300", "red-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-red-400", "red-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-red-500", "red-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-red-600", "red-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-red-700", "red-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-red-800", "red-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-red-900", "red-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-red-950", "red-950");
    }

    /// <summary>
    /// Represents the orange color scale.
    /// </summary>
    public sealed class Orange : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-orange-50", "orange-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-orange-100", "orange-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-orange-200", "orange-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-orange-300", "orange-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-orange-400", "orange-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-orange-500", "orange-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-orange-600", "orange-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-orange-700", "orange-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-orange-800", "orange-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-orange-900", "orange-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-orange-950", "orange-950");
    }

    /// <summary>
    /// Represents the amber color scale.
    /// </summary>
    public sealed class Amber : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-amber-50", "amber-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-amber-100", "amber-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-amber-200", "amber-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-amber-300", "amber-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-amber-400", "amber-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-amber-500", "amber-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-amber-600", "amber-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-amber-700", "amber-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-amber-800", "amber-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-amber-900", "amber-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-amber-950", "amber-950");
    }

    /// <summary>
    /// Represents the yellow color scale.
    /// </summary>
    public sealed class Yellow : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-yellow-50", "yellow-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-yellow-100", "yellow-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-yellow-200", "yellow-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-yellow-300", "yellow-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-yellow-400", "yellow-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-yellow-500", "yellow-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-yellow-600", "yellow-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-yellow-700", "yellow-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-yellow-800", "yellow-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-yellow-900", "yellow-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-yellow-950", "yellow-950");
    }

    /// <summary>
    /// Represents the lime color scale.
    /// </summary>
    public sealed class Lime : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-lime-50", "lime-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-lime-100", "lime-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-lime-200", "lime-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-lime-300", "lime-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-lime-400", "lime-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-lime-500", "lime-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-lime-600", "lime-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-lime-700", "lime-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-lime-800", "lime-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-lime-900", "lime-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-lime-950", "lime-950");
    }

    /// <summary>
    /// Represents the green color scale.
    /// </summary>
    public sealed class Green : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-green-50", "green-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-green-100", "green-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-green-200", "green-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-green-300", "green-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-green-400", "green-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-green-500", "green-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-green-600", "green-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-green-700", "green-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-green-800", "green-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-green-900", "green-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-green-950", "green-950");
    }

    /// <summary>
    /// Represents the emerald color scale.
    /// </summary>
    public sealed class Emerald : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-emerald-50", "emerald-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-emerald-100", "emerald-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-emerald-200", "emerald-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-emerald-300", "emerald-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-emerald-400", "emerald-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-emerald-500", "emerald-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-emerald-600", "emerald-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-emerald-700", "emerald-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-emerald-800", "emerald-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-emerald-900", "emerald-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-emerald-950", "emerald-950");
    }

    /// <summary>
    /// Represents the teal color scale.
    /// </summary>
    public sealed class Teal : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-teal-50", "teal-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-teal-100", "teal-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-teal-200", "teal-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-teal-300", "teal-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-teal-400", "teal-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-teal-500", "teal-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-teal-600", "teal-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-teal-700", "teal-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-teal-800", "teal-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-teal-900", "teal-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-teal-950", "teal-950");
    }

    /// <summary>
    /// Represents the cyan color scale.
    /// </summary>
    public sealed class Cyan : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-cyan-50", "cyan-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-cyan-100", "cyan-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-cyan-200", "cyan-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-cyan-300", "cyan-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-cyan-400", "cyan-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-cyan-500", "cyan-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-cyan-600", "cyan-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-cyan-700", "cyan-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-cyan-800", "cyan-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-cyan-900", "cyan-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-cyan-950", "cyan-950");
    }

    /// <summary>
    /// Represents the sky color scale.
    /// </summary>
    public sealed class Sky : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-sky-50", "sky-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-sky-100", "sky-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-sky-200", "sky-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-sky-300", "sky-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-sky-400", "sky-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-sky-500", "sky-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-sky-600", "sky-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-sky-700", "sky-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-sky-800", "sky-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-sky-900", "sky-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-sky-950", "sky-950");
    }

    /// <summary>
    /// Represents the blue color scale.
    /// </summary>
    public sealed class Blue : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-blue-50", "blue-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-blue-100", "blue-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-blue-200", "blue-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-blue-300", "blue-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-blue-400", "blue-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-blue-500", "blue-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-blue-600", "blue-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-blue-700", "blue-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-blue-800", "blue-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-blue-900", "blue-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-blue-950", "blue-950");
    }

    /// <summary>
    /// Represents the indigo color scale.
    /// </summary>
    public sealed class Indigo : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-indigo-50", "indigo-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-indigo-100", "indigo-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-indigo-200", "indigo-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-indigo-300", "indigo-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-indigo-400", "indigo-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-indigo-500", "indigo-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-indigo-600", "indigo-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-indigo-700", "indigo-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-indigo-800", "indigo-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-indigo-900", "indigo-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-indigo-950", "indigo-950");
    }

    /// <summary>
    /// Represents the violet color scale.
    /// </summary>
    public sealed class Violet : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-violet-50", "violet-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-violet-100", "violet-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-violet-200", "violet-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-violet-300", "violet-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-violet-400", "violet-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-violet-500", "violet-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-violet-600", "violet-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-violet-700", "violet-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-violet-800", "violet-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-violet-900", "violet-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-violet-950", "violet-950");
    }

    /// <summary>
    /// Represents the purple color scale.
    /// </summary>
    public sealed class Purple : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-purple-50", "purple-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-purple-100", "purple-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-purple-200", "purple-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-purple-300", "purple-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-purple-400", "purple-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-purple-500", "purple-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-purple-600", "purple-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-purple-700", "purple-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-purple-800", "purple-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-purple-900", "purple-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-purple-950", "purple-950");
    }

    /// <summary>
    /// Represents the fuchsia color scale.
    /// </summary>
    public sealed class Fuchsia : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-fuchsia-50", "fuchsia-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-fuchsia-100", "fuchsia-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-fuchsia-200", "fuchsia-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-fuchsia-300", "fuchsia-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-fuchsia-400", "fuchsia-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-fuchsia-500", "fuchsia-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-fuchsia-600", "fuchsia-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-fuchsia-700", "fuchsia-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-fuchsia-800", "fuchsia-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-fuchsia-900", "fuchsia-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-fuchsia-950", "fuchsia-950");
    }

    /// <summary>
    /// Represents the pink color scale.
    /// </summary>
    public sealed class Pink : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-pink-50", "pink-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-pink-100", "pink-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-pink-200", "pink-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-pink-300", "pink-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-pink-400", "pink-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-pink-500", "pink-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-pink-600", "pink-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-pink-700", "pink-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-pink-800", "pink-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-pink-900", "pink-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-pink-950", "pink-950");
    }

    /// <summary>
    /// Represents the rose color scale.
    /// </summary>
    public sealed class Rose : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-rose-50", "rose-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-rose-100", "rose-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-rose-200", "rose-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-rose-300", "rose-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-rose-400", "rose-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-rose-500", "rose-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-rose-600", "rose-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-rose-700", "rose-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-rose-800", "rose-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-rose-900", "rose-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-rose-950", "rose-950");
    }

    /// <summary>
    /// Represents the slate color scale.
    /// </summary>
    public sealed class Slate : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-slate-50", "slate-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-slate-100", "slate-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-slate-200", "slate-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-slate-300", "slate-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-slate-400", "slate-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-slate-500", "slate-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-slate-600", "slate-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-slate-700", "slate-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-slate-800", "slate-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-slate-900", "slate-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-slate-950", "slate-950");
    }

    /// <summary>
    /// Represents the gray color scale.
    /// </summary>
    public sealed class Gray : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-gray-50", "gray-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-gray-100", "gray-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-gray-200", "gray-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-gray-300", "gray-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-gray-400", "gray-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-gray-500", "gray-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-gray-600", "gray-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-gray-700", "gray-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-gray-800", "gray-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-gray-900", "gray-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-gray-950", "gray-950");
    }

    /// <summary>
    /// Represents the zinc color scale.
    /// </summary>
    public sealed class Zinc : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-zinc-50", "zinc-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-zinc-100", "zinc-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-zinc-200", "zinc-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-zinc-300", "zinc-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-zinc-400", "zinc-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-zinc-500", "zinc-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-zinc-600", "zinc-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-zinc-700", "zinc-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-zinc-800", "zinc-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-zinc-900", "zinc-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-zinc-950", "zinc-950");
    }

    /// <summary>
    /// Represents the neutral color scale.
    /// </summary>
    public sealed class Neutral : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-neutral-50", "neutral-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-neutral-100", "neutral-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-neutral-200", "neutral-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-neutral-300", "neutral-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-neutral-400", "neutral-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-neutral-500", "neutral-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-neutral-600", "neutral-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-neutral-700", "neutral-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-neutral-800", "neutral-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-neutral-900", "neutral-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-neutral-950", "neutral-950");
    }

    /// <summary>
    /// Represents the stone color scale.
    /// </summary>
    public sealed class Stone : ColorScale
    {
        /// <inheritdoc/>
        public override Color L50 => new("--color-stone-50", "stone-50");
        /// <inheritdoc/>
        public override Color L100 => new("--color-stone-100", "stone-100");
        /// <inheritdoc/>
        public override Color L200 => new("--color-stone-200", "stone-200");
        /// <inheritdoc/>
        public override Color L300 => new("--color-stone-300", "stone-300");
        /// <inheritdoc/>
        public override Color L400 => new("--color-stone-400", "stone-400");
        /// <inheritdoc/>
        public override Color L500 => new("--color-stone-500", "stone-500");
        /// <inheritdoc/>
        public override Color L600 => new("--color-stone-600", "stone-600");
        /// <inheritdoc/>
        public override Color L700 => new("--color-stone-700", "stone-700");
        /// <inheritdoc/>
        public override Color L800 => new("--color-stone-800", "stone-800");
        /// <inheritdoc/>
        public override Color L900 => new("--color-stone-900", "stone-900");
        /// <inheritdoc/>
        public override Color L950 => new("--color-stone-950", "stone-950");
    }
}
