using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

/// <summary>
/// Abstract base class for a Tailwind color scale.
/// Defines properties for each shade of color (L50, L100, ..., L950)
/// and provides a dictionary-like indexer for shade access.
/// </summary>
public abstract class ColorScale
{
    /// <summary>Shade 50</summary>
    public abstract RgbColor L50 { get; }
    /// <summary>Shade 100</summary>
    public abstract RgbColor L100 { get; }
    /// <summary>Shade 200</summary>
    public abstract RgbColor L200 { get; }
    /// <summary>Shade 300</summary>
    public abstract RgbColor L300 { get; }
    /// <summary>Shade 400</summary>
    public abstract RgbColor L400 { get; }
    /// <summary>Shade 500</summary>
    public abstract RgbColor L500 { get; }
    /// <summary>Shade 600</summary>
    public abstract RgbColor L600 { get; }
    /// <summary>Shade 700</summary>
    public abstract RgbColor L700 { get; }
    /// <summary>Shade 800</summary>
    public abstract RgbColor L800 { get; }
    /// <summary>Shade 900</summary>
    public abstract RgbColor L900 { get; }
    /// <summary>Shade 950</summary>
    public abstract RgbColor L950 { get; }

    private Dictionary<string, RgbColor>? _shadeDictionary;

    /// <summary>
    /// Indexer to access shades by string key ("50", "100", etc.).
    /// </summary>
    /// <param name="shade">The shade key as a string (e.g. "50", "100").</param>
    /// <returns>The corresponding <see cref="RgbColor"/>.</returns>
    public RgbColor this[string shade]
    {
        get
        {
            _shadeDictionary ??= new Dictionary<string, RgbColor>()
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
            {
                return color;
            }

            throw new ArgumentOutOfRangeException(nameof(shade), $"Invalid shade key: {shade}");
        }
    }
}

/// <summary>Red color palette</summary>
public sealed class Red : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(254, 242, 242);
    /// <inheritdoc/>
    public override RgbColor L100 => new(254, 226, 226);
    /// <inheritdoc/>
    public override RgbColor L200 => new(254, 202, 202);
    /// <inheritdoc/>
    public override RgbColor L300 => new(252, 165, 165);
    /// <inheritdoc/>
    public override RgbColor L400 => new(248, 113, 113);
    /// <inheritdoc/>
    public override RgbColor L500 => new(239, 68, 68);
    /// <inheritdoc/>
    public override RgbColor L600 => new(220, 38, 38);
    /// <inheritdoc/>
    public override RgbColor L700 => new(185, 28, 28);
    /// <inheritdoc/>
    public override RgbColor L800 => new(153, 27, 27);
    /// <inheritdoc/>
    public override RgbColor L900 => new(127, 29, 29);
    /// <inheritdoc/>
    public override RgbColor L950 => new(69, 10, 10);
}

/// <summary>Orange color palette</summary>
public sealed class Orange : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(255, 247, 237);
    /// <inheritdoc/>
    public override RgbColor L100 => new(255, 237, 213);
    /// <inheritdoc/>
    public override RgbColor L200 => new(254, 215, 170);
    /// <inheritdoc/>
    public override RgbColor L300 => new(253, 186, 116);
    /// <inheritdoc/>
    public override RgbColor L400 => new(251, 146, 60);
    /// <inheritdoc/>
    public override RgbColor L500 => new(249, 115, 22);
    /// <inheritdoc/>
    public override RgbColor L600 => new(234, 88, 12);
    /// <inheritdoc/>
    public override RgbColor L700 => new(194, 65, 12);
    /// <inheritdoc/>
    public override RgbColor L800 => new(154, 52, 18);
    /// <inheritdoc/>
    public override RgbColor L900 => new(124, 45, 18);
    /// <inheritdoc/>
    public override RgbColor L950 => new(67, 20, 7);
}

