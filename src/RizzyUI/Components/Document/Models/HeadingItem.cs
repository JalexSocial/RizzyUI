using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

/// <summary>
/// Represents a heading item with level and title.
/// </summary>
public class HeadingItem
{
    /// <summary>
    /// The heading level.
    /// </summary>
    public HeadingLevel Level { get; }

    /// <summary>
    /// The title of the heading.
    /// </summary>
    public string Title { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="HeadingItem"/> class.
    /// </summary>
    /// <param name="level">The heading level.</param>
    /// <param name="title">The title of the heading.</param>
    public HeadingItem(HeadingLevel level, string title)
    {
        Level = level;
        Title = title;
    }
}
