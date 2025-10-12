using System.Text;

namespace RizzyUI.TailwindVariants.SourceGenerators;

internal class Indenter
{
    private const char Tab = '\t';
    private readonly StringBuilder _sb = new();
    private int _level = 0;

    public void AppendLine(string text) => _sb.AppendLine(GetIndentation() + text);

    public void AppendLine() => _sb.AppendLine();

    public void AppendMultiline(string text)
    {
        foreach (var line in text.Split('\n'))
        {
            _sb.AppendLine(GetIndentation() + line.TrimEnd());
        }
    }

    public void Dedent() => _level = Math.Max(0, _level - 1);

    public void Indent() => _level++;

    public override string ToString() => _sb.ToString();

    private string GetIndentation() => new(Tab, _level);
}