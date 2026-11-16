using System.ComponentModel.DataAnnotations;

namespace RizzyUI.Starter.Features.Settings;

public sealed class ProfileSettings
{
    [Required, StringLength(50)]
    [Display(Name = "Display name")]
    public string? DisplayName { get; set; }

    [Required, EmailAddress]
    [Display(Name = "Email")]
    public string? Email { get; set; }

    [StringLength(200)]
    [Display(Name = "Bio")]
    public string? Bio { get; set; }

    [Display(Name = "Email me about product updates")]
    public bool ProductUpdates { get; set; }
}
