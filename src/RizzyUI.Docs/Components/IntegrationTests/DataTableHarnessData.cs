namespace RizzyUI.Docs.Components.IntegrationTests;

/// <summary>Table-specific DTOs and configuration for the DataTable integration harness.</summary>
public static class DataTableHarnessData
{
    /// <summary>A person row, as a table DTO: only the fields the table shows.</summary>
    public sealed record PersonRow(string Id, string Name, string Email, string Role, int Age);

    /// <summary>A product row for the second, independent table.</summary>
    public sealed record ProductRow(string Id, string Name, decimal Price);

    /// <summary>A name that must stay text: rendering it as HTML would run the handler.</summary>
    public const string HostileName = "<img src=x onerror=\"window.__rzXss = true\">Mallory";

    /// <summary>A row id that would break out of an attribute if it were not escaped.</summary>
    public const string HostileProductId = "p-\"><b id=\"injected\">x</b>";

    private static readonly string[] Roles = ["Admin", "Editor", "Viewer"];

    /// <summary>25 people (three pages of 10), one with a hostile name.</summary>
    public static IReadOnlyList<PersonRow> People { get; } = Enumerable.Range(1, 25)
        .Select(i => new PersonRow(
            $"person-{i:00}",
            i == 13 ? HostileName : $"Person {i:00}",
            $"person{i:00}@example.com",
            Roles[i % Roles.Length],
            20 + i))
        .ToArray();

    /// <summary>The people table: a grouped header (Person: Name, Email), sorting, selection.</summary>
    public static RzDataTableConfig<PersonRow> PeopleConfig { get; } = new()
    {
        Columns =
        [
            new RzDataTableColumn<PersonRow> { Id = "select", Header = "Select", EnableSorting = false, EnableHiding = false, EnableGlobalFilter = false },
            new RzDataTableColumn<PersonRow>
            {
                Id = "person",
                Header = "Person",
                Columns =
                [
                    new RzDataTableColumn<PersonRow> { Accessor = x => x.Name, Header = "Name" },
                    new RzDataTableColumn<PersonRow> { Accessor = x => x.Email, Header = "Email", EnableSorting = false },
                ],
            },
            new RzDataTableColumn<PersonRow> { Accessor = x => x.Role, Header = "Role" },
            new RzDataTableColumn<PersonRow> { Accessor = x => x.Age, Header = "Age", Footer = "Age" },
        ],
        Features = new RzDataTableFeatures { EnableRowSelection = true },
        InitialState = new RzDataTableInitialState { Pagination = new RzPaginationState { PageIndex = 0, PageSize = 10 } },
    };

    /// <summary>Five products, one with a hostile id.</summary>
    public static IReadOnlyList<ProductRow> Products { get; } =
    [
        new("p-1", "Keyboard", 49m),
        new("p-2", "Mouse", 19m),
        new("p-3", "Monitor", 199m),
        new(HostileProductId, "Cable", 5m),
        new("p-5", "Dock", 129m),
    ];

    /// <summary>The products table selects rows with the generated <c>rowSelection</c> cells.</summary>
    public static RzDataTableConfig<ProductRow> ProductsConfig { get; } = new()
    {
        Columns =
        [
            new RzDataTableColumn<ProductRow> { Id = "select", Header = "Select", CellRenderer = "rowSelection", EnableSorting = false, EnableHiding = false },
            new RzDataTableColumn<ProductRow> { Accessor = x => x.Name, Header = "Product" },
            new RzDataTableColumn<ProductRow> { Accessor = x => x.Price, Header = "Price" },
        ],
        Features = new RzDataTableFeatures { EnableRowSelection = true },
    };
}
