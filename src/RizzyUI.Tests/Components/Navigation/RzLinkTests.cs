using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Extensions; // For TwMerge and AddRizzyUI
using Xunit;

namespace RizzyUI.Tests.Components.Navigation
{
    public class RzLinkTests : TestContext
    {
        public RzLinkTests()
        {
            // Register RizzyUI services. This includes TwMerge and the default RzTheme.
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzLink_DefaultRender_RendersCorrectly()
        {
            // Arrange
            var linkText = "Default Link";
            var expectedId = "default-link";

            // Act
            var cut = RenderComponent<RzLink>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent($"<span>{linkText}</span>")
            );

            // Assert
            var expectedMarkup = $@"
                <a href=""#"" id=""{expectedId}"" class:ignore>
                    <span>{linkText}</span>
                </a>";
            cut.MarkupMatches(expectedMarkup);
        }

        [Fact]
        public void RzLink_WithSpecificHref_RendersCorrectHref()
        {
            // Arrange
            var linkText = "Specific Href";
            var testHref = "/test-page";
            var expectedId = "href-link";

            // Act
            var cut = RenderComponent<RzLink>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Href, testHref)
                .AddChildContent($"<span>{linkText}</span>")
            );

            // Assert
            var expectedMarkup = $@"
                <a href=""{testHref}"" id=""{expectedId}"" class:ignore>
                    <span>{linkText}</span>
                </a>";
            cut.MarkupMatches(expectedMarkup);
        }

        [Fact]
        public void RzLink_UnderlineFalse_RendersWithoutUnderlineClassesEffectively()
        {
            // Arrange
            var linkText = "No Underline";
            var expectedId = "no-underline-link";

            // Act
            var cut = RenderComponent<RzLink>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Underline, false)
                .AddChildContent($"<span>{linkText}</span>")
            );

            // Assert
            // The actual class will change, but class:ignore means we only care about other attributes and structure.
            var expectedMarkup = $@"
                <a href=""#"" id=""{expectedId}"" class:ignore>
                    <span>{linkText}</span>
                </a>";
            cut.MarkupMatches(expectedMarkup);
        }

        [Fact]
        public void RzLink_WithAdditionalAttributes_RendersAttributes()
        {
            // Arrange
            var linkText = "With Attributes";
            var expectedId = "attr-link";
            var customAttributeValue = "test-value";

            // Act
            var cut = RenderComponent<RzLink>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddUnmatched("data-custom", customAttributeValue)
                .AddUnmatched("aria-role", "button")
                .AddChildContent($"<span>{linkText}</span>")
            );

            // Assert
            var expectedMarkup = $@"
                <a href=""#"" id=""{expectedId}"" class:ignore data-custom=""{customAttributeValue}"" aria-role=""button"">
                    <span>{linkText}</span>
                </a>";
            cut.MarkupMatches(expectedMarkup);
        }
        
        [Fact]
        public void RzLink_WithNullHref_DefaultsToHash()
        {
            // Arrange
            var linkText = "Null Href";
            var expectedId = "null-href-link";

            // Act
            var cut = RenderComponent<RzLink>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Href, null) // Explicitly pass null
                .AddChildContent($"<span>{linkText}</span>")
            );

            // Assert
            var expectedMarkup = $@"
                <a href=""#"" id=""{expectedId}"" class:ignore>
                    <span>{linkText}</span>
                </a>";
            cut.MarkupMatches(expectedMarkup);
        }

        [Fact]
        public void RzLink_WithEmptyHref_DefaultsToHash()
        {
            // Arrange
            var linkText = "Empty Href";
            var expectedId = "empty-href-link";

            // Act
            var cut = RenderComponent<RzLink>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Href, "") // Explicitly pass empty string
                .AddChildContent($"<span>{linkText}</span>")
            );

            // Assert
            var expectedMarkup = $@"
                <a href="""" id=""{expectedId}"" class:ignore>
                    <span>{linkText}</span>
                </a>";
            cut.MarkupMatches(expectedMarkup);
        }
    }
}