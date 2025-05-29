using Alba;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection; // For RenderFragment
using RizzyUI; // To access AvatarImage and AvatarFallback directly if needed for setup

namespace RizzyUI.Tests.Components.Display;

public class RzAvatarTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    private readonly IAlbaHost _host;

    public RzAvatarTests(WebAppFixture fixture) : base(fixture)
    {
        _host = fixture.Host;
    }

    #region RzAvatar (Container) Tests

    [Fact]
    public void RzAvatar_DefaultRender_ShowsCorrectStructureAndAriaLabel()
    {
        // Arrange
        var expectedId = "default-avatar-container";
        var expectedDefaultAriaLabel = Services.GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizer<RizzyLocalization>>()["RzAvatar.DefaultAriaLabel"].Value;

        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Id, expectedId)
        );

        // Assert
        var avatarContainer = cut.Find($"div#{expectedId}"); // RzComponent defaults to div
        Assert.NotNull(avatarContainer);
        Assert.Equal("img", avatarContainer.GetAttribute("role")); // Role is 'img'
        Assert.Equal(expectedDefaultAriaLabel, avatarContainer.GetAttribute("aria-label"));

        // Check default classes (Size.Medium, AvatarShape.Circle)
        Assert.Contains("size-10", avatarContainer.ClassList); // Default Medium size
        Assert.Contains("rounded-full", avatarContainer.ClassList); // Default Circle shape
    }

    [Theory]
    [InlineData(AvatarShape.Circle, "rounded-full")]
    [InlineData(AvatarShape.Square, "rounded-theme")]
    public void RzAvatar_ShapeParameter_AppliesCorrectShapeClass(AvatarShape shape, string expectedClass)
    {
        // Arrange
        var expectedId = $"avatar-shape-{shape.ToString().ToLower()}";

        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .Add(p => p.Shape, shape)
        );

        // Assert
        var avatarContainer = cut.Find($"div#{expectedId}");
        Assert.Contains(expectedClass, avatarContainer.ClassList);
    }

    [Theory]
    [InlineData(Size.ExtraSmall, "size-6")]
    [InlineData(Size.Small, "size-8")]
    [InlineData(Size.Medium, "size-10")]
    [InlineData(Size.Large, "size-14")]
    [InlineData(Size.ExtraLarge, "size-20")]
    public void RzAvatar_SizeParameter_AppliesCorrectSizeClassToContainer(Size size, string expectedClass)
    {
        // Arrange
        var expectedId = $"avatar-size-{size.ToString().ToLower()}";

        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .Add(p => p.Size, size)
        );

        // Assert
        var avatarContainer = cut.Find($"div#{expectedId}");
        Assert.Contains(expectedClass, avatarContainer.ClassList);
    }

    [Fact]
    public void RzAvatar_BorderParameterTrue_AppliesBorderClass()
    {
        // Arrange
        var expectedId = "avatar-border";

        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .Add(p => p.Border, true)
        );

        // Assert
        var avatarContainer = cut.Find($"div#{expectedId}");
        // The actual class comes from Theme.RzAvatar.Border
        var theme = Services.GetRequiredService<RzTheme>();
        Assert.Contains(theme.RzAvatar.Border.Trim(), avatarContainer.ClassList.ToArray());
    }

    [Fact]
    public void RzAvatar_CustomAriaLabel_OverridesDefault()
    {
        // Arrange
        var expectedId = "avatar-custom-aria";
        var customLabel = "Profile picture of Jane Doe";

        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .Add(p => p.AriaLabel, customLabel)
        );

        // Assert
        var avatarContainer = cut.Find($"div#{expectedId}");
        Assert.Equal(customLabel, avatarContainer.GetAttribute("aria-label"));
    }

    #endregion

    #region AvatarImage Tests (as child of RzAvatar)

    [Fact]
    public void AvatarImage_WithValidSource_RendersImageAndSetsParentHasImageTrue()
    {
        // Arrange
        var imageUrl = "/images/profile/test.jpg";
        var altText = "Test User";

        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.AriaLabel, "Parent Container") // Parent label for fallback testing
            .AddChildContent<AvatarImage>(imageParams => imageParams
                .Add(p => p.ImageSource, imageUrl)
                .Add(p => p.AlternateText, altText)
            )
        );

        // Assert
        var img = cut.Find("img");
        Assert.NotNull(img);
        Assert.Equal(imageUrl, img.GetAttribute("src"));
        Assert.Equal(altText, img.GetAttribute("alt"));
        Assert.True(cut.Instance.HasImage);

        // Check styling applied from parent to image
        Assert.Contains("size-10", img.ClassList); // Default RzAvatar size
        Assert.Contains("rounded-full", img.ClassList); // Default RzAvatar shape
    }

    [Fact]
    public void AvatarImage_WithNullOrEmptySource_DoesNotRenderImageAndSetsParentHasImageFalse()
    {
        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarImage>(imageParams => imageParams
                .Add(p => p.ImageSource, null)
            )
        );

        // Assert
        Assert.Empty(cut.FindAll("img"));
        Assert.False(cut.Instance.HasImage);
    }
    
    [Fact]
    public void AvatarImage_AlternateText_FallsBackToParentAriaLabelThenDefault()
    {
        var parentAriaLabel = "Parent Avatar Label";
        var defaultLocalizedLabel = Services.GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizer<RizzyLocalization>>()["RzAvatar.DefaultAriaLabel"].Value;

        // Case 1: AlternateText provided on AvatarImage
        var cutWithAltText = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.AriaLabel, parentAriaLabel)
            .AddChildContent<AvatarImage>(imageParams => imageParams
                .Add(p => p.ImageSource, "/img.jpg")
                .Add(p => p.AlternateText, "Specific Alt")
            )
        );
        Assert.Equal("Specific Alt", cutWithAltText.Find("img").GetAttribute("alt"));

        // Case 2: AlternateText NOT provided on AvatarImage, falls back to ParentAvatar.AriaLabel
        var cutWithParentLabel = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.AriaLabel, parentAriaLabel)
            .AddChildContent<AvatarImage>(imageParams => imageParams
                .Add(p => p.ImageSource, "/img.jpg")
            )
        );
        Assert.Equal(parentAriaLabel, cutWithParentLabel.Find("img").GetAttribute("alt"));

        // Case 3: Neither AlternateText on AvatarImage nor AriaLabel on RzAvatar, falls back to localized default
        var cutWithDefaultLabel = RenderComponent<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarImage>(imageParams => imageParams
                .Add(p => p.ImageSource, "/img.jpg")
            )
        );
        Assert.Equal(defaultLocalizedLabel, cutWithDefaultLabel.Find("img").GetAttribute("alt"));
    }

    #endregion

    #region AvatarFallback Tests (as child of RzAvatar)

    [Fact]
    public void AvatarFallback_RendersWhenNoImageIsPresent()
    {
        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarImage>(imageParams => imageParams.Add(p => p.ImageSource, null)) // Ensure no image
            .AddChildContent<AvatarFallback>(fallbackParams => fallbackParams.AddChildContent("JD"))
        );

        // Assert
        Assert.NotNull(cut.Find("div.items-center.justify-center")); // Part of InitialsContainer class
        Assert.Contains("JD", cut.Markup);
        Assert.Empty(cut.FindAll("img")); // No image should be rendered
    }

    [Fact]
    public void AvatarFallback_DoesNotRenderWhenImageIsPresent()
    {
        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .AddChildContent<AvatarImage>(imageParams => imageParams.Add(p => p.ImageSource, "/image.jpg"))
            .AddChildContent<AvatarFallback>(fallbackParams => fallbackParams.AddChildContent("JD"))
        );

        // Assert
        Assert.NotNull(cut.Find("img"));
        // AvatarFallback's content ("JD") should not be in the markup if it didn't render.
        // It's tricky to assert non-existence of a component that might render nothing.
        // We rely on ParentAvatar.HasImage being true, which prevents AvatarFallback from rendering its div.
        var fallbackDivs = cut.FindAll("div").Where(d => d.TextContent.Contains("JD") && d.ClassList.Contains("bg-surface-alt"));
        Assert.Empty(fallbackDivs);
    }

    [Fact]
    public void AvatarFallback_WithChildContent_RendersInitialsWithCorrectStyling()
    {
        var initials = "TS";
        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Size, Size.Large) // To test dynamic text size
            .Add(p => p.Shape, AvatarShape.Square) // To test shape
            .AddChildContent<AvatarFallback>(fallbackParams => fallbackParams.AddChildContent(initials))
        );

        // Assert
        var fallbackElement = cut.Find("div"); // The root of AvatarFallback
        Assert.Contains(initials, fallbackElement.TextContent);
        
        // Check styling (InitialsContainer and dynamic classes from parent RzAvatar)
        var theme = Services.GetRequiredService<RzTheme>();
        Assert.Contains(theme.AvatarFallback.InitialsContainer.Split(' ').First(), fallbackElement.ClassList); // Base class
        Assert.Contains(theme.RzAvatar.GetSizeCss(Size.Large).Split(' ').First(), fallbackElement.ClassList); // Size from parent
        Assert.Contains(theme.RzAvatar.GetShapeCss(AvatarShape.Square).Split(' ').First(), fallbackElement.ClassList); // Shape from parent
        Assert.Contains(theme.RzAvatar.GetInitialsSizeCss(Size.Large).Split(' ').First(), fallbackElement.ClassList); // Text size for initials
    }

    [Fact]
    public void AvatarFallback_WithoutChildContent_RendersDefaultSvgPlaceholder()
    {
        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Size, Size.Small) // To test dynamic icon size
            .Add(p => p.Shape, AvatarShape.Circle) // To test shape
            .AddChildContent<AvatarFallback>() // No child content
        );

        // Assert
        var placeholderDiv = cut.Find("div > div"); // The div containing the SVG
        var svg = placeholderDiv.QuerySelector("svg");
        Assert.NotNull(svg);
        
        // Check styling (PlaceholderContainer, PlaceholderIcon, and dynamic classes)
        var theme = Services.GetRequiredService<RzTheme>();
        Assert.Contains(theme.AvatarFallback.PlaceholderContainer.Split(' ').First(), placeholderDiv.ClassList); // Base placeholder container class
        Assert.Contains(theme.RzAvatar.GetSizeCss(Size.Small).Split(' ').First(), placeholderDiv.ClassList); // Size from parent
        Assert.Contains(theme.RzAvatar.GetShapeCss(AvatarShape.Circle).Split(' ').First(), placeholderDiv.ClassList); // Shape from parent

        Assert.Contains(theme.AvatarFallback.PlaceholderIcon.Split(' ').First(), svg.ClassList); // Base icon class
        Assert.Contains(theme.RzAvatar.GetPlaceholderSizeCss(Size.Small).Split(' ').First(), svg.ClassList); // Icon size
    }

    #endregion

    #region RzIndicator (as child) Test
    
    [Fact]
    public void RzAvatar_CanHostRzIndicatorAsChild()
    {
        // Arrange
        // This test primarily ensures RzAvatar's ChildContent mechanism works for other components.
        // RzIndicator's own logic (visibility, color, etc.) is tested in RzIndicatorTests.cs.

        // Act
        var cut = RenderComponent<RzAvatar>(parameters => parameters
            .Add(p => p.Id, "avatar-with-indicator-child")
            .AddChildContent<RzIndicator>(indicatorParams => indicatorParams // Assuming RzIndicator.razor exists
                .Add(p => p.Id, "child-indicator")
                .Add(p => p.Visible, true)
                .Add(p => p.Color, Colors.Green.L500) // Example color
                .Add(p => p.Position, IndicatorPosition.TopEnd)
            )
        );

        // Assert
        // Check that the RzIndicator's root element (which should be a div with x-data='rzIndicator') is rendered
        var indicatorElement = cut.Find("div[data-alpine-root='child-indicator']");
        Assert.NotNull(indicatorElement);
        Assert.Equal("rzIndicator", indicatorElement.GetAttribute("x-data"));
        // Further RzIndicator assertions would be in RzIndicatorTests.cs
    }

    #endregion
}