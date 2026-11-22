using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Primitives;

namespace RizzyUI.Tests.Components.DataTable.RzDataTable;

/// <summary>Decision D-31 (Summit SF-001): the table state the browser posts back.</summary>
public class RzDataTableStateTests
{
    private const string Json = """{"v":1,"sorting":[{"id":"Company","desc":false}],"pagination":{"pageIndex":1,"pageSize":25},"columnFilters":[{"id":"Country","value":"DE"}],"globalFilter":"example.org","columnVisibility":{"Country":false},"rowSelection":{"a-1":true,"a-2":false}}""";

    [Fact]
    public void Parses_the_json_and_maps_it_to_an_initial_state()
    {
        Assert.True(global::RizzyUI.RzDataTableState.TryParse(Json, out var state));
        Assert.Equal(["a-1"], state.SelectedRowIds);

        var initial = state.ToInitialState();
        Assert.Equal("Company", initial.Sorting![0].Id);
        Assert.Equal(25, initial.Pagination!.PageSize);
        Assert.Equal("example.org", initial.GlobalFilter);
        Assert.False(initial.ColumnVisibility!["Country"]);
        Assert.Null(initial.RowSelection);
        Assert.NotNull(state.ToInitialState(includeSelection: true).RowSelection);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("not json")]
    [InlineData("""{"v":2}""")]
    public void Rejects_missing_invalid_or_newer_state(string? value) =>
        Assert.False(global::RizzyUI.RzDataTableState.TryParse(value, out _));

    [Fact]
    public void The_model_binder_reads_the_value_with_the_parameter_name()
    {
        var context = new DefaultModelBindingContext
        {
            ModelName = "TableState",
            ValueProvider = new QueryStringValueProvider(BindingSource.Query,
                new Microsoft.AspNetCore.Http.QueryCollection(new Dictionary<string, StringValues> { ["TableState"] = Json }),
                System.Globalization.CultureInfo.InvariantCulture),
        };
        new global::RizzyUI.RzDataTableStateModelBinder().BindModelAsync(context);
        Assert.True(context.Result.IsModelSet);
        Assert.Equal(25, Assert.IsType<global::RizzyUI.RzDataTableState>(context.Result.Model).Pagination!.PageSize);
    }
}
