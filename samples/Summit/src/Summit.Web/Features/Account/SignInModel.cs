using System.ComponentModel.DataAnnotations;

namespace Summit.Web.Features.Account;

public sealed class SignInModel
{
    [Required(ErrorMessage = "Enter your email address.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [Display(Name = "Email")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Enter your password.")]
    [Display(Name = "Password")]
    public string? Password { get; set; }

    public string? ReturnUrl { get; set; }
}
