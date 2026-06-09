using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using RizzyUI.Utility.Serialization.Converters;

namespace RizzyUI.Services.RzToast;

/// <summary>
/// Represents the visual style type of the toast notification.
/// Corresponds to simple-notify 'type' option.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ToastType
{
	/// <summary>
	/// Default type, has an outline style.
	/// </summary>
	[EnumMember(Value = "outline")]
	Outline,
	
	/// <summary>
	/// Filled type, has a solid background style.
	/// </summary>
	[EnumMember(Value = "filled")]
	Filled
}