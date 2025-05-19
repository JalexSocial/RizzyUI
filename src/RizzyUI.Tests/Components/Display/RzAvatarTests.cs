using Bunit;
using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Extensions;
using Xunit;

namespace RizzyUI.Tests.Components.Display
{
    public class RzAvatarTests : TestContext
    {
        public RzAvatarTests()
        {
            // Register RizzyUI services. This includes TwMerge and the default RzTheme.
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzAvatar_DefaultRender_ShowsPlaceholder()
        {
            // Arrange
            var expectedId = "default-avatar";

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
            );

            // Assert
            var avatar = cut.Find($"div#{expectedId}");
            Assert.NotNull(avatar);
            Assert.Contains("User Avatar", cut.Markup); // Default alt text
            Assert.Contains("<svg", cut.Markup); // Contains placeholder SVG
        }

        [Fact]
        public void RzAvatar_WithImageSource_RendersImage()
        {
            // Arrange
            var expectedId = "image-avatar";
            var imageUrl = "https://example.com/avatar.jpg";

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.ImageSource, imageUrl)
            );

            // Assert
            var avatar = cut.Find($"div#{expectedId}");
            Assert.NotNull(avatar);
            var img = cut.Find("img");
            Assert.Equal(imageUrl, img.Attributes["src"]?.Value);
        }

        [Fact]
        public void RzAvatar_WithInitials_RendersInitials()
        {
            // Arrange
            var expectedId = "initials-avatar";
            var initials = "AB";

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Initials, initials)
            );

            // Assert
            var avatar = cut.Find($"div#{expectedId}");
            Assert.NotNull(avatar);
            
            // Find the initials container div and check its text content
            var initialsContainer = cut.Find(".initialsContainer");
            Assert.Contains(initials, initialsContainer.TextContent);
            Assert.DoesNotContain("<svg", cut.Markup); // Should not contain placeholder SVG
        }

        [Fact]
        public void RzAvatar_WithLongInitials_TruncatesTo2Chars()
        {
            // Arrange
            var expectedId = "long-initials-avatar";
            var longInitials = "ABCDEF";
            var expectedInitials = "AB";

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Initials, longInitials)
            );

            // Assert
            var initialsContainer = cut.Find(".initialsContainer");
            Assert.Equal(expectedInitials, initialsContainer.TextContent);
        }

        [Fact]
        public void RzAvatar_WithIndicator_RendersStatusIndicator()
        {
            // Arrange
            var expectedId = "indicator-avatar";

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.IndicatorVisible, true)
                .Add(p => p.IndicatorColor, AccentColor.Emerald)
            );

            // Assert
            var avatar = cut.Find($"div#{expectedId}");
            Assert.NotNull(avatar);
            var indicator = cut.Find("div[aria-hidden='true']");
            Assert.NotNull(indicator);
        }

        [Fact]
        public void RzAvatar_WithDisplayName_SetsCorrectAltText()
        {
            // Arrange
            var expectedId = "named-avatar";
            var displayName = "John Doe";

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.DisplayName, displayName)
                .Add(p => p.ImageSource, "https://example.com/avatar.jpg")
            );

            // Assert
            var avatar = cut.Find($"div#{expectedId}");
            Assert.NotNull(avatar);
            
            // Check the aria-label attribute for the display name
            Assert.Equal(displayName, avatar.Attributes["aria-label"]?.Value);
            
            // Also check the alt text on the image
            var img = cut.Find("img");
            Assert.Equal(displayName, img.Attributes["alt"]?.Value);
        }

        [Fact]
        public void RzAvatar_WithSquareShape_AppliesSquareClasses()
        {
            // Arrange
            var expectedId = "square-avatar";

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Shape, AvatarShape.Square)
                .Add(p => p.ImageSource, "https://example.com/avatar.jpg")
            );

            // Assert
            var img = cut.Find("img");
            var shapeClass = img.ClassList.FirstOrDefault(c => c.Contains("aspect-square"));
            Assert.NotNull(shapeClass);
        }

        [Fact]
        public void RzAvatar_WithCustomSize_AppliesSizeClasses()
        {
            // Arrange
            var expectedId = "large-avatar";
            var size = Size.Large;

            // Act
            var cut = RenderComponent<RzAvatar>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Size, size)
                .Add(p => p.ImageSource, "https://example.com/avatar.jpg")
            );

            // Assert
            var img = cut.Find("img");
            var sizeClass = img.ClassList.FirstOrDefault(c => c.Contains("size-14"));
            Assert.NotNull(sizeClass);
        }
    }
}
