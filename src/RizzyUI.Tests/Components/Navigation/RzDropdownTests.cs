using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Extensions;
using Xunit;

namespace RizzyUI.Tests.Components.Navigation
{
    public class RzDropdownTests : TestContext
    {
        public RzDropdownTests()
        {
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzDropdown_DefaultRender_DisplaysTrigger()
        {
            // Arrange & Act
            var cut = RenderComponent<RzDropdown>(parameters => parameters
                .AddChildContent("<div>TriggerContent</div>")
                .Add(p => p.Content, (RenderFragment)(builder =>
                {
                    builder.AddContent(0, "<div>DropdownContent</div>");
                }))
            );

            // Assert
            var markup = cut.Markup;
            Assert.Contains("TriggerContent", markup);
            Assert.DoesNotContain("DropdownContent", markup);
        }

        [Fact]
        public void RzDropdown_ClickTrigger_ShowsContent()
        {
            // Arrange
            var cut = RenderComponent<RzDropdown>(parameters => parameters
                .AddChildContent("<button id='trigger'>Open Dropdown</button>")
                .Add(p => p.Content, (RenderFragment)(builder =>
                {
                    builder.AddContent(0, "<div id='dropdown-content'>DropdownContent</div>");
                }))
            );

            // Act
            cut.Find("#trigger").Click();

            // Assert
            Assert.Contains("DropdownContent", cut.Markup);
        }
    }
}
