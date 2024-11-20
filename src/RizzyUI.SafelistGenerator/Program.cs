using AngleSharp.Css.Dom;
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
    static void Main(string[] args)
    {
        // Path to your CSS file
        string cssFilePath = "../../../../RizzyUI/wwwroot/dist/rizzyui.css";
        string outputDirectory = "../../../../RizzyUI/Scripts/rizzyui-tailwind";

        SafelistBuildTask task = new SafelistBuildTask
        {
            CssFilePath = cssFilePath,
            OutputDirectory = outputDirectory
        };

        task.Execute();
    }
}