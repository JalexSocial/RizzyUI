namespace RizzyUI;

/// <summary> Provides default styles for RzEmbeddedPreview. </summary>
public class DefaultRzEmbeddedPreviewStyles : RzStylesBase.RzEmbeddedPreviewStylesBase
{
    /// <inheritdoc />
    public DefaultRzEmbeddedPreviewStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "w-full";

    /// <inheritdoc />
    public override string IFrame => "w-full transition-all min-h-28";
}