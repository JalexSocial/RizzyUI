namespace RizzyUI.Services.RzToast;

/// <summary>
/// Queues toast commands for the current request so an HTMX response can replay them through the RizzyUI toast runtime.
/// </summary>
/// <remarks>
/// The service is request scoped. Commands are emitted by <c>UseRzToast()</c> only for HTMX responses and are not persisted across redirects or later requests.
/// </remarks>
public interface IRzToastService
{
    /// <summary>
    /// Queues a toast show command using a flat options object that mirrors <c>Rizzy.toast.show(...)</c>.
    /// </summary>
    /// <param name="message">The message and options to show.</param>
    /// <returns>A request-scoped handle containing the final toast id.</returns>
    RzToastHandle Show(RzToastMessage message);

    /// <summary>
    /// Queues a custom toast by delegating directly to <see cref="Show(RzToastMessage)"/>.
    /// </summary>
    /// <param name="message">The message and options to show.</param>
    /// <returns>A request-scoped handle containing the final toast id.</returns>
    RzToastHandle Custom(RzToastMessage message);

    /// <summary>
    /// Queues a success toast command.
    /// </summary>
    /// <param name="text">The toast body text.</param>
    /// <param name="title">The toast title.</param>
    /// <param name="options">Optional runtime options.</param>
    /// <returns>A request-scoped handle containing the final toast id.</returns>
    RzToastHandle Success(string text, string title = "Success", RzToastOptions? options = null);

    /// <summary>
    /// Queues an error toast command.
    /// </summary>
    /// <param name="text">The toast body text.</param>
    /// <param name="title">The toast title.</param>
    /// <param name="options">Optional runtime options.</param>
    /// <returns>A request-scoped handle containing the final toast id.</returns>
    RzToastHandle Error(string text, string title = "Error", RzToastOptions? options = null);

    /// <summary>
    /// Queues a warning toast command.
    /// </summary>
    /// <param name="text">The toast body text.</param>
    /// <param name="title">The toast title.</param>
    /// <param name="options">Optional runtime options.</param>
    /// <returns>A request-scoped handle containing the final toast id.</returns>
    RzToastHandle Warning(string text, string title = "Warning", RzToastOptions? options = null);

    /// <summary>
    /// Queues an informational toast command.
    /// </summary>
    /// <param name="text">The toast body text.</param>
    /// <param name="title">The toast title.</param>
    /// <param name="options">Optional runtime options.</param>
    /// <returns>A request-scoped handle containing the final toast id.</returns>
    RzToastHandle Info(string text, string title = "Info", RzToastOptions? options = null);

    /// <summary>
    /// Queues a loading toast command with <see cref="RzToastOptions.AutoClose"/> and <see cref="RzToastOptions.Progress"/> defaulted to <see langword="false"/> unless explicitly supplied.
    /// </summary>
    /// <param name="text">The toast body text.</param>
    /// <param name="title">The toast title.</param>
    /// <param name="options">Optional runtime options.</param>
    /// <returns>A request-scoped handle containing the final toast id.</returns>
    RzToastHandle Loading(string text, string title = "Loading", RzToastOptions? options = null);

    /// <summary>
    /// Queues an update command for an existing client-side toast.
    /// </summary>
    /// <param name="id">The stable toast id to update.</param>
    /// <param name="update">The supplied update fields. Null fields are omitted from transport and leave client values unchanged.</param>
    void Update(string id, RzToastUpdate update);

    /// <summary>
    /// Queues a dismiss command for a specific toast or, when omitted, the most recent client-side toast.
    /// </summary>
    /// <param name="id">The optional toast id to dismiss.</param>
    void Dismiss(string? id = null);

    /// <summary>
    /// Queues a clear command that dismisses all client-side toasts.
    /// </summary>
    void Clear();
}
