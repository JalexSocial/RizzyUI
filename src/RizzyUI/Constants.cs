using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

internal class Constants
{
    public const string PackageName = "RizzyUI";
    public static string ContentUrl(string path) => $"/_content/{PackageName}/{path}";
}
