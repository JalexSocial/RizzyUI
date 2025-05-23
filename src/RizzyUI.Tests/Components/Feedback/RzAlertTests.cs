using Blazicons;
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Feedback
{
    public class RzAlertTests : TestContext
    {
        public RzAlertTests()
        {
            // Register RizzyUI services
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzAlert_DefaultRender_ShowsCorrectStructure()
        {
            // Arrange
            var expectedId = "default-alert";
            var content = "This is an alert message";

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(content)
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);
            Assert.Contains(content, cut.Markup);
            Assert.Contains("role=\"alert\"", cut.Markup);
            Assert.Contains("aria-live=\"assertive\"", cut.Markup);
        }

        [Fact]
        public void RzAlert_WithIcon_RendersIcon()
        {
            // Arrange
            var expectedId = "icon-alert";
            var testIcon = SvgIcon.FromContent("<path></path>", "24");

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Icon, testIcon)
                .AddChildContent("Alert with icon")
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);
            Assert.Contains("<svg", cut.Markup);
        }

        [Fact]
        public void RzAlert_WithPulse_RendersAnimatedElement()
        {
            // Arrange
            var expectedId = "pulse-alert";
            var testIcon = SvgIcon.FromContent("<path></path>", "24");

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Icon, testIcon)
                .Add(p => p.Pulse, true)
                .AddChildContent("Alert with pulse")
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);
            var pulseElement = cut.Find(".animate-ping");
            Assert.NotNull(pulseElement);
        }

        [Fact]
        public void RzAlert_Dismissable_RendersDismissButton()
        {
            // Arrange
            var expectedId = "dismissable-alert";

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Dismissable, true)
                .AddChildContent("Dismissable alert")
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);
            var closeButton = cut.Find("button[aria-label]");
            Assert.NotNull(closeButton);
            Assert.Contains("M6 18L18 6M6 6l12 12", cut.Markup); // Close icon path
        }

        [Theory]
        [InlineData(AlertVariant.Information)]
        [InlineData(AlertVariant.Success)]
        [InlineData(AlertVariant.Warning)]
        [InlineData(AlertVariant.Danger)]
        [InlineData(AlertVariant.Alternate)]
        public void RzAlert_WithVariant_AppliesCorrectClasses(AlertVariant variant)
        {
            // Arrange
            var expectedId = $"{variant.ToString().ToLower()}-alert";

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Variant, variant)
                .AddChildContent($"{variant} alert")
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);

            // Check for presence of variant-specific classes (based on DefaultRzAlertStyles)
            string expectedClass = variant switch
            {
                AlertVariant.Alternate => "border-outline",
                AlertVariant.Information => "border-info",
                AlertVariant.Success => "border-success",
                AlertVariant.Warning => "border-warning",
                AlertVariant.Danger => "border-danger",
                _ => "border-info"
            };
            Assert.Contains(expectedClass, alert.OuterHtml);
        }

        [Fact]
        public void RzAlert_WithTitle_RendersCorrectly()
        {
            // Arrange
            var expectedId = "title-alert";
            var titleText = "Alert Title";

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(builder =>
                {
                    builder.OpenComponent<RzAlertTitle>(0);
                    builder.AddAttribute(1, "ChildContent", (RenderFragment)(titleBuilder =>
                        titleBuilder.AddContent(0, titleText)));
                    builder.CloseComponent();

                    builder.OpenComponent<RzAlertDescription>(2);
                    builder.AddAttribute(3, "ChildContent", (RenderFragment)(descBuilder =>
                        descBuilder.AddContent(0, "Description text")));
                    builder.CloseComponent();
                })
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);
            Assert.Contains(titleText, cut.Markup);
            Assert.Contains("text-sm font-semibold", cut.Markup); // Title class
        }

        [Fact]
        public void RzAlert_WithDescription_RendersCorrectly()
        {
            // Arrange
            var expectedId = "description-alert";
            var descriptionText = "This is a detailed description";

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(builder =>
                {
                    builder.OpenComponent<RzAlertDescription>(0);
                    builder.AddAttribute(1, "ChildContent", (RenderFragment)(descBuilder =>
                        descBuilder.AddContent(0, descriptionText)));
                    builder.CloseComponent();
                })
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);
            Assert.Contains(descriptionText, cut.Markup);
            Assert.Contains("text-xs font-medium", cut.Markup); // Description class
        }

        [Fact]
        public void RzAlert_WithCustomElement_RendersSpecifiedElement()
        {
            // Arrange
            var expectedId = "custom-element-alert";
            var customElement = "section";

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Element, customElement)
                .AddChildContent("Alert with custom element")
            );

            // Assert
            var alert = cut.Find($"{customElement}#{expectedId}");
            Assert.NotNull(alert);
            Assert.StartsWith($"<{customElement}", cut.Markup.Trim());
        }

        [Fact]
        public void RzAlert_WithCompleteStructure_RendersCorrectly()
        {
            // Arrange
            var expectedId = "complete-alert";
            var testIcon = SvgIcon.FromContent("<path></path>", "24");
            var titleText = "Important Notice";
            var descriptionText = "This is a comprehensive alert with all features.";

            // Act
            var cut = RenderComponent<RzAlert>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Icon, testIcon)
                .Add(p => p.Variant, AlertVariant.Warning)
                .Add(p => p.Dismissable, true)
                .Add(p => p.Pulse, true)
                .AddChildContent(builder =>
                {
                    builder.OpenComponent<RzAlertTitle>(0);
                    builder.AddAttribute(1, "ChildContent", (RenderFragment)(titleBuilder =>
                        titleBuilder.AddContent(0, titleText)));
                    builder.CloseComponent();

                    builder.OpenComponent<RzAlertDescription>(2);
                    builder.AddAttribute(3, "ChildContent", (RenderFragment)(descBuilder =>
                        descBuilder.AddContent(0, descriptionText)));
                    builder.CloseComponent();
                })
            );

            // Assert
            var alert = cut.Find($"div#{expectedId}");
            Assert.NotNull(alert);
            Assert.Contains(titleText, cut.Markup);
            Assert.Contains(descriptionText, cut.Markup);
            Assert.Contains("<svg", cut.Markup); // Icon
            Assert.Contains("animate-ping", cut.Markup); // Pulse effect
            Assert.Contains("border-warning", alert.OuterHtml); // Warning variant
            Assert.Contains("<button", cut.Markup); // Dismiss button
        }
    }
}
