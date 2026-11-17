namespace RizzyUI.Starter.Features.Customers;

public enum CustomerStatus
{
    Active,
    Trial,
    Churned
}

public sealed record Customer(int Id, string Name, string Email, string Plan, CustomerStatus Status, decimal MonthlyRevenue, DateOnly Joined);

public sealed record CustomerPage(IReadOnlyList<Customer> Items, string Query, int Page, int PageSize, int TotalCount)
{
    public int PageCount => Math.Max(1, (int)Math.Ceiling(TotalCount / (double)PageSize));
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < PageCount;
}

/// <summary>
/// In-memory sample data for the starter pages. Replace it with your own data access.
/// </summary>
public sealed class CustomerStore
{
    private static readonly string[] FirstNames = ["Ada", "Grace", "Alan", "Linus", "Margaret", "Ken", "Barbara", "Dennis", "Radia", "Guido", "Frances", "Bjarne"];
    private static readonly string[] LastNames = ["Lovelace", "Hopper", "Turing", "Torvalds", "Hamilton", "Thompson", "Liskov", "Ritchie", "Perlman", "van Rossum", "Allen", "Stroustrup"];
    private static readonly string[] Plans = ["Free", "Starter", "Pro", "Enterprise"];

    private readonly List<Customer> _customers;

    public CustomerStore()
    {
        var random = new Random(42);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        _customers = Enumerable.Range(1, 48).Select(id =>
        {
            var first = FirstNames[random.Next(FirstNames.Length)];
            var last = LastNames[random.Next(LastNames.Length)];
            var plan = Plans[random.Next(Plans.Length)];
            var status = (CustomerStatus)random.Next(3);
            var revenue = plan switch
            {
                "Starter" => 19m,
                "Pro" => 49m,
                "Enterprise" => 299m,
                _ => 0m
            };
            var email = $"{first}.{last}{id}@example.com".Replace(" ", string.Empty).ToLowerInvariant();
            return new Customer(id, $"{first} {last}", email, plan, status, status == CustomerStatus.Churned ? 0m : revenue, today.AddDays(-random.Next(1, 720)));
        }).ToList();
    }

    public CustomerPage Search(string? query, int page, int pageSize = 10)
    {
        query = query?.Trim() ?? string.Empty;
        IEnumerable<Customer> matches = _customers.OrderByDescending(c => c.Joined);
        if (query.Length > 0)
        {
            matches = matches.Where(c =>
                c.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                c.Email.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                c.Plan.Contains(query, StringComparison.OrdinalIgnoreCase));
        }

        var all = matches.ToList();
        var pageCount = Math.Max(1, (int)Math.Ceiling(all.Count / (double)pageSize));
        page = Math.Clamp(page, 1, pageCount);
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        return new CustomerPage(items, query, page, pageSize, all.Count);
    }

    public IReadOnlyList<Customer> Newest(int count) =>
        _customers.OrderByDescending(c => c.Joined).Take(count).ToList();

    public int ActiveCount => _customers.Count(c => c.Status == CustomerStatus.Active);

    public int TrialCount => _customers.Count(c => c.Status == CustomerStatus.Trial);

    public decimal MonthlyRevenue => _customers.Sum(c => c.MonthlyRevenue);

    public int TotalCount => _customers.Count;
}
