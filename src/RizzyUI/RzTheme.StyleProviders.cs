namespace RizzyUI;

/// <summary>
/// Tailwind classname providers for all components
/// </summary>
public partial class RzTheme
{
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

    /// <summary>
    /// Gets or sets the style definitions for the <see cref="RzBrowser" /> component.
    /// </summary>
    public virtual RzStylesBase.RzBrowserStylesBase RzBrowser { get; }

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
    
    /// <summary> Gets or sets the style definitions for the <see cref="RzModal"/> component. </summary>
    public virtual RzStylesBase.RzModalStylesBase RzModal { get; }    

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

    /// <summary> Gets or sets the style definitions for the <see cref="RzSpinner" /> component. </summary>
    public virtual RzStylesBase.RzSpinnerStylesBase RzSpinner { get; }
    
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
}