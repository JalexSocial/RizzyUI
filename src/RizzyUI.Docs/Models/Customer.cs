using System.ComponentModel.DataAnnotations;

namespace RizzyUI.Docs.Models;

/// <summary>
/// Represents a customer with personal and contact information.
/// </summary>
public class Customer
{
    /// <summary>
    /// Gets or sets the unique identifier for the customer.
    /// </summary>
    public int CustomerId { get; set; } = 1234;

    /// <summary>
    /// Gets or sets the full name of the customer.
    /// </summary>
    [MaxLength(10)]
    public string Name { get; set; } = "Jane Johnson";

    /// <summary>
    /// Gets or sets the email address of the customer.
    /// </summary>
    public string Email { get; set; } = "johnsonj@gmail.com";

    /// <summary>
    /// Gets or sets the phone number of the customer.
    /// </summary>
    public string PhoneNumber { get; set; } = "555-555-5555";

    /// <summary>
    /// Gets or sets the age of the customer.
    /// </summary>
    public int Age { get; set; } = 29;

    /// <summary>
    /// Gets or sets a value indicating whether the customer is active.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Gets or sets the gender of the customer.
    /// </summary>
    public string Gender { get; set; } = "female";

    /// <summary>
    /// Gets or sets the preferred method of contact for the customer.
    /// </summary>
    public string PreferredContactMethod { get; set; } = "email";

    /// <summary>
    /// Gets or sets the birth date of the customer.
    /// </summary>
    public DateTime BirthDate { get; set; } = DateTime.Now.AddYears(-29).AddMonths(3).AddDays(9);
}

