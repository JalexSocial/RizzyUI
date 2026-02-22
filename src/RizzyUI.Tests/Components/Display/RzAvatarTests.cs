
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI.Tests.Components.Display;

public class RzAvatarTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAvatarTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructure()
    {
        // Arrange
        var expectedId = "default-avatar";

        // Act
        var cut = Render<RzAvatar>(parameters => parameters
            .Add(p => p.Id, expectedId)
        );

        // Assert
        var avatar = cut.Find($"div#{expectedId}");
        Assert.NotNull(avatar);
        Assert.Equal("img", avatar.GetAttribute("role"));
        Assert.NotNull(avatar.GetAttribute("aria-label"));
        Assert.Contains("rounded-full", avatar.ClassList); // Default shape
        Assert.Contains("size-10", avatar.ClassList); // Default size (Medium)
        Assert.Equal("medium", avatar.GetAttribute("data-size"));
        Assert.DoesNotContain("overflow-hidden", avatar.ClassList);
    }

    [Fact]
    public void ShapeParameter_AppliesCorrectClasses()
    {
        // Act
        var cut = Render<RzAvatar>(parameters => parameters
            .Add(p => p.Shape, AvatarShape.Square)
        );

        // Assert
        var avatar = cut.Find("[data-slot='avatar']");
        Assert.Contains("rounded-lg", avatar.ClassList);
        Assert.DoesNotContain("rounded-full", avatar.ClassList);
    }

    [Theory]
    [InlineData(Size.ExtraSmall, "size-6")]
    [InlineData(Size.Small, "size-8")]
    [InlineData(Size.Large, "size-12")]
    [InlineData(Size.ExtraLarge, "size-16")]
    public void SizeParameter_AppliesCorrectClasses(Size size, string expectedClass)
    {
        // Act
        var cut = Render<RzAvatar>(parameters => parameters
            .Add(p => p.Size, size)
        );

        // Assert
        var avatar = cut.Find("[data-slot='avatar']");
        Assert.Contains(expectedClass, avatar.ClassList);
    }

    [Fact]
    public void BorderParameter_AppliesBorderClasses()
    {
        // Act
        var cut = Render<RzAvatar>(parameters => parameters
            .Add(p => p.Border, true)
        );

        // Assert
        var avatar = cut.Find("[data-slot='avatar']");
        Assert.Contains("border-2", avatar.ClassList);
        Assert.Contains("ring-2", avatar.ClassList);
    }

    [Fact]
    public void AvatarImage_RendersImage_WhenSourceProvided()
    {
        // Act
        var cut = Render<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarImage>(img => img
                .Add(p => p.ImageSource, "/test.jpg")
                .Add(p => p.AlternateText, "Test Alt")
            )
        );

        // Assert
        var img = cut.Find("img[data-slot='avatar-image']");
        Assert.Equal("/test.jpg", img.GetAttribute("src"));
        Assert.Equal("Test Alt", img.GetAttribute("alt"));
    }

    [Fact]
    public void AvatarFallback_Renders_WhenImageMissing()
    {
        // Act - No AvatarImage or empty AvatarImage
        var cut = Render<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarFallback>(fb => fb
                .AddChildContent("JD")
            )
        );

        // Assert
        var fallback = cut.Find("[data-slot='avatar-fallback']");
        Assert.Contains("JD", fallback.TextContent);
        // Fallback styling usually depends on parent
        Assert.Contains("bg-muted", fallback.ClassList);
    }

    [Fact]
    public void AvatarFallback_RendersIcon_WhenContentMissing()
    {
        // Act
        var cut = Render<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarFallback>()
        );

        // Assert
        var fallback = cut.Find("[data-slot='avatar-fallback']");
        Assert.NotNull(fallback.QuerySelector("svg[data-slot='avatar-placeholder-icon']"));
    }

    [Fact]
    public void AvatarBadge_RendersInsideAvatar()
    {
        var cut = Render<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarImage>(img => img.Add(p => p.ImageSource, "/test.jpg"))
            .AddChildContent<AvatarBadge>()
        );

        var badge = cut.Find("[data-slot='avatar-badge']");
        Assert.Contains("absolute", badge.ClassList);
    }

    [Fact]
    public void AvatarGroup_RendersOverlappingAvatarsAndCount()
    {
        var cut = Render<AvatarGroup>(parameters => parameters
            .AddChildContent<RzAvatar>()
            .AddChildContent<RzAvatar>()
            .AddChildContent<AvatarGroupCount>(count => count.AddChildContent("+2"))
        );

        var group = cut.Find("[data-slot='avatar-group']");
        Assert.Contains("-space-x-2", group.ClassList);
        Assert.Equal("+2", cut.Find("[data-slot='avatar-group-count']").TextContent.Trim());
    }
}
