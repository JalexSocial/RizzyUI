using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Represents the possible screen positions for a toast notification.
/// Corresponds to simple-notify 'position' option.
/// </summary>
[JsonConverter(typeof(EnumMemberJsonConverter<ToastPosition>))]
public enum ToastPosition
{
    /// <summary>
    /// Notification appears at the right top of the screen.
    /// </summary>
    [EnumMember(Value = "right top")]
    RightTop,

    /// <summary>
    /// Notification appears at the right bottom of the screen.
    /// </summary>
    [EnumMember(Value = "right bottom")]
    RightBottom,

    /// <summary>
    /// Notification appears at the left top of the screen.
    /// </summary>
    [EnumMember(Value = "left top")]
    LeftTop,

    /// <summary>
    /// Notification appears at the left bottom of the screen.
    /// </summary>
    [EnumMember(Value = "left bottom")]
    LeftBottom,

    /// <summary>
    /// Notification appears at the center top of the screen.
    /// </summary>
    [EnumMember(Value = "center top")]
    CenterTop,

    /// <summary>
    /// Notification appears at the center bottom of the screen.
    /// </summary>
    [EnumMember(Value = "center bottom")]
    CenterBottom
}