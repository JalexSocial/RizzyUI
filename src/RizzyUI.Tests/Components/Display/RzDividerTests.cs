using Bunit;

namespace RizzyUI.Tests.Components.Display
{
    public class RzDividerTests : TestContext
    {
        public RzDividerTests()
        {
            // Register RizzyUI services. This includes TwMerge and the default RzTheme.
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzDivider_WithContent_RendersContentContainer()
        {
            // Arrange
            var expectedId = "content-divider";
            var contentText = "Section Divider";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(contentText)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Equal("separator", divider.Attributes["role"]?.Value);
            Assert.Contains(contentText, divider.TextContent);
        }

        [Fact]
        public void RzDivider_WithDashedStyle_AppliesDashedClasses()
        {
            // Arrange
            var expectedId = "dashed-divider";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Style, DividerStyle.Dashed)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Contains("border-dashed", divider.ClassList);
        }

        [Fact]
        public void RzDivider_WithDottedStyle_AppliesDottedClasses()
        {
            // Arrange
            var expectedId = "dotted-divider";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Style, DividerStyle.Dotted)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Contains("border-dotted", divider.ClassList);
        }

        [Fact]
        public void RzDivider_WithSolidStyle_AppliesSolidClasses()
        {
            // Arrange
            var expectedId = "solid-divider";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Style, DividerStyle.Solid)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Contains("border-solid", divider.ClassList);
        }

        [Fact]
        public void RzDivider_WithStartAlignment_AppliesStartAlignmentClasses()
        {
            // Arrange
            var expectedId = "start-aligned-divider";
            var contentText = "Left Aligned";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.LabelAlignment, Align.Start)
                .AddChildContent(contentText)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Contains("after:flex-1", divider.ClassList);
            Assert.DoesNotContain("before:flex-1", divider.ClassList); // Start alignment has no before pseudo-element
        }

        [Fact]
        public void RzDivider_WithCenterAlignment_AppliesCenterAlignmentClasses()
        {
            // Arrange
            var expectedId = "center-aligned-divider";
            var contentText = "Center Aligned";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.LabelAlignment, Align.Center)
                .AddChildContent(contentText)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Contains("before:flex-1", divider.ClassList); // Center has both before and after
            Assert.Contains("after:flex-1", divider.ClassList);
        }

        [Fact]
        public void RzDivider_WithEndAlignment_AppliesEndAlignmentClasses()
        {
            // Arrange
            var expectedId = "end-aligned-divider";
            var contentText = "Right Aligned";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.LabelAlignment, Align.End)
                .AddChildContent(contentText)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Contains("before:flex-1", divider.ClassList);
            Assert.DoesNotContain("after:flex-1", divider.ClassList); // End alignment has no after pseudo-element
        }

        [Fact]
        public void RzDivider_WithCustomClass_AppliesAdditionalClass()
        {
            // Arrange
            var expectedId = "custom-class-divider";
            var customClass = "my-custom-class py-8";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddUnmatched("class", customClass)
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);

            // Custom class should be applied
            Assert.Contains("my-custom-class", divider.ClassList);
            Assert.Contains("py-8", divider.ClassList);
        }

        [Fact]
        public void RzDivider_WithCustomAttributes_AppliesAttributes()
        {
            // Arrange
            var expectedId = "custom-attr-divider";
            var dataTestId = "test-divider";

            // Act
            var cut = RenderComponent<RzDivider>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.AdditionalAttributes, new Dictionary<string, object>
                {
                    { "data-testid", dataTestId },
                    { "aria-label", "Divider with custom attributes" }
                })
            );

            // Assert
            var divider = cut.Find($"div#{expectedId}");
            Assert.NotNull(divider);
            Assert.Equal(dataTestId, divider.Attributes["data-testid"]?.Value);
            Assert.Equal("Divider with custom attributes", divider.Attributes["aria-label"]?.Value);
        }
    }
}
