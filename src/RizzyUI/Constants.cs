namespace RizzyUI;

internal class Constants
{
    /// <summary>
    ///     Package name
    /// </summary>
    public const string PackageName = "RizzyUI";
    
    /// <summary>
    /// Conventional name for RizzyLocalization override resource files.
    /// </summary>
    internal const string RizzyLocalizationResourceName = "RizzyLocalization";

    /// <summary>
    ///     Resolves path to internal package assets
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
    public static string ContentUrl(string path)
    {
        return $"/_content/{PackageName}/{path}";
    }
}