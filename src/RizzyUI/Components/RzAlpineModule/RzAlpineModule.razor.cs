
    using Microsoft.AspNetCore.Components;

    namespace RizzyUI;

    public partial class RzAlpineModule : RzComponent
    {
        private string? _modulePath;

        [Parameter, EditorRequired]
        public object For { get; set; } = default!;

        [Parameter, EditorRequired]
        public string Name { get; set; } = string.Empty;

        protected override void OnParametersSet()
        {
            if (For is null) throw new InvalidOperationException("'For' is required.");
            if (string.IsNullOrWhiteSpace(Name)) throw new InvalidOperationException("'Name' is required.");

            var key = For.GetType().FullName!;
            if (!RzAlpineModuleRegistry.TryGet(key, out _modulePath))
            {
                _modulePath = null;
            }
        }
    }