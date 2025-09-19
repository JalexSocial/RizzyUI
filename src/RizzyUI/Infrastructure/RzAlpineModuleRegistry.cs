
    using System.Collections.Concurrent;

    namespace RizzyUI;

    public static class RzAlpineModuleRegistry
    {
        private static readonly ConcurrentDictionary<string, string> _map = new();

        public static void Add(string componentFullTypeName, string modulePath)
            => _map[componentFullTypeName] = modulePath;

        public static bool TryGet(string componentFullTypeName, out string modulePath)
            => _map.TryGetValue(componentFullTypeName, out modulePath!);
    }