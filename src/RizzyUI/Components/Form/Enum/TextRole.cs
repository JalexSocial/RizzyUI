namespace RizzyUI;

/// <summary>
///     Specifies the semantic role of a text input field within a form. This enumeration determines the behavior and
///     styling
///     applied to text inputs, such as standard text, password, email, URL, search, or telephone inputs.
/// </summary>
public enum TextRole
{
	/// <summary>
	///     Represents a standard text input field.
	/// </summary>
	Text,

	/// <summary>
	///     Represents a password input field, which obscures user input for privacy.
	/// </summary>
	Password,

	/// <summary>
	///     Represents an email input field, optimized for entering email addresses.
	/// </summary>
	Email,

	/// <summary>
	///     Represents a URL input field, optimized for entering web addresses.
	/// </summary>
	Url,

	/// <summary>
	///     Represents a search input field, typically styled for search functionality.
	/// </summary>
	Search,

	/// <summary>
	///     Represents a telephone input field, optimized for entering phone numbers.
	/// </summary>
	Tel
}