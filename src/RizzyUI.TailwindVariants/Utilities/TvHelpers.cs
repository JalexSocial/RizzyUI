using System.Linq.Expressions;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// Helper methods for working with slot and variant accessor expressions.
/// </summary>
internal static class TvHelpers
{
    /// <summary>
    /// Extracts the slot name from a slot accessor expression.
    /// </summary>
    /// <typeparam name="TSlots">The type representing the slots.</typeparam>
    /// <param name="accessor">An expression selecting a slot from the slots type (e.g. <c>s => s.Base</c>).</param>
    /// <returns>The name of the slot as a string (e.g. "Base").</returns>
    /// <exception cref="ArgumentException">
    /// Thrown if the expression is not a simple member access (e.g. <c>s => s.Base</c>).
    /// </exception>
    /// <example>
    /// <code>
    /// var slotName = GetSlot&lt;MySlots&gt;(s => s.Title);
    /// // Returns: "Title"
    /// </code>
    /// </example>
    public static string GetSlot<TSlots>(Expression<SlotAccessor<TSlots>> accessor)
        where TSlots : ISlots, new()
    {
        var memberName = ExtractMemberName(accessor, nameof(accessor), "slot");
        return TSlots.GetName(memberName);
    }

    /// <summary>
    /// Extracts the variant property name from a variant accessor expression.
    /// </summary>
    /// <typeparam name="TOwner">The type that owns the variant property.</typeparam>
    /// <param name="accessor">An expression selecting a variant property from the owner type (e.g. <c>c => c.Size</c>).</param>
    /// <returns>The name of the variant property as a string (e.g. "Size").</returns>
    /// <exception cref="ArgumentException">
    /// Thrown if the expression is not a simple member access (e.g. <c>c => c.Size</c>).
    /// </exception>
    /// <example>
    /// <code>
    /// var variantName = GetVariant&lt;MyComponent&gt;(c => c.Size);
    /// // Returns: "Size"
    /// </code>
    /// </example>
    public static string GetVariant<TOwner>(Expression<VariantAccessor<TOwner>> accessor)
    {
        return ExtractMemberName(accessor, nameof(accessor), "variant");
    }

    /// <summary>
    /// Extracts the member name from a lambda expression that accesses a property or field.
    /// Handles both direct member access (e.g. <c>x => x.Property</c>) and conversions (e.g. <c>x => (object)x.Property</c>).
    /// </summary>
    /// <param name="expression">The lambda expression to extract the member name from.</param>
    /// <param name="parameterName">The name of the parameter for error reporting.</param>
    /// <param name="accessorType">The type of accessor (e.g. "slot", "variant") for error messages.</param>
    /// <returns>The name of the accessed member.</returns>
    /// <exception cref="ArgumentException">
    /// Thrown if the expression is not a simple member access.
    /// </exception>
    private static string ExtractMemberName(
        LambdaExpression expression,
        string parameterName,
        string accessorType)
    {
        // Direct member access: x => x.Property
        if (expression.Body is MemberExpression memberExpr)
        {
            return memberExpr.Member.Name;
        }

        // Handle type conversions: x => (object)x.Property
        if (expression.Body is UnaryExpression unary && unary.Operand is MemberExpression member)
        {
            return member.Member.Name;
        }

        throw new ArgumentException(
            $"Invalid {accessorType} accessor expression: '{expression}'. " +
            $"Expression must be a simple member access (e.g. 'x => x.PropertyName').",
            parameterName);
    }
}