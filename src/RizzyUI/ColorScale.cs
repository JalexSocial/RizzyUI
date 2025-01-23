namespace RizzyUI;

/// <summary>
/// Abstract base class for a Tailwind-like color scale.
/// Defines properties for each shade of color (L50, L100, ..., L950)
/// as <see cref="Oklch"/>.
/// </summary>
public abstract class ColorScale
{
    /// <summary>Shade 50</summary>
    public abstract Oklch L50 { get; }
    /// <summary>Shade 100</summary>
    public abstract Oklch L100 { get; }
    /// <summary>Shade 200</summary>
    public abstract Oklch L200 { get; }
    /// <summary>Shade 300</summary>
    public abstract Oklch L300 { get; }
    /// <summary>Shade 400</summary>
    public abstract Oklch L400 { get; }
    /// <summary>Shade 500</summary>
    public abstract Oklch L500 { get; }
    /// <summary>Shade 600</summary>
    public abstract Oklch L600 { get; }
    /// <summary>Shade 700</summary>
    public abstract Oklch L700 { get; }
    /// <summary>Shade 800</summary>
    public abstract Oklch L800 { get; }
    /// <summary>Shade 900</summary>
    public abstract Oklch L900 { get; }
    /// <summary>Shade 950</summary>
    public abstract Oklch L950 { get; }

    private Dictionary<string, Oklch>? _shadeDictionary;

    /// <summary>
    /// Indexer to access shades by string key ("50", "100", etc.).
    /// </summary>
    public Oklch this[string shade]
    {
        get
        {
            _shadeDictionary ??= new Dictionary<string, Oklch>()
            {
                { "50", L50 },
                { "100", L100 },
                { "200", L200 },
                { "300", L300 },
                { "400", L400 },
                { "500", L500 },
                { "600", L600 },
                { "700", L700 },
                { "800", L800 },
                { "900", L900 },
                { "950", L950 }
            };

            if (_shadeDictionary.TryGetValue(shade, out var color))
                return color;

            throw new ArgumentOutOfRangeException(nameof(shade), $"Invalid shade key: {shade}");
        }
    }
}

/// <summary>Red color palette</summary>
public sealed class Red : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.971f, 0.013f, 17.38f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.936f, 0.032f, 17.717f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.885f, 0.062f, 18.334f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.808f, 0.114f, 19.571f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.704f, 0.191f, 22.216f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.637f, 0.237f, 25.331f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.577f, 0.245f, 27.325f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.505f, 0.213f, 27.518f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.444f, 0.177f, 26.899f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.396f, 0.141f, 25.723f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.258f, 0.092f, 26.042f);
}

/// <summary>Orange color palette</summary>
public sealed class Orange : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.98f, 0.016f, 73.684f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.954f, 0.038f, 75.164f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.901f, 0.076f, 70.697f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.837f, 0.128f, 66.29f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.75f, 0.183f, 55.934f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.705f, 0.213f, 47.604f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.646f, 0.222f, 41.116f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.553f, 0.195f, 38.402f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.47f, 0.157f, 37.304f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.408f, 0.123f, 38.172f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.266f, 0.079f, 36.259f);
}

/// <summary>Amber color palette</summary>
public sealed class Amber : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.987f, 0.022f, 95.277f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.962f, 0.059f, 95.617f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.924f, 0.12f, 95.746f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.879f, 0.169f, 91.605f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.828f, 0.189f, 84.429f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.769f, 0.188f, 70.08f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.666f, 0.179f, 58.318f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.555f, 0.163f, 48.998f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.473f, 0.137f, 46.201f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.414f, 0.112f, 45.904f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.279f, 0.077f, 45.635f);
}

/// <summary>Yellow color palette</summary>
public sealed class Yellow : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.987f, 0.026f, 102.212f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.973f, 0.071f, 103.193f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.945f, 0.129f, 101.54f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.905f, 0.182f, 98.111f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.852f, 0.199f, 91.936f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.795f, 0.184f, 86.047f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.681f, 0.162f, 75.834f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.554f, 0.135f, 66.442f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.476f, 0.114f, 61.907f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.421f, 0.095f, 57.708f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.286f, 0.066f, 53.813f);
}

/// <summary>Lime color palette</summary>
public sealed class Lime : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.986f, 0.031f, 120.757f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.967f, 0.067f, 122.328f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.938f, 0.127f, 124.321f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.897f, 0.196f, 126.665f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.841f, 0.238f, 128.85f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.768f, 0.233f, 130.85f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.648f, 0.2f, 131.684f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.532f, 0.157f, 131.589f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.453f, 0.124f, 130.933f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.405f, 0.101f, 131.063f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.274f, 0.072f, 132.109f);
}

