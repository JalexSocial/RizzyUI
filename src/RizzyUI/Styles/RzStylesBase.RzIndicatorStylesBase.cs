namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
	#region RzIndicator Styles

	/// <summary>
	/// Defines the abstract structure for styling the <see cref="RzIndicator"/> component.
	/// </summary>
	public abstract class RzIndicatorStylesBase
	{
		/// <summary> The theme instance providing color and sizing tokens. </summary>
		protected readonly RzTheme Theme;

		/// <summary> Initializes a new instance of the <see cref="RzIndicatorStylesBase"/> class. </summary>
		protected RzIndicatorStylesBase(RzTheme theme)
		{
			Theme = theme;
		}

		/// <summary> Gets the base CSS classes for the RzIndicator element (shape, border). </summary>
		public abstract string IndicatorBase { get; }

		/// <summary> Gets the CSS classes for positioning the indicator based on the IndicatorPosition. </summary>
		/// <param name="position">The desired position of the indicator.</param>
		/// <returns>A string of Tailwind CSS positioning classes.</returns>
		public abstract string GetPositionCss(IndicatorPosition position);

		/// <summary> Gets the CSS classes for the size of the indicator. </summary>
		/// <param name="size">The desired size.</param>
		/// <returns>A string of Tailwind CSS size classes (e.g., "size-3").</returns>
		public abstract string GetSizeCss(Size size);
	}

	#endregion	
}