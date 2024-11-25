### [RizzyUI](RizzyUI 'RizzyUI').[TypographyBase](RizzyUI.TypographyBase 'RizzyUI.TypographyBase')

## TypographyBase.GetTextTransformCss(TextTransform) Method

Gets the Tailwind CSS class associated with the specified text transform.

```csharp
public static string GetTextTransformCss(RizzyUI.TextTransform transform);
```
#### Parameters

<a name='RizzyUI.TypographyBase.GetTextTransformCss(RizzyUI.TextTransform).transform'></a>

`transform` [RizzyUI.TextTransform](https://docs.microsoft.com/en-us/dotnet/api/RizzyUI.TextTransform 'RizzyUI.TextTransform')

The [RizzyUI.TypographyBase.TextTransform](https://docs.microsoft.com/en-us/dotnet/api/RizzyUI.TypographyBase.TextTransform 'RizzyUI.TypographyBase.TextTransform') enum value representing the desired text transformation.

#### Returns
[System.String](https://docs.microsoft.com/en-us/dotnet/api/System.String 'System.String')  
A string containing the Tailwind CSS class for the specified text transform.

#### Exceptions

[System.ArgumentOutOfRangeException](https://docs.microsoft.com/en-us/dotnet/api/System.ArgumentOutOfRangeException 'System.ArgumentOutOfRangeException')  
Thrown when an invalid [RizzyUI.TypographyBase.TextTransform](https://docs.microsoft.com/en-us/dotnet/api/RizzyUI.TypographyBase.TextTransform 'RizzyUI.TypographyBase.TextTransform') value is provided.