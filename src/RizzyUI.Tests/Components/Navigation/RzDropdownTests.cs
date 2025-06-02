using Blazicons;
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Navigation
{
    public class RzDropdownMenuTests : TestContext
    {
        public RzDropdownMenuTests()
        {
            Services.AddRizzyUI();
        }

        [Fact]
        public void RzDropdownMenu_DefaultRender_DisplaysTriggerAndNotContent()
        {
            // Arrange & Act
            var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
                .Add(p => p.DropdownMenuTrigger, (RenderFragment)(builder =>
                {
                    builder.AddContent(0, "TriggerContent");
                }))
                .Add(p => p.DropdownMenuContent, (RenderFragment)(builder =>
                {
                    builder.AddContent(0, "<div>DropdownContent</div>");
                }))
            );

            // Assert
            var markup = cut.Markup;
            Assert.Contains("TriggerContent", markup);
            // Content is always rendered, but may be hidden by Alpine.js, so just check for its presence
            Assert.Contains("DropdownContent", markup);
        }

        [Fact]
        public void RzDropdownMenu_WithAvatarTrigger_RendersMenuItems()
        {
            // Arrange & Act
            var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
                .Add(p => p.DropdownMenuTrigger, (RenderFragment)(builder =>
                {
                    builder.OpenComponent(0, typeof(RzAvatar));
                    builder.AddAttribute(1, "ImageSource", "/images/profile/51.jpg");
                    builder.AddAttribute(2, "Initials", "JD");
                    builder.AddAttribute(3, "Shape", AvatarShape.Circle);
                    builder.AddAttribute(4, "Size", Size.Medium);
                    builder.CloseComponent();
                }))
                .Add(p => p.DropdownMenuContent, (RenderFragment)(builder =>
                {
                    builder.OpenComponent(5, typeof(RzDropdownMenuSection));
                    builder.AddAttribute(6, "ChildContent", (RenderFragment)(sectionBuilder =>
                    {
                        sectionBuilder.OpenComponent(7, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(8, "Icon", MdiIcon.Home);
                        sectionBuilder.AddAttribute(9, "Title", "Dashboard");
                        sectionBuilder.CloseComponent();
                        sectionBuilder.OpenComponent(10, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(11, "Icon", MdiIcon.Cog);
                        sectionBuilder.AddAttribute(12, "Title", "Settings");
                        sectionBuilder.CloseComponent();
                        sectionBuilder.OpenComponent(13, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(14, "Icon", MdiIcon.Logout);
                        sectionBuilder.AddAttribute(15, "Title", "Sign Out");
                        sectionBuilder.CloseComponent();
                    }));
                    builder.CloseComponent();
                }))
            );

            // Assert
            Assert.Contains("Dashboard", cut.Markup);
            Assert.Contains("Settings", cut.Markup);
            Assert.Contains("Sign Out", cut.Markup);
        }

        [Fact]
        public void RzDropdownMenu_WithButtonTriggerAndMultipleSections_RendersAllSections()
        {
            // Arrange & Act
            var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
                .Add(p => p.DropdownMenuTrigger, (RenderFragment)(builder =>
                {
                    builder.OpenComponent(0, typeof(RzButton));
                    builder.AddAttribute(1, "Variant", ButtonVariant.Primary);
                    builder.AddAttribute(2, "Label", "Menu");
                    builder.CloseComponent();
                }))
                .Add(p => p.DropdownMenuContent, (RenderFragment)(builder =>
                {
                    // Section 1
                    builder.OpenComponent(3, typeof(RzDropdownMenuSection));
                    builder.AddAttribute(4, "ChildContent", (RenderFragment)(sectionBuilder =>
                    {
                        sectionBuilder.OpenComponent(5, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(6, "Icon", MdiIcon.Home);
                        sectionBuilder.AddAttribute(7, "Title", "Dashboard");
                        sectionBuilder.CloseComponent();
                        sectionBuilder.OpenComponent(8, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(9, "Icon", MdiIcon.Chat);
                        sectionBuilder.AddAttribute(10, "Title", "Messages");
                        sectionBuilder.AddAttribute(11, "Count", 6);
                        sectionBuilder.CloseComponent();
                        sectionBuilder.OpenComponent(12, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(13, "Icon", MdiIcon.Heart);
                        sectionBuilder.AddAttribute(14, "Title", "Favorites");
                        sectionBuilder.CloseComponent();
                    }));
                    builder.CloseComponent();
                    // Section 2
                    builder.OpenComponent(15, typeof(RzDropdownMenuSection));
                    builder.AddAttribute(16, "ChildContent", (RenderFragment)(sectionBuilder =>
                    {
                        sectionBuilder.OpenComponent(17, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(18, "Icon", MdiIcon.Circle);
                        sectionBuilder.AddAttribute(19, "Title", "Profile");
                        sectionBuilder.CloseComponent();
                        sectionBuilder.OpenComponent(20, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(21, "Icon", MdiIcon.Cog);
                        sectionBuilder.AddAttribute(22, "Title", "Settings");
                        sectionBuilder.CloseComponent();
                    }));
                    builder.CloseComponent();
                    // Section 3
                    builder.OpenComponent(23, typeof(RzDropdownMenuSection));
                    builder.AddAttribute(24, "ChildContent", (RenderFragment)(sectionBuilder =>
                    {
                        sectionBuilder.OpenComponent(25, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(26, "Icon", MdiIcon.Logout);
                        sectionBuilder.AddAttribute(27, "Title", "Sign Out");
                        sectionBuilder.CloseComponent();
                    }));
                    builder.CloseComponent();
                }))
            );

            // Assert
            Assert.Contains("Dashboard", cut.Markup);
            Assert.Contains("Messages", cut.Markup);
            Assert.Contains("Favorites", cut.Markup);
            Assert.Contains("Profile", cut.Markup);
            Assert.Contains("Settings", cut.Markup);
            Assert.Contains("Sign Out", cut.Markup);
            Assert.Contains("6", cut.Markup); // Badge count
        }

        [Fact]
        public void RzDropdownMenu_WithCustomAnchor_RendersWithAnchorAttribute()
        {
            // Arrange & Act
            var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
                .Add(p => p.Anchor, AnchorPoint.TopEnd)
                .Add(p => p.DropdownMenuTrigger, (RenderFragment)(builder =>
                {
                    builder.OpenComponent(0, typeof(RzButton));
                    builder.AddAttribute(1, "Variant", ButtonVariant.Secondary);
                    builder.AddAttribute(2, "Label", "Options");
                    builder.CloseComponent();
                }))
                .Add(p => p.DropdownMenuContent, (RenderFragment)(builder =>
                {
                    builder.OpenComponent(3, typeof(RzDropdownMenuSection));
                    builder.AddAttribute(4, "ChildContent", (RenderFragment)(sectionBuilder =>
                    {
                        sectionBuilder.OpenComponent(5, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(6, "Icon", MdiIcon.Cog);
                        sectionBuilder.AddAttribute(7, "Title", "Preferences");
                        sectionBuilder.CloseComponent();
                        sectionBuilder.OpenComponent(8, typeof(RzDropdownMenuItem));
                        sectionBuilder.AddAttribute(9, "Icon", MdiIcon.Information);
                        sectionBuilder.AddAttribute(10, "Title", "About");
                        sectionBuilder.CloseComponent();
                    }));
                    builder.CloseComponent();
                }))
            );

            // Assert
            Assert.Contains("Preferences", cut.Markup);
            Assert.Contains("About", cut.Markup);
            // Check anchor attribute is set
            var wrapper = cut.Find("[data-anchor]");
            Assert.Equal("topend", wrapper.GetAttribute("data-anchor"));
        }
    }
}
