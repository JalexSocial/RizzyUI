namespace RizzyUI;

public abstract partial class RzStylesBase
{
	/// <summary>
	/// Defines the abstract structure for styling the RzEmpty component family.
	/// </summary>
	public abstract class RzEmptyStylesBase
	{
		/// <summary> The theme instance providing styling context. </summary>
		protected readonly RzTheme Theme;

		/// <summary> Initializes a new instance of the <see cref="RzEmptyStylesBase"/> class. </summary>
		protected RzEmptyStylesBase(RzTheme theme)
		{
			Theme = theme;
		}

		/// <summary> Gets the CSS classes for the root RzEmpty container. </summary>
		public abstract string Empty { get; }

		/// <summary> Gets the CSS classes for the EmptyHeader container. </summary>
		public abstract string Header { get; }

		/// <summary> Gets the CSS classes for the EmptyTitle element. </summary>
		public abstract string Title { get; }

		/// <summary> Gets the CSS classes for the EmptyDescription element. </summary>
		public abstract string Description { get; }

		/// <summary> Gets the CSS classes for the EmptyContent container. </summary>
		public abstract string Content { get; }

		/// <summary> Gets the variant-specific CSS classes for the EmptyMedia container. </summary>
		/// <param name="variant">The media variant type.</param>
		/// <returns>A string of CSS classes.</returns>
		public abstract string GetMediaCss(EmptyMediaVariant variant);
	}
}