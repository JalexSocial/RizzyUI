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

        var status = cut.Find("[data-slot='announcement']");
        Assert.Equal("status", status.GetAttribute("role"));
        Assert.Equal("polite", status.GetAttribute("aria-live"));
        Assert.Equal("true", status.GetAttribute("aria-atomic"));
        Assert.Equal("announcement.message", status.GetAttribute("x-text"));
    }

    [Fact]
    public void DataTableSelectionCheckboxes_RenderAccessibleNamesAndStateBindings()
    {
        var cut = Render<TestableDataTable>(parameters => parameters
            .Add(x => x.Items, CreateRows())
            .Add(x => x.Config, CreateConfig())
            .Add(x => x.RowIdSelector, x => x.Id)
            .Add(x => x.ChildContent, (RenderFragment)(builder =>
            {
                builder.OpenComponent<global::RizzyUI.DataTableSelectionHeaderCell>(0);
                builder.AddAttribute(1, "AriaLabel", "Select visible rows");
                builder.CloseComponent();
                builder.OpenComponent<global::RizzyUI.DataTableSelectionCell>(2);
                builder.AddAttribute(3, "RowExpr", "row");
                builder.AddAttribute(4, "AriaLabel", "Select Ada");
                builder.CloseComponent();
            })));

        var selectAll = cut.Find("[data-slot='data-table-select-all-checkbox']");
        Assert.Equal("Select visible rows", selectAll.GetAttribute("aria-label"));
        Assert.Equal("selection.allPageRowsSelected()", selectAll.GetAttribute("x-bind:checked"));
        Assert.Equal("$el.indeterminate = selection.somePageRowsSelected() && !selection.allPageRowsSelected()", selectAll.GetAttribute("x-effect"));

        var rowSelect = cut.Find("[data-slot='data-table-row-select-checkbox']");
        Assert.Equal("Select Ada", rowSelect.GetAttribute("aria-label"));
        Assert.Equal("selection.isSelected(row)", rowSelect.GetAttribute("x-bind:checked"));
        Assert.Equal("selection.setRowSelected(row, $event.target.checked)", rowSelect.GetAttribute("x-on:change"));
    }


    [Fact]
    public void DataTableSortToggle_RendersNativeButtonBindingsAndIconStates()
    {
        var cut = Render<global::RizzyUI.DataTableSortToggle>(parameters => parameters
            .Add(x => x.HeaderExpr, "header"));

        var toggle = cut.Find("[data-slot='data-table-sort-toggle']");
        Assert.Equal("button", toggle.TagName.ToLowerInvariant());
        Assert.Equal("button", toggle.GetAttribute("type"));
        Assert.Equal("!sort.can(header)", toggle.GetAttribute("x-bind:disabled"));
        Assert.Equal("sort.nextLabel(header)", toggle.GetAttribute("x-bind:aria-label"));
        Assert.Equal("sort.direction(header) || 'none'", toggle.GetAttribute("x-bind:data-sort-direction"));
        Assert.Equal("sort.toggle(header)", toggle.GetAttribute("x-on:click"));

        var label = cut.Find("[data-slot='label']");
        Assert.Equal("_flex.header(header)", label.GetAttribute("x-flexrender"));

        var icon = cut.Find("[data-slot='data-table-sort-icon']");
        Assert.Equal("sort.can(header)", icon.GetAttribute("x-show"));
        Assert.Equal("sort.direction(header) === 'asc'", cut.Find("[data-slot='ascending']").GetAttribute("x-show"));
        Assert.Equal("sort.direction(header) === 'desc'", cut.Find("[data-slot='descending']").GetAttribute("x-show"));
        Assert.Equal("!sort.direction(header)", cut.Find("[data-slot='unsorted']").GetAttribute("x-show"));
    }

    [Fact]
    public void SelectionHelpers_RenderSemanticTableCellsAndNativeCheckboxes()
    {
        var headerCut = Render<global::RizzyUI.DataTableSelectionHeaderCell>(parameters => parameters
            .Add(x => x.Scope, global::RizzyUI.DataTableSelectionScope.All));
        var cellCut = Render<global::RizzyUI.DataTableSelectionCell>(parameters => parameters
            .Add(x => x.RowExpr, "row"));

        var headerCell = headerCut.Find("[data-slot='data-table-selection-header-cell']");
        Assert.Equal("th", headerCell.TagName.ToLowerInvariant());
        Assert.Equal("col", headerCell.GetAttribute("scope"));

        var dataCell = cellCut.Find("[data-slot='data-table-selection-cell']");
        Assert.Equal("td", dataCell.TagName.ToLowerInvariant());

        var selectAll = headerCut.Find("[data-slot='data-table-select-all-checkbox']");
        Assert.Equal("input", selectAll.TagName.ToLowerInvariant());
        Assert.Equal("checkbox", selectAll.GetAttribute("type"));
        Assert.Equal("selection.allRowsSelected()", selectAll.GetAttribute("x-bind:checked"));
        Assert.Equal("$el.indeterminate = selection.someRowsSelected() && !selection.allRowsSelected()", selectAll.GetAttribute("x-effect"));
        Assert.Equal("selection.setAllRows($event.target.checked)", selectAll.GetAttribute("x-on:change"));

        var rowSelect = cellCut.Find("[data-slot='data-table-row-select-checkbox']");
        Assert.Equal("input", rowSelect.TagName.ToLowerInvariant());
        Assert.Equal("checkbox", rowSelect.GetAttribute("type"));
        Assert.Equal("selection.isSelected(row)", rowSelect.GetAttribute("x-bind:checked"));
        Assert.Equal("!selection.canSelect(row)", rowSelect.GetAttribute("x-bind:disabled"));
        Assert.Equal("$el.indeterminate = selection.isSomeSelected(row) && !selection.isSelected(row)", rowSelect.GetAttribute("x-effect"));
        Assert.Equal("selection.setRowSelected(row, $event.target.checked)", rowSelect.GetAttribute("x-on:change"));
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
