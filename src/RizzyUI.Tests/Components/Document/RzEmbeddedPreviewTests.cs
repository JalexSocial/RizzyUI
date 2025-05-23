using Alba;
using Bunit;

namespace RizzyUI.Tests.Components.Document
{
    public class RzEmbeddedPreviewTests : BunitAlbaContext, IClassFixture<WebAppFixture>
    {
        private readonly IAlbaHost _host;
        public RzEmbeddedPreviewTests(WebAppFixture fixture) : base(fixture) => _host = fixture.Host;

        [Fact]
        public void Renders_IFrame_With_ChildContent()
        {
            var cut = RenderComponent<RzEmbeddedPreview>(p => p.AddChildContent("<h2>Previewed!</h2>"));
            var iframe = cut.Find("iframe");
            Assert.NotNull(iframe);
            Assert.Contains("Previewed!", iframe.GetAttribute("srcdoc"));
        }

        [Fact]
        public void IFrame_Title_Default_And_Custom()
        {
            var cutDefault = RenderComponent<RzEmbeddedPreview>(p => p.AddChildContent("abc"));
            var iframe = cutDefault.Find("iframe");
            Assert.False(string.IsNullOrWhiteSpace(iframe.GetAttribute("title")));
            var cutCustom = RenderComponent<RzEmbeddedPreview>(p => p
                .AddChildContent("abc")
                .Add(x => x.IFrameTitle, "My Preview")
            );
            var iframe2 = cutCustom.Find("iframe");
            Assert.Equal("My Preview", iframe2.GetAttribute("title"));
        }
    }
}

