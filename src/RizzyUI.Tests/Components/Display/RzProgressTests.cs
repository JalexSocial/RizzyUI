using Alba;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Extensions;
using Xunit;

namespace RizzyUI.Tests.Components.Display
{
    public class RzProgressTests : BunitAlbaContext, IClassFixture<WebAppFixture>
    {
        private readonly IAlbaHost _host;
        
        public RzProgressTests(WebAppFixture fixture) : base(fixture)
        {
            _host = fixture.Host;
        }

        [Fact]
        public void RzProgress_DefaultRender_ShowsCorrectStructure()
        {
            // Arrange & Act
            var cut = RenderComponent<RzProgress>(parameters => parameters
                .Add(p => p.CurrentValue, 20)
                .Add(p => p.MinValue, 0)
                .Add(p => p.MaxValue, 100)
                .Add(p => p.Variant, StatusColor.Primary)
                .Add(p => p.AriaLabel, "Default progress bar")
            );

            // Assert
            var progressBar = cut.Find("[role='progressbar']");
            Assert.NotNull(progressBar);
            Assert.Equal("20", progressBar.GetAttribute("aria-valuenow"));
            Assert.Equal("0", progressBar.GetAttribute("aria-valuemin"));
            Assert.Equal("100", progressBar.GetAttribute("aria-valuemax"));
            Assert.Contains("bg-primary", cut.Markup);
        }

        [Fact]
        public void RzProgress_LabelInside_RendersLabelContainer()
        {
            // Arrange & Act
            var cut = RenderComponent<RzProgress>(parameters => parameters
                .Add(p => p.CurrentValue, 45)
                .Add(p => p.MinValue, 0)
                .Add(p => p.MaxValue, 100)
                .Add(p => p.Label, "Completed {percent}%")
                .Add(p => p.LabelPosition, ProgressLabelPosition.Inside)
                .Add(p => p.Variant, StatusColor.Success)
                .Add(p => p.AriaLabel, "RzProgress bar with label inside")
            );

            // Assert
            Assert.Contains("Completed", cut.Markup); // Label text present
            Assert.Contains("bg-success", cut.Markup);
        }

        [Fact]
        public void RzProgress_LabelOutside_RendersLabelContainer()
        {
            // Arrange & Act
            var cut = RenderComponent<RzProgress>(parameters => parameters
                .Add(p => p.CurrentValue, 70)
                .Add(p => p.MinValue, 0)
                .Add(p => p.MaxValue, 100)
                .Add(p => p.Label, "{percent}% Compressed")
                .Add(p => p.LabelPosition, ProgressLabelPosition.Outside)
                .Add(p => p.Variant, StatusColor.Warning)
                .Add(p => p.AriaLabel, "RzProgress bar with label outside")
            );

            // Assert
            Assert.Contains("Compressed", cut.Markup);
            Assert.Contains("bg-warning", cut.Markup);
        }

        [Theory]
        [InlineData(StatusColor.Primary, "bg-primary")]
        [InlineData(StatusColor.Secondary, "bg-secondary")]
        [InlineData(StatusColor.Success, "bg-success")]
        [InlineData(StatusColor.Info, "bg-info")]
        [InlineData(StatusColor.Warning, "bg-warning")]
        [InlineData(StatusColor.Danger, "bg-danger")]
        public void RzProgress_Variant_AppliesCorrectClass(StatusColor variant, string expectedClass)
        {
            // Arrange & Act
            var cut = RenderComponent<RzProgress>(parameters => parameters
                .Add(p => p.CurrentValue, 50)
                .Add(p => p.MinValue, 0)
                .Add(p => p.MaxValue, 100)
                .Add(p => p.Variant, variant)
            );

            // Assert
            Assert.Contains(expectedClass, cut.Markup);
        }
    }
}

