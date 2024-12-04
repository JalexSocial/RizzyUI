#### [RizzyUI](index 'index')
### [RizzyUI.Utility](RizzyUI.Utility 'RizzyUI.Utility').[IdGenerator](RizzyUI.Utility.IdGenerator 'RizzyUI.Utility.IdGenerator')

## IdGenerator.UniqueId(string) Method

Generates a unique ID with an optional prefix.

```csharp
public static string UniqueId(string prefix);
```
#### Parameters

<a name='RizzyUI.Utility.IdGenerator.UniqueId(string).prefix'></a>

`prefix` [System.String](https://docs.microsoft.com/en-us/dotnet/api/System.String 'System.String')

An optional string to prefix the unique ID.  
If null or whitespace, "id" is used as the default prefix.

#### Returns
[System.String](https://docs.microsoft.com/en-us/dotnet/api/System.String 'System.String')  
A unique ID string composed of the prefix and a Base62 encoded unique number.