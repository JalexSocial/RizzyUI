using System.Collections.Frozen;
using System.Globalization;

namespace RizzyUI;

/// <summary>
/// The locale files flatpickr 4.6.13 publishes (<c>dist/l10n/*.js</c>), with the key each one registers
/// in <c>flatpickr.l10ns</c> and its Subresource Integrity hash (from the jsDelivr metadata API), and the
/// mapping from a .NET culture to one of them. <see cref="RzDateEdit"/> uses it to load the request
/// culture's locale (Summit SF-073). Each file is an asset keyed <c>FlatpickrLocale.{file}</c>, so an
/// application can self-host it by overriding that key in <see cref="RizzyUIConfig.AssetUrls"/>.
/// </summary>
internal static class FlatpickrLocales
{
    internal const string Version = "4.6.13";

    /// <summary>File name (without <c>.js</c>) to the <c>flatpickr.l10ns</c> key it registers and its hash.</summary>
    internal static readonly FrozenDictionary<string, (string Key, string Integrity)> Files =
        new Dictionary<string, (string Key, string Integrity)>(StringComparer.Ordinal)
    {
        ["ar"] = ("ar", "sha256-rgWE61CJjOJRZnvcs+rjD56h6wCa9rh3c/Gp+4e66Qs="),
        ["ar-dz"] = ("ar", "sha256-0cJKFAlHg32MXyq84R2k/nKEd9owSbM6hKQ+gILFzok="),
        ["at"] = ("at", "sha256-zcGCrWjE9BoZ86zPSrS4sSeTqnEg3ywCsLcEa6nGA/8="),
        ["az"] = ("az", "sha256-FJW/DbmKwJNBUIrUF+KnSoL6T9U/Y3aosZEDabJigMs="),
        ["be"] = ("be", "sha256-V6+qUmAes7cyRQ7s1dZLoRtVBarVjY10xJSyXCfxkBQ="),
        ["bg"] = ("bg", "sha256-t3NpbrcfGU918cxrkfYp0VCp70Rujz7s+NQddfYUEd4="),
        ["bn"] = ("bn", "sha256-l406qoLTHoj1PR6dyzLcNjqshqTghHEUk3CtQYAcvQ8="),
        ["bs"] = ("bs", "sha256-3x3mWHhcskJBACcj0BYnOpmIP9hqal7VNfZyfW2AqZc="),
        ["cat"] = ("cat", "sha256-oTrkjkuVHvO3ffVxZV011Q+trvBT/2AUwEfIaOyif+g="),
        ["ckb"] = ("ckb", "sha256-yaPp2AvO13z5C5f8uAbo6YgGqMhAX9o/zWlP2Y0ziy8="),
        ["cs"] = ("cs", "sha256-XHcMtfrF6jz7+wOuunikmgfd2tT9z9Ww7x/oJzrAOfE="),
        ["cy"] = ("cy", "sha256-GRv/UyCZy8NQdlmUUhYxCuP2ThIub4RIyANZ7iePnOk="),
        ["da"] = ("da", "sha256-JSxEmq3vePv5nm/zIZvMQDUDgyuI3YKowyZsz2Ck10w="),
        ["de"] = ("de", "sha256-i8+L+31ossi5nSCCJXxe9SPIwa/GLJT2qprrb7d7kzg="),
        ["eo"] = ("eo", "sha256-RCmUjhML9nrJT034mvOEhPUWNgkNH5nr88JAw/Fver4="),
        ["es"] = ("es", "sha256-G5b/9Xk32jhqv0GG6ZcNalPQ+lh/ANEGLHYV6BLksIw="),
        ["et"] = ("et", "sha256-wfRcWzYIb5Ggpo+R/MuKlqVeGDdRyXW1bU+yhHlSzZA="),
        ["fa"] = ("fa", "sha256-4qBuMobvj5srOzNM50lve0FR0xRW4PBdIr1dw3yEcJ0="),
        ["fi"] = ("fi", "sha256-llIxGElorBL0gGuMzm+7phDBglLhaT0R5DXLpspDsCs="),
        ["fo"] = ("fo", "sha256-cKMpNupXs+I4WAR48rSvL2yAQKm2JatOlvEOw2tO7L0="),
        ["fr"] = ("fr", "sha256-+xpDzJZ/BxtMFrLCduljhDclmRS8Gr2W3UpKAxMBC9g="),
        ["ga"] = ("ga", "sha256-T8XlDueCRM5keJuFBBtttq9OuIFRgSbV3z37bCWE74c="),
        ["gr"] = ("gr", "sha256-cK3184nTD4qqT/E4kcEUW+/ymG7RZFS/4Aq066DbRBY="),
        ["he"] = ("he", "sha256-8/3tVNzORHoaZzfSLsh83U7j+RCYnO0jojfqqZWe+WY="),
        ["hi"] = ("hi", "sha256-QiZIZYI86J/v8SpmS+gwnUUPFfVvKk4AaZqpsAYJCgs="),
        ["hr"] = ("hr", "sha256-uf+IEMKXduGRIFbFDvy/uJc17rJQdqT0WrLEqjxe6+Q="),
        ["hu"] = ("hu", "sha256-Uns4QLuBeaoJ/hThWHZKiMhkfTm+O1W+L5nFf/qJKog="),
        ["hy"] = ("hy", "sha256-eU1oGlr2oqsBQkct8UzTYjN7sc6T2ZSLb+yBediHgP8="),
        ["id"] = ("id", "sha256-cvHCpHmt9EqKfsBeDHOujIlR5wZ8Wy3s90da1L3sGkc="),
        ["is"] = ("is", "sha256-qEopLwCuThCgkhISkw2Xsx3plhms3ebc3gsgnGHA/d0="),
        ["it"] = ("it", "sha256-gaWVqfkIK6tULoU2T1KYrgzbutxk2XvQ0rVjTWRt/mE="),
        ["ja"] = ("ja", "sha256-us400PA8+wpkgAkYwnKn7ueJbkk00UuwAcqrHqLGQJw="),
        ["ka"] = ("ka", "sha256-R+ISiHSNHWsaKWM3pmMvRMXonsmaoXTkzdIBWRGVv6Y="),
        ["km"] = ("km", "sha256-CPK02zCfvkwX3FgpxeZJme8viCj9yyTTwDeGpdjHH1Y="),
        ["ko"] = ("ko", "sha256-qcKyFrsZbS7dBNXT7iObLQr3za2k5gFOLN8+6yYzHQs="),
        ["kz"] = ("kz", "sha256-b+mRY97Y3oM6KUMLEnK+WvJYUxGrBjnta1HD8VgHAAU="),
        ["lt"] = ("lt", "sha256-YqGhScexcRtu3q8++1QKfiMJFy7KBiuvLdRORAcnbcw="),
        ["lv"] = ("lv", "sha256-KHp4lg3hmjXHdUE1RdaB6JgSySIZfnWxnCoy8xP/zm0="),
        ["mk"] = ("mk", "sha256-Fvav5ioenQJzlBdgezL+IFzVRTYDUthGvGyX6bxM9+s="),
        ["mn"] = ("mn", "sha256-GpFCPPp0X5vXFo7HqYRWfxt1bsFQWtaq1huMpmcbpLI="),
        ["ms"] = ("ms", "sha256-8lag9VlDOEfOK+YKkHVizVzSFIU0EIu2IY8b+CEaY+Y="),
        ["my"] = ("my", "sha256-XXFmSYNjtwg4qdf+XZDG689nwk9Le6cWyHG4P2lyk6s="),
        ["nl"] = ("nl", "sha256-7e6dIzdvyM9X1QoY5wkjIBt648fCq36ewEAdTiV7h4g="),
        ["nn"] = ("nn", "sha256-87Z9vwY9W73kzciqBV88nyukjrUkTP/Q6cUBnjcEzS0="),
        ["no"] = ("no", "sha256-N48M4rqFWaOwUoFg3AW1VyClfjpKVy30Qvv67n0vvR8="),
        ["pa"] = ("pa", "sha256-YoBwB2VkxXeCk+nm4Ged5Ywdufjtd6Yux7dpmkGCIkM="),
        ["pl"] = ("pl", "sha256-rbIdjv/Z/uj8mHC4331mnn6xMNo1WaVy2Ouh1nn4GkA="),
        ["pt"] = ("pt", "sha256-dToT8NhAhejnL0aGbHv9BP6u+1u7vgv2QPUpkuDUhws="),
        ["ro"] = ("ro", "sha256-PX5RezU5OB8kFuWtG7rG3fsMqCGlF6yLHWRODJPT9JE="),
        ["ru"] = ("ru", "sha256-4QQ4NL8WNIHzKIWL1LOcsmfidqKihdB2eQeZBHsBT50="),
        ["si"] = ("si", "sha256-1Pz6d5PpmajOffvAYIZISSs5sQ9vz79aedm9qAhszE4="),
        ["sk"] = ("sk", "sha256-2gr9OLQE7o7+7nmCTPPlydf5LZUGoJaceBje6GhEuB4="),
        ["sl"] = ("sl", "sha256-AsNiSqC3dx7hujeQYw27kilcdxF9A+cZLZha3QxKDhU="),
        ["sq"] = ("sq", "sha256-EDLukokHP6OAGdLZUShOMTRKyQmkewWq+ZhiTwIbmpo="),
        ["sr"] = ("sr", "sha256-qX+M3EsUuIlxSL758AblLc6Y5QmK4Kd+5LUQafSdrEc="),
        ["sr-cyr"] = ("sr", "sha256-TlyO9J6St+dNRO8sisUU9HAl7Fzq0TdWXG8z1fyEXiM="),
        ["sv"] = ("sv", "sha256-7MYgQuwIWp3Kt/HFfTfgCy6kWO3klic1L5sVAB4Wq2w="),
        ["th"] = ("th", "sha256-1yCGOmSxmgH6XD59EAS9iazP2q1cz/fzstFG72RCjfU="),
        ["tr"] = ("tr", "sha256-0U9i0CqkXwjYHycfi42Z0JSp9zgJbniPyMaaNB0JTFo="),
        ["uk"] = ("uk", "sha256-NEzT9U0ScZGX/UnkVHAvI/sXnuUixU2uOZVFjpCDfq8="),
        ["uz"] = ("uz", "sha256-wZucBLdU7/CrrQ7ZtE5jXxvkhNgcyP8oFliHviHP2hw="),
        ["uz_latn"] = ("uz_latn", "sha256-3cw1JnIJzaZ/kgBQr21heyMTzHHiwZ0MDEcW3sOzYw0="),
        ["vn"] = ("vn", "sha256-0Nx1JjwPrTqvu7uGuE1ZsZtowl96PYRTwUZBF4+Jo5o="),
        ["zh"] = ("zh", "sha256-hilWjE5slTaGQYnpQ0GVQWq1stY8l5Ojd58SpbNNmVU="),
        ["zh-tw"] = ("zh_tw", "sha256-xX+YRvQNMpn/AFflZww7AXwoW5COswgmp1NgOTcxo9I="),
    }.ToFrozenDictionary(StringComparer.Ordinal);

