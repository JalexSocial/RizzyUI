
using System;
using System.ComponentModel;

namespace RizzyUI;

[AttributeUsage(AttributeTargets.Assembly, AllowMultiple = false)]
[EditorBrowsable(EditorBrowsableState.Never)]
public sealed class AssemblyRzAlpineCodeBehindAttribute : Attribute
{
	public string CallerFileNamePathPrefix { get; }
	public string StaticWebAssetBasePath { get; }

	public AssemblyRzAlpineCodeBehindAttribute(string callerFileNamePathPrefix, string staticWebAssetBasePath)
	{
		CallerFileNamePathPrefix = callerFileNamePathPrefix;
		StaticWebAssetBasePath = staticWebAssetBasePath;
	}

	// Add this overloaded constructor
	public AssemblyRzAlpineCodeBehindAttribute(string callerFileNamePathPrefix)
		: this(callerFileNamePathPrefix, string.Empty)
	{
	}
}