/// <summary>Amber color palette</summary>
public sealed class Amber : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(255, 251, 235);
    /// <inheritdoc/>
    public override RgbColor L100 => new(254, 243, 199);
    /// <inheritdoc/>
    public override RgbColor L200 => new(253, 230, 138);
    /// <inheritdoc/>
    public override RgbColor L300 => new(252, 211, 77);
    /// <inheritdoc/>
    public override RgbColor L400 => new(251, 191, 36);
    /// <inheritdoc/>
    public override RgbColor L500 => new(245, 158, 11);
    /// <inheritdoc/>
    public override RgbColor L600 => new(217, 119, 6);
    /// <inheritdoc/>
    public override RgbColor L700 => new(180, 83, 9);
    /// <inheritdoc/>
    public override RgbColor L800 => new(146, 64, 14);
    /// <inheritdoc/>
    public override RgbColor L900 => new(120, 53, 15);
    /// <inheritdoc/>
    public override RgbColor L950 => new(69, 26, 3);
}

/// <summary>Yellow color palette</summary>
public sealed class Yellow : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(254, 252, 232);
    /// <inheritdoc/>
    public override RgbColor L100 => new(254, 249, 195);
    /// <inheritdoc/>
    public override RgbColor L200 => new(254, 240, 138);
    /// <inheritdoc/>
    public override RgbColor L300 => new(253, 224, 71);
    /// <inheritdoc/>
    public override RgbColor L400 => new(250, 204, 21);
    /// <inheritdoc/>
    public override RgbColor L500 => new(234, 179, 8);
    /// <inheritdoc/>
    public override RgbColor L600 => new(202, 138, 4);
    /// <inheritdoc/>
    public override RgbColor L700 => new(161, 98, 7);
    /// <inheritdoc/>
    public override RgbColor L800 => new(133, 77, 14);
    /// <inheritdoc/>
    public override RgbColor L900 => new(113, 63, 18);
    /// <inheritdoc/>
    public override RgbColor L950 => new(66, 32, 6);
}

/// <summary>Lime color palette</summary>
public sealed class Lime : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(247, 254, 231);
    /// <inheritdoc/>
    public override RgbColor L100 => new(236, 252, 203);
    /// <inheritdoc/>
    public override RgbColor L200 => new(217, 249, 157);
    /// <inheritdoc/>
    public override RgbColor L300 => new(190, 242, 100);
    /// <inheritdoc/>
    public override RgbColor L400 => new(163, 230, 53);
    /// <inheritdoc/>
    public override RgbColor L500 => new(132, 204, 22);
    /// <inheritdoc/>
    public override RgbColor L600 => new(101, 163, 13);
    /// <inheritdoc/>
    public override RgbColor L700 => new(77, 124, 15);
    /// <inheritdoc/>
    public override RgbColor L800 => new(63, 98, 18);
    /// <inheritdoc/>
    public override RgbColor L900 => new(54, 83, 20);
    /// <inheritdoc/>
    public override RgbColor L950 => new(26, 46, 5);
}

/// <summary>Green color palette</summary>
public sealed class Green : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(240, 253, 244);
    /// <inheritdoc/>
    public override RgbColor L100 => new(220, 252, 231);
    /// <inheritdoc/>
    public override RgbColor L200 => new(187, 247, 208);
    /// <inheritdoc/>
    public override RgbColor L300 => new(134, 239, 172);
    /// <inheritdoc/>
    public override RgbColor L400 => new(74, 222, 128);
    /// <inheritdoc/>
    public override RgbColor L500 => new(34, 197, 94);
    /// <inheritdoc/>
    public override RgbColor L600 => new(22, 163, 74);
    /// <inheritdoc/>
    public override RgbColor L700 => new(21, 128, 61);
    /// <inheritdoc/>
    public override RgbColor L800 => new(22, 101, 52);
    /// <inheritdoc/>
    public override RgbColor L900 => new(20, 83, 45);
    /// <inheritdoc/>
    public override RgbColor L950 => new(5, 46, 22);
}

