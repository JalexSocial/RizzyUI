using System.ComponentModel.DataAnnotations;

namespace RizzyUI.Docs.Components.IntegrationTests;

public sealed class HarnessModel
{
    [Required(ErrorMessage = "Enter a name.")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Enter an email address.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    public string? Email { get; set; }
}
