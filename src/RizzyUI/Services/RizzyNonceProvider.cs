using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;

namespace RizzyUI.Services;

/// <summary>
/// Provides nonce values for inline scripts and styles to enhance security by preventing
/// the execution of unauthorized scripts and styles in web applications.
/// </summary>
public sealed class RizzyNonceProvider : IRizzyNonceProvider
{
    /// <summary>
    /// The key used to store nonce values in the <see cref="HttpContext.Items"/> collection.
    /// </summary>
    private const string NonceKey = "RizzyNonceValues";

    /// <summary>
    /// The HTTP context accessor used to retrieve the current <see cref="HttpContext"/>.
    /// </summary>
    private readonly IHttpContextAccessor _httpContextAccessor;

    /// <summary>
    /// Initializes a new instance of the <see cref="RizzyNonceProvider"/> class.
    /// </summary>
    /// <param name="httpContextAccessor">
    /// The <see cref="IHttpContextAccessor"/> used to access the current <see cref="HttpContext"/>.
    /// </param>
    /// <exception cref="ArgumentNullException">
    /// Thrown if <paramref name="httpContextAccessor"/> is <c>null</c>.
    /// </exception>
    public RizzyNonceProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    /// <summary>
    /// Retrieves the nonce values for inline scripts and styles. If the nonce values
    /// have already been generated for the current HTTP request, they are returned
    /// from the cache; otherwise, new nonce values are generated, cached, and returned.
    /// </summary>
    /// <returns>
    /// An instance of <see cref="RizzyNonceValues"/> containing the generated nonce values.
    /// </returns>
    /// <exception cref="InvalidOperationException">
    /// Thrown if there is no current <see cref="HttpContext"/>.
    /// </exception>
    public RizzyNonceValues GetNonceValues()
    {
        var context = _httpContextAccessor.HttpContext
                      ?? throw new InvalidOperationException("No HttpContext available.");

        if (context.Items[NonceKey] is RizzyNonceValues nonceValues)
        {
            return nonceValues;
        }

        nonceValues = new RizzyNonceValues
        {
            InlineScriptNonce = GenerateNonce(),
            InlineStyleNonce = GenerateNonce()
        };

        context.Items[NonceKey] = nonceValues;
        return nonceValues;
    }

    /// <summary>
    /// Generates a cryptographically secure nonce value encoded in Base64.
    /// </summary>
    /// <returns>
    /// A <see cref="string"/> representing the generated nonce.
    /// </returns>
    private string GenerateNonce()
    {
        var bytes = new byte[16];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes); 
    }

    /// <summary>
    /// Gets the nonce value to be used for inline scripts in the current HTTP request.
    /// </summary>
    public string InlineScriptNonce => GetNonceValues().InlineScriptNonce;

    /// <summary>
    /// Gets the nonce value to be used for inline styles in the current HTTP request.
    /// </summary>
    public string InlineStyleNonce => GetNonceValues().InlineStyleNonce;
}

