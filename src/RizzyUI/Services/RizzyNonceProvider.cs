using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;

namespace RizzyUI.Services;

/// <summary>
/// Basic implementation of IRizzyNonceProvider that generates unique per-request nonce values.
/// </summary>
public sealed class RizzyNonceProvider(IHttpContextAccessor httpContextAccessor) : IRizzyNonceProvider
{
    private const string NonceKey = "RizzyNonceValues";

    /// <inheritdoc/>
    public RizzyNonceValues GetNonceValues()
    {
        var context = httpContextAccessor.HttpContext;

        if (context == null)
            throw new InvalidOperationException("No HttpContext available.");

        // Check if nonce values are already generated for this request
        if (context.Items[NonceKey] is RizzyNonceValues nonceValues)
        {
            return nonceValues;
        }
        else
        {
            // Generate new nonce values
            nonceValues = new RizzyNonceValues
            {
                InlineScriptNonce = GenerateNonce(),
                InlineStyleNonce = GenerateNonce()
            };

            // Store nonce values in HttpContext.Items for the current request
            context.Items[NonceKey] = nonceValues;

            return nonceValues;
        }
    }

    private string GenerateNonce()
    {
        // Generate a 16-byte nonce and convert it to a Base64 string
        var bytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(bytes);
        }
        return Convert.ToBase64String(bytes);
    }
}