/// <summary>Emerald color palette</summary>
public sealed class Emerald : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(236, 253, 245);
    /// <inheritdoc/>
    public override RgbColor L100 => new(209, 250, 229);
    /// <inheritdoc/>
    public override RgbColor L200 => new(167, 243, 208);
    /// <inheritdoc/>
    public override RgbColor L300 => new(110, 231, 183);
    /// <inheritdoc/>
    public override RgbColor L400 => new(52, 211, 153);
    /// <inheritdoc/>
    public override RgbColor L500 => new(16, 185, 129);
    /// <inheritdoc/>
    public override RgbColor L600 => new(5, 150, 105);
    /// <inheritdoc/>
    public override RgbColor L700 => new(4, 120, 87);
    /// <inheritdoc/>
    public override RgbColor L800 => new(6, 95, 70);
    /// <inheritdoc/>
    public override RgbColor L900 => new(6, 78, 59);
    /// <inheritdoc/>
    public override RgbColor L950 => new(2, 44, 34);
}

/// <summary>Teal color palette</summary>
public sealed class Teal : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(240, 253, 250);
    /// <inheritdoc/>
    public override RgbColor L100 => new(204, 251, 241);
    /// <inheritdoc/>
    public override RgbColor L200 => new(153, 246, 228);
    /// <inheritdoc/>
    public override RgbColor L300 => new(94, 234, 212);
    /// <inheritdoc/>
    public override RgbColor L400 => new(45, 212, 191);
    /// <inheritdoc/>
    public override RgbColor L500 => new(20, 184, 166);
    /// <inheritdoc/>
    public override RgbColor L600 => new(13, 148, 136);
    /// <inheritdoc/>
    public override RgbColor L700 => new(15, 118, 110);
    /// <inheritdoc/>
    public override RgbColor L800 => new(17, 94, 89);
    /// <inheritdoc/>
    public override RgbColor L900 => new(19, 78, 74);
    /// <inheritdoc/>
    public override RgbColor L950 => new(4, 47, 46);
}

/// <summary>Cyan color palette</summary>
public sealed class Cyan : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(236, 254, 255);
    /// <inheritdoc/>
    public override RgbColor L100 => new(207, 250, 254);
    /// <inheritdoc/>
    public override RgbColor L200 => new(165, 243, 252);
    /// <inheritdoc/>
    public override RgbColor L300 => new(103, 232, 249);
    /// <inheritdoc/>
    public override RgbColor L400 => new(34, 211, 238);
    /// <inheritdoc/>
    public override RgbColor L500 => new(6, 182, 212);
    /// <inheritdoc/>
    public override RgbColor L600 => new(8, 145, 178);
    /// <inheritdoc/>
    public override RgbColor L700 => new(14, 116, 144);
    /// <inheritdoc/>
    public override RgbColor L800 => new(21, 94, 117);
    /// <inheritdoc/>
    public override RgbColor L900 => new(22, 78, 99);
    /// <inheritdoc/>
    public override RgbColor L950 => new(8, 51, 68);
}

/// <summary>Sky color palette</summary>
public sealed class Sky : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(240, 249, 255);
    /// <inheritdoc/>
    public override RgbColor L100 => new(224, 242, 254);
    /// <inheritdoc/>
    public override RgbColor L200 => new(186, 230, 253);
    /// <inheritdoc/>
    public override RgbColor L300 => new(125, 211, 252);
    /// <inheritdoc/>
    public override RgbColor L400 => new(56, 189, 248);
    /// <inheritdoc/>
    public override RgbColor L500 => new(14, 165, 233);
    /// <inheritdoc/>
    public override RgbColor L600 => new(2, 132, 199);
    /// <inheritdoc/>
    public override RgbColor L700 => new(3, 105, 161);
    /// <inheritdoc/>
    public override RgbColor L800 => new(7, 89, 133);
    /// <inheritdoc/>
    public override RgbColor L900 => new(12, 74, 110);
    /// <inheritdoc/>
    public override RgbColor L950 => new(8, 47, 73);
}

