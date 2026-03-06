using Bunit;

namespace RizzyUI.Tests.Components.Form;

public class RzInputOTPTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputOTPTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzInputOTP_RendersRootSlotsAndAlpineHooks()
    {
        var cut = Render<RzInputOTP>(p => p.Add(x => x.Length, 6));

        Assert.NotNull(cut.Find("[data-slot='input-otp']"));
        var alpine = cut.Find("[x-data='rzInputOTP']");
        Assert.Equal("6", alpine.GetAttribute("data-length"));
        Assert.Equal(cut.Instance.Id, alpine.GetAttribute("data-alpine-root"));

        var input = cut.Find("input[data-otp-input='true']");
        Assert.Equal("onInput", input.GetAttribute("x-on:input"));
    }

    [Fact]
    public void RzInputOTP_RendersAriaAndKeyboardFriendlyMarkup()
    {
        var cut = Render<RzInputOTP>(p => p
            .Add(x => x.Length, 4)
            .Add(x => x.Required, true)
            .Add(x => x.AriaLabel, "One-time passcode")
            .Add(x => x.AriaDescribedBy, "otp-help")
            .Add(x => x.InputMode, "numeric"));

        var input = cut.Find("input[data-otp-input='true']");
        Assert.Equal("4", input.GetAttribute("maxlength"));
        Assert.Equal("numeric", input.GetAttribute("inputmode"));
        Assert.Equal("One-time passcode", input.GetAttribute("aria-label"));
        Assert.Equal("otp-help", input.GetAttribute("aria-describedby"));
        Assert.Equal("true", input.GetAttribute("aria-required"));
        Assert.Equal("onKeyDown", input.GetAttribute("x-on:keydown"));
    }

    [Fact]
    public void RzInputOTP_HandlesPartialConfigurationAndClassMerge()
    {
        var cut = Render<RzInputOTP>(p => p
            .Add(x => x.Length, 6)
            .Add(x => x.Name, "otp")
            .AddUnmatched("class", "text-red-500")
            .Add(x => x.ContainerClass, "gap-6")
            .Add(x => x.OtpType, InputOtpType.Alphanumeric)
            .Add(x => x.TextTransform, InputOtpTextTransform.ToUpper));

        var root = cut.Find("[data-slot='input-otp']");
        Assert.Contains("gap-6", root.ClassList);

        var alpine = cut.Find("[x-data='rzInputOTP']");
        Assert.Equal("alphanumeric", alpine.GetAttribute("data-otp-type"));
        Assert.Equal("to-upper", alpine.GetAttribute("data-text-transform"));

        var input = cut.Find("input[data-otp-input='true']");
        Assert.Equal("otp", input.GetAttribute("name"));
        Assert.Contains("text-red-500", input.ClassList);
    }
}
