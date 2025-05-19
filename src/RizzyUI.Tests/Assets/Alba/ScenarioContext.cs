using Alba;
using RizzyUI.Tests;

namespace RizzyUI.Tests;

[Collection("scenarios")]
public abstract class ScenarioContext
{
    protected ScenarioContext(WebAppFixture fixture)
    {
        Host = fixture.Host;
    }

    public IAlbaHost Host { get; }
}