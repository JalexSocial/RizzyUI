using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI;

/// <summary>
/// Evaluates the form using data annotations on page load
/// </summary>
public class InitialValidator : ComponentBase
{
    // Get the EditContext from the parent component (EditForm)
    [CascadingParameter]
    private EditContext? CurrentEditContext { get; set; }

    /// <summary>
    /// Validate the current EditContext, if exists
    /// </summary>
    protected override void OnParametersSet()
    {
        CurrentEditContext?.Validate();
    }
}
