namespace RizzyUI.Components.Form.RzDateEdit.Styling;

/// <summary> Provides default styles for RzDateEdit. </summary>
public class DefaultRzDateEditStyles : RzStylesBase.RzDateEditStylesBase // Not sealed
{
	public DefaultRzDateEditStyles(RzTheme theme) : base(theme) { }

	/// <inheritdoc/>
	public override string Container => "w-full";
	/// <inheritdoc/>
	public override string InputWrapper => "relative";
	/// <inheritdoc/>
	public override string PrependElement => $"pointer-events-none absolute inset-y-0 left-0 my-px ml-px flex items-center rounded-l-theme border-r border-outline bg-surface-alt px-3 text-on-surface dark:border-outline dark:bg-surface-alt dark:text-on-surface"; // Use semantic names
	/// <inheritdoc/>
	public override string PrependIconContainer => "text-xl";
	/// <inheritdoc/>
	public override string Input => $"block w-full rounded-theme border border-outline px-3 py-2 leading-6 placeholder-on-surface-muted focus:border-primary focus:ring focus:ring-primary/50 dark:border-outline dark:bg-surface-alt dark:placeholder-on-surface-muted dark:focus:border-primary flatpickr-input"; // Use semantic names, adjusted focus ring
}