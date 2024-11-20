using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using AngleSharp.Css.Dom;
using AngleSharp.Css.Parser;
using Microsoft.Build.Framework;

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

        private IEnumerable<string> GetClassNames(ICssStyleSheet stylesheet)
        {
            var classNames = new HashSet<string>();

            foreach (var rule in stylesheet.Rules)
            {
                if (rule is ICssStyleRule styleRule)
                {
                    if (styleRule.SelectorText is null) continue;

                    var selector = styleRule.SelectorText;

                    if (selector.StartsWith("."))
                    {
                        var clean = selector.TrimStart('.').Replace(@"\", "");
                        classNames.Add(clean);
                    }
                }
                else if (rule is ICssMediaRule mediaRule)
                {
                    foreach (var mRule in mediaRule.Rules)
                    {
                        if (mRule is ICssStyleRule mediaStyleRule)
                        {
                            var selector = mediaStyleRule.SelectorText;

                            if (selector.StartsWith("."))
                            {
                                var clean = selector.TrimStart('.').Replace(@"\", "");
                                classNames.Add(clean);
                            }
                        }
                    }
                }
            }

            return classNames;
        }
    }
}