/// <summary>Blue color palette</summary>
public sealed class Blue : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(239, 246, 255);
    /// <inheritdoc/>
    public override RgbColor L100 => new(219, 234, 254);
    /// <inheritdoc/>
    public override RgbColor L200 => new(191, 219, 254);
    /// <inheritdoc/>
    public override RgbColor L300 => new(147, 197, 253);
    /// <inheritdoc/>
    public override RgbColor L400 => new(96, 165, 250);
    /// <inheritdoc/>
    public override RgbColor L500 => new(59, 130, 246);
    /// <inheritdoc/>
    public override RgbColor L600 => new(37, 99, 235);
    /// <inheritdoc/>
    public override RgbColor L700 => new(29, 78, 216);
    /// <inheritdoc/>
    public override RgbColor L800 => new(30, 64, 175);
    /// <inheritdoc/>
    public override RgbColor L900 => new(30, 58, 138);
    /// <inheritdoc/>
    public override RgbColor L950 => new(23, 37, 84);
}

/// <summary>Indigo color palette</summary>
public sealed class Indigo : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(238, 242, 255);
    /// <inheritdoc/>
    public override RgbColor L100 => new(224, 231, 255);
    /// <inheritdoc/>
    public override RgbColor L200 => new(199, 210, 254);
    /// <inheritdoc/>
    public override RgbColor L300 => new(165, 180, 252);
    /// <inheritdoc/>
    public override RgbColor L400 => new(129, 140, 248);
    /// <inheritdoc/>
    public override RgbColor L500 => new(99, 102, 241);
    /// <inheritdoc/>
    public override RgbColor L600 => new(79, 70, 229);
    /// <inheritdoc/>
    public override RgbColor L700 => new(67, 56, 202);
    /// <inheritdoc/>
    public override RgbColor L800 => new(55, 48, 163);
    /// <inheritdoc/>
    public override RgbColor L900 => new(49, 46, 129);
    /// <inheritdoc/>
    public override RgbColor L950 => new(30, 27, 75);
}

/// <summary>Violet color palette</summary>
public sealed class Violet : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(245, 243, 255);
    /// <inheritdoc/>
    public override RgbColor L100 => new(237, 233, 254);
    /// <inheritdoc/>
    public override RgbColor L200 => new(221, 214, 254);
    /// <inheritdoc/>
    public override RgbColor L300 => new(196, 181, 253);
    /// <inheritdoc/>
    public override RgbColor L400 => new(167, 139, 250);
    /// <inheritdoc/>
    public override RgbColor L500 => new(139, 92, 246);
    /// <inheritdoc/>
    public override RgbColor L600 => new(124, 58, 237);
    /// <inheritdoc/>
    public override RgbColor L700 => new(109, 40, 217);
    /// <inheritdoc/>
    public override RgbColor L800 => new(91, 33, 182);
    /// <inheritdoc/>
    public override RgbColor L900 => new(76, 29, 149);
    /// <inheritdoc/>
    public override RgbColor L950 => new(46, 16, 101);
}

/// <summary>Purple color palette</summary>
public sealed class Purple : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(250, 245, 255);
    /// <inheritdoc/>
    public override RgbColor L100 => new(243, 232, 255);
    /// <inheritdoc/>
    public override RgbColor L200 => new(233, 213, 255);
    /// <inheritdoc/>
    public override RgbColor L300 => new(216, 180, 254);
    /// <inheritdoc/>
    public override RgbColor L400 => new(192, 132, 252);
    /// <inheritdoc/>
    public override RgbColor L500 => new(168, 85, 247);
    /// <inheritdoc/>
    public override RgbColor L600 => new(147, 51, 234);
    /// <inheritdoc/>
    public override RgbColor L700 => new(126, 34, 206);
    /// <inheritdoc/>
    public override RgbColor L800 => new(107, 33, 168);
    /// <inheritdoc/>
    public override RgbColor L900 => new(88, 28, 135);
    /// <inheritdoc/>
    public override RgbColor L950 => new(59, 7, 100);
}

