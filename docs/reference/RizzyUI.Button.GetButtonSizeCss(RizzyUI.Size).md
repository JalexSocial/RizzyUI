### [RizzyUI](RizzyUI 'RizzyUI').[Button](RizzyUI.Button 'RizzyUI.Button')

## Button.GetButtonSizeCss(Size) Method

Gets the CSS classes associated with the specified size for buttons.

```csharp
public static string GetButtonSizeCss(RizzyUI.Size size);
```
#### Parameters

<a name='RizzyUI.Button.GetButtonSizeCss(RizzyUI.Size).size'></a>

`size` [RizzyUI.Size](https://docs.microsoft.com/en-us/dotnet/api/RizzyUI.Size 'RizzyUI.Size')

The [Size](RizzyUI.Button.Size 'RizzyUI.Button.Size') enum value representing the button size.

#### Returns
[System.String](https://docs.microsoft.com/en-us/dotnet/api/System.String 'System.String')  
A string containing the CSS classes for the specified button size.

#### Exceptions

[System.ArgumentOutOfRangeException](https://docs.microsoft.com/en-us/dotnet/api/System.ArgumentOutOfRangeException 'System.ArgumentOutOfRangeException')  
Thrown when an invalid [Size](RizzyUI.Button.Size 'RizzyUI.Button.Size') value is provided.