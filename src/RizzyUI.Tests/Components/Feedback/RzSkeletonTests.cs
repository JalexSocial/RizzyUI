using Bunit;

namespace RizzyUI.Tests.Components.Feedback;

public class RzSkeletonTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzSkeletonTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersSkeletonSlotAndDefaultClasses()
    {
        var cut = Render<RzSkeleton>(p => p.AddChildContent("Loading"));

        var skeleton = cut.Find("[data-slot='skeleton']");
        Assert.Contains("animate-pulse", skeleton.ClassList);
        Assert.Contains("bg-accent", skeleton.ClassList);
        Assert.Contains("Loading", skeleton.TextContent);
    }

    [Fact]
    public void MergesAdditionalClassWithoutInteractivityHooks()
    {
        var cut = Render<RzSkeleton>(p => p.AddUnmatched("class", "skeleton-custom"));

        var skeleton = cut.Find("[data-slot='skeleton']");
        Assert.Contains("skeleton-custom", skeleton.ClassList);
        Assert.Null(skeleton.GetAttribute("x-data"));
    }
}
