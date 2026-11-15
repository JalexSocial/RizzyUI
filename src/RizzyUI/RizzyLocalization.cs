
using System.Resources;
using Microsoft.Extensions.Localization; // Added for xmldoc reference

// The library has no culture-neutral RizzyLocalization.resx; English lives in the "en" satellite.
// Declaring English as the neutral language makes the resource manager fall back to it, so a
// key missing from a partial translation (de, es, fr, pt) or a culture without its own file
// renders the English text instead of the raw resource key.
[assembly: NeutralResourcesLanguage("en", UltimateResourceFallbackLocation.Satellite)]

namespace RizzyUI;

/// <summary>
/// An empty marker class used by <see cref="IStringLocalizer{T}"/>
/// to identify and locate RizzyUI's embedded resource files (.resx) named following the
/// convention `RizzyLocalization.{culture}.resx`.
/// This allows the library to manage its own default translations independently.
/// </summary>
/// <remarks>
/// This class is intentionally left empty. Its sole purpose is to serve as a type marker
/// for the localization system. Resource files should be named matching this class name
/// (e.g., RizzyLocalization.resx, RizzyLocalization.es.resx).
/// </remarks>
public sealed class RizzyLocalization
{
    // Intentionally empty.
}