using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Services.RzToast;
using RizzyUI.Services.RzToast.Internal;
using Xunit;

namespace RizzyUI.Services.RzToast;

public sealed class RzToastServiceTests
{
    [Fact]
    public void Show_QueuesShowCommandAndGeneratesOrPreservesIds()
    {
        var (service, queue) = CreateService();

        var generated = service.Show(new RzToastMessage { Text = "Generated" });
        var supplied = service.Show(new RzToastMessage { Id = "supplied", Title = "Supplied" });
        var commands = queue.Drain();

        Assert.StartsWith("rz-toast-", generated.Id);
        Assert.Equal("supplied", supplied.Id);
        Assert.Equal(new[] { "show", "show" }, commands.Select(command => command.Type));
        Assert.Equal(generated.Id, commands[0].Options?.Id);
        Assert.Equal("supplied", commands[1].Options?.Id);
        Assert.Empty(queue.Drain());
    }

    [Fact]
    public void Show_RejectsBlankTitleAndText()
    {
        var (service, _) = CreateService();

        Assert.Throws<ArgumentException>(() => service.Show(new RzToastMessage { Title = " ", Text = "" }));
    }

    [Fact]
    public void Custom_IsAliasOfShow()
    {
        var (service, queue) = CreateService();

        var handle = service.Custom(new RzToastMessage { Id = "custom", Text = "Custom" });
        var command = Assert.Single(queue.Drain());

        Assert.Equal("custom", handle.Id);
        Assert.Equal("show", command.Type);
        Assert.Equal("custom", command.Options?.Id);
    }

    [Theory]
    [InlineData("Success", "success", "Success")]
    [InlineData("Error", "error", "Error")]
    [InlineData("Warning", "warning", "Warning")]
    [InlineData("Info", "info", "Info")]
    [InlineData("Loading", "loading", "Loading")]
    public void ConvenienceMethods_EmitExpectedStatusesAndDefaultTitles(string method, string status, string title)
    {
        var (service, queue) = CreateService();

        _ = method switch
        {
            "Success" => service.Success("Text"),
            "Error" => service.Error("Text"),
            "Warning" => service.Warning("Text"),
            "Info" => service.Info("Text"),
            "Loading" => service.Loading("Text"),
            _ => throw new InvalidOperationException(),
        };

        var command = Assert.Single(queue.Drain());
        Assert.Equal(status, command.Options?.Status);
        Assert.Equal(title, command.Options?.Title);
    }

    [Fact]
    public void Loading_DefaultsAutoCloseAndProgressToFalseButExplicitOptionsOverride()
    {
        var (service, queue) = CreateService();

        service.Loading("Default loading");
        service.Loading("Explicit loading", options: new RzToastOptions { AutoClose = true, Progress = true });
        var commands = queue.Drain();

        Assert.False(commands[0].Options?.AutoClose);
        Assert.False(commands[0].Options?.Progress);
        Assert.True(commands[1].Options?.AutoClose);
        Assert.True(commands[1].Options?.Progress);
    }

    [Fact]
    public void ConvenienceMethods_CopyEveryOption()
    {
        var (service, queue) = CreateService();
        var data = new { MessageId = 42 };
        var action = new RzToastAction
        {
            Label = "Undo",
            EventName = "rz:message:restore",
            Detail = data,
            DismissOnClick = false,
        };

        service.Success("Saved", options: new RzToastOptions
        {
            Id = "all-options",
            Position = ToastPosition.BottomRight,
            Tone = ToastTone.Solid,
            Animation = ToastAnimation.Slide,
            Duration = 7000,
            Speed = 150,
            AutoClose = true,
            Dismissible = false,
            ShowIcon = false,
            Progress = true,
            PauseOnHover = false,
            PauseOnFocus = false,
            PauseOnWindowBlur = true,
            CloseOnEscape = false,
            PreventDuplicates = true,
            DedupeKey = "saved",
            IncrementCount = true,
            MaxVisible = 3,
            NewestOnTop = false,
            OverflowStrategy = ToastOverflowStrategy.IgnoreNewest,
            CustomClass = "custom-toast",
            ClassNames = new Dictionary<string, string> { ["toast"] = "toast-class" },
            Role = "alert",
            AriaLive = "assertive",
            Data = data,
            Action = action,
        });

        var options = Assert.Single(queue.Drain()).Options!;
        Assert.Equal("all-options", options.Id);
        Assert.Equal("bottom-right", options.Position);
        Assert.Equal("solid", options.Tone);
        Assert.Equal("slide", options.Animation);
        Assert.Equal(7000, options.Duration);
        Assert.Equal(150, options.Speed);
        Assert.True(options.AutoClose);
        Assert.False(options.Dismissible);
        Assert.False(options.ShowIcon);
        Assert.True(options.Progress);
        Assert.False(options.PauseOnHover);
        Assert.False(options.PauseOnFocus);
        Assert.True(options.PauseOnWindowBlur);
        Assert.False(options.CloseOnEscape);
        Assert.True(options.PreventDuplicates);
        Assert.Equal("saved", options.DedupeKey);
        Assert.True(options.IncrementCount);
        Assert.Equal(3, options.MaxVisible);
        Assert.False(options.NewestOnTop);
        Assert.Equal("ignore-newest", options.OverflowStrategy);
        Assert.Equal("custom-toast", options.CustomClass);
        Assert.Equal("toast-class", options.ClassNames?["toast"]);
        Assert.Equal("alert", options.Role);
        Assert.Equal("assertive", options.AriaLive);
        Assert.Same(data, options.Data);
        Assert.Equal("Undo", options.Action?.Label);
        Assert.Equal("rz:message:restore", options.Action?.EventName);
        Assert.False(options.Action?.DismissOnClick);
    }

