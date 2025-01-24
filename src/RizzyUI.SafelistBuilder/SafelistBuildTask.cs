using AngleSharp.Css.Dom;
using AngleSharp.Css.Parser;
using Microsoft.Build.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace RizzyUI.SafelistBuilder
{
    public class SafelistBuildTask : ITask
    {
        [Required]
        public string CssFilePath { get; set; }

        [Required]
        public string OutputDirectory { get; set; }
        public IBuildEngine BuildEngine { get; set; }
        public ITaskHost HostObject { get; set; }

        public bool Execute()
        {
            try
            {
                // Read the CSS file content
                string cssContent = File.ReadAllText(CssFilePath);

                // Flatten all the layers since we only are looking for unique classes
                cssContent = ExtractCssFromLayers(cssContent);

                // Create a CSS parser
                var parser = new CssParser();

                // Parse the CSS content
                var stylesheet = parser.ParseStyleSheetAsync(cssContent).Result;

                // Extract class selectors
                var classNames = GetClassNames(stylesheet);

                // Serialize the class names
                string serializedArray = JsonSerializer.Serialize(classNames);

                Console.WriteLine($"Discovered the following used Tailwind classes:\n {serializedArray}");

                // Prepare the output content
                string outputContent = $"module.exports = {serializedArray};";

                // Ensure the output directory exists
                Directory.CreateDirectory(OutputDirectory);

                // Write to the output file
                string outputFilePath = Path.Combine(OutputDirectory, "safelist.js");
                File.WriteAllText(outputFilePath, outputContent);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return false;
            }
        }

        public string ExtractCssFromLayers(string cssText)
        {
	        // Regex pattern to match @layer rule and capture the inner CSS content
	        var layerPattern = new Regex(@"@layer\s+[\w-]+\s*{([^}]*)}", RegexOptions.Singleline);

	        // Replace all @layer blocks with the inner CSS content
	        string result = layerPattern.Replace(cssText, match => match.Groups[1].Value.Trim());

	        return result;
        }

        private IEnumerable<string> GetClassNames(ICssStyleSheet stylesheet)
        {
            var classNames = new HashSet<string>();

            foreach (var rule in stylesheet.Rules)
            {
                if (rule is ICssStyleRule styleRule)
                {
                    if (styleRule.SelectorText is null) continue;

                    ParseRules(classNames, styleRule);
                }
                else if (rule is ICssMediaRule mediaRule)
                {
                    foreach (var mRule in mediaRule.Rules)
                    {
                        if (mRule is ICssStyleRule mediaStyleRule)
                        {
                            ParseRules(classNames, mediaStyleRule);
                        }
                    }
                }
            }

            return classNames;
        }

        private void ParseRules(HashSet<string> classNames, ICssStyleRule styleRule)
        {
            if (styleRule.Selector is CompoundSelector selector)
            {
                var selectors = selector.ToList()
                    .Where(x => x is ClassSelector)
                    .Select(x => x.Text.TrimStart('.').Replace(@"\", ""));

                foreach (var n in selectors)
                    classNames.Add(n);
            }
            else if (styleRule.Selector is ClassSelector)
            {
                var clean = styleRule.SelectorText.TrimStart('.').Replace(@"\", "");
                classNames.Add(clean);
            }
            else if (styleRule.Selector is ComplexSelector cs)
            {
                foreach (var combinator in cs.Combinators)
                {
                    if (combinator.Selector.Text.StartsWith("."))
                    {
                        var rule = combinator.Selector.Text.TrimStart('.');
                        if (!string.IsNullOrEmpty(rule))
                            classNames.Add(rule.Replace("\\", ""));

                    }
                }

            }
            else if (styleRule.Selector is TypeSelector)
            {
                // Ignore these since they are types and not classes
                // classNames.Add(styleRule.SelectorText);
            }
            else
            {

            }
        }
    }
}