/// <summary>Fuchsia color palette</summary>
public sealed class Fuchsia : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(253, 244, 255);
    /// <inheritdoc/>
    public override RgbColor L100 => new(250, 232, 255);
    /// <inheritdoc/>
    public override RgbColor L200 => new(245, 208, 254);
    /// <inheritdoc/>
    public override RgbColor L300 => new(240, 171, 252);
    /// <inheritdoc/>
    public override RgbColor L400 => new(232, 121, 249);
    /// <inheritdoc/>
    public override RgbColor L500 => new(217, 70, 239);
    /// <inheritdoc/>
    public override RgbColor L600 => new(192, 38, 211);
    /// <inheritdoc/>
    public override RgbColor L700 => new(162, 28, 175);
    /// <inheritdoc/>
    public override RgbColor L800 => new(134, 25, 143);
    /// <inheritdoc/>
    public override RgbColor L900 => new(112, 26, 117);
    /// <inheritdoc/>
    public override RgbColor L950 => new(74, 4, 78);
}

/// <summary>Pink color palette</summary>
public sealed class Pink : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(253, 242, 248);
    /// <inheritdoc/>
    public override RgbColor L100 => new(252, 231, 243);
    /// <inheritdoc/>
    public override RgbColor L200 => new(251, 207, 232);
    /// <inheritdoc/>
    public override RgbColor L300 => new(249, 168, 212);
    /// <inheritdoc/>
    public override RgbColor L400 => new(244, 114, 182);
    /// <inheritdoc/>
    public override RgbColor L500 => new(236, 72, 153);
    /// <inheritdoc/>
    public override RgbColor L600 => new(219, 39, 119);
    /// <inheritdoc/>
    public override RgbColor L700 => new(190, 24, 93);
    /// <inheritdoc/>
    public override RgbColor L800 => new(157, 23, 77);
    /// <inheritdoc/>
    public override RgbColor L900 => new(131, 24, 67);
    /// <inheritdoc/>
    public override RgbColor L950 => new(80, 7, 36);
}

/// <summary>Rose color palette</summary>
public sealed class Rose : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(255, 241, 242);
    /// <inheritdoc/>
    public override RgbColor L100 => new(255, 228, 230);
    /// <inheritdoc/>
    public override RgbColor L200 => new(254, 205, 211);
    /// <inheritdoc/>
    public override RgbColor L300 => new(253, 164, 175);
    /// <inheritdoc/>
    public override RgbColor L400 => new(251, 113, 133);
    /// <inheritdoc/>
    public override RgbColor L500 => new(244, 63, 94);
    /// <inheritdoc/>
    public override RgbColor L600 => new(225, 29, 72);
    /// <inheritdoc/>
    public override RgbColor L700 => new(190, 18, 60);
    /// <inheritdoc/>
    public override RgbColor L800 => new(159, 18, 57);
    /// <inheritdoc/>
    public override RgbColor L900 => new(136, 19, 55);
    /// <inheritdoc/>
    public override RgbColor L950 => new(76, 5, 25);
}

/// <summary>Stone color palette</summary>
public sealed class Stone : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(250, 250, 249);
    /// <inheritdoc/>
    public override RgbColor L100 => new(245, 245, 244);
    /// <inheritdoc/>
    public override RgbColor L200 => new(231, 229, 228);
    /// <inheritdoc/>
    public override RgbColor L300 => new(214, 211, 209);
    /// <inheritdoc/>
    public override RgbColor L400 => new(168, 162, 158);
    /// <inheritdoc/>
    public override RgbColor L500 => new(120, 113, 108);
    /// <inheritdoc/>
    public override RgbColor L600 => new(87, 83, 78);
    /// <inheritdoc/>
    public override RgbColor L700 => new(68, 64, 60);
    /// <inheritdoc/>
    public override RgbColor L800 => new(41, 37, 36);
    /// <inheritdoc/>
    public override RgbColor L900 => new(28, 25, 23);
    /// <inheritdoc/>
    public override RgbColor L950 => new(12, 10, 9);
}

