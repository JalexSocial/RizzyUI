
using System.IO;
using System.Net.Http;
using System.Reflection;
using System.Security;
using System.Text.Json;
using System.Threading.Tasks;
using RizzyUI.Utility.Serialization.Converters;

namespace RizzyUI;

/// <xmldoc>
/// A static service class responsible for loading and deserializing RizzyUI themes from various sources.
/// It uses a custom <see cref="RzThemeConverter"/> to handle the specific JSON structure of shadcn/ui themes.
/// This class provides robust error handling for I/O and parsing operations.
/// </xmldoc>
public static class ThemeLoader
{
    private static readonly JsonSerializerOptions _jsonOptions;

    /// <summary>
    /// Initializes the static instance of the <see cref="ThemeLoader"/> class,
    /// setting up the necessary JSON serialization options.
    /// </summary>
    static ThemeLoader()
    {
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new RzThemeConverter() }
        };
    }

    /// <xmldoc>
    /// Asynchronously loads and deserializes a theme from a stream.
    /// </xmldoc>
    /// <param name="stream">The stream containing the JSON theme data. The stream must be readable.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the deserialized <see cref="RzTheme"/>.</returns>
    /// <exception cref="ArgumentNullException">Thrown if the provided <paramref name="stream"/> is null.</exception>
    /// <exception cref="ArgumentException">Thrown if the stream cannot be read.</exception>
    /// <exception cref="JsonException">Thrown if the JSON in the stream is invalid or cannot be deserialized into an <see cref="RzTheme"/>.</exception>
    /// <exception cref="NotSupportedException">Thrown if the stream does not support asynchronous reading.</exception>
    public static async Task<RzTheme?> LoadFromStreamAsync(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);

        if (!stream.CanRead)
        {
            throw new ArgumentException("The provided stream cannot be read.", nameof(stream));
        }

        try
        {
            return await JsonSerializer.DeserializeAsync<RzTheme>(stream, _jsonOptions);
        }
        catch (JsonException ex)
        {
            // Re-throw with more context for easier debugging.
            throw new JsonException("Failed to deserialize the theme from the stream. Ensure the JSON is valid and matches the expected format.", ex);
        }
    }

    /// <xmldoc>
    /// Asynchronously loads a theme from an embedded resource within a specified assembly.
    /// </xmldoc>
    /// <param name="assembly">The assembly containing the embedded resource.</param>
    /// <param name="resourceName">The full name of the embedded resource (e.g., "MyWebApp.Themes.MyTheme.json").</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the deserialized <see cref="RzTheme"/>.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="assembly"/> or <paramref name="resourceName"/> is null or empty.</exception>
    /// <exception cref="FileNotFoundException">Thrown if the specified embedded resource cannot be found in the assembly.</exception>
    /// <exception cref="JsonException">Thrown if the embedded resource contains invalid JSON.</exception>
    public static async Task<RzTheme?> LoadFromEmbeddedResourceAsync(Assembly assembly, string resourceName)
    {
        ArgumentNullException.ThrowIfNull(assembly);
        if (string.IsNullOrEmpty(resourceName))
        {
            throw new ArgumentNullException(nameof(resourceName));
        }

        await using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
        {
            throw new FileNotFoundException($"The embedded resource '{resourceName}' was not found in assembly '{assembly.FullName}'. Ensure the resource name is correct and the file's 'Build Action' is set to 'Embedded resource'.");
        }
        
        return await LoadFromStreamAsync(stream);
    }

    /// <xmldoc>
    /// Asynchronously loads a theme from a specified URL.
    /// </xmldoc>
    /// <param name="httpClient">The <see cref="HttpClient"/> instance to use for the request.</param>
    /// <param name="url">The URL from which to fetch the theme JSON.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the deserialized <see cref="RzTheme"/>.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="httpClient"/> or <paramref name="url"/> is null or empty.</exception>
    /// <exception cref="HttpRequestException">Thrown if the HTTP request fails (e.g., network error, non-success status code like 404 Not Found).</exception>
    /// <exception cref="JsonException">Thrown if the response body contains invalid JSON.</exception>
    public static async Task<RzTheme?> LoadFromUrlAsync(HttpClient httpClient, string url)
    {
        ArgumentNullException.ThrowIfNull(httpClient);
        if (string.IsNullOrEmpty(url))
        {
            throw new ArgumentNullException(nameof(url));
        }

        try
        {
            var response = await httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode(); // Throws HttpRequestException for non-2xx responses.
            await using var stream = await response.Content.ReadAsStreamAsync();
            return await LoadFromStreamAsync(stream);
        }
        catch (HttpRequestException ex)
        {
            throw new HttpRequestException($"Failed to load theme from URL '{url}'. See inner exception for details.", ex);
        }
    }

    /// <xmldoc>
    /// Asynchronously loads a theme from a physical file path.
    /// </xmldoc>
    /// <param name="filePath">The absolute or relative path to the theme JSON file.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the deserialized <see cref="RzTheme"/>.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="filePath"/> is null or empty.</exception>
    /// <exception cref="FileNotFoundException">Thrown if the file at the specified path does not exist.</exception>
    /// <exception cref="DirectoryNotFoundException">Thrown if the directory specified in the path does not exist.</exception>
    /// <exception cref="IOException">Thrown if an I/O error occurs while opening the file.</exception>
    /// <exception cref="SecurityException">Thrown if the caller does not have the required permission to access the file.</exception>
    /// <exception cref="UnauthorizedAccessException">Thrown if the caller does not have the required permission or the path is a directory.</exception>
    /// <exception cref="JsonException">Thrown if the file contains invalid JSON.</exception>
    public static async Task<RzTheme?> LoadFromFileAsync(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
        {
            throw new ArgumentNullException(nameof(filePath));
        }

        try
        {
            await using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return await LoadFromStreamAsync(stream);
        }
        catch (Exception ex) when (ex is FileNotFoundException or DirectoryNotFoundException or IOException or SecurityException or UnauthorizedAccessException)
        {
            // Re-throw common file access exceptions with more context.
            throw new IOException($"Failed to load theme from file path '{filePath}'. See inner exception for details.", ex);
        }
    }
}