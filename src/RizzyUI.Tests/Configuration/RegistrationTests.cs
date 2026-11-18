using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;

namespace RizzyUI.Tests.Configuration;

/// <summary>RM-3.1: AddRizzyUI is idempotent and its localization does not depend on DI order.</summary>
public class RegistrationTests
{
    private const string Key = "RzSpinner.DefaultAriaLabel";

    [Fact]
    public void CallingAddRizzyUITwice_RegistersServicesOnceAndKeepsBothConfigurations()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddRizzyUI(c => c.AssetUrls["First"] = "/first.js");
        var countAfterFirst = services.Count;
        services.AddRizzyUI(c => c.AssetUrls["Second"] = "/second.js");

        // Only the second configure action is added.
        Assert.Equal(countAfterFirst + 1, services.Count);

        var config = services.BuildServiceProvider().GetRequiredService<IOptions<RizzyUIConfig>>().Value;
        Assert.Equal("/first.js", config.AssetUrls["First"]);
        Assert.Equal("/second.js", config.AssetUrls["Second"]);
        Assert.Equal(config.AvailableThemes.Count, config.AvailableThemes.Select(t => t.ThemeCode).Distinct().Count());
    }

    [Fact]
    public void VercelAsDefaultTheme_IsListedOnce()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddRizzyUI(c => c.DefaultTheme = RzTheme.VercelTheme);

        var config = services.BuildServiceProvider().GetRequiredService<IOptions<RizzyUIConfig>>().Value;

        Assert.Single(config.AvailableThemes, t => t.ThemeCode == RzTheme.VercelTheme.ThemeCode);
        Assert.Same(RzTheme.VercelTheme, RzTheme.VercelTheme);
    }

    [Fact]
    public void WithoutAddLocalization_ComponentsGetEnglishText_NotResourceKeys()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddRizzyUI();

        var localizer = services.BuildServiceProvider().GetRequiredService<IStringLocalizer<RizzyLocalization>>();

        Assert.False(localizer[Key].ResourceNotFound);
        Assert.NotEqual(Key, localizer[Key].Value);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void ApplicationOverrides_ApplyWhetherAddLocalizationComesBeforeOrAfter(bool localizationFirst)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        if (localizationFirst)
            services.AddSingleton<IStringLocalizerFactory, OverrideFactory>();
        services.AddRizzyUI(c => c.LocalizationResourceType = typeof(AppOverrides));
        if (!localizationFirst)
            services.AddSingleton<IStringLocalizerFactory, OverrideFactory>();

        var localizer = services.BuildServiceProvider().GetRequiredService<IStringLocalizer<RizzyLocalization>>();

        Assert.Equal("Bitte warten", localizer[Key].Value);
        // Keys the application does not override fall back to RizzyUI's resources.
        Assert.False(localizer["RzSheet.CloseButtonAriaLabel"].ResourceNotFound);
    }

    private sealed class AppOverrides;

    private sealed class OverrideFactory : IStringLocalizerFactory
    {
        public IStringLocalizer Create(Type resourceSource) =>
            resourceSource == typeof(AppOverrides) ? new OverrideLocalizer() : throw new InvalidOperationException(resourceSource.FullName);

        public IStringLocalizer Create(string baseName, string location) => throw new InvalidOperationException(baseName);
    }

    private sealed class OverrideLocalizer : IStringLocalizer
    {
        public LocalizedString this[string name] =>
            name == Key ? new LocalizedString(name, "Bitte warten") : new LocalizedString(name, name, resourceNotFound: true);

        public LocalizedString this[string name, params object[] arguments] => this[name];

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => [this[Key]];
    }
}
