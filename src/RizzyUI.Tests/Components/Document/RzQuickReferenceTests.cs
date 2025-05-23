using Alba;
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Document
{
    public class RzQuickReferenceTests : BunitAlbaContext, IClassFixture<WebAppFixture>
    {
        private readonly IAlbaHost _host;

        public RzQuickReferenceTests(WebAppFixture fixture) : base(fixture)
        {
            _host = fixture.Host;
        }

        [Fact]
        public void RzQuickReferenceContainer_WithHeadings_RegistersHeadings()
        {
            // Arrange
            var headingText1 = "Introduction";
            var headingText2 = "Getting Started";
            var headingText3 = "Advanced Topics";

            // Act - Render a container with headings and quick reference
            var cut = RenderComponent<RzQuickReferenceContainer>(parameters => parameters
                .Add(p => p.MinimumHeadingLevel, HeadingLevel.H2)
                .Add(p => p.MaximumHeadingLevel, HeadingLevel.H4)
                .Add(p => p.ChildContent, builder =>
                {
                    builder.OpenComponent<RzHeading>(0);
                    builder.AddAttribute(1, "Level", HeadingLevel.H2);
                    builder.AddAttribute(2, "ChildContent", (RenderFragment)(h => h.AddContent(3, headingText1)));
                    builder.AddAttribute(4, "QuickReferenceTitle", headingText1);
                    builder.CloseComponent();

                    builder.OpenComponent<RzHeading>(10);
                    builder.AddAttribute(11, "Level", HeadingLevel.H3);
                    builder.AddAttribute(12, "ChildContent", (RenderFragment)(h => h.AddContent(13, headingText2)));
                    builder.AddAttribute(14, "QuickReferenceTitle", headingText2);
                    builder.CloseComponent();

                    builder.OpenComponent<RzHeading>(20);
                    builder.AddAttribute(21, "Level", HeadingLevel.H4);
                    builder.AddAttribute(22, "ChildContent", (RenderFragment)(h => h.AddContent(23, headingText3)));
                    builder.AddAttribute(24, "QuickReferenceTitle", headingText3);
                    builder.CloseComponent();

                    builder.OpenComponent<RzQuickReference>(30);
                    builder.CloseComponent();
                })
            );

            // Assert
            Assert.Contains(headingText1, cut.Markup);
            Assert.Contains(headingText2, cut.Markup);
            Assert.Contains(headingText3, cut.Markup);
            // Check that the nested quick reference component rendered properly too
            var quickRef = cut.FindComponent<RzQuickReference>();
            Assert.NotNull(quickRef);
        }

        [Fact]
        public void RzQuickReference_DisplaysCorrectHeadingLinks()
        {
            // Arrange - Create a container with headings first
            var container = RenderComponent<RzQuickReferenceContainer>(parameters => parameters
                .Add(p => p.MinimumHeadingLevel, HeadingLevel.H2)
                .Add(p => p.MaximumHeadingLevel, HeadingLevel.H4)
                .Add(p => p.ChildContent, builder =>
                {
                    builder.OpenComponent<RzHeading>(0);
                    builder.AddAttribute(1, "Level", HeadingLevel.H2);
                    builder.AddAttribute(2, "Id", "section-1");
                    builder.AddAttribute(3, "ChildContent", (RenderFragment)(h => h.AddContent(4, "First Section")));
                    builder.AddAttribute(5, "QuickReferenceTitle", "First Section");
                    builder.CloseComponent();

                    builder.OpenComponent<RzHeading>(10);
                    builder.AddAttribute(11, "Level", HeadingLevel.H3);
                    builder.AddAttribute(12, "Id", "section-2");
                    builder.AddAttribute(13, "ChildContent", (RenderFragment)(h => h.AddContent(14, "Second Section")));
                    builder.AddAttribute(15, "QuickReferenceTitle", "Second Section");
                    builder.CloseComponent();
                })
            );

            // Act - Now render the quick reference within the same container
            var cut = RenderComponent<RzQuickReference>(parameters => parameters
                .AddCascadingValue(container.Instance)
                .Add(p => p.Title, "Page Contents")
            );

            // Assert
            Assert.Contains("Page Contents", cut.Markup);
            var links = cut.FindAll("a");
            Assert.Equal(2, links.Count);
            Assert.Equal("#section-1", links[0].GetAttribute("href"));
            Assert.Contains("First Section", links[0].TextContent);
            Assert.Equal("#section-2", links[1].GetAttribute("href"));
            Assert.Contains("Second Section", links[1].TextContent);
        }

        [Fact]
        public void RzQuickReference_WithCustomTitle_DisplaysCustomTitle()
        {
            // Arrange & Act
            var customTitle = "In This Article";
            var cut = RenderComponent<RzQuickReference>(parameters => parameters
                // Create a container instance and provide it as a cascading parameter
                .AddCascadingValue(new RzQuickReferenceContainer())
                .Add(p => p.Title, customTitle)
            );

            // Assert
            Assert.Contains(customTitle, cut.Markup);
        }

        [Fact]
        public void RzQuickReference_WithDefaultTitle_UsesLocalizedTitle()
        {
            // Arrange & Act
            var cut = RenderComponent<RzQuickReference>(parameters => parameters
                .AddCascadingValue(new RzQuickReferenceContainer())
            );

            // Assert - Default title from localizer should be present
            var titleElement = cut.Find("p");
            Assert.NotNull(titleElement);
            Assert.False(string.IsNullOrWhiteSpace(titleElement.TextContent));
        }

        [Fact]
        public void RzQuickReference_WithCustomAriaLabel_SetsAriaLabel()
        {
            // Arrange
            var customAriaLabel = "Navigation for article sections";

            // Act
            var cut = RenderComponent<RzQuickReference>(parameters => parameters
                .AddCascadingValue(new RzQuickReferenceContainer())
                .Add(p => p.AriaLabel, customAriaLabel)
            );

            // Assert
            var nav = cut.Find("nav");
            Assert.Equal(customAriaLabel, nav.GetAttribute("aria-label"));
        }

        [Fact]
        public void RzQuickReference_WithoutCascadingContainer_ThrowsException()
        {
            // Arrange & Act & Assert
            var ex = Assert.Throws<InvalidOperationException>(() =>
            {
                RenderComponent<RzQuickReference>();
            });

            Assert.Contains("must be placed within", ex.Message);
        }

        [Theory]
        [InlineData(HeadingLevel.H2, HeadingLevel.H3, "ml-0", "ml-4")]
        [InlineData(HeadingLevel.H3, HeadingLevel.H4, "ml-0", "ml-4")]
        public void RzQuickReference_IndentationClasses_AreAppliedBasedOnLevel(
            HeadingLevel minLevel, HeadingLevel secondLevel, string firstIndent, string secondIndent)
        {
            // Arrange
            var container = RenderComponent<RzQuickReferenceContainer>(parameters => parameters
                .Add(p => p.MinimumHeadingLevel, minLevel)
                .Add(p => p.MaximumHeadingLevel, HeadingLevel.H4)
                .Add(p => p.ChildContent, builder =>
                {
                    builder.OpenComponent<RzHeading>(0);
                    builder.AddAttribute(1, "Level", minLevel);
                    builder.AddAttribute(2, "ChildContent", (RenderFragment)(h => h.AddContent(3, "First Heading")));
                    builder.AddAttribute(4, "QuickReferenceTitle", "First Heading");
                    builder.CloseComponent();

                    builder.OpenComponent<RzHeading>(10);
                    builder.AddAttribute(11, "Level", secondLevel);
                    builder.AddAttribute(12, "ChildContent", (RenderFragment)(h => h.AddContent(13, "Second Heading")));
                    builder.AddAttribute(14, "QuickReferenceTitle", "Second Heading");
                    builder.CloseComponent();
                })
            );

            // Act
            var cut = RenderComponent<RzQuickReference>(parameters => parameters
                .AddCascadingValue(container.Instance)
            );

            // Assert - Check that different heading levels have appropriate indentation classes
            var listItems = cut.FindAll("li");
            Assert.Equal(2, listItems.Count);
            Assert.Contains(firstIndent, listItems[0].GetAttribute("class"));
            Assert.Contains(secondIndent, listItems[1].GetAttribute("class"));
        }

        [Fact]
        public void RzQuickReferenceContainer_HeadingLevelFiltering_WorksCorrectly()
        {
            // Arrange & Act
            var cut = RenderComponent<RzQuickReferenceContainer>(parameters => parameters
                .Add(p => p.MinimumHeadingLevel, HeadingLevel.H2)
                .Add(p => p.MaximumHeadingLevel, HeadingLevel.H3)
                .Add(p => p.ChildContent, builder =>
                {
                    // H1 heading - should be filtered out
                    builder.OpenComponent<RzHeading>(0);
                    builder.AddAttribute(1, "Level", HeadingLevel.H1);
                    builder.AddAttribute(2, "ChildContent", (RenderFragment)(h => h.AddContent(3, "Document Title")));
                    builder.AddAttribute(4, "QuickReferenceTitle", "Document Title");
                    builder.CloseComponent();

                    // H2 heading - should be included
                    builder.OpenComponent<RzHeading>(10);
                    builder.AddAttribute(11, "Level", HeadingLevel.H2);
                    builder.AddAttribute(12, "ChildContent", (RenderFragment)(h => h.AddContent(13, "Section")));
                    builder.AddAttribute(14, "QuickReferenceTitle", "Section");
                    builder.CloseComponent();

                    // H3 heading - should be included
                    builder.OpenComponent<RzHeading>(20);
                    builder.AddAttribute(21, "Level", HeadingLevel.H3);
                    builder.AddAttribute(22, "ChildContent", (RenderFragment)(h => h.AddContent(23, "Subsection")));
                    builder.AddAttribute(24, "QuickReferenceTitle", "Subsection");
                    builder.CloseComponent();

                    // H4 heading - should be filtered out
                    builder.OpenComponent<RzHeading>(30);
                    builder.AddAttribute(31, "Level", HeadingLevel.H4);
                    builder.AddAttribute(32, "ChildContent", (RenderFragment)(h => h.AddContent(33, "Detail")));
                    builder.AddAttribute(34, "QuickReferenceTitle", "Detail");
                    builder.CloseComponent();

                    // The quick reference component
                    builder.OpenComponent<RzQuickReference>(40);
                    builder.CloseComponent();
                })
            );

            // Assert
            var quickRef = cut.FindComponent<RzQuickReference>();
            var links = quickRef.Find("ul").ChildNodes;

            // Should have only 2 links (H2 and H3) as others should be filtered
            Assert.Equal(2, links.Length);
            Assert.Contains("Section", links[0].TextContent);
            Assert.Contains("Subsection", links[1].TextContent);
        }
    }
}
