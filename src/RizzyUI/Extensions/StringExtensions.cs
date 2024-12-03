﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI.Extensions;

internal static class StringExtensions
{
    public static string TrimEmptyLines(this string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        // Split the string into lines
        var lines = input.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);

        // Find the first non-empty line
        int start = 0;
        while (start < lines.Length && string.IsNullOrWhiteSpace(lines[start]))
        {
            start++;
        }

        // Find the last non-empty line
        int end = lines.Length - 1;
        while (end >= start && string.IsNullOrWhiteSpace(lines[end]))
        {
            end--;
        }

        // Join the lines back together, trimming the empty ones
        return string.Join(Environment.NewLine, lines[start..(end + 1)]);
    }
}