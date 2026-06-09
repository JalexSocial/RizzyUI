using System.Collections.Concurrent;

namespace RizzyUI.Services.RzToast.Internal;

internal sealed class RzToastCommandQueue
{
    private readonly ConcurrentQueue<RzToastTransportCommand> _commands = new();

    public void Enqueue(RzToastTransportCommand command)
    {
        ArgumentNullException.ThrowIfNull(command);
        _commands.Enqueue(command);
    }

    public IReadOnlyList<RzToastTransportCommand> Drain()
    {
        var commands = new List<RzToastTransportCommand>();
        while (_commands.TryDequeue(out var command))
        {
            commands.Add(command);
        }

        return commands;
    }
}
