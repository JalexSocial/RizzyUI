using System.Text.Json;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form;

/// <summary>
/// RZUI-033: RzCombobox wrote every public property of each item into the page (data-item). It now
/// sends value and text by default, and what ItemDataSelector returns when it is set.
/// </summary>
public class RzComboboxItemDataTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzComboboxItemDataTests(WebAppFixture fixture) : base(fixture)
    {
    }

    public sealed class Account
    {
        public int Id { get; init; }
        public string Name { get; init; } = "";
        public string Email { get; init; } = "";
        public string PasswordHash { get; init; } = "";
    }

    private sealed class AssignModel
    {
        public string AccountId { get; set; } = "";
    }

    private IRenderedComponent<CascadingValue<EditContext>> RenderCombobox(Action<ComponentParameterCollectionBuilder<RzCombobox<Account, string>>> parameters)
    {
        var model = new AssignModel();
        return Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<RzCombobox<Account, string>>(p =>
            {
                p.Add(x => x.For, () => model.AccountId);
                parameters(p);
            }));
    }

    private static readonly Account[] Accounts =
    [
        new() { Id = 1, Name = "Ada", Email = "ada@example.com", PasswordHash = "secret-hash-1" },
        new() { Id = 2, Name = "Grace", Email = "grace@example.com", PasswordHash = "secret-hash-2" },
    ];

    [Fact]
    public void ByDefault_OnlyValueAndTextReachThePage()
    {
        var cut = RenderCombobox(p => p
            .Add(x => x.Items, Accounts)
            .Add(x => x.ValueSelector, a => a.Id.ToString())
            .Add(x => x.TextSelector, a => a.Name));

        Assert.DoesNotContain("secret-hash", cut.Markup);
        Assert.DoesNotContain("example.com", cut.Markup);

        var data = JsonDocument.Parse(cut.Find("option[value='1']").GetAttribute("data-item")!).RootElement;
        Assert.Equal("1", data.GetProperty("value").GetString());
        Assert.Equal("Ada", data.GetProperty("text").GetString());
        Assert.Equal(2, data.EnumerateObject().Count());
    }

    [Fact]
    public void ItemDataSelector_ChoosesTheFieldsTheTemplatesCanRead()
    {
        var cut = RenderCombobox(p => p
            .Add(x => x.Items, Accounts)
            .Add(x => x.ValueSelector, a => a.Id.ToString())
            .Add(x => x.TextSelector, a => a.Name)
            .Add(x => x.ItemDataSelector, a => new { a.Name, a.Email }));

        Assert.DoesNotContain("secret-hash", cut.Markup);

        var data = JsonDocument.Parse(cut.Find("option[value='2']").GetAttribute("data-item")!).RootElement;
        Assert.Equal("Grace", data.GetProperty("name").GetString());
        Assert.Equal("grace@example.com", data.GetProperty("email").GetString());
        Assert.False(data.TryGetProperty("passwordHash", out _));
    }
}
