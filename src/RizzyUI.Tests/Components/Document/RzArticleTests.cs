using Alba;
using Bunit;

namespace RizzyUI.Tests.Components.Document
{
    public class RzArticleTests : BunitAlbaContext, IClassFixture<WebAppFixture>
    {
        private readonly IAlbaHost _host;

        public RzArticleTests(WebAppFixture fixture) : base(fixture)
        {
            _host = fixture.Host;
        }

        [Fact]
        public void Renders_SideContent_When_Provided()
        {
            // Arrange
            var mainContent = "<p>Main</p>";
            var sideContent = "<span>Side</span>";

            // Act
            var cut = RenderComponent<RzArticle>(parameters => parameters
                .Add(p => p.MainContent, builder => builder.AddMarkupContent(0, mainContent))
                .Add(p => p.SideContent, builder => builder.AddMarkupContent(0, sideContent))
            );

            // Assert
            Assert.Contains("<aside", cut.Markup, System.StringComparison.OrdinalIgnoreCase);
            Assert.Contains("Side", cut.Markup);
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
            // Arrange
            var mainContent = "<p>Content</p>";

            // Act
            var cut = RenderComponent<RzArticle>(parameters => parameters
                .Add(p => p.MainContent, builder => builder.AddMarkupContent(0, mainContent))
                .Add(p => p.ProseWidth, width)
            );

            // Assert
            Assert.Contains(expectedClass, cut.Markup);
        }

        [Theory]
        [InlineData(Size.ExtraSmall, "xl:pr-48")]
        [InlineData(Size.Small, "xl:pr-56")]
        [InlineData(Size.Medium, "xl:pr-64")]
        [InlineData(Size.Large, "xl:pr-72")]
        [InlineData(Size.ExtraLarge, "xl:pr-80")]
        public void Applies_ColumnWidth_Padding(Size columnWidth, string expectedPadding)
        {
            // Arrange
            var mainContent = "<p>Content</p>";

            // Act
            var cut = RenderComponent<RzArticle>(parameters => parameters
                .Add(p => p.MainContent, builder => builder.AddMarkupContent(0, mainContent))
                .Add(p => p.ColumnWidth, columnWidth)
            );

            // Assert
            Assert.Contains(expectedPadding, cut.Markup);
        }

        [Fact]
        public void Aside_AriaLabel_Defaults_If_Not_Provided()
        {
            // Arrange
            var mainContent = "<p>Main</p>";
            var sideContent = "<span>Side</span>";

            // Act
            var cut = RenderComponent<RzArticle>(parameters => parameters
                .Add(p => p.MainContent, builder => builder.AddMarkupContent(0, mainContent))
                .Add(p => p.SideContent, builder => builder.AddMarkupContent(0, sideContent))
            );

            // Assert
            var aside = cut.Find("aside");
            Assert.False(string.IsNullOrWhiteSpace(aside.GetAttribute("aria-label")));
        }

        [Fact]
        public void Aside_AriaLabel_Uses_Provided_Value()
        {
            // Arrange
            var mainContent = "<p>Main</p>";
            var sideContent = "<span>Side</span>";
            var ariaLabel = "Custom Aside Label";

            // Act
            var cut = RenderComponent<RzArticle>(parameters => parameters
                .Add(p => p.MainContent, builder => builder.AddMarkupContent(0, mainContent))
                .Add(p => p.SideContent, builder => builder.AddMarkupContent(0, sideContent))
                .Add(p => p.AsideAriaLabel, ariaLabel)
            );

            // Assert
            var aside = cut.Find("aside");
            Assert.Equal(ariaLabel, aside.GetAttribute("aria-label"));
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void Aside_Fixed_Class_Applied_When_IsSideFixed(bool isFixed)
        {
            // Arrange
            var mainContent = "<p>Main</p>";
            var sideContent = "<span>Side</span>";

            // Act
            var cut = RenderComponent<RzArticle>(parameters => parameters
                .Add(p => p.MainContent, builder => builder.AddMarkupContent(0, mainContent))
                .Add(p => p.SideContent, builder => builder.AddMarkupContent(0, sideContent))
                .Add(p => p.IsSideFixed, isFixed)
            );

            // Assert
            var aside = cut.Find("aside");
            if (isFixed)
                Assert.Contains("fixed", aside.GetAttribute("class"));
            else
                Assert.DoesNotContain("fixed", aside.GetAttribute("class"));
        }
    }
}

