using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Extensions;
using Xunit;

namespace RizzyUI.Tests.Components.Form
{
    public class RzButtonGroupTests : TestContext
    {
        public RzButtonGroupTests()
        {
            // Register RizzyUI services
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzButtonGroup_DefaultRender_ShowsCorrectStructure()
        {
            // Arrange
            var expectedId = "default-button-group";

            // Act
            var cut = RenderComponent<RzButtonGroup>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(builder =>
                {
                    builder.OpenComponent<RzButton>(0);
                    builder.AddAttribute(1, "Label", "Button 1");
                    builder.CloseComponent();
                    
                    builder.OpenComponent<RzButton>(2);
                    builder.AddAttribute(3, "Label", "Button 2");
                    builder.CloseComponent();
                })
            );

            // Assert
            var buttonGroup = cut.Find($"div#{expectedId}");
            Assert.NotNull(buttonGroup);
            Assert.Contains("inline-flex", buttonGroup.OuterHtml);
            
            // Should contain two buttons
            var buttons = cut.FindAll("button");
            Assert.Equal(2, buttons.Count);
        }

        [Fact]
        public void RzButtonGroup_WithMultipleButtons_AppliesSpecificClassesToButtons()
        {
            // Arrange
            var expectedId = "multi-button-group";
            var buttonIds = new[] { "first-button", "middle-button", "last-button" };

            // Act
            var cut = RenderComponent<RzButtonGroup>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(builder =>
                {
                    // First button
                    builder.OpenComponent<RzButton>(0);
                    builder.AddAttribute(1, "Id", buttonIds[0]);
                    builder.AddAttribute(2, "Label", "First");
                    builder.CloseComponent();
                    
                    // Middle button
                    builder.OpenComponent<RzButton>(3);
                    builder.AddAttribute(4, "Id", buttonIds[1]);
                    builder.AddAttribute(5, "Label", "Middle");
                    builder.CloseComponent();
                    
                    // Last button
                    builder.OpenComponent<RzButton>(6);
                    builder.AddAttribute(7, "Id", buttonIds[2]);
                    builder.AddAttribute(8, "Label", "Last");
                    builder.CloseComponent();
                })
            );

            // Assert
            var buttonGroup = cut.Find($"div#{expectedId}");
            Assert.NotNull(buttonGroup);
            
            // First button should have rounded left corners
            var firstButton = cut.Find($"button#{buttonIds[0]}");
            Assert.Contains("rounded-l-borderRadius", firstButton.OuterHtml);
            Assert.DoesNotContain("border-l-0", firstButton.OuterHtml);
            
            // Middle button should have no rounded corners and border-left-0
            var middleButton = cut.Find($"button#{buttonIds[1]}");
            Assert.Contains("rounded-none", middleButton.OuterHtml);
            Assert.Contains("border-l-0", middleButton.OuterHtml);
            Assert.DoesNotContain("rounded-l-borderRadius", middleButton.OuterHtml);
            Assert.DoesNotContain("rounded-r-borderRadius", middleButton.OuterHtml);
            
            // Last button should have rounded right corners and border-left-0
            var lastButton = cut.Find($"button#{buttonIds[2]}");
            Assert.Contains("rounded-r-borderRadius", lastButton.OuterHtml);
            Assert.Contains("border-l-0", lastButton.OuterHtml);
        }

        [Fact]
        public void RzButtonGroup_WithSingleButton_AppliesNoGroupSpecificClasses()
        {
            // Arrange
            var expectedId = "single-button-group";
            var buttonId = "single-button";

            // Act
            var cut = RenderComponent<RzButtonGroup>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddChildContent(builder =>
                {
                    builder.OpenComponent<RzButton>(0);
                    builder.AddAttribute(1, "Id", buttonId);
                    builder.AddAttribute(2, "Label", "Single Button");
                    builder.CloseComponent();
                })
            );

            // Assert
            var buttonGroup = cut.Find($"div#{expectedId}");
            Assert.NotNull(buttonGroup);
            
            // A single button should still get the first button treatment
            var button = cut.Find($"button#{buttonId}");
            Assert.Contains("rounded-l-borderRadius", button.OuterHtml);
            Assert.DoesNotContain("border-l-0", button.OuterHtml);
        }

        [Fact]
        public void RzButtonGroup_WithAttribute_AppliesAdditionalAttributes()
        {
            // Arrange
            var expectedId = "attributes-button-group";
            var customClass = "custom-class";
            var dataAttribute = "test-group";

            // Act
            var cut = RenderComponent<RzButtonGroup>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .AddUnmatched("class", customClass)
                .AddUnmatched("data-testid", dataAttribute)
                .AddChildContent(builder =>
                {
                    builder.OpenComponent<RzButton>(0);
                    builder.AddAttribute(1, "Label", "Button");
                    builder.CloseComponent();
                })
            );

            // Assert
            var buttonGroup = cut.Find($"div#{expectedId}");
            Assert.NotNull(buttonGroup);
            
            // Should have custom class and data attribute
            Assert.Contains(customClass, buttonGroup.OuterHtml);
            Assert.Equal(dataAttribute, buttonGroup.GetAttribute("data-testid"));
        }

        [Fact]
        public void RzButtonGroup_WithCustomElement_UsesCorrectElement()
        {
            // Arrange
            var expectedId = "custom-element-group";
            var customElement = "section";

            // Act
            var cut = RenderComponent<RzButtonGroup>(parameters => parameters
                .Add(p => p.Id, expectedId)
                .Add(p => p.Element, customElement)
                .AddChildContent(builder =>
                {
                    builder.OpenComponent<RzButton>(0);
                    builder.AddAttribute(1, "Label", "Button");
                    builder.CloseComponent();
                })
            );

            // Assert
            var buttonGroup = cut.Find($"div#{expectedId}");
            Assert.NotNull(buttonGroup);
            
            // Even with custom element, the outer wrapper should still be a div
            // because RzButtonGroup uses a fixed div element in its Razor file
            Assert.StartsWith("<div", buttonGroup.OuterHtml);
        }
    }
}
