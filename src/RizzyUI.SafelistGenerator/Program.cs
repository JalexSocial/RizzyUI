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
        string cssFilePath = "rizzyui.css";

        SafelistBuildTask task = new SafelistBuildTask
        {
            CssFilePath = "rizzyui.css",
            OutputDirectory = "./"
        };

        task.Execute();
    }
}