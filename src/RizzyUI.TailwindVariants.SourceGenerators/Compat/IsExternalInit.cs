// IsExternalInit.cs
// Shim per compilare con C#9+ features su netstandard2.0
namespace System.Runtime.CompilerServices
{
    // semplice tipo marker richiesto dal compilatore per init-only setters / record
#pragma warning disable CS1591 // Manca il commento XML per il tipo o il membro visibile pubblicamente

    public static class IsExternalInit
    { }

#pragma warning restore CS1591 // Manca il commento XML per il tipo o il membro visibile pubblicamente
}