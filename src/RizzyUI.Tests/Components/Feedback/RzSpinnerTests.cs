using Bunit;

namespace RizzyUI.Tests.Components.Feedback
{
    public class RzSpinnerTests : TestContext
    {
        public RzSpinnerTests()
        {
            // Register RizzyUI services
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzSpinner_DefaultRender_ShowsCorrectStructure()
        {
            // Arrange
            var expectedId = "default-spinner";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
            );

            // Assert
            var container = cut.Find($"div#{expectedId}");
            Assert.NotNull(container);
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Contains("role=\"status\"", cut.Markup);
            Assert.Contains("viewBox=\"0 0 24 24\"", cut.Markup);
            Assert.Contains("motion-safe:animate-spin", svg.OuterHtml);
        }

        [Fact]
        public void RzSpinner_DefaultSize_AppliesMediumSizeClass()
        {
            // Arrange
            var expectedId = "medium-spinner";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
            );

            // Assert
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Contains("size-6", svg.ClassList); // Medium is size-6
        }

        [Theory]
        [InlineData(Size.ExtraSmall, "size-4")]
        [InlineData(Size.Small, "size-5")]
        [InlineData(Size.Medium, "size-6")]
        [InlineData(Size.Large, "size-7")]
        [InlineData(Size.ExtraLarge, "size-8")]
        public void RzSpinner_WithDifferentSizes_AppliesCorrectSizeClasses(Size size, string expectedClass)
        {
            // Arrange
            var expectedId = $"{size.ToString().ToLower()}-spinner";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Size, size)
            );

            // Assert
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Contains(expectedClass, svg.ClassList);
        }

        [Fact]
        public void RzSpinner_DefaultColor_UsesOnSurfaceFill()
        {
            // Arrange
            var expectedId = "default-color-spinner";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
            );

            // Assert
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Contains("fill-on-surface", svg.ClassList); // Default from SpinnerBase
        }

        [Theory]
        [InlineData(SemanticColor.Primary, "fill-primary")]
        [InlineData(SemanticColor.Secondary, "fill-secondary")]
        [InlineData(SemanticColor.Danger, "fill-danger")]
        [InlineData(SemanticColor.Success, "fill-success")]
        [InlineData(SemanticColor.Warning, "fill-warning")]
        [InlineData(SemanticColor.Info, "fill-info")]
        public void RzSpinner_WithDifferentColors_AppliesCorrectFillClasses(SemanticColor color, string expectedClass)
        {
            // Arrange
            var expectedId = $"{color.ToString().ToLower()}-spinner";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Color, color)
            );

            // Assert
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Contains(expectedClass, svg.ClassList);
        }

        [Fact]
        public void RzSpinner_CustomAriaLabel_AppliesCorrectLabel()
        {
            // Arrange
            var expectedId = "aria-spinner";
            var customLabel = "Processing your request...";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.AriaLabel, customLabel)
            );

            // Assert
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Equal(customLabel, svg.GetAttribute("aria-label"));
        }

        [Fact]
        public void RzSpinner_WithAdditionalAttributes_PassesAttributesToSvg()
        {
            // Arrange
            var expectedId = "attributes-spinner";
            var testClass = "test-additional-class";
            var testAttribute = "test-data";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.AdditionalAttributes, new Dictionary<string, object>
                {
                    { "class", testClass },
                    { "data-test", testAttribute }
                })
            );

            // Assert
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Contains(testClass, svg.ClassList);
            Assert.Equal(testAttribute, svg.GetAttribute("data-test"));
        }

        [Fact]
        public void RzSpinner_CombinesMultipleParameters_RendersCorrectly()
        {
            // Arrange
            var expectedId = "combined-spinner";
            var customLabel = "Saving data...";

            // Act
            var cut = RenderComponent<RzSpinner>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Size, Size.Large)
                .Add(p => p.Color, SemanticColor.Primary)
                .Add(p => p.AriaLabel, customLabel)
            );

            // Assert
            var svg = cut.Find("svg");
            Assert.NotNull(svg);
            Assert.Contains("size-7", svg.ClassList);
            Assert.Contains("fill-primary", svg.ClassList);
            Assert.Equal(customLabel, svg.GetAttribute("aria-label"));
        }
    }
}
