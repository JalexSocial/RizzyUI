namespace RizzyUI.Services.RzToast;

/// <summary>
/// Represents a request-scoped handle returned by a server-side toast show command.
/// </summary>
/// <remarks>
/// This handle only queues commands through the current request scope. Do not store it for later requests; persist the <see cref="Id"/> string and call <see cref="IRzToastService.Update(string, RzToastUpdate)"/> or <see cref="IRzToastService.Dismiss(string?)"/> in a later request instead.
/// </remarks>
public sealed class RzToastHandle
{
    private readonly IRzToastService _service;

    internal RzToastHandle(string id, IRzToastService service)
    {
        Id = id;
        _service = service;
    }

    /// <summary>Gets the stable client-side toast id.</summary>
    public string Id { get; }

    /// <summary>Queues an update command for this toast id.</summary>
    /// <param name="update">The supplied update fields.</param>
    public void Update(RzToastUpdate update) => _service.Update(Id, update);

    /// <summary>Queues a dismiss command for this toast id.</summary>
    public void Dismiss() => _service.Dismiss(Id);
}
