using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;

namespace RizzyUI;

/// <summary>
/// Base class for input components, handling value binding and additional attributes.
/// </summary>
/// <typeparam name="TValue">Type of the bound value.</typeparam>
public class InputBase<TValue> : RizzyComponent
{
    /// <summary>
    /// Expression identifying the model property to bind.
    /// </summary>
    [Parameter, EditorRequired]
    public required Expression<Func<TValue>> For { get; set; }

    /// <summary>
    /// Retrieves a parameter value from additional attributes with type safety.
    /// </summary>
    /// <param name="parameterName">The attribute key.</param>
    /// <param name="defaultValue">Default value if not found or type mismatch.</param>
    /// <returns>
    /// The attribute value cast to <typeparamref name="TValue"/>, or <paramref name="defaultValue"/>.
    /// </returns>
    protected TValue GetParameterValue(string parameterName, TValue defaultValue)
    {
        if (AdditionalAttributes is not null &&
            AdditionalAttributes.TryGetValue(parameterName, out var attributeValue) &&
            attributeValue is TValue typedValue)
        {
            return typedValue;
        }

        return defaultValue;
    }
}
