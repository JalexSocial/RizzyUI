﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RizzyUI.Extensions;
using Sqids;

namespace RizzyUI.Utility;

public static class IdGenerator
{
    /// <summary>
    /// A thread-safe counter used to ensure uniqueness of the IDs.
    /// Initialized with the current UTC timestamp ticks.
    /// </summary>
    private static long _counter = DateTime.UtcNow.Ticks;

    private static SqidsEncoder<long> _encoder = new(new SqidsOptions() {
        Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".Shuffle(),
    });

    /// <summary>
    /// Generates a unique ID with an optional prefix.
    /// </summary>
    /// <param name="prefix">
    /// An optional string to prefix the unique ID.
    /// If null or whitespace, "id" is used as the default prefix.
    /// </param>
    /// <returns>
    /// A unique ID string composed of the prefix and a Base62 encoded unique number.
    /// </returns>
    public static string UniqueId(string prefix)
    {
        long uniqueNumber = Interlocked.Increment(ref _counter);

        var encodedNumber = _encoder.Encode(uniqueNumber);

        string finalPrefix = string.IsNullOrWhiteSpace(prefix) ? "id" : prefix;
        return $"{finalPrefix}_{encodedNumber}";
    }
}
