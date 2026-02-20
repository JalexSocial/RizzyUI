
using Bunit;

namespace RizzyUI.Tests.Components.Display
{
    public class RzSeparatorTests : TestContext
    {
        public RzSeparatorTests()
        {
            // Register RizzyUI services. This includes TwMerge and the default RzTheme.
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzSeparator_WithContent_RendersContentContainer()
        {
            // Arrange
            var expectedId = "content-separator";
            var contentText = "Section Separator";

            // Act
            var cut = Render<RzSeparator>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(contentText)
            );

            // Assert
            var separator = cut.Find($"div#{expectedId}");
            Assert.NotNull(separator);
            Assert.Equal("separator", separator.Attributes["role"]?.Value);
            Assert.Contains(contentText, separator.TextContent);
        }

        [Fact]
        public void RzSeparator_WithDashedStyle_AppliesDashedClasses()
        {
            // Arrange
            var expectedId = "dashed-separator";

            // Act
            var cut = Render<RzSeparator>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Style, SeparatorStyle.Dashed)
            );

            // Assert
            var separator = cut.Find($"div#{expectedId}");
            Assert.NotNull(separator);
            Assert.Contains("border-dashed", separator.ClassList);
        }

        [Fact]
        public void RzSeparator_WithDottedStyle_AppliesDottedClasses()
        {
            // Arrange
            var expectedId = "dotted-separator";

            // Act
            var cut = Render<RzSeparator>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Style, SeparatorStyle.Dotted)
            );

            // Assert
            var separator = cut.Find($"div#{expectedId}");
            Assert.NotNull(separator);
            Assert.Contains("border-dotted", separator.ClassList);
        }

        [Fact]
        public void RzSeparator_WithSolidStyle_AppliesSolidClasses()
        {
            // Arrange
            var expectedId = "solid-separator";

            // Act
            var cut = Render<RzSeparator>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Style, SeparatorStyle.Solid)
            );

            // Assert
            var separator = cut.Find($"div#{expectedId}");
            Assert.NotNull(separator);
            Assert.Contains("border-solid", separator.ClassList);
        }

        [Fact]
        public void RzSeparator_WithStartAlignment_AppliesStartAlignmentClasses()
        {
            // Arrange
            var expectedId = "start-aligned-separator";
            var contentText = "Left Aligned";

            // Act
            var cut = Render<RzSeparator>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.LabelAlignment, Align.Start)
                .AddChildContent(contentText)
            );

            // Assert
            var separator = cut.Find($"div#{expectedId}");
            Assert.NotNull(separator);
            Assert.Contains("after:flex-1", separator.ClassList);
            Assert.DoesNotContain("before:flex-1", separator.ClassList); // Start alignment has no before pseudo-element
        }

        [Fact]
        public void RzSeparator_WithCenterAlignment_AppliesCenterAlignmentClasses()
        {
            // Arrange
            var expectedId = "center-aligned-separator";
            var contentText = "Center Aligned";

            // Act
            var cut = Render<RzSeparator>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.LabelAlignment, Align.Center)
                .AddChildContent(contentText)
            );

            // Assert
            var separator = cut.Find($"div#{expectedId}");
            Assert.NotNull(separator);
            Assert.Contains("before:flex-1", separator.ClassList); // Center has both before and after
            Assert.Contains("after:flex-1", separator.ClassList);
        }

        [Fact]
        public void RzSeparator_WithEndAlignment_AppliesEndAlignmentClasses()
        {
            // Arrange
            var expectedId = "end-aligned-separator";
            var contentText = "Right Aligned";

            // Act
            var cut = Render<RzSeparator>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.LabelAlignment, Align.End)
                .AddChildContent(contentText)
            );

            // Assert
            var separator = cut.Find($"div#{expectedId}");
            Assert.NotNull(separator);
            Assert.Contains("before:flex-1", separator.ClassList);
            Assert.DoesNotContain("after:flex-1", separator.ClassList); // End alignment has no after pseudo-element
        }
    }
}