﻿using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using RizzyUI.Utility;

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
    private static readonly string NonceKey = "RizzyNonceValues";

    /// <summary>
    /// Defines the custom header name for the inline script nonce.
    /// </summary>
    private static readonly string ScriptNonceHeader = "Rizzy-Script-Nonce";

    /// <summary>
    /// Defines the custom header name for the inline style nonce.
    /// </summary>
    private static readonly string StyleNonceHeader = "Rizzy-Style-Nonce";

    /// <summary>
    /// Generates secure nonce values
    /// </summary>
    private readonly RizzyNonceGenerator _generator;

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
    /// <param name="generator"></param>
    /// <exception cref="ArgumentNullException">
    /// Thrown if <paramref name="httpContextAccessor"/> is <c>null</c>.
    /// </exception>
    public RizzyNonceProvider(IHttpContextAccessor httpContextAccessor, RizzyNonceGenerator generator)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _generator = generator;
    }

    /// <summary>
    /// Retrieves the nonce values for inline scripts and styles. If the nonce values
    /// have already been generated for the current HTTP request or provided via headers,
    /// they are returned from the cache; otherwise, new nonce values are generated, cached, and returned.
    /// </summary>
    /// <returns>
    /// An instance of <see cref="RizzyNonceValues"/> containing the generated or reused nonce values.
    /// </returns>
    /// <exception cref="InvalidOperationException">
    /// Thrown if there is no current <see cref="HttpContext"/>.
    /// </exception>
    public RizzyNonceValues GetNonceValues()
    {
	    var context = _httpContextAccessor.HttpContext
	                  ?? throw new InvalidOperationException("No HttpContext available.");

	    if (context.Items[NonceKey] is RizzyNonceValues cachedNonceValues)
	    {
		    return cachedNonceValues;
	    }

	    // Attempt to retrieve nonce values from headers
	    context.Request.Headers.TryGetValue(ScriptNonceHeader, out var scriptNonceValues);
	    context.Request.Headers.TryGetValue(StyleNonceHeader, out var styleNonceValues);

	    var scriptNonce = scriptNonceValues.FirstOrDefault();
	    var styleNonce = styleNonceValues.FirstOrDefault();

	    // Validate and reuse nonce values if both are present and valid
	    if (!string.IsNullOrEmpty(scriptNonce) && _generator.ValidateNonce(scriptNonce) &&
	        !string.IsNullOrEmpty(styleNonce) && _generator.ValidateNonce(styleNonce))
	    {
		    // Reuse nonce values from headers
		    var nonceValues = new RizzyNonceValues
		    {
			    InlineScriptNonce = scriptNonce,
			    InlineStyleNonce = styleNonce
		    };
		    context.Items[NonceKey] = nonceValues;
		    return nonceValues;
	    }

	    // Generate new nonce values if validation fails or headers are missing
	    var newNonceValues = new RizzyNonceValues
	    {
		    InlineScriptNonce = _generator.CreateNonce(),
		    InlineStyleNonce = _generator.CreateNonce()
	    };
	    context.Items[NonceKey] = newNonceValues;
	    return newNonceValues;
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

