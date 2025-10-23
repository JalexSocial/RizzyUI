
using System;
using System.ComponentModel;

namespace RizzyUI;

/// <summary>
/// An assembly-level attribute that provides necessary path information for the Alpine Code-Behind feature.
/// This attribute is emitted by RizzyUI's build tasks and should not be used directly by consumers.
/// </summary>
[AttributeUsage(AttributeTargets.Assembly, AllowMultiple = false)]
[EditorBrowsable(EditorBrowsableState.Never)]
public sealed class AssemblyRzAlpineCodeBehindAttribute : Attribute
{
    /// <summary>
    /// Gets the normalized path prefix of the project directory, used to calculate relative paths for co-located JavaScript files.
    /// </summary>
	public string CallerFileNamePathPrefix { get; }
    
    /// <summary>
    /// Gets the static web asset base path for the project (e.g., "_content/MyProject"), used to construct correct web-accessible URLs for JavaScript modules.
    /// </summary>
	public string StaticWebAssetBasePath { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="AssemblyRzAlpineCodeBehindAttribute"/> class with a caller file name path prefix and a static web asset base path.
    /// </summary>
    /// <param name="callerFileNamePathPrefix">The normalized path prefix of the project directory.</param>
    /// <param name="staticWebAssetBasePath">The static web asset base path for the project.</param>
	public AssemblyRzAlpineCodeBehindAttribute(string callerFileNamePathPrefix, string staticWebAssetBasePath)
	{
		CallerFileNamePathPrefix = callerFileNamePathPrefix;
		StaticWebAssetBasePath = staticWebAssetBasePath;
	}

	/// <summary>
    /// Initializes a new instance of the <see cref="AssemblyRzAlpineCodeBehindAttribute"/> class with only a caller file name path prefix.
    /// </summary>
    /// <param name="callerFileNamePathPrefix">The normalized path prefix of the project directory.</param>
	public AssemblyRzAlpineCodeBehindAttribute(string callerFileNamePathPrefix)
		: this(callerFileNamePathPrefix, string.Empty)
	{
	}
}