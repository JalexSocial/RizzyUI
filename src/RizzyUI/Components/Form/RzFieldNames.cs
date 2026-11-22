using System.Linq.Expressions;
using System.Reflection;
using Rizzy.Components.Form.Helpers;

namespace RizzyUI;

/// <summary>
/// The form field name for a bound expression, as Blazor's own inputs compute it: the model path
/// (<c>Model.Country</c>, <c>Model.Attendees[0].Name</c>) (decision D-28, Summit SF-009).
/// </summary>
/// <remarks>
/// Blazor's inputs also apply the prefix that <c>Editor&lt;T&gt;</c> cascades; that type is internal to
/// ASP.NET Core, so components inside an <c>Editor&lt;T&gt;</c> set <c>Name</c> themselves.
/// </remarks>
internal static class RzFieldNames
{
    internal static string For(LambdaExpression expression) => ExpressionFormatter.FormatLambda(expression);

    /// <summary>
    /// The display name of a bound expression, as <c>FieldLabel</c> infers it: the member's
    /// <c>[Display(Name)]</c>, <c>[DisplayName]</c>, or its name.
    /// </summary>
    internal static string DisplayNameFor(LambdaExpression? expression)
    {
        if (expression?.Body is not MemberExpression member)
            return string.Empty;
        return member.Member.GetCustomAttribute<System.ComponentModel.DataAnnotations.DisplayAttribute>(true)?.GetName()
            ?? member.Member.GetCustomAttribute<System.ComponentModel.DisplayNameAttribute>(true)?.DisplayName
            ?? member.Member.Name;
    }
}