/// <summary>Green color palette</summary>
public sealed class Green : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.982f, 0.018f, 155.826f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.962f, 0.044f, 156.743f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.925f, 0.084f, 155.995f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.871f, 0.15f, 154.449f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.792f, 0.209f, 151.711f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.723f, 0.219f, 149.579f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.627f, 0.194f, 149.214f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.527f, 0.154f, 150.069f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.448f, 0.119f, 151.328f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.393f, 0.095f, 152.535f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.266f, 0.065f, 152.934f);
}

/// <summary>Emerald color palette</summary>
public sealed class Emerald : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.979f, 0.021f, 166.113f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.95f, 0.052f, 163.051f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.905f, 0.093f, 164.15f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.845f, 0.143f, 164.978f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.765f, 0.177f, 163.223f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.696f, 0.17f, 162.48f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.596f, 0.145f, 163.225f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.508f, 0.118f, 165.612f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.432f, 0.095f, 166.913f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.378f, 0.077f, 168.94f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.262f, 0.051f, 172.552f);
}

/// <summary>Teal color palette</summary>
public sealed class Teal : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.984f, 0.014f, 180.72f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.953f, 0.051f, 180.801f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.91f, 0.096f, 180.426f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.855f, 0.138f, 181.071f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.777f, 0.152f, 181.912f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.704f, 0.14f, 182.503f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.6f, 0.118f, 184.704f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.511f, 0.096f, 186.391f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.437f, 0.078f, 188.216f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.386f, 0.063f, 188.416f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.277f, 0.046f, 192.524f);
}

/// <summary>Cyan color palette</summary>
public sealed class Cyan : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.984f, 0.019f, 200.873f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.956f, 0.045f, 203.388f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.917f, 0.08f, 205.041f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.865f, 0.127f, 207.078f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.789f, 0.154f, 211.53f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.715f, 0.143f, 215.221f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.609f, 0.126f, 221.723f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.52f, 0.105f, 223.128f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.45f, 0.085f, 224.283f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.398f, 0.07f, 227.392f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.302f, 0.056f, 229.695f);
}

/// <summary>Sky color palette</summary>
public sealed class Sky : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.977f, 0.013f, 236.62f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.951f, 0.026f, 236.824f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.901f, 0.058f, 230.902f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.828f, 0.111f, 230.318f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.746f, 0.16f, 232.661f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.685f, 0.169f, 237.323f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.588f, 0.158f, 241.966f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.5f, 0.134f, 242.749f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.443f, 0.11f, 240.79f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.391f, 0.09f, 240.876f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.293f, 0.066f, 243.157f);
}

/// <summary>Blue color palette</summary>
public sealed class Blue : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.97f, 0.014f, 254.604f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.932f, 0.032f, 255.585f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.882f, 0.059f, 254.128f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.809f, 0.105f, 251.813f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.707f, 0.165f, 254.624f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.623f, 0.214f, 259.815f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.546f, 0.245f, 262.881f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.488f, 0.243f, 264.376f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.424f, 0.199f, 265.638f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.379f, 0.146f, 265.522f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.282f, 0.091f, 267.935f);
}

/// <summary>Indigo color palette</summary>
public sealed class Indigo : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.962f, 0.018f, 272.314f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.93f, 0.034f, 272.788f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.87f, 0.065f, 274.039f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.785f, 0.115f, 274.713f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.673f, 0.182f, 276.935f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.585f, 0.233f, 277.117f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.511f, 0.262f, 276.966f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.457f, 0.24f, 277.023f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.398f, 0.195f, 277.366f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.359f, 0.144f, 278.697f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.257f, 0.09f, 281.288f);
}

/// <summary>Violet color palette</summary>
public sealed class Violet : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.969f, 0.016f, 293.756f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.943f, 0.029f, 294.588f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.894f, 0.057f, 293.283f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.811f, 0.111f, 293.571f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.702f, 0.183f, 293.541f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.606f, 0.25f, 292.717f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.541f, 0.281f, 293.009f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.491f, 0.27f, 292.581f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.432f, 0.232f, 292.759f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.38f, 0.189f, 293.745f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.283f, 0.141f, 291.089f);
}

/// <summary>Purple color palette</summary>
public sealed class Purple : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.977f, 0.014f, 308.299f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.946f, 0.033f, 307.174f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.902f, 0.063f, 306.703f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.827f, 0.119f, 306.383f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.714f, 0.203f, 305.504f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.627f, 0.265f, 303.9f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.558f, 0.288f, 302.321f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.496f, 0.265f, 301.924f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.438f, 0.218f, 303.724f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.381f, 0.176f, 304.987f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.291f, 0.149f, 302.717f);
}

