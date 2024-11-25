using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

/// <summary>
/// Represents the heading level, corresponding to HTML heading tags.
/// </summary>
public enum HeadingLevel
{
    /// <summary>
    /// Heading level 1 (&lt;h1&gt;), typically the largest heading.
    /// </summary>
    H1,

    /// <summary>
    /// Heading level 2 (&lt;h2&gt;), typically used for main sections.
    /// </summary>
    H2,

    /// <summary>
    /// Heading level 3 (&lt;h3&gt;), typically used for subsections.
    /// </summary>
    H3,

    /// <summary>
    /// Heading level 4 (&lt;h4&gt;), typically used for smaller subsections.
    /// </summary>
    H4
}


/// <summary>
/// Represents the font weight.
/// </summary>
public enum TextWeight
{
    /// <summary>
    /// Thin font weight (font-weight: 100).
    /// </summary>
    Thin,

    /// <summary>
    /// Normal font weight (font-weight: 400).
    /// </summary>
    Normal,

    /// <summary>
    /// Bold font weight (font-weight: 700).
    /// </summary>
    Bold,

    /// <summary>
    /// Extra bold font weight (font-weight: 800).
    /// </summary>
    ExtraBold
}


/// <summary>
/// Represents the font size.
/// </summary>
public enum TextSize
{
    /// <summary>
    /// Small text size (font-size: 0.875rem; 14px).
    /// </summary>
    Small,

    /// <summary>
    /// Medium text size (font-size: 1rem; 16px).
    /// </summary>
    Medium,

    /// <summary>
    /// Large text size (font-size: 1.125rem; 18px).
    /// </summary>
    Large,

    /// <summary>
    /// Extra large text size (font-size: 1.25rem; 20px).
    /// </summary>
    ExtraLarge,

    /// <summary>
    /// 2XL text size (font-size: 1.5rem; 24px).
    /// </summary>
    TwoXL,

    /// <summary>
    /// 3XL text size (font-size: 1.875rem; 30px).
    /// </summary>
    ThreeXL,

    /// <summary>
    /// 4XL text size (font-size: 2.25rem; 36px).
    /// </summary>
    FourXL,

    /// <summary>
    /// 5XL text size (font-size: 3rem; 48px).
    /// </summary>
    FiveXL
}


/// <summary>
/// Represents text decoration styles.
/// </summary>
public enum TextDecoration
{
    /// <summary>
    /// No text decoration (text-decoration: none).
    /// </summary>
    None,

    /// <summary>
    /// Underlined text (text-decoration: underline).
    /// </summary>
    Underline,

    /// <summary>
    /// Overlined text (text-decoration: overline).
    /// </summary>
    Overline,

    /// <summary>
    /// Line-through text (text-decoration: line-through).
    /// </summary>
    LineThrough
}

/// <summary>
/// Represents text transformation styles.
/// </summary>
public enum TextTransform
{
    /// <summary>
    /// Normal text (text-transform: none).
    /// </summary>
    None,

    /// <summary>
    /// Uppercase text (text-transform: uppercase).
    /// </summary>
    Uppercase,

    /// <summary>
    /// Lowercase text (text-transform: lowercase).
    /// </summary>
    Lowercase,

    /// <summary>
    /// Capitalized text (text-transform: capitalize).
    /// </summary>
    Capitalize
}

/// <summary>
/// Represents the line height.
/// </summary>
public enum Leading
{
    /// <summary>
    /// None line height (line-height: 1).
    /// </summary>
    None,

    /// <summary>
    /// Tight line height (line-height: 1.25).
    /// </summary>
    Tight,

    /// <summary>
    /// Snug line height (line-height: 1.375).
    /// </summary>
    Snug,

    /// <summary>
    /// Normal line height (line-height: 1.5).
    /// </summary>
    Normal,

    /// <summary>
    /// Relaxed line height (line-height: 1.625).
    /// </summary>
    Relaxed,

    /// <summary>
    /// Loose line height (line-height: 2).
    /// </summary>
    Loose
}
