﻿using System.Web;
using Rizzy.Utility;
using RizzyUI.Extensions;
using Microsoft.AspNetCore.Components;
using Markdig;
using Pek.Markdig.HighlightJs;
using System.Text.Json;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using System.Text;
using Markdig.Renderers.Html;

namespace RizzyUI;

/// <xmldoc>
/// A Markdown component that converts the provided RenderFragment markdown content into HTML.
/// The markdown content is passed as child content and converted to HTML using Markdig.
/// </xmldoc>
public partial class Markdown : RizzyComponent
{
    private string _assets = string.Empty;
    private static readonly string BaseStyle = "prose lg:prose-xl dark:prose-invert text-on-surface dark:text-on-surface-dark";

    /// <summary>
    /// Pipeline to use with Markdown components
    /// </summary>
    public static MarkdownPipeline? Pipeline { get; set; }

    /// <summary>
    /// Reference to the QuickReferenceContainer.
    /// </summary>
    [CascadingParameter]
    private QuickReferenceContainer? QuickReferenceContainer { get; set; }

    /// <xmldoc>
    /// Gets or sets the html-encoded markdown content provided as child content.
    /// </xmldoc>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <xmldoc>
    /// Gets or sets the markdown content provided as child content. If provided
    /// the Markdown component will render this string only.
    /// </xmldoc>
    [Parameter] 
    public string? Content { get; set; } = string.Empty;

    /// <summary>
    /// Default assets loaded for Markdown
    /// </summary>
    public static string[] DefaultAssets =
    [
        Constants.ContentUrl("js/vendor/highlightjs/highlight.js"),
        Constants.ContentUrl("js/vendor/highlightjs-plugin/cshtml-razor.min.js"),
        Constants.ContentUrl("js/vendor/highlightjs/styles/stackoverflow-dark.css")
    ];

    /// <summary>
    /// (optional) Javascript and CSS assets that are loaded when component is instantiated.  Assets are requested
    /// in parallel but loaded sequentially
    /// </summary>
    [Parameter] 
    public string[] ComponentAssets { get; set; } = DefaultAssets;

    /// <xmldoc>
    /// Gets the HTML markup generated by converting the markdown content.
    /// </xmldoc>
    private MarkupString? OutputHtml { get; set; }

    /// <xmldoc>
    /// Computes the final CSS class string for the root element by merging AdditionalAttributes with the base style.
    /// </xmldoc>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, BaseStyle);

    protected override void OnInitialized()
    {
        base.OnInitialized();

        Pipeline ??= new MarkdownPipelineBuilder()
            .UseAdvancedExtensions()
            .UseRizzySyntaxHighlighting()
            .Build();
    }

    /// <xmldoc>
    /// Called when component parameters have been set. Converts the markdown content (via AsMarkupString())
    /// into HTML using Markdig and stores it in OutputHtml.
    /// </xmldoc>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        string markdownText;

        if (OutputHtml is null)
        {
            if (!string.IsNullOrEmpty(Content))
            {
                markdownText = Content;
            }
            else
            {
                markdownText = ChildContent?.AsMarkupString().Outdent() ?? string.Empty;
                markdownText = HttpUtility.HtmlDecode(markdownText);
            }

            // Convert the markdown to HTML using Markdig.
            var html = RenderOutput(markdownText);

            // Wrap the HTML string in a MarkupString so it renders as HTML.
            OutputHtml ??= new MarkupString(html);
        }

        _assets = JsonSerializer.Serialize(ComponentAssets);
        Nonce = RizzyNonceProvider.GetNonceValues();
    }

    private string RenderOutput(string markdownText)
    {
        var document = Markdig.Markdown.Parse(markdownText, Pipeline);

        // Iterate through heading blocks and register them.
        if (QuickReferenceContainer != null)
        {
            foreach (var block in document)
            {
                if (block is HeadingBlock heading)
                {
                    // Heading level (1 for h1, 2 for h2, etc.)
                    int level = heading.Level;

                    // Extract plain text from the heading's inline content.
                    string headingText = ExtractPlainText(heading.Inline);
                    
                    // Retrieve the auto-generated id from the heading attributes.
                    var attributes = heading.GetAttributes();
                    
                    attributes.Id ??= IdGenerator.UniqueId("heading");
                    attributes.AddProperty("x-data", "rzHeading");

                    // Convert the numeric level into our HeadingLevel enum.
                    HeadingLevel headingLevel = level switch
                    {
                        1 => HeadingLevel.H1,
                        2 => HeadingLevel.H2,
                        3 => HeadingLevel.H3,
                        _ => HeadingLevel.H4,
                    };

                    QuickReferenceContainer.RegisterHeading(headingLevel, headingText, attributes.Id);
                }
            }
        }

        return document.ToHtml(Pipeline);
    }

    /// <summary>
    /// Recursively extracts plain text from inline elements.
    /// </summary>
    /// <param name="inline">The inline container to process.</param>
    /// <returns>A plain-text representation of the inline content.</returns>
    private string ExtractPlainText(ContainerInline? inline)
    {
        if (inline == null)
            return string.Empty;

        var sb = new StringBuilder();
        foreach (var child in inline)
        {
            if (child is LiteralInline literal)
            {
                sb.Append(literal.Content.Text.Substring(literal.Content.Start, literal.Content.Length));
            }
            else if (child is ContainerInline container)
            {
                sb.Append(ExtractPlainText(container));
            }
        }
        return sb.ToString().Trim();
    }
}