using RizzyUI;

public class ToastService 
{
	private readonly List<ToastMessage> _notifications = new();

	public ToastService()
	{

	}
    
	private void Generic(ToastStatus status, string title, string? text = null, int? duration = 3000, bool showIcon = true)
	{
		_notifications.Add(new ToastMessage
		{
			Status = status,
			Title = title,
			Text = text,
			Effect = ToastEffect.Slide,
			Speed = 300,
			ShowIcon = true,
			ShowCloseButton = true,
			AutoClose = true,
			AutoTimeout = duration ?? 3000,
			Type = ToastType.Outline,
			Position = ToastPosition.CenterTop
		});
	}

	public void Success(string title, string? description = null, int? duration = 3000, bool showIcon = true) =>
		Generic(ToastStatus.Success, title, description, duration, showIcon);

	public void Warning(string title, string? description = null, int? duration = 3000, bool showIcon = true) =>
		Generic(ToastStatus.Warning, title, description, duration, showIcon);

	public void Information(string title, string? description = null, int? duration = 3000, bool showIcon = true) =>
		Generic(ToastStatus.Info, title, description, duration, showIcon);

	public void Error(string title, string? description = null, int? duration = 3000, bool showIcon = true) =>
		Generic(ToastStatus.Error, title, description, duration, showIcon);

	public void Custom(ToastMessage notification)
	{
		_notifications.Add(notification);
	}

	public List<ToastMessage> ReadAllNotifications()
	{
		return _notifications;
	}

	public void RemoveAll()
	{
		_notifications.Clear();
	}
}