/// <summary>Fuchsia color palette</summary>
public sealed class Fuchsia : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.977f, 0.017f, 320.058f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.952f, 0.037f, 318.852f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.903f, 0.076f, 319.62f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.833f, 0.145f, 321.434f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.74f, 0.238f, 322.16f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.667f, 0.295f, 322.15f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.591f, 0.293f, 322.896f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.518f, 0.253f, 323.949f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.452f, 0.211f, 324.591f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.401f, 0.17f, 325.612f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.293f, 0.136f, 325.661f);
}

/// <summary>Pink color palette</summary>
public sealed class Pink : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.971f, 0.014f, 343.198f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.948f, 0.028f, 342.258f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.899f, 0.061f, 343.231f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.823f, 0.12f, 346.018f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.718f, 0.202f, 349.761f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.656f, 0.241f, 354.308f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.592f, 0.249f, 0.584f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.525f, 0.223f, 3.958f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.459f, 0.187f, 3.815f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.408f, 0.153f, 2.432f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.284f, 0.109f, 3.907f);
}

/// <summary>Rose color palette</summary>
public sealed class Rose : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.969f, 0.015f, 12.422f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.941f, 0.03f, 12.58f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.892f, 0.058f, 10.001f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.81f, 0.117f, 11.638f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.712f, 0.194f, 13.428f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.645f, 0.246f, 16.439f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.586f, 0.253f, 17.585f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.514f, 0.222f, 16.935f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.455f, 0.188f, 13.697f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.41f, 0.159f, 10.272f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.271f, 0.105f, 12.094f);
}

/// <summary>Slate color palette</summary>
public sealed class Slate : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.984f, 0.003f, 247.858f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.968f, 0.007f, 247.896f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.929f, 0.013f, 255.508f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.869f, 0.022f, 252.894f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.704f, 0.04f, 256.788f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.554f, 0.046f, 257.417f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.446f, 0.043f, 257.281f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.372f, 0.044f, 257.287f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.279f, 0.041f, 260.031f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.208f, 0.042f, 265.755f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.129f, 0.042f, 264.695f);
}

/// <summary>Gray color palette</summary>
public sealed class Gray : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.985f, 0.002f, 247.839f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.967f, 0.003f, 264.542f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.928f, 0.006f, 264.531f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.872f, 0.01f, 258.338f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.707f, 0.022f, 261.325f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.551f, 0.027f, 264.364f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.446f, 0.03f, 256.802f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.373f, 0.034f, 259.733f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.278f, 0.033f, 256.848f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.21f, 0.034f, 264.665f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.13f, 0.028f, 261.692f);
}

/// <summary>Zinc color palette</summary>
public sealed class Zinc : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.985f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.967f, 0.001f, 286.375f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.92f, 0.004f, 286.32f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.871f, 0.006f, 286.286f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.705f, 0.015f, 286.067f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.552f, 0.016f, 285.938f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.442f, 0.017f, 285.786f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.37f, 0.013f, 285.805f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.274f, 0.006f, 286.033f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.21f, 0.006f, 285.885f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.141f, 0.005f, 285.823f);
}

/// <summary>Neutral color palette</summary>
public sealed class Neutral : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.985f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.97f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.922f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.87f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.708f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.556f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.439f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.371f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.269f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.205f, 0f, 0f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.145f, 0f, 0f);
}

/// <summary>Stone color palette</summary>
public sealed class Stone : ColorScale
{
    /// <inheritdoc/>
    public override Oklch L50 => new(0.985f, 0.001f, 106.423f);
    /// <inheritdoc/>
    public override Oklch L100 => new(0.97f, 0.001f, 106.424f);
    /// <inheritdoc/>
    public override Oklch L200 => new(0.923f, 0.003f, 48.717f);
    /// <inheritdoc/>
    public override Oklch L300 => new(0.869f, 0.005f, 56.366f);
    /// <inheritdoc/>
    public override Oklch L400 => new(0.709f, 0.01f, 56.259f);
    /// <inheritdoc/>
    public override Oklch L500 => new(0.553f, 0.013f, 58.071f);
    /// <inheritdoc/>
    public override Oklch L600 => new(0.444f, 0.011f, 73.639f);
    /// <inheritdoc/>
    public override Oklch L700 => new(0.374f, 0.01f, 67.558f);
    /// <inheritdoc/>
    public override Oklch L800 => new(0.268f, 0.007f, 34.298f);
    /// <inheritdoc/>
    public override Oklch L900 => new(0.216f, 0.006f, 56.043f);
    /// <inheritdoc/>
    public override Oklch L950 => new(0.147f, 0.004f, 49.25f);
}
