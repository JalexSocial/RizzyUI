#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
///     Represents the comprehensive theme data for the RizzyUI application.
///     It holds semantic colors (light/dark variants), status colors, border settings,
///     and references to style definitions for all individual RizzyUI components.
///     This class allows for theme customization and provides styling context to components.
/// </summary>
public class RzTheme
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="RzTheme" /> class, setting the name, code,
    ///     and instantiating all default component style definitions.
    /// </summary>
    /// <param name="name">The full, human-readable name of the theme.</param>
    /// <param name="themeCode">The short, lowercase code name for the theme.</param>
    public RzTheme(string name, string themeCode)
    {
        Name = name;
        ThemeCode = themeCode;

        // Instantiate default styles for all components
        RzAccordion = new DefaultRzAccordionStyles(this);
        RzAccordionSection = new DefaultRzAccordionSectionStyles(this);
        RzAlert = new DefaultRzAlertStyles(this);
        RzAlertTitle = new DefaultRzAlertTitleStyles(this);
        RzAlertDescription = new DefaultRzAlertDescriptionStyles(this);
        RzArticle = new DefaultRzArticleStyles(this);
        RzAvatar = new DefaultRzAvatarStyles(this);
        RzBadge = new DefaultRzBadgeStyles(this);
        RzBreadcrumb = new DefaultRzBreadcrumbStyles(this);
        RzBreadcrumbItem = new DefaultRzBreadcrumbItemStyles(this);
        RzButton = new DefaultRzButtonStyles(this);
        RzButtonGroup = new DefaultRzButtonGroupStyles(this);
        RzCard = new DefaultRzCardStyles(this);
        RzCardBody = new DefaultRzCardBodyStyles(this);
        RzCardButtons = new DefaultRzCardButtonsStyles(this);
        RzCardFooter = new DefaultRzCardFooterStyles(this);
        RzCardHeader = new DefaultRzCardHeaderStyles(this);
        RzCardSubtitle = new DefaultRzCardSubtitleStyles(this);
        RzCardTitle = new DefaultRzCardTitleStyles(this);
        RzCheckboxGroup = new DefaultRzCheckboxGroupStyles(this);
        RzCheckboxGroupField = new DefaultRzCheckboxGroupFieldStyles(this);
        RzCheckboxGroupItem = new DefaultRzCheckboxGroupItemStyles(this);
        RzCodeViewer = new DefaultRzCodeViewerStyles(this);
        RzDarkmodeToggle = new DefaultRzDarkmodeToggleStyles(this);
        RzDateEdit = new DefaultRzDateEditStyles(this);
        RzDivider = new DefaultRzDividerStyles(this);
        RzDropdown = new DefaultRzDropdownStyles(this);
        RzDropdownMenuItem = new DefaultRzDropdownMenuItemStyles(this);
        RzDropdownSection = new DefaultRzDropdownSectionStyles(this);
        RzEmbeddedPreview = new DefaultRzEmbeddedPreviewStyles(this);
        RzField = new DefaultRzFieldStyles(this);
        RzFieldHelp = new DefaultRzFieldHelpStyles(this);
        RzFieldLabel = new DefaultRzFieldLabelStyles(this);
        RzFormSection = new DefaultRzFormSectionStyles(this);
        RzHeading = new DefaultRzHeadingStyles(this);
        RzLink = new DefaultRzLinkStyles(this);
        RzMarkdown = new DefaultRzMarkdownStyles(this);
        RzNavbar = new DefaultRzNavbarStyles(this);
        RzNumberEdit = new DefaultRzNumberEditStyles(this);
        RzNumberField = new DefaultRzNumberFieldStyles(this);
        RzParagraph = new DefaultRzParagraphStyles(this);
        RzProgress = new DefaultRzProgressStyles(this);
        RzQuickReferenceContainer = new DefaultRzQuickReferenceContainerStyles(this);
        RzQuickReference = new DefaultRzQuickReferenceStyles(this);
        RzRadioGroup = new DefaultRzRadioGroupStyles(this);
        RzRadioGroupField = new DefaultRzRadioGroupFieldStyles(this);
        RzRadioGroupItem = new DefaultRzRadioGroupItemStyles(this);
        RzSearchButton = new DefaultRzSearchButtonStyles(this);
        RzSidebar = new DefaultRzSidebarStyles(this);
        RzSidebarLinkItem = new DefaultRzSidebarLinkItemStyles(this);
        RzSidebarLinks = new DefaultRzSidebarLinksStyles(this);
        RzSteps = new DefaultRzStepsStyles(this);
        RzTabs = new DefaultRzTabsStyles(this);
        RzTab = new DefaultRzTabStyles(this);
        RzTabPanel = new DefaultRzTabPanelStyles(this);
        RzTabStrip = new DefaultRzTabStripStyles(this);
        RzTextEdit = new DefaultRzTextEditStyles(this);
        RzTextField = new DefaultRzTextFieldStyles(this);
        RzToggle = new DefaultRzToggleStyles(this);
        RzToggleField = new DefaultRzToggleFieldStyles(this);
        RzTypography = new DefaultRzTypographyStyles(this);
    }

    /// <summary>
    ///     Gets the full, human-readable name of the theme (e.g., "Arctic", "High Contrast").
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    ///     Gets the short code name of the theme (lowercase, no spaces, e.g., "arctic", "highcontrast").
    ///     Used internally, such as for generating theme-specific CSS token names.
    /// </summary>
    public string ThemeCode { get; init; }

    /// <summary>
    ///     Gets or sets the color scheme definitions for the light mode variant of the theme.
    /// </summary>
    public RzThemeVariant Light { get; set; } = new();

    /// <summary>
    ///     Gets or sets the color scheme definitions for the dark mode variant of the theme.
    /// </summary>
    public RzThemeVariant Dark { get; set; } = new();

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate dangerous states or error conditions.
    /// </summary>
    public Color Danger { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Danger" /> background.
    /// </summary>
    public Color OnDanger { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for informational messages or states.
    /// </summary>
    public Color Info { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on an <see cref="Info" /> background.
    /// </summary>
    public Color OnInfo { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate warning or cautionary states.
    /// </summary>
    public Color Warning { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Warning" /> background.
    /// </summary>
    public Color OnWarning { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate success or positive states.
    /// </summary>
    public Color Success { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Success" /> background.
    /// </summary>
    public Color OnSuccess { get; init; }

    /// <summary>
    ///     Gets the default border width value used across components (e.g., "1px").
    /// </summary>
    public string BorderWidth { get; init; }

    /// <summary>
    ///     Gets the default border radius value used across components (e.g., "6px", "0.5rem").
    /// </summary>
    public string BorderRadius { get; init; }

    // --- Component Style Properties ---

    /// <summary> Gets or sets the style definitions for the <see cref="RzAccordion" /> component. </summary>
    public virtual RzStylesBase.RzAccordionStylesBase RzAccordion { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzAccordionSection" /> component. </summary>
    public virtual RzStylesBase.RzAccordionSectionStylesBase RzAccordionSection { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzAlert" /> component. </summary>
    public virtual RzStylesBase.RzAlertStylesBase RzAlert { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzAlertTitle" /> component. </summary>
    public virtual RzStylesBase.RzAlertTitleStylesBase RzAlertTitle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzAlertDescription" /> component. </summary>
    public virtual RzStylesBase.RzAlertDescriptionStylesBase RzAlertDescription { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzArticle" /> component. </summary>
    public virtual RzStylesBase.RzArticleStylesBase RzArticle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzAvatar" /> component. </summary>
    public virtual RzStylesBase.RzAvatarStylesBase RzAvatar { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzBadge" /> component. </summary>
    public virtual RzStylesBase.RzBadgeStylesBase RzBadge { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzBreadcrumb" /> component. </summary>
    public virtual RzStylesBase.RzBreadcrumbStylesBase RzBreadcrumb { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzBreadcrumbItem" /> component. </summary>
    public virtual RzStylesBase.RzBreadcrumbItemStylesBase RzBreadcrumbItem { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzButton" /> component. </summary>
    public virtual RzStylesBase.RzButtonStylesBase RzButton { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzButtonGroup" /> component. </summary>
    public virtual RzStylesBase.RzButtonGroupStylesBase RzButtonGroup { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCard" /> component. </summary>
    public virtual RzStylesBase.RzCardStylesBase RzCard { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCardBody" /> component. </summary>
    public virtual RzStylesBase.RzCardBodyStylesBase RzCardBody { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCardButtons" /> component. </summary>
    public virtual RzStylesBase.RzCardButtonsStylesBase RzCardButtons { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCardFooter" /> component. </summary>
    public virtual RzStylesBase.RzCardFooterStylesBase RzCardFooter { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCardHeader" /> component. </summary>
    public virtual RzStylesBase.RzCardHeaderStylesBase RzCardHeader { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCardSubtitle" /> component. </summary>
    public virtual RzStylesBase.RzCardSubtitleStylesBase RzCardSubtitle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCardTitle" /> component. </summary>
    public virtual RzStylesBase.RzCardTitleStylesBase RzCardTitle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCheckboxGroup{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzCheckboxGroupStylesBase RzCheckboxGroup { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCheckboxGroupField{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzCheckboxGroupFieldStylesBase RzCheckboxGroupField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCheckboxGroupItem{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzCheckboxGroupItemStylesBase RzCheckboxGroupItem { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCodeViewer" /> component. </summary>
    public virtual RzStylesBase.RzCodeViewerStylesBase RzCodeViewer { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzDarkmodeToggle" /> component. </summary>
    public virtual RzStylesBase.RzDarkmodeToggleStylesBase RzDarkmodeToggle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzDateEdit" /> component. </summary>
    public virtual RzStylesBase.RzDateEditStylesBase RzDateEdit { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzDivider" /> component. </summary>
    public virtual RzStylesBase.RzDividerStylesBase RzDivider { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzDropdown" /> component. </summary>
    public virtual RzStylesBase.RzDropdownStylesBase RzDropdown { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzDropdownMenuItem" /> component. </summary>
    public virtual RzStylesBase.RzDropdownMenuItemStylesBase RzDropdownMenuItem { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzDropdownSection" /> component. </summary>
    public virtual RzStylesBase.RzDropdownSectionStylesBase RzDropdownSection { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzEmbeddedPreview" /> component. </summary>
    public virtual RzStylesBase.RzEmbeddedPreviewStylesBase RzEmbeddedPreview { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzField" /> component. </summary>
    public virtual RzStylesBase.RzFieldStylesBase RzField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzFieldHelp" /> component. </summary>
    public virtual RzStylesBase.RzFieldHelpStylesBase RzFieldHelp { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzFieldLabel{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzFieldLabelStylesBase RzFieldLabel { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzFormSection" /> component. </summary>
    public virtual RzStylesBase.RzFormSectionStylesBase RzFormSection { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzHeading" /> component. </summary>
    public virtual RzStylesBase.RzHeadingStylesBase RzHeading { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzLink" /> component. </summary>
    public virtual RzStylesBase.RzLinkStylesBase RzLink { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzMarkdown" /> component. </summary>
    public virtual RzStylesBase.RzMarkdownStylesBase RzMarkdown { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzNavbar" /> component. </summary>
    public virtual RzStylesBase.RzNavbarStylesBase RzNavbar { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzNumberEdit{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzNumberEditStylesBase RzNumberEdit { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzNumberField{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzNumberFieldStylesBase RzNumberField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzParagraph" /> component. </summary>
    public virtual RzStylesBase.RzParagraphStylesBase RzParagraph { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzProgress" /> component. </summary>
    public virtual RzStylesBase.RzProgressStylesBase RzProgress { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzQuickReferenceContainer" /> component. </summary>
    public virtual RzStylesBase.RzQuickReferenceContainerStylesBase RzQuickReferenceContainer { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzQuickReference" /> component. </summary>
    public virtual RzStylesBase.RzQuickReferenceStylesBase RzQuickReference { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzRadioGroup{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzRadioGroupStylesBase RzRadioGroup { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzRadioGroupField{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzRadioGroupFieldStylesBase RzRadioGroupField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzRadioGroupItem{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzRadioGroupItemStylesBase RzRadioGroupItem { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSearchButton" /> component. </summary>
    public virtual RzStylesBase.RzSearchButtonStylesBase RzSearchButton { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSidebar" /> component. </summary>
    public virtual RzStylesBase.RzSidebarStylesBase RzSidebar { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSidebarLinkItem" /> component. </summary>
    public virtual RzStylesBase.RzSidebarLinkItemStylesBase RzSidebarLinkItem { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSidebarLinks" /> component. </summary>
    public virtual RzStylesBase.RzSidebarLinksStylesBase RzSidebarLinks { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSteps" /> component. </summary>
    public virtual RzStylesBase.RzStepsStylesBase RzSteps { get; }

    // RzStep has no styles
    /// <summary> Gets or sets the style definitions for the <see cref="RzTabs" /> component. </summary>
    public virtual RzStylesBase.RzTabsStylesBase RzTabs { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTab" /> component. </summary>
    public virtual RzStylesBase.RzTabStylesBase RzTab { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTabPanel" /> component. </summary>
    public virtual RzStylesBase.RzTabPanelStylesBase RzTabPanel { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTabStrip" /> component. </summary>
    public virtual RzStylesBase.RzTabStripStylesBase RzTabStrip { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTextEdit" /> component. </summary>
    public virtual RzStylesBase.RzTextEditStylesBase RzTextEdit { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTextField" /> component. </summary>
    public virtual RzStylesBase.RzTextFieldStylesBase RzTextField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzToggle" /> component. </summary>
    public virtual RzStylesBase.RzToggleStylesBase RzToggle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzToggleField" /> component. </summary>
    public virtual RzStylesBase.RzToggleFieldStylesBase RzToggleField { get; }

    /// <summary> Gets or sets the style definitions for base typography used by multiple components. </summary>
    public virtual RzStylesBase.RzTypographyStylesBase RzTypography { get; }

    /// <summary>
    ///     Gets the default Arctic theme instance.
    /// </summary>
    public static RzTheme Default => ArcticTheme;

    /// <summary>
    ///     Gets a new instance of the Arctic theme.
    /// </summary>
    public static RzTheme ArcticTheme => new ArcticTheme();

    /// <summary>
    ///     Gets a new instance of the High Contrast theme.
    /// </summary>
    public static RzTheme HighContrastTheme => new HighContrastTheme();

    /// <summary>
    ///     Gets a new instance of the Modern theme.
    /// </summary>
    public static RzTheme ModernTheme => new ModernTheme();

    /// <summary>
    ///     Gets a new instance of the News theme.
    /// </summary>
    public static RzTheme NewsTheme => new NewsTheme();
}

#pragma warning restore CS8618