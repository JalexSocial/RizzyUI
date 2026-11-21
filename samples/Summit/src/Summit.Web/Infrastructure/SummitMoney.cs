using System.Globalization;

namespace Summit.Web.Infrastructure;

/// <summary>
/// Prices are in euros, shown in the visitor's number format: €1,234.50 in English, 1.234,50 € in German.
/// (The current culture's own currency would be dollars for en-US.)
/// </summary>
public static class SummitMoney
{
    public static IFormatProvider Format
    {
        get
        {
            var format = (NumberFormatInfo)CultureInfo.CurrentCulture.NumberFormat.Clone();
            format.CurrencySymbol = "€";
            return format;
        }
    }

    public static string Euros(this decimal amount, bool cents = false) =>
        amount.ToString(cents ? "C2" : "C0", Format);
}