/// <summary>Neutral color palette</summary>
public sealed class Neutral : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(250, 250, 250);
    /// <inheritdoc/>
    public override RgbColor L100 => new(245, 245, 245);
    /// <inheritdoc/>
    public override RgbColor L200 => new(229, 229, 229);
    /// <inheritdoc/>
    public override RgbColor L300 => new(212, 212, 212);
    /// <inheritdoc/>
    public override RgbColor L400 => new(163, 163, 163);
    /// <inheritdoc/>
    public override RgbColor L500 => new(115, 115, 115);
    /// <inheritdoc/>
    public override RgbColor L600 => new(82, 82, 82);
    /// <inheritdoc/>
    public override RgbColor L700 => new(64, 64, 64);
    /// <inheritdoc/>
    public override RgbColor L800 => new(38, 38, 38);
    /// <inheritdoc/>
    public override RgbColor L900 => new(23, 23, 23);
    /// <inheritdoc/>
    public override RgbColor L950 => new(10, 10, 10);
}

/// <summary>Zinc color palette</summary>
public sealed class Zinc : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(250, 250, 250);
    /// <inheritdoc/>
    public override RgbColor L100 => new(244, 244, 245);
    /// <inheritdoc/>
    public override RgbColor L200 => new(228, 228, 231);
    /// <inheritdoc/>
    public override RgbColor L300 => new(212, 212, 216);
    /// <inheritdoc/>
    public override RgbColor L400 => new(161, 161, 170);
    /// <inheritdoc/>
    public override RgbColor L500 => new(113, 113, 122);
    /// <inheritdoc/>
    public override RgbColor L600 => new(82, 82, 91);
    /// <inheritdoc/>
    public override RgbColor L700 => new(63, 63, 70);
    /// <inheritdoc/>
    public override RgbColor L800 => new(39, 39, 42);
    /// <inheritdoc/>
    public override RgbColor L900 => new(24, 24, 27);
    /// <inheritdoc/>
    public override RgbColor L950 => new(9, 9, 11);
}

/// <summary>Gray color palette</summary>
public sealed class Gray : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(249, 250, 251);
    /// <inheritdoc/>
    public override RgbColor L100 => new(243, 244, 246);
    /// <inheritdoc/>
    public override RgbColor L200 => new(229, 231, 235);
    /// <inheritdoc/>
    public override RgbColor L300 => new(209, 213, 219);
    /// <inheritdoc/>
    public override RgbColor L400 => new(156, 163, 175);
    /// <inheritdoc/>
    public override RgbColor L500 => new(107, 114, 128);
    /// <inheritdoc/>
    public override RgbColor L600 => new(75, 85, 99);
    /// <inheritdoc/>
    public override RgbColor L700 => new(55, 65, 81);
    /// <inheritdoc/>
    public override RgbColor L800 => new(31, 41, 55);
    /// <inheritdoc/>
    public override RgbColor L900 => new(17, 24, 39);
    /// <inheritdoc/>
    public override RgbColor L950 => new(3, 7, 18);
}

/// <summary>Slate color palette</summary>
public sealed class Slate : ColorScale
{
    /// <inheritdoc/>
    public override RgbColor L50 => new(248, 250, 252);
    /// <inheritdoc/>
    public override RgbColor L100 => new(241, 245, 249);
    /// <inheritdoc/>
    public override RgbColor L200 => new(226, 232, 240);
    /// <inheritdoc/>
    public override RgbColor L300 => new(203, 213, 225);
    /// <inheritdoc/>
    public override RgbColor L400 => new(148, 163, 184);
    /// <inheritdoc/>
    public override RgbColor L500 => new(100, 116, 139);
    /// <inheritdoc/>
    public override RgbColor L600 => new(71, 85, 105);
    /// <inheritdoc/>
    public override RgbColor L700 => new(51, 65, 85);
    /// <inheritdoc/>
    public override RgbColor L800 => new(30, 41, 59);
    /// <inheritdoc/>
    public override RgbColor L900 => new(15, 23, 42);
    /// <inheritdoc/>
    public override RgbColor L950 => new(2, 6, 23);
}