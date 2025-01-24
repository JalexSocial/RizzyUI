using System;
using System.IO;
using System.Reflection;
using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;

namespace RizzyUI
{

    public class BuildRizzySafelistTask : Microsoft.Build.Utilities.Task
    {
        [Required] public string OutputDirectory { get; set; }

        public override bool Execute()
        {
            try
            {
                Log.LogMessage("Building Rizzy safelist.js");

                // Get the current assembly
                var assembly = Assembly.GetExecutingAssembly();

                foreach (var name in Assembly.GetExecutingAssembly().GetManifestResourceNames())
                {
                    Log.LogMessage(name);
                }

                // The resource name typically follows the pattern: [DefaultNamespace].[Folder].[Filename]
                var resourceName = "RizzyBuildSafelistTask.Resources.safelist.js";

                using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                {
                    if (stream == null)
                    {
                        Log.LogError($"Resource '{resourceName}' not found in RizzyUI assembly.");
                        return false;
                    }

                    using (var reader = new StreamReader(stream))
                    {
                        string content = reader.ReadToEnd();
                        string outputPath = Path.Combine(OutputDirectory, "safelist.js");
                        File.WriteAllText(outputPath, content);
                        Log.LogMessage(MessageImportance.High, $"safelist.js has been written to {outputPath}");
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Log.LogErrorFromException(ex, true);
                return false;
            }
        }
    }
}