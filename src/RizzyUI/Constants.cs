using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

internal class Constants
{
    /// <summary>
    /// Package name
    /// </summary>
    public const string PackageName = "RizzyUI";

    /// <summary>
    /// Resolves path to internal package assets
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
    public static string ContentUrl(string path) => $"/_content/{PackageName}/{path}";
}
