using System;
using System.ComponentModel;

namespace RizzyUI;

[AttributeUsage(AttributeTargets.Assembly, AllowMultiple = false)]
[EditorBrowsable(EditorBrowsableState.Never)]
public sealed class AssemblyCollocatedJSAttribute : Attribute
{
	public string CallerFileNamePathPrefix { get; }
	public string StaticWebAssetBasePath { get; }

	public AssemblyCollocatedJSAttribute(string callerFileNamePathPrefix, string staticWebAssetBasePath)
	{
		CallerFileNamePathPrefix = callerFileNamePathPrefix;
		StaticWebAssetBasePath = staticWebAssetBasePath;
	}

	// Add this overloaded constructor
	public AssemblyCollocatedJSAttribute(string callerFileNamePathPrefix)
		: this(callerFileNamePathPrefix, string.Empty)
	{
	}
}