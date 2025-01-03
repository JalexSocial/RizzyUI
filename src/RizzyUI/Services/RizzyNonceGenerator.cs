﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using RizzyUI.Utility;

namespace RizzyUI.Services;

/// <summary>
/// Responsible for generating tamper-resistant nonce values <see cref="NonceUtil"/>
/// </summary>
public sealed class RizzyNonceGenerator
{
	private readonly byte[] _hmacKey;

	public RizzyNonceGenerator(IOptions<RizzyUIConfig> options)
	{
		if (string.IsNullOrEmpty(options.Value.NonceHMACKey))
			_hmacKey = GenerateSecureHmacKey();
		else
		{
			try
			{
				_hmacKey = options.Value.NonceHMACKeyBytes;

				if (_hmacKey.Length < 32)
				{
					throw new ArgumentException("Provided HMAC key when decoded must be at least 256 bits (32 bytes).");
				}
			}
			catch (FormatException ex)
			{
				throw new ArgumentException("NonceHMACKey must be a valid base-64 encoded string.", ex);
			}
        }
	}

	/// <summary>
	/// Creates a tamper-resistant nonce.
	/// </summary>
	/// <returns>Base64-encoded nonce token.</returns>
	public string CreateNonce() => NonceUtil.CreateNonce(_hmacKey);

	/// <summary>
	/// Validates a tamper-resistant nonce.
	/// </summary>
	/// <param name="nonceToken">The Base64-encoded nonce token to validate.</param>
	/// <returns>True if valid; false otherwise.</returns>
	public bool ValidateNonce(string nonceToken) => NonceUtil.ValidateNonce(nonceToken, _hmacKey);

	/// <summary>
	/// Generates a secure HMAC key using a cryptographically secure random number generator.
	/// </summary>
	/// <param name="keySizeInBytes">Size of the key in bytes (e.g., 32 for 256-bit).</param>
	/// <returns>Base64-encoded HMAC key.</returns>
	private byte[] GenerateSecureHmacKey(int keySizeInBytes = 32)
	{
		byte[] key = new byte[keySizeInBytes];
		RandomNumberGenerator.Fill(key);
		return key;
	}
}
