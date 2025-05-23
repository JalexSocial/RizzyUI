using Alba;
using Bunit;
using Markdig;

namespace RizzyUI.Tests.Components.Document
{
    public class RzMarkdownTests : BunitAlbaContext, IClassFixture<WebAppFixture>
    {
        private readonly IAlbaHost _host;

        public RzMarkdownTests(WebAppFixture fixture) : base(fixture)
        {
            _host = fixture.Host;
        }

        [Fact]
        public void Renders_Markdown_From_Content_Parameter()
        {
            // Arrange
            var markdownContent = "# Heading 1\n\nThis is a paragraph.";

            // Act
            var cut = RenderComponent<RzMarkdown>(parameters => parameters
                .Add(p => p.Content, markdownContent)
            );

            // Assert
            var heading = cut.Find("h1");
            Assert.Equal("Heading 1", heading.TextContent);
            Assert.Contains("<p>This is a paragraph.</p>", cut.Markup);
        }

        [Fact]
        public void Renders_Markdown_From_ChildContent()
        {
            // Arrange & Act
            var cut = RenderComponent<RzMarkdown>(parameters => parameters
                .AddChildContent("## Heading 2\n\n- List item 1\n- List item 2")
            );

            // Assert
            var heading = cut.Find("h2");
            Assert.Equal("Heading 2", heading.TextContent);
            var listItems = cut.FindAll("li");
            Assert.Equal(2, listItems.Count);
            Assert.Equal("List item 1", listItems[0].TextContent);
            Assert.Equal("List item 2", listItems[1].TextContent);
        }

        [Fact]
        public void Content_Parameter_Takes_Precedence_Over_ChildContent()
        {
            // Arrange & Act
            var cut = RenderComponent<RzMarkdown>(parameters => parameters
                .Add(p => p.Content, "# Content Parameter")
                .AddChildContent("# Child Content")
            );

            // Assert
            var heading = cut.Find("h1");
            Assert.Equal("Content Parameter", heading.TextContent);
            Assert.DoesNotContain("Child Content", cut.Markup);
        }

        [Theory]
        [InlineData(ProseWidth.Compact, "prose-compact")]
        [InlineData(ProseWidth.Comfortable, "prose-comfortable")]
        [InlineData(ProseWidth.Relaxed, "prose-relaxed")]
        [InlineData(ProseWidth.Wide, "prose-wide")]
        [InlineData(ProseWidth.UltraWide, "prose-ultrawide")]
        [InlineData(ProseWidth.Full, "prose-full")]
        public void Applies_ProseWidth_Class(ProseWidth width, string expectedClass)
        {
            // Arrange & Act
            var cut = RenderComponent<RzMarkdown>(parameters => parameters
                .Add(p => p.Content, "Some content")
                .Add(p => p.ProseWidth, width)
            );

            // Assert
            Assert.Contains(expectedClass, cut.Markup);
        }

        [Fact]
        public void Renders_Code_Blocks_With_Syntax_Highlighting()
        {
            // Arrange
            var markdownWithCode = "```csharp\nvar x = 10;\n```";

            // Act
            var cut = RenderComponent<RzMarkdown>(parameters => parameters
                .Add(p => p.Content, markdownWithCode)
            );

            // Assert
            var codeBlock = cut.Find("code");
            Assert.Contains("language-csharp", codeBlock.GetAttribute("class"));
            Assert.Contains("hljs", codeBlock.GetAttribute("class"));
            Assert.Contains("var x = 10;", cut.Markup);
        }

        [Fact]
        public void Uses_Custom_Pipeline_When_Provided()
        {
            // Arrange
            var customPipeline = new MarkdownPipelineBuilder()
                .UseAdvancedExtensions()
                .Build();

            var markdownWithAbbr = "This is HTML.";

            // Act
            var cut = RenderComponent<RzMarkdown>(parameters => parameters
                .Add(p => p.Content, markdownWithAbbr)
                .Add(p => p.Pipeline, customPipeline)
            );

            // Assert
            Assert.Contains("<p>This is HTML.</p>", cut.Markup);
        }
    }
}
