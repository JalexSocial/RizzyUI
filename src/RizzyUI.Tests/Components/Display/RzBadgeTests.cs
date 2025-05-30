using Blazicons;
using Bunit;

namespace RizzyUI.Tests.Components.Display
{
    public class RzBadgeTests : TestContext
    {
        public RzBadgeTests()
        {
            // Register RizzyUI services. This includes TwMerge and the default RzTheme.
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzBadge_DefaultRender_ShowsCorrectStructure()
        {
            // Arrange
            var expectedId = "default-badge";

            // Act
            var cut = RenderComponent<RzBadge>(parameters => parameters
                .Add(p => p.Id, expectedId)
            );

            // Assert
            var badge = cut.Find($"span#{expectedId}");
            Assert.NotNull(badge);
            Assert.Contains("span", cut.Markup); // Contains inner span
            Assert.DoesNotContain("<svg", cut.Markup); // Should not contain an icon by default
        }

        [Fact]
        public void RzBadge_WithLabel_DisplaysLabelText()
        {
            // Arrange
            var expectedId = "label-badge";
            var labelText = "New";

            // Act
            var cut = RenderComponent<RzBadge>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Label, labelText)
            );

            // Assert
            var badge = cut.Find($"span#{expectedId}");
            Assert.NotNull(badge);
            Assert.Contains(labelText, cut.Markup);
        }

        [Fact]
        public void RzBadge_WithChildContent_DisplaysChildContent()
        {
            // Arrange
            var expectedId = "childcontent-badge";
            var childContent = "Custom Content";

            // Act
            var cut = RenderComponent<RzBadge>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(childContent)
            );

            // Assert
            var badge = cut.Find($"span#{expectedId}");
            Assert.NotNull(badge);
            Assert.Contains(childContent, cut.Markup);
        }

        [Fact]
        public void RzBadge_WithIcon_RendersIcon()
        {
            // Arrange
            var expectedId = "icon-badge";
            // Using a simple "test" icon
            var testIcon = SvgIcon.FromContent("", "24");

            // Act
            var cut = RenderComponent<RzBadge>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Icon, testIcon)
            );

            // Assert
            var badge = cut.Find($"span#{expectedId}");
            Assert.NotNull(badge);
            Assert.Contains("<svg", cut.Markup); // Should contain an SVG icon
        }

        [Fact]
        public void RzBadge_WithCustomColor_AppliesColorClasses()
        {
            // Arrange
            var expectedId = "color-badge";
            var color = SemanticColor.Primary;

            // Act
            var cut = RenderComponent<RzBadge>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Color, color)
                .Add(p => p.Label, "Primary")
            );

            // Assert
            var badge = cut.Find($"span#{expectedId}");
            Assert.NotNull(badge);

            // Should have primary color classes (checking for a subset of the expected classes)
            Assert.Contains("border-primary", badge.ClassList);
            Assert.Contains("bg-primary", badge.ClassList);
            Assert.Contains("text-on-primary", badge.ClassList);
        }

        [Fact]
        public void RzBadge_WithSoftVariant_AppliesSoftStyling()
        {
            // Arrange
            var expectedId = "soft-badge";
            var color = SemanticColor.Primary;

            // Act
            var cut = RenderComponent<RzBadge>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Color, color)
                .Add(p => p.Soft, true)
                .Add(p => p.Label, "Soft Primary")
            );

            // Assert
            var badge = cut.Find($"span#{expectedId}");
            Assert.NotNull(badge);

            // Should have soft primary color classes
            Assert.Contains("border-primary", badge.ClassList);
            Assert.Contains("bg-primary/10", badge.ClassList);
            Assert.Contains("text-primary", badge.ClassList);
        }

        [Fact]
        public void RzBadge_WithIconAndLabel_RendersCorrectly()
        {
            // Arrange
            var expectedId = "icon-label-badge";
            var labelText = "Status";
            var testIcon = SvgIcon.FromContent("", "24");

            // Act
            var cut = RenderComponent<RzBadge>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Icon, testIcon)
                .Add(p => p.Label, labelText)
            );

            // Assert
            var badge = cut.Find($"span#{expectedId}");
            Assert.NotNull(badge);
            Assert.Contains("<svg", cut.Markup); // Should contain an SVG icon
            Assert.Contains(labelText, cut.Markup); // Should contain the label text
        }

        [Fact]
        public void RzBadge_DifferentSemanticColors_ApplyCorrectClasses()
        {
            // Test different semantic colors to verify they apply the right classes
            var colors = new[]
            {
                SemanticColor.Success,
                SemanticColor.Warning,
                SemanticColor.Destructive,
                SemanticColor.Info
            };

            foreach (var color in colors)
            {
                // Act
                var cut = RenderComponent<RzBadge>(parameters => parameters
                    .Add(p => p.Id, $"{color}-badge")
                    .Add(p => p.Color, color)
                    .Add(p => p.Label, color.ToString())
                );

                // Assert
                var badge = cut.Find($"span#{color}-badge");
                Assert.NotNull(badge);

                // Should have the correct color class
                Assert.Contains($"border-{color.ToString().ToLower()}", badge.ClassList);
                Assert.Contains($"bg-{color.ToString().ToLower()}", badge.ClassList);
                Assert.Contains($"text-on-{color.ToString().ToLower()}", badge.ClassList);
            }
        }
    }
}
