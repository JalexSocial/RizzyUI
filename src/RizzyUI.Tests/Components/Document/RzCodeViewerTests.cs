using Alba;
using Bunit;
using Xunit;

namespace RizzyUI.Tests.Components.Document
{
    public class RzCodeViewerTests : BunitAlbaContext, IClassFixture<WebAppFixture>
    {
        private readonly IAlbaHost _host;
        public RzCodeViewerTests(WebAppFixture fixture) : base(fixture) => _host = fixture.Host;

        [Fact]
        public void Renders_With_Source_String()
        {
            var code = "<h1>Hello World</h1>";
            var cut = RenderComponent<RzCodeViewer>(p => p
                .Add(x => x.Source, code)
                .Add(x => x.Language, "html")
            );
            Assert.Contains("Hello World", cut.Markup);
            Assert.Contains("language-html", cut.Markup);
        }

        [Fact]
        public void Renders_With_ChildContent()
        {
            var cut = RenderComponent<RzCodeViewer>(p => p
                .AddChildContent("@code { int x = 1; }")
                .Add(x => x.Language, "csharp")
            );
            Assert.Contains("int x = 1", cut.Markup);
            Assert.Contains("language-csharp", cut.Markup);
        }

        [Fact]
        public void Shows_ViewerTitle_Default_And_Custom()
        {
            var cutDefault = RenderComponent<RzCodeViewer>(p => p.Add(x => x.Source, "abc"));
            Assert.Contains("Source", cutDefault.Markup, System.StringComparison.OrdinalIgnoreCase);
            var cutCustom = RenderComponent<RzCodeViewer>(p => p
                .Add(x => x.Source, "abc")
                .Add(x => x.ViewerTitle, "My Code")
            );
            Assert.Contains("My Code", cutCustom.Markup);
        }

        [Fact]
        public void CopyButton_IsPresent()
        {
            var cut = RenderComponent<RzCodeViewer>(p => p.Add(x => x.Source, "abc"));
            Assert.Contains("aria-label=\"copy code\"", cut.Markup);
        }
    }
}

