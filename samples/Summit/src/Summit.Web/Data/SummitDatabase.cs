using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Summit.Web.Data.Seeding;
using Summit.Web.Infrastructure;

namespace Summit.Web.Data;

/// <summary>
/// The SQLite database: a seeded template file plus the working copy the app uses. Resetting copies
/// the template over the working database with SQLite's online backup API, which takes milliseconds
/// and works while other connections are open (the browser tests reset before every spec file).
/// </summary>
public sealed class SummitDatabase
{
    private readonly SemaphoreSlim _lock = new(1, 1);

    public SummitDatabase(IWebHostEnvironment environment, IOptions<SummitOptions> options)
    {
        var path = options.Value.Database.Path;
        WorkingPath = Path.IsPathRooted(path) ? path : Path.Combine(environment.ContentRootPath, path);
        TemplatePath = WorkingPath + ".template";
    }

    public string WorkingPath { get; }

    public string TemplatePath { get; }

    public string ConnectionString => new SqliteConnectionStringBuilder { DataSource = WorkingPath, Pooling = true }.ToString();

    public static IServiceCollection AddSummitDatabase(IServiceCollection services)
    {
        services.AddSingleton<SummitDatabase>();
        services.AddDbContext<SummitDbContext>((provider, options) =>
            options.UseSqlite(provider.GetRequiredService<SummitDatabase>().ConnectionString));
        return services;
    }

    /// <summary>Creates the template (when asked to, or when it is missing) and the working copy.</summary>
    public async Task InitializeAsync(IServiceProvider services, bool rebuild, CancellationToken cancellationToken = default)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(WorkingPath)!);

        if (rebuild || !File.Exists(TemplatePath))
            await BuildTemplateAsync(services, cancellationToken);

        if (rebuild || !File.Exists(WorkingPath))
            await ResetAsync(cancellationToken);
    }

    /// <summary>Copies the seeded template over the working database.</summary>
    public async Task ResetAsync(CancellationToken cancellationToken = default)
    {
        await _lock.WaitAsync(cancellationToken);
        try
        {
            await using var source = new SqliteConnection(new SqliteConnectionStringBuilder { DataSource = TemplatePath, Mode = SqliteOpenMode.ReadOnly, Pooling = false }.ToString());
            await using var destination = new SqliteConnection(ConnectionString);
            await source.OpenAsync(cancellationToken);
            await destination.OpenAsync(cancellationToken);
            source.BackupDatabase(destination);
        }
        finally
        {
            _lock.Release();
        }
    }

    private async Task BuildTemplateAsync(IServiceProvider services, CancellationToken cancellationToken)
    {
        var building = TemplatePath + ".building";
        File.Delete(building);

        var options = new DbContextOptionsBuilder<SummitDbContext>()
            .UseSqlite(new SqliteConnectionStringBuilder { DataSource = building, Pooling = false }.ToString())
            .Options;

        await using (var db = new SummitDbContext(options))
        {
            await db.Database.EnsureCreatedAsync(cancellationToken);
            var seeder = new SummitSeeder(db, services.GetRequiredService<TimeProvider>(), services.GetRequiredService<IOptions<SummitOptions>>().Value);
            await seeder.SeedAsync(cancellationToken);
        }

        File.Move(building, TemplatePath, overwrite: true);
    }
}
