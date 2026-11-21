using System.ComponentModel.DataAnnotations;

namespace Summit.Web.Features.Help;

public sealed class ContactModel
{
    public static readonly string[] Topics = ["Tickets and invoices", "Program and speaking", "Accessibility", "Sponsorship", "Something else"];

    [Required(ErrorMessage = "Tell us your name.")]
    [StringLength(100)]
    [Display(Name = "Name")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "We need an email address to answer you.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [Display(Name = "Email")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Choose a topic.")]
    [Display(Name = "Topic")]
    public string? Topic { get; set; }

    [Required(ErrorMessage = "Write a message.")]
    [StringLength(2000, MinimumLength = 10, ErrorMessage = "Write at least 10 characters (and at most 2,000).")]
    [Display(Name = "Message")]
    public string? Message { get; set; }

    /// <summary>Only the attachment's validation result is kept on the model; the file itself is never stored.</summary>
    [Display(Name = "Attachment")]
    public object? Attachment { get; set; }
}
