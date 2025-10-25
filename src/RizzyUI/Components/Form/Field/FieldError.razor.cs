
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying validation error messages for a form field.
/// </summary>
public partial class FieldError : RzComponent<FieldError.Slots>
{
    /// <summary>
    /// Defines the default styling for the FieldError component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-destructive text-sm font-normal"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the error message container.
    /// If provided, this will be used instead of processing the `Errors` collection.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a collection of error messages to display.
    /// If more than one unique error message is provided, they will be rendered as an unordered list.
    /// </summary>
    [Parameter]
    public IEnumerable<string>? Errors { get; set; }

    /// <summary>
    /// Gets the final renderable content for the error message(s).
    /// </summary>
    protected RenderFragment? Content { get; private set; }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        BuildContent();
    }

    private void BuildContent()
    {
        if (ChildContent is not null)
        {
            Content = ChildContent;
            return;
        }

        var uniqueErrors = Errors?.Where(e => !string.IsNullOrWhiteSpace(e)).Distinct().ToList();

        if (uniqueErrors is null || uniqueErrors.Count == 0)
        {
            Content = null;
            return;
        }

        if (uniqueErrors.Count == 1)
        {
            Content = builder => builder.AddContent(0, uniqueErrors[0]);
        }
        else
        {
            Content = builder =>
            {
                builder.OpenElement(0, "ul");
                builder.AddAttribute(1, "class", "ml-4 flex list-disc flex-col gap-1");
                for (int i = 0; i < uniqueErrors.Count; i++)
                {
                    builder.OpenElement(2, "li");
                    builder.AddContent(3, uniqueErrors[i]);
                    builder.CloseElement();
                }
                builder.CloseElement();
            };
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.FieldError;

    /// <summary>
    /// Defines the slots available for styling in the FieldError component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("field-error")]
        public string? Base { get; set; }
    }
}