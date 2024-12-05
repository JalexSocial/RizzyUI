using RizzyUI.SafelistBuilder;

namespace RizzyUI.SafelistGenerator;

class Program
{
    static void Main(string[] args)
    {
        // Path to your CSS file
        string cssFilePath = args.Length == 2 ? args[0] : "../../../../RizzyUI/wwwroot/dist/rizzyui.css";
        string outputDirectory = args.Length == 2 ? args[1] : "../../../../RizzyUI/Scripts/rizzyui-tailwind";

        Console.WriteLine($"Generating safelist using CSS '{cssFilePath}' and output path '{outputDirectory}'");
        SafelistBuildTask task = new SafelistBuildTask
        {
            CssFilePath = cssFilePath,
            OutputDirectory = outputDirectory
        };

        task.Execute();
    }
}