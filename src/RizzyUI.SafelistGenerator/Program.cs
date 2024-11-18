﻿using AngleSharp.Css.Dom;
using AngleSharp.Css.Parser;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualBasic;

class Program
{
    static async Task Main(string[] args)
    {
        // Path to your CSS file
        string cssFilePath = "rizzyui.css";

        // Read the CSS file content
        string cssContent = await File.ReadAllTextAsync(cssFilePath);

        // Create a CSS parser
        var parser = new CssParser();

        // Parse the CSS content
        var stylesheet = await parser.ParseStyleSheetAsync(cssContent);

        // Extract class selectors
        var classNames = GetClassNames(stylesheet);

        // Output the class names
        Console.WriteLine("Class names found in the CSS file:");
        foreach (var className in classNames)
        {
            Console.WriteLine(className);
        }

        string safeList = JsonSerializer.Serialize(classNames);
        Console.WriteLine(safeList);
    }

    static IEnumerable<string> GetClassNames(ICssStyleSheet stylesheet)
    {
        var classNames = new HashSet<string>();

        foreach (var rule in stylesheet.Rules)
        {
            if (rule is ICssStyleRule styleRule)
            {
                // Split the selector text and filter class selectors
                var selectors = styleRule.SelectorText?.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);

                if (selectors is null) continue;

                var selector = String.Join(' ', selectors);

                if (selector.StartsWith("."))
                {
                    // Remove the dot and add to the set
                    var clean = selector.TrimStart('.');
                    clean = clean.Replace(@"\", "");

                    classNames.Add(clean);
                }
            }
        }

        return classNames;
    }
}