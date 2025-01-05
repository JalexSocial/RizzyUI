namespace RizzyUI;

/// <summary>
/// Configuration for RizzyUI
/// </summary>
public sealed class RizzyUIConfig
{
    /// <summary>
    /// Gets or sets the Nonce HMAC Key as a base-64 encoded string. This key is used to sign generated nonce values
    /// such that they may be revalidated when
    /// </summary>
    // ReSharper disable once InconsistentNaming
    public string NonceHMACKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets the decoded Nonce HMAC Key as a byte array.
    /// </summary>
    // ReSharper disable once InconsistentNaming
    public byte[] NonceHMACKeyBytes => Convert.FromBase64String(NonceHMACKey);
}
