
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
        protected readonly RzTheme Theme;

        protected RzTableStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the outermost wrapper div of the RzTable (e.g., overflow, rounding, border).</summary>
        public abstract string Container { get; }

        /// <summary>Gets the CSS classes for the <table> element (e.g., width, text alignment, base text styles).</summary>
        public abstract string Table { get; }

        /// <summary>Gets the CSS classes for the <thead> element (e.g., border, background, text styles for headers).</summary>
        public abstract string Thead { get; }

        /// <summary>Gets the CSS classes for the <tfoot> element (e.g., border, background, text styles for footers).</summary>
        public abstract string Tfoot { get; }
    }

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzTableHeaderCell{TItem}"/> component.
    /// </summary>
    public abstract class RzTableHeaderCellStylesBase
    {
        protected readonly RzTheme Theme;

        protected RzTableHeaderCellStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the base <th> element.</summary>
        public abstract string HeaderCellBase { get; }
        
        /// <summary>Gets the CSS classes for the button element inside a sortable header cell.</summary>
        public abstract string SortableButton { get; }

        /// <summary>Gets the CSS classes applied to a header cell when it is sortable (e.g., cursor, hover effects).</summary>
        public abstract string SortableHeaderCell { get; }
        
        /// <summary>Gets the CSS classes for the span containing the title text within the header cell.</summary>
        public abstract string TitleSpan { get; }
        
        /// <summary>Gets the CSS classes for a bordered <th> element.</summary>
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
    /// Defines the abstract structure for styling the <see cref="RzTableBody{TItem}"/> component.
    /// </summary>
    public abstract class RzTableBodyStylesBase
    {
        protected readonly RzTheme Theme;

        protected RzTableBodyStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the <tbody> element (e.g., row dividers, relative positioning for indicators).</summary>
        public abstract string TableBody { get; }

        /// <summary>Gets the CSS classes for the default cell (<td>) used when displaying the empty row message (e.g., padding, text alignment, color).</summary>
        public abstract string EmptyRowCell { get; }
    }
    
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzTableCell{TItem}"/> component.
    /// </summary>
    public abstract class RzTableCellStylesBase
    {
        protected readonly RzTheme Theme;

        protected RzTableCellStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the base <td> element (e.g., padding).</summary>
        public abstract string TableCellBase { get; }
        
        /// <summary>Gets the CSS classes for a bordered <td> element.</summary>
        public abstract string TableCellBordered { get; }
    }

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzPagination{TItem}"/> component.
    /// </summary>
    public abstract class RzPaginationStylesBase
    {
        protected readonly RzTheme Theme;

        protected RzPaginationStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the CSS classes for the main pagination navigation container (e.g., <nav>, flex properties).</summary>
        public abstract string Container { get; }

        /// <summary>Gets the CSS classes for the unordered list (<ul>) holding the pagination items (e.g., flex, spacing, rounding).</summary>
        public abstract string List { get; }

        /// <summary>Gets the CSS classes for individual page links/buttons (<a> or <button>) in their default state.</summary>
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