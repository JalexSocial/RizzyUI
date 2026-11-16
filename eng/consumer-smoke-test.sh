#!/usr/bin/env bash
# Builds, publishes and runs a fresh ASP.NET Core SSR app against the packed RizzyUI packages,
# then checks it in a browser. Validates what consumers get, not the repository projects.
#
# Usage: bash eng/consumer-smoke-test.sh <nupkg-dir> <rizzyui-version> [<npm-tarball>]
#
# Requires: .NET 10 SDK, Node.js 22+, and Playwright's Chromium (installed for
# src/RizzyUI.Docs: `npm ci && npx playwright install chromium`), or a Chrome on Windows.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
nupkg_dir="$(cd "${1:?nupkg directory required}" && pwd)"
version="${2:?RizzyUI package version required}"
npm_tarball="${3:-}"
port="${SMOKE_PORT:-5199}"
htmx_version="${HTMX_VERSION:-4.0.1}"

work="$(mktemp -d)"
server_pid=""

# Paths handed to .NET must be native paths (Git Bash on Windows uses /c/... paths).
native_path() {
  if command -v cygpath >/dev/null 2>&1; then cygpath -w "$1"; else printf '%s' "$1"; fi
}
cleanup() {
  if [[ -n "$server_pid" ]]; then kill "$server_pid" 2>/dev/null || true; fi
  rm -rf "$work"
}
trap cleanup EXIT

echo "==> Consumer workspace: $work"
cp -R "$repo_root/eng/consumer-smoke/app/." "$work/app/"

# Isolated package cache and sources: the consumer must restore the RizzyUI package from
# <nupkg-dir>, never a copy of the same version from nuget.org or the machine cache.
# RizzyUI.Tasks may come from either source: <nupkg-dir> holds it when RizzyUI depends on a
# Tasks version that is not on nuget.org yet.
packages_dir="$work/.nuget/packages"
export NUGET_PACKAGES="$(native_path "$packages_dir")"
cat > "$work/app/nuget.config" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="local" value="$(native_path "$nupkg_dir")" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
  <packageSourceMapping>
    <packageSource key="local">
      <package pattern="RizzyUI" />
      <package pattern="RizzyUI.Tasks" />
    </packageSource>
    <packageSource key="nuget.org">
      <package pattern="RizzyUI.Tasks" />
      <package pattern="*" />
    </packageSource>
  </packageSourceMapping>
</configuration>
EOF

echo "==> htmx $htmx_version (served by the consumer, checked against Rizzy's SRI hashes)"
(cd "$work" && npm pack "htmx.org@$htmx_version" --silent >/dev/null && tar -xzf "htmx.org-$htmx_version.tgz")
mkdir -p "$work/app/wwwroot/lib/htmx"
cp "$work/package/dist/htmx.min.js" "$work/app/wwwroot/lib/htmx/"
rm -rf "$work/package"

echo "==> Restore, build and publish against RizzyUI $version"
dotnet publish "$work/app/SmokeConsumer.csproj" -c Release -o "$work/publish" -p:RizzyUIVersion="$version" --nologo

if [[ ! -d "$packages_dir/rizzyui/$version" ]]; then
  echo "error: RizzyUI $version was not restored from $nupkg_dir" >&2
  exit 1
fi

for asset in rizzyui.js rizzyui-csp.js; do
  if [[ ! -f "$work/publish/wwwroot/_content/RizzyUI/js/$asset" ]]; then
    echo "error: published app is missing wwwroot/_content/RizzyUI/js/$asset" >&2
    exit 1
  fi
done
if [[ -f "$work/publish/package.json" || -f "$work/publish/package-lock.json" ]]; then
  echo "error: the RizzyUI package added its own package.json/package-lock.json to the published app" >&2
  exit 1
fi

if [[ -n "$npm_tarball" ]]; then
  echo "==> npm: install the packed @jalexsocial/rizzyui into an empty project"
  npm_tarball="$(cd "$(dirname "$npm_tarball")" && pwd)/$(basename "$npm_tarball")"
  mkdir -p "$work/npm-consumer"
  (
    cd "$work/npm-consumer"
    npm init -y >/dev/null
    npm install "$npm_tarball" "htmx.org@$htmx_version" --no-audit --no-fund
    node --input-type=module -e "
      for (const spec of ['@jalexsocial/rizzyui', '@jalexsocial/rizzyui/csp', '@jalexsocial/rizzyui/dist/css/rizzyui-plugin.css', '@jalexsocial/rizzyui/package.json']) {
        const url = import.meta.resolve(spec);
        const { existsSync } = await import('node:fs');
        if (!existsSync(new URL(url))) { console.error('unresolvable: ' + spec + ' -> ' + url); process.exit(1); }
        console.log('resolved ' + spec);
      }"
    # A local file: dependency would leave a dangling link in node_modules.
    if find node_modules -maxdepth 2 -xtype l | grep -q .; then
      echo "error: dangling symlinks in node_modules after installing the package:" >&2
      find node_modules -maxdepth 2 -xtype l >&2
      exit 1
    fi
  )
fi

echo "==> Start the published consumer on port $port"
(
  cd "$work/publish"
  ASPNETCORE_URLS="http://127.0.0.1:$port" ASPNETCORE_ENVIRONMENT=Production dotnet SmokeConsumer.dll
) > "$work/server.log" 2>&1 &
server_pid=$!

for _ in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:$port/" >/dev/null 2>&1; then break; fi
  if ! kill -0 "$server_pid" 2>/dev/null; then
    echo "error: consumer exited during startup" >&2
    cat "$work/server.log" >&2
    exit 1
  fi
  sleep 1
done

echo "==> Browser checks"
(
  cd "$repo_root/src/RizzyUI.Docs"
  SMOKE_BASE_URL="http://127.0.0.1:$port" npx playwright test -c playwright.consumer-smoke.config.ts
) || { echo "--- consumer server log ---"; cat "$work/server.log"; exit 1; }

echo "==> Consumer smoke test passed for RizzyUI $version"
