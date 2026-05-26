using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.DataTable.RzDataTable;

public class RzDataTableTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzDataTableTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzDataTable_RendersRootAndAlpineHostContract()
    {
        var cut = RenderTable();

        var root = cut.Find("[data-slot='datatable']");
        Assert.NotNull(root);

        var alpineHost = cut.Find("[x-data='rzDataTable']");
        Assert.Equal(cut.Instance.Id, alpineHost.GetAttribute("data-alpine-root"));
        Assert.Equal("[]", alpineHost.GetAttribute("data-assets"));
        Assert.Equal(cut.Instance.ConfigScriptIdForTests, alpineHost.GetAttribute("data-config-id"));
        Assert.False(string.IsNullOrWhiteSpace(alpineHost.GetAttribute("x-load")));
        Assert.NotNull(alpineHost.GetAttribute("data-nonce"));

        var configScript = cut.Find($"script#{cut.Instance.ConfigScriptIdForTests}");
        Assert.Equal("application/json", configScript.GetAttribute("type"));
    }

    [Fact]
    public void RzDataTable_SerializesLargePayloadIntoScriptBlock_NotDataAttributes()
    {
        var cut = Render<TestableDataTable>(parameters => parameters
            .Add(x => x.Items, CreateRows(60))
            .Add(x => x.Config, CreateConfig())
            .Add(x => x.RowIdSelector, x => x.Id));

        var alpineHost = cut.Find("[x-data='rzDataTable']");
        var script = cut.Find($"script#{cut.Instance.ConfigScriptIdForTests}");

        Assert.Contains("User 55", script.TextContent);
        Assert.DoesNotContain("User 55", alpineHost.GetAttribute("data-config-id"));
        Assert.DoesNotContain("User 55", alpineHost.GetAttribute("data-assets"));
    }

    [Fact]
    public void RzDataTable_ThrowsWhenItemsAreMissing()
    {
        Assert.Throws<InvalidOperationException>(() =>
            Render<TestableDataTable>(parameters => parameters
                .Add(x => x.Items, null!)
                .Add(x => x.Config, CreateConfig())
                .Add(x => x.RowIdSelector, x => x.Id)));
    }

    [Fact]
    public void RzDataTable_ThrowsWhenConfigIsMissing()
    {
        Assert.Throws<InvalidOperationException>(() =>
            Render<TestableDataTable>(parameters => parameters
                .Add(x => x.Items, CreateRows())
                .Add(x => x.Config, null!)
                .Add(x => x.RowIdSelector, x => x.Id)));
    }

    [Fact]
    public void RzDataTable_ThrowsWhenRowIdSelectorIsMissing()
    {
        Assert.Throws<InvalidOperationException>(() =>
            Render<TestableDataTable>(parameters => parameters
                .Add(x => x.Items, CreateRows())
                .Add(x => x.Config, CreateConfig())
                .Add(x => x.RowIdSelector, null!)));
    }

    [Fact]
    public void RzDataTable_RejectsInvalidRowIdSelectorExpression()
    {
        Assert.Throws<InvalidOperationException>(() =>
            Render<TestableDataTable>(parameters => parameters
                .Add(x => x.Items, CreateRows())
                .Add(x => x.Config, CreateConfig())
                .Add(x => x.RowIdSelector, x => x.Name.ToLower())));
    }

    [Fact]
    public void RzDataTable_RejectsDuplicateColumnIds()
    {
        var config = new global::RizzyUI.RzDataTableConfig<RowModel>
        {
            Columns =
            [
                new global::RizzyUI.RzDataTableColumn<RowModel> { Id = "name", Accessor = x => x.Name },
                new global::RizzyUI.RzDataTableColumn<RowModel> { Id = "name", Accessor = x => x.Email },
            ],
        };

        Assert.Throws<InvalidOperationException>(() =>
            Render<TestableDataTable>(parameters => parameters
                .Add(x => x.Items, CreateRows())
                .Add(x => x.Config, config)
                .Add(x => x.RowIdSelector, x => x.Id)));
    }

    [Fact]
    public void RzDataTable_RejectsDuplicateRowIds()
    {
        var duplicateRows = new List<RowModel>
        {
            new("1", "Ada", "ada@example.com"),
            new("1", "Ada Again", "ada2@example.com"),
        };

        Assert.Throws<InvalidOperationException>(() =>
            Render<TestableDataTable>(parameters => parameters
                .Add(x => x.Items, duplicateRows)
                .Add(x => x.Config, CreateConfig())
                .Add(x => x.RowIdSelector, x => x.Id)));
    }

    [Fact]
    public void RzDataTable_SerializesNormalizedTransport()
    {
        var cut = RenderTable();
        var json = cut.Find($"script#{cut.Instance.ConfigScriptIdForTests}").TextContent;

        Assert.Contains("\"rowIdPath\":\"Id\"", json);
        Assert.Contains("\"accessorKey\":\"Name\"", json);
        Assert.Contains("\"enableGlobalFilter\":true", json);
        Assert.Contains("\"core\":\"getCoreRowModel\"", json);
    }

    private IRenderedComponent<TestableDataTable> RenderTable()
    {
        return Render<TestableDataTable>(parameters => parameters
            .Add(x => x.Items, CreateRows())
            .Add(x => x.Config, CreateConfig())
            .Add(x => x.RowIdSelector, x => x.Id)
            .Add(x => x.ChildContent, (RenderFragment)(builder =>
            {
                builder.OpenComponent<global::RizzyUI.RzTable>(0);
                builder.CloseComponent();
            })));
    }

    private static IReadOnlyList<RowModel> CreateRows(int count = 3)
    {
        return Enumerable.Range(1, count)
            .Select(index => new RowModel(index.ToString(), $"User {index}", $"user{index}@example.com"))
            .ToArray();
    }

    private static global::RizzyUI.RzDataTableConfig<RowModel> CreateConfig()
    {
        return new global::RizzyUI.RzDataTableConfig<RowModel>
        {
            Columns =
            [
                new global::RizzyUI.RzDataTableColumn<RowModel> { Accessor = x => x.Name, Header = "Name" },
                new global::RizzyUI.RzDataTableColumn<RowModel> { Accessor = x => x.Email, Header = "Email" },
            ],
            Features = new global::RizzyUI.RzDataTableFeatures
            {
                EnableGlobalFilter = true,
                EnableFiltering = true,
                EnablePagination = true,
                EnableSorting = true,
            },
        };
    }

    private sealed record RowModel(string Id, string Name, string Email);

    private sealed class TestableDataTable : global::RizzyUI.RzDataTable<RowModel>
    {
        public string ConfigScriptIdForTests => ConfigScriptId;
    }
}
