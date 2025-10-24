
using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Base class for input components, handling value binding, additional attributes, and integration with the TailwindVariants.NET styling system.
/// </summary>
/// <typeparam name="TValue">The type of the bound value for the input component.</typeparam>
/// <typeparam name="TSlots">The type of the slots class that defines the styleable parts of the component, implementing <see cref="ISlots"/>.</typeparam>
public abstract class InputBase<TValue, TSlots> : RzComponent<TSlots>
    where TSlots : ISlots, new()
{
    /// <summary>
    ///     Expression identifying the model property to bind.
    /// </summary>
    [Parameter]
    [EditorRequired]
    public required Expression<Func<TValue>> For { get; set; }

    /// <summary>
    ///     Retrieves a parameter value from additional attributes with type safety.
    /// </summary>
    /// <param name="parameterName">The attribute key.</param>
    /// <param name="defaultValue">Default value if not found or type mismatch.</param>
    /// <returns>
    ///     The attribute value cast to <typeparamref name="T" />, or <paramref name="defaultValue" />.
    /// </returns>
    protected T GetParameterValue<T>(string parameterName, T defaultValue)
    {
        if (AdditionalAttributes is not null &&
            AdditionalAttributes.TryGetValue(parameterName, out var attributeValue) &&
            attributeValue is T typedValue)
            return typedValue;

        return defaultValue;
    }
}