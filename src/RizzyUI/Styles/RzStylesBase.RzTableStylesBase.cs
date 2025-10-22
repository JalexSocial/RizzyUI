
using Blazicons;

namespace RizzyUI;

public abstract partial class RzStylesBase
{
    #region RzTable Component Family Styles

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzTable{TItem}"/> component and its direct parts.
    /// </summary>
    public abstract class RzTableStylesBase
    {
        /// <summary>
        /// The theme that provides the styling context.
        /// </summary>
        protected readonly RzTheme Theme;

        /// <summary>
        /// Initializes a new instance of the <see cref="RzTableStylesBase"/> class with the specified theme.
        /// </summary>
        /// <param name="theme">The theme to use for styling.</param>
        protected RzTableStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the outermost wrapper div of the RzTable (e.g., overflow, rounding, border).</summary>
        public abstract string Container { get; }

        /// <summary>Gets the CSS classes for the &lt;table&gt; element (e.g., width, text alignment, base text styles).</summary>
        public abstract string Table { get; }

        /// <summary>Gets the CSS classes for the &lt;thead&gt; element (e.g., border, background, text styles for headers).</summary>
        public abstract string Thead { get; }

        /// <summary>Gets the CSS classes for the &lt;tfoot&gt; element (e.g., border, background, text styles for footers).</summary>
        public abstract string Tfoot { get; }

        /// <summary>Gets the CSS classes applied to the RzTable's root container when FixedHeader is true.</summary>
        public abstract string FixedHeaderContainer { get; }
        /// <summary>Gets the CSS classes for the &lt;thead&gt; element when it should be fixed (sticky).</summary>
        public abstract string FixedThead { get; }
        /// <summary>Gets the CSS classes for the &lt;tfoot&gt; element when it should be fixed (sticky).</summary>
        public abstract string FixedTfoot { get; }

    }

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="TableHeaderCell{TItem}"/> component.
    /// </summary>
    public abstract class RzTableHeaderCellStylesBase
    {
        /// <summary>
        /// The theme that provides the styling context.
        /// </summary>
        protected readonly RzTheme Theme;

        /// <summary>
        /// Initializes a new instance of the <see cref="RzTableHeaderCellStylesBase"/> class with the specified theme.
        /// </summary>
        /// <param name="theme">The theme to use for styling.</param>
        protected RzTableHeaderCellStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the base &lt;th&gt; element.</summary>
        public abstract string HeaderCellBase { get; }

        /// <summary>Gets the CSS classes for the button element inside a sortable header cell.</summary>
        public abstract string SortableButton { get; }

        /// <summary>Gets the CSS classes applied to a header cell when it is sortable (e.g., cursor, hover effects).</summary>
        public abstract string SortableHeaderCell { get; }

        /// <summary>Gets the CSS classes for the span containing the title text within the header cell.</summary>
        public abstract string TitleSpan { get; }

        /// <summary>Gets the CSS classes for a bordered &lt;th&gt; element.</summary>
        public abstract string HeaderCellBordered { get; }

        /// <summary>Gets the CSS classes for the sort direction indicator icon.</summary>
        /// <param name="direction">The current sort direction.</param>
        /// <returns>CSS classes for the indicator (e.g., size, color, opacity).</returns>
        public abstract string GetSortIndicatorCss(SortDirection direction);

        /// <summary>Gets the SVG Icon for the sort direction indicator.</summary>
        /// <param name="direction">The current sort direction.</param>
        /// <returns>An SvgIcon instance (e.g., MdiIcon.ArrowUp) or null if no icon should be displayed.</returns>
        public abstract SvgIcon? GetSortIndicatorIcon(SortDirection direction);
    }

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="TableBody{TItem}"/> component.
    /// </summary>
    public abstract class RzTableBodyStylesBase
    {
        /// <summary>
        /// The theme that provides the styling context.
        /// </summary>
        protected readonly RzTheme Theme;

        /// <summary>
        /// Initializes a new instance of the <see cref="RzTableBodyStylesBase"/> class with the specified theme.
        /// </summary>
        /// <param name="theme">The theme to use for styling.</param>
        protected RzTableBodyStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the &lt;tbody&gt; element (e.g., row dividers, relative positioning for indicators).</summary>
        public abstract string TableBody { get; }

        /// <summary>Gets the CSS classes for the default cell (&lt;td&gt;) used when displaying the empty row message (e.g., padding, text alignment, color).</summary>
        public abstract string EmptyRowCell { get; }

        /// <summary>Gets the CSS classes for the &lt;tbody&gt; element to make it scrollable when FixedHeader is true.</summary>
        public abstract string ScrollableBody { get; }
    }

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="TableCell{TItem}"/> component.
    /// </summary>
    public abstract class RzTableCellStylesBase
    {
        /// <summary>
        /// The theme that provides the styling context.
        /// </summary>
        protected readonly RzTheme Theme;

        /// <summary>
        /// Initializes a new instance of the <see cref="RzTableCellStylesBase"/> class with the specified theme.
        /// </summary>
        /// <param name="theme">The theme to use for styling.</param>
        protected RzTableCellStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the base &lt;td&gt; element (e.g., padding).</summary>
        public abstract string TableCellBase { get; }

        /// <summary>Gets the CSS classes for a bordered &lt;td&gt; element.</summary>
        public abstract string TableCellBordered { get; }
    }

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="TablePagination{TItem}"/> component.
    /// </summary>
    public abstract class RzPaginationStylesBase
    {
        /// <summary>
        /// The theme that provides the styling context.
        /// </summary>
        protected readonly RzTheme Theme;

        /// <summary>
        /// Initializes a new instance of the <see cref="RzPaginationStylesBase"/> class with the specified theme.
        /// </summary>
        /// <param name="theme">The theme to use for styling.</param>
        protected RzPaginationStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the main pagination navigation container (e.g., &lt;nav&gt;, flex properties).</summary>
        public abstract string Container { get; }

        /// <summary>Gets the CSS classes for the unordered list (&lt;ul&gt;) holding the pagination items (e.g., flex, spacing, rounding).</summary>
        public abstract string List { get; }

        /// <summary>Gets the CSS classes for individual page links/buttons (&lt;a&gt; or &lt;button&gt;) in their default state.</summary>
        public abstract string Link { get; }

        /// <summary>Gets the CSS classes for the currently active/selected page link/button.</summary>
        public abstract string LinkCurrent { get; }

        /// <summary>Gets the CSS classes for disabled page links/buttons (e.g., previous on first page, next on last page).</summary>
        public abstract string LinkDisabled { get; }

        /// <summary>Gets the CSS classes for ellipsis items (...) used when some page numbers are skipped.</summary>
        public abstract string Ellipsis { get; }
    }

    #endregion
}