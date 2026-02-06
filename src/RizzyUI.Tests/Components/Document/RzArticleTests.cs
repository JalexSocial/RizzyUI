
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Document;

public class RzArticleTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzArticleTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructure()
    {
        // Act
        var cut = RenderComponent<RzArticle>(parameters => parameters
            .Add(p => p.MainContent, (RenderFragment)(b => b.AddContent(0, "Main Body")))
        );

        // Assert
        var root = cut.Find("[data-slot='article']");
        Assert.NotNull(root);
        Assert.NotNull(cut.Find("[data-slot='article-inner-container']"));
        Assert.Contains("Main Body", cut.Find("[data-slot='article-content']").InnerHtml);
    }

    [Fact]
    public void SideContent_RendersAside()
    {
        // Act
        var cut = RenderComponent<RzArticle>(parameters => parameters
            .Add(p => p.MainContent, (RenderFragment)(b => b.AddContent(0, "Main")))
            .Add(p => p.SideContent, (RenderFragment)(b => b.AddContent(0, "Sidebar")))
        );

        // Assert
        var aside = cut.Find("[data-slot='article-aside']");
        Assert.NotNull(aside);
        Assert.Contains("Sidebar", aside.InnerHtml);
    }

    [Theory]
    [InlineData(ProseWidth.Compact, "prose-compact")]
    [InlineData(ProseWidth.Wide, "prose-wide")]
    [InlineData(ProseWidth.Full, "prose-full")]
    public void ProseWidth_AppliesCorrectClass(ProseWidth width, string expectedClass)
    {
        // Act
        var cut = RenderComponent<RzArticle>(parameters => parameters
            .Add(p => p.MainContent, (RenderFragment)(b => b.AddContent(0, "Main")))
            .Add(p => p.ProseWidth, width)
        );

        // Assert
        var article = cut.Find("[data-slot='article-content']");
        Assert.Contains(expectedClass, article.ClassList);
    }

    [Fact]
    public void IsSideFixed_AppliesFixedClass()
    {
        // Act
        var cut = RenderComponent<RzArticle>(parameters => parameters
            .Add(p => p.MainContent, (RenderFragment)(b => b.AddContent(0, "Main")))
            .Add(p => p.SideContent, (RenderFragment)(b => b.AddContent(0, "Sidebar")))
            .Add(p => p.IsSideFixed, true)
        );

        // Assert
        var aside = cut.Find("[data-slot='article-aside']");
        Assert.Contains("fixed", aside.ClassList);
    }
}