    [Fact]
    public void Update_QueuesCanonicalUpdateAndOmittedNullsSerializeAway()
    {
        var (service, queue) = CreateService();

        service.Update("toast-id", new RzToastUpdate { Status = ToastStatus.Success, Text = string.Empty });
        var command = Assert.Single(queue.Drain());
        var json = JsonSerializer.Serialize(command);

        Assert.Equal("update", command.Type);
        Assert.Equal("toast-id", command.Id);
        Assert.Equal("success", command.Options?.Status);
        Assert.Equal(string.Empty, command.Options?.Text);
        Assert.DoesNotContain("title", json);
        Assert.DoesNotContain("\"id\":null", json);
    }

    [Fact]
    public void Update_RejectsBlankIdAndNullUpdate()
    {
        var (service, _) = CreateService();

        Assert.Throws<ArgumentException>(() => service.Update(" ", new RzToastUpdate { Text = "Updated" }));
        Assert.Throws<ArgumentNullException>(() => service.Update("id", null!));
    }

    [Fact]
    public void DismissAndClear_QueueExpectedCommands()
    {
        var (service, queue) = CreateService();

        service.Dismiss("toast-id");
        service.Dismiss();
        service.Clear();
        var commands = queue.Drain();

        Assert.Equal(new[] { "dismiss", "dismiss", "clear" }, commands.Select(command => command.Type));
        Assert.Equal("toast-id", commands[0].Id);
        Assert.Null(commands[1].Id);
        Assert.Null(commands[2].Id);
    }

    [Fact]
    public void Commands_RetainInsertionOrderAndDrainEmptiesQueue()
    {
        var (service, queue) = CreateService();

        service.Success("One", options: new RzToastOptions { Id = "one" });
        service.Update("one", new RzToastUpdate { Text = "Two" });
        service.Dismiss("one");
        service.Clear();

        Assert.Equal(new[] { "show", "update", "dismiss", "clear" }, queue.Drain().Select(command => command.Type));
        Assert.Empty(queue.Drain());
    }

    [Fact]
    public void Handle_UpdateAndDismissQueueCommandsForHandleId()
    {
        var (service, queue) = CreateService();

        var handle = service.Info("Preparing", options: new RzToastOptions { Id = "export" });
        handle.Update(new RzToastUpdate { Status = ToastStatus.Success, Text = "Ready" });
        handle.Dismiss();
        var commands = queue.Drain();

        Assert.Equal("export", handle.Id);
        Assert.Equal(new[] { "show", "update", "dismiss" }, commands.Select(command => command.Type));
        Assert.Equal("export", commands[1].Id);
        Assert.Equal("export", commands[2].Id);
    }

    [Fact]
    public void CanonicalEnumsAndActionSerializeWithExpectedNames()
    {
        var (service, queue) = CreateService();

        service.Show(new RzToastMessage
        {
            Id = "canonical",
            Text = "Canonical",
            Status = ToastStatus.Loading,
            Position = ToastPosition.LeftCenter,
            Tone = ToastTone.Ghost,
            Animation = ToastAnimation.None,
            OverflowStrategy = ToastOverflowStrategy.DismissOldest,
            Action = new RzToastAction
            {
                Label = "Undo",
                EventName = "rz:message:restore",
                Detail = new { messageId = 123 },
            },
        });

        var json = JsonSerializer.Serialize(Assert.Single(queue.Drain()));
        Assert.Contains("\"status\":\"loading\"", json);
        Assert.Contains("\"position\":\"left-center\"", json);
        Assert.Contains("\"tone\":\"ghost\"", json);
        Assert.Contains("\"animation\":\"none\"", json);
        Assert.Contains("\"overflowStrategy\":\"dismiss-oldest\"", json);
        Assert.Contains("\"label\":\"Undo\"", json);
        Assert.Contains("\"eventName\":\"rz:message:restore\"", json);
        Assert.Contains("\"messageId\":123", json);
        Assert.Contains("\"dismissOnClick\":true", json);
    }

    [Theory]
    [InlineData("Duration")]
    [InlineData("Speed")]
    [InlineData("MaxVisible")]
    public void NegativeNumericOptionsAreRejected(string property)
    {
        var (service, _) = CreateService();
        var options = property switch
        {
            "Duration" => new RzToastOptions { Duration = -1 },
            "Speed" => new RzToastOptions { Speed = -1 },
            "MaxVisible" => new RzToastOptions { MaxVisible = -1 },
            _ => throw new InvalidOperationException(),
        };

        Assert.Throws<ArgumentOutOfRangeException>(() => service.Success("Text", options: options));
    }

    private static (IRzToastService Service, RzToastCommandQueue Queue) CreateService()
    {
        var services = new ServiceCollection();
        services.AddScoped<RzToastCommandQueue>();
        services.AddScoped<IRzToastService, RzToastService>();
        var provider = services.BuildServiceProvider();
        var scope = provider.CreateScope();
        return (scope.ServiceProvider.GetRequiredService<IRzToastService>(), scope.ServiceProvider.GetRequiredService<RzToastCommandQueue>());
    }
}
