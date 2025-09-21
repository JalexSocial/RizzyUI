
    using System;
    using System.Runtime.CompilerServices;

    namespace RizzyUI;

    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public sealed class DiscoverCollocatedJSAttribute([CallerFilePath] string? razorFilePath = null) : Attribute
    {
        public string? RazorFilePath { get; } = razorFilePath;
    }