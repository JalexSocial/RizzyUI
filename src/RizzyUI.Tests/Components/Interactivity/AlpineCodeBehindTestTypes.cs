using RizzyUI;

namespace RizzyUI.Tests.Components.Interactivity;

[RzAlpineCodeBehind("/workspace/RizzyUI/src/RizzyUI.Tests/Components/Interactivity/FakeAlpineHost.razor")]
public sealed class FakeAlpineHost
{
}

// A component compiled on Windows: [CallerFilePath] keeps backslashes after the project prefix.
[RzAlpineCodeBehind(@"/workspace/RizzyUI/src/RizzyUI.Tests/Components\Interactivity\WindowsBuiltHost.razor")]
public sealed class WindowsBuiltHost
{
}

// The attribute declared in the component's .razor.cs file.
[RzAlpineCodeBehind("/workspace/RizzyUI/src/RizzyUI.Tests/Components/Interactivity/PartialClassHost.razor.cs")]
public sealed class PartialClassHost
{
}

// No [RzAlpineCodeBehind]: RzAlpineComponent cannot find a module for it.
public sealed class UnmarkedHost
{
}
