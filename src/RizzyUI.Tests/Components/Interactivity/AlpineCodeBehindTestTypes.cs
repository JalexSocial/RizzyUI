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
