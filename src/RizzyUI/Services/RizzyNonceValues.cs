using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI.Services;

/// <summary>
/// Holds the script and style nonce values to be used in the application.
/// </summary>
public sealed class RizzyNonceValues
{
    /// <summary>
    /// The nonce to add to any inlined scripts
    /// </summary>
    public required string InlineScriptNonce { get; set; }

    /// <summary>
    /// The nonce to add to any inlined styles
    /// </summary>
    public required string InlineStyleNonce { get; set; } 
}
