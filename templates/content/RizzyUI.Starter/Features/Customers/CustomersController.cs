using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Framework.Mvc;

namespace RizzyUI.Starter.Features.Customers;

public sealed class CustomersController(CustomerStore store) : RzController
{
    // The full page: the layout, the search box and the first page of results.
    [HttpGet("/customers")]
    public IResult Index(string? q, int page = 1) =>
        View<CustomersPage>(new { Result = store.Search(q, page) });

    // Only the table, for the search box and the pager (hx-get with hx-target="#customer-table").
    [HttpGet("/customers/table")]
    public IResult Table(string? q, int page = 1) =>
        PartialView<CustomerTable>(new { Result = store.Search(q, page) });
}
