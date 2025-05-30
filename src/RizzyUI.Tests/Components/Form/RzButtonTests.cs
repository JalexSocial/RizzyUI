using Bunit;

namespace RizzyUI.Tests.Components.Form
{
    public class RzButtonTests : TestContext
    {
        public RzButtonTests()
        {
            // Register RizzyUI services
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzButton_DefaultRender_ShowsCorrectStructure()
        {
            // Arrange
            var expectedId = "default-button";
            var labelText = "Click Me";

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Label, labelText)
            );

            // Assert
            var button = cut.Find($"button#{expectedId}");
            Assert.NotNull(button);
            Assert.Contains(labelText, cut.Markup);
            Assert.Contains("bg-primary", button.OuterHtml); // Default variant is Primary
        }

        [Theory]
        [InlineData(ButtonVariant.Primary)]
        [InlineData(ButtonVariant.Secondary)]
        [InlineData(ButtonVariant.Alternate)]
        [InlineData(ButtonVariant.Inverse)]
        [InlineData(ButtonVariant.Information)]
        [InlineData(ButtonVariant.Destructive)]
        [InlineData(ButtonVariant.Warning)]
        [InlineData(ButtonVariant.Success)]
        [InlineData(ButtonVariant.Ghost)]
        public void RzButton_WithVariant_AppliesCorrectClasses(ButtonVariant variant)
        {
            // Arrange
            var expectedId = $"{variant.ToString().ToLower()}-button";

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Variant, variant)
                .Add(p => p.Label, variant.ToString())
            );

            // Assert
            var button = cut.Find($"button#{expectedId}");
            Assert.NotNull(button);

            // Check for variant-specific classes
            string expectedClass = variant switch
            {
                ButtonVariant.Primary => "bg-primary",
                ButtonVariant.Secondary => "bg-secondary",
                ButtonVariant.Alternate => "bg-surface-alt",
                ButtonVariant.Inverse => "bg-surface",
                ButtonVariant.Information => "bg-info",
                ButtonVariant.Destructive => "bg-danger",
                ButtonVariant.Warning => "bg-warning",
                ButtonVariant.Success => "bg-success",
                ButtonVariant.Ghost => "bg-transparent",
                _ => "bg-primary"
            };
            Assert.Contains(expectedClass, button.OuterHtml);
        }

        [Fact]
        public void RzButton_WithOutline_AppliesOutlineClasses()
        {
            // Arrange
            var expectedId = "outline-button";
            var variant = ButtonVariant.Primary;

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Variant, variant)
                .Add(p => p.Outline, true)
                .Add(p => p.Label, "Outline Button")
            );

            // Assert
            var button = cut.Find($"button#{expectedId}");
            Assert.NotNull(button);
            Assert.Contains("bg-transparent", button.OuterHtml);
            Assert.Contains("border-primary", button.OuterHtml);
            Assert.Contains("text-primary", button.OuterHtml);
        }

        [Theory]
        [InlineData(Size.ExtraSmall, "px-2 py-1")]
        [InlineData(Size.Small, "px-3 py-2")]
        [InlineData(Size.Medium, "px-4 py-2")]
        [InlineData(Size.Large, "px-6 py-3")]
        [InlineData(Size.ExtraLarge, "px-8 py-4")]
        public void RzButton_WithSize_AppliesSizeClasses(Size size, string expectedClass)
        {
            // Arrange
            var expectedId = $"{size.ToString().ToLower()}-button";

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Size, size)
                .Add(p => p.Label, size.ToString())
            );

            // Assert
            var button = cut.Find($"button#{expectedId}");
            Assert.NotNull(button);

            // Size class check
            Assert.Contains(expectedClass, button.OuterHtml);
        }

        [Fact]
        public void RzButton_WithAnimationDisabled_DoesNotApplyAnimationClasses()
        {
            // Arrange
            var expectedId = "no-animation-button";

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Animate, false)
                .Add(p => p.Label, "No Animation")
            );

            // Assert
            var button = cut.Find($"button#{expectedId}");
            Assert.NotNull(button);
            Assert.DoesNotContain("transform active:scale-90", button.OuterHtml);
        }

        [Fact]
        public void RzButton_WithChildContent_RendersCorrectly()
        {
            // Arrange
            var expectedId = "childcontent-button";
            var childContent = "Custom Button Content";

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(childContent)
            );

            // Assert
            var button = cut.Find($"button#{expectedId}");
            Assert.NotNull(button);
            Assert.Contains(childContent, cut.Markup);
        }

        [Fact]
        public void RzButton_WithAssistiveLabel_AddsAriaLabel()
        {
            // Arrange
            var expectedId = "assistive-button";
            var assistiveLabel = "Custom Assistive Label";

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.AssistiveLabel, assistiveLabel)
                .Add(p => p.Label, "Button")
            );

            // Assert
            var button = cut.Find($"button#{expectedId}");
            Assert.NotNull(button);
            Assert.Equal(assistiveLabel, button.GetAttribute("aria-label"));
        }

        [Fact]
        public void RzButton_WithCustomElement_RendersSpecifiedElement()
        {
            // Arrange
            var expectedId = "custom-element-button";
            var customElement = "a";

            // Act
            var cut = RenderComponent<RzButton>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Element, customElement)
                .Add(p => p.Label, "Link Button")
            );

            // Assert
            var button = cut.Find($"{customElement}#{expectedId}");
            Assert.NotNull(button);
            Assert.StartsWith($"<{customElement}", cut.Markup.Trim());
        }
    }
}