    /// <summary>The asset key for a locale file.</summary>
    internal static string AssetKey(string file) => "FlatpickrLocale." + file;

    /// <summary>The CDN URL of a locale file.</summary>
    internal static string Url(string file) => $"https://cdn.jsdelivr.net/npm/flatpickr@{Version}/dist/l10n/{file}.js";

    /// <summary>The default CDN assets for every locale file.</summary>
    internal static IEnumerable<(string Key, string Url, string Integrity)> CdnAssets =>
        Files.OrderBy(f => f.Key, StringComparer.Ordinal).Select(f => (AssetKey(f.Key), Url(f.Key), f.Value.Integrity));

    /// <summary>
    /// The locale file for <paramref name="culture"/>, or <see langword="null"/> for English (built into
    /// flatpickr), the invariant culture and languages flatpickr does not translate.
    /// </summary>
    internal static string? FileFor(CultureInfo culture)
    {
        var name = culture.Name;
        if (string.IsNullOrEmpty(name)) return null;

        // Regional and script variants flatpickr has its own file for.
        if (name.Equals("de-AT", StringComparison.OrdinalIgnoreCase)) return "at";
        if (name.Equals("ar-DZ", StringComparison.OrdinalIgnoreCase)) return "ar-dz";
        if (name.StartsWith("zh-Hant", StringComparison.OrdinalIgnoreCase)
            || name is "zh-TW" or "zh-HK" or "zh-MO") return "zh-tw";
        if (name.StartsWith("sr-Cyrl", StringComparison.OrdinalIgnoreCase)) return "sr-cyr";
        if (name.StartsWith("uz-Latn", StringComparison.OrdinalIgnoreCase)) return "uz_latn";

        var language = culture.TwoLetterISOLanguageName;
        var file = language switch
        {
            "en" => null,
            "ca" => "cat",
            "el" => "gr",
            "vi" => "vn",
            "kk" => "kz",
            "nb" => "no",
            _ => language,
        };
        return file is not null && Files.ContainsKey(file) ? file : null;
    }

    /// <summary>
    /// The locale file for a value given as <see cref="FlatpickrOptions.Locale"/>: a file name or an
    /// <c>l10ns</c> key (<c>"de"</c>, <c>"zh_tw"</c>), or <see langword="null"/> when none matches.
    /// </summary>
    internal static string? FileForOption(string locale)
    {
        if (Files.ContainsKey(locale)) return locale;
        foreach (var (file, value) in Files)
        {
            if (string.Equals(value.Key, locale, StringComparison.Ordinal)) return file;
        }
        return null;
    }
}
