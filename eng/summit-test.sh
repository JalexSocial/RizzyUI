#!/usr/bin/env bash
# Tests the Summit demo app against the packed RizzyUI packages, the way a consumer gets them:
# publishes Summit.Web in Package mode (the RizzyUI NuGet package and the npm tarball instead of the
# repository projects), checks the publish output, starts two published servers (standard and strict
# CSP) in the Production environment, and runs the browser tests against them.
#
# Usage: bash eng/summit-test.sh <nupkg-dir> <rizzyui-version> <npm-tarball>
#
# Requires: .NET 10 SDK, Node.js 22+, and Playwright's Chromium installed for samples/Summit/tests/e2e
# (`npm ci && npx playwright install chromium`), or a Chrome on Windows.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
nupkg_dir="$(cd "${1:?nupkg directory required}" && pwd)"
version="${2:?RizzyUI package version required}"
npm_tarball_arg="${3:?npm tarball required}"
npm_tarball="$(cd "$(dirname "$npm_tarball_arg")" && pwd)/$(basename "$npm_tarball_arg")"
port="${SUMMIT_PORT:-5280}"
csp_port="${SUMMIT_CSP_PORT:-5281}"

web="$repo_root/samples/Summit/src/Summit.Web"
e2e="$repo_root/samples/Summit/tests/e2e"
work="$(mktemp -d)"
pids=()

native_path() {
  if command -v cygpath >/dev/null 2>&1; then cygpath -w "$1"; else printf '%s' "$1"; fi
}
cleanup() {
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
  # Git Bash on Windows: killing the subshell leaves the dotnet server running, so stop whatever
  # listens on the two ports.
  if command -v taskkill >/dev/null 2>&1; then
    for p in "$port" "$csp_port"; do
      netstat -ano 2>/dev/null | awk -v p=":$p" '$2 ~ p"$" && $4 == "LISTENING" { print $5 }' | sort -u         | while read -r winpid; do taskkill //F //PID "$winpid" >/dev/null 2>&1 || true; done
    done
  fi
  rm -rf "$work" 2>/dev/null || true
  # Locally, put the repository's @jalexsocial/rizzyui link back for normal (Project mode) builds.
  if [[ -z "${CI:-}" ]]; then (cd "$web" && npm ci --no-audit --no-fund >/dev/null 2>&1) || true; fi
}
trap cleanup EXIT

echo "==> npm: the packed @jalexsocial/rizzyui instead of packages/rizzyui"
(
  cd "$web"
  npm ci --no-audit --no-fund
  # --no-save: package.json and the lockfile keep pointing at the repository (the tree stays clean).
  npm install --no-save --no-audit --no-fund "$npm_tarball"
  if [[ -L node_modules/@jalexsocial/rizzyui ]]; then
    echo "error: @jalexsocial/rizzyui is still linked to the repository, not installed from $npm_tarball" >&2
    exit 1
  fi
  npm run build:css
  echo "==> Code-behind unit tests against the tarball"
  npm test
)

echo "==> Publish Summit.Web with RizzyUI $version from $nupkg_dir"
dotnet publish "$web/Summit.Web.csproj" -c Release -o "$work/publish" --nologo \
  -p:SummitRizzyUISource=Package -p:RizzyUIVersion="$version" -p:SkipNpm=true \
  -p:RestoreAdditionalProjectSources="$(native_path "$nupkg_dir")"

assets_file="$web/obj-package/project.assets.json"
if ! grep -q "\"RizzyUI/$version\"" "$assets_file"; then
  echo "error: Summit.Web did not restore RizzyUI $version (see $assets_file)" >&2
  exit 1
fi

echo "==> Check the publish output"
publish_root="$work/publish/wwwroot"
for asset in _content/RizzyUI/js/rizzyui.min.js _content/RizzyUI/js/rizzyui-csp.min.js css/app.css lib/htmx/htmx.min.js; do
  [[ -f "$publish_root/$asset" ]] || { echo "error: the published app is missing wwwroot/$asset" >&2; exit 1; }
done
if [[ -f "$work/publish/package.json" || -f "$work/publish/package-lock.json" || -f "$work/publish/tsconfig.json" ]]; then
  echo "error: package.json, package-lock.json or tsconfig.json was published" >&2
  exit 1
fi
modules=$(find "$publish_root" -name "*.razor.js" -not -name "*.gz" -not -name "*.br" | wc -l)
# Every *.razor.js / *.razor.ts module in the source is bundled into one published *.razor.js.
expected=$(find "$web" \( -name node_modules -o -name 'bin*' -o -name 'obj*' -o -name .test-build -o -name tests -o -name wwwroot \) -prune \
  -o \( -name "*.razor.js" -o -name "*.razor.ts" \) -print | wc -l)
if [[ "$expected" -lt 1 || "$modules" -lt "$expected" ]]; then
  echo "error: expected the $expected bundled code-behind modules in the publish output, found $modules" >&2
  exit 1
fi
if ! find "$publish_root" -name "AttendeeTableState*.razor.js" | grep -q .; then
  echo "error: the TypeScript code-behind module (AttendeeTableState.razor.ts) was not bundled" >&2
  exit 1
fi
if ! find "$publish_root/_content/RizzyUI/js" -name "rizzyui.min.js.br" | grep -q . \
   || ! find "$publish_root/_content/RizzyUI/js" -name "rizzyui.min.js.gz" | grep -q .; then
  echo "error: compressed (.br/.gz) RizzyUI assets are missing from the publish output" >&2
  exit 1
fi
echo "    $modules code-behind modules, compressed assets, no npm files"

start_server() {
  local name="$1" server_port="$2" csp="$3"
  (
    cd "$work/publish"
    ASPNETCORE_URLS="http://127.0.0.1:$server_port" \
    ASPNETCORE_ENVIRONMENT=Production \
    Summit__EnableTestHooks=true \
    Summit__FixedNow="2027-06-14T08:00:00+00:00" \
    Summit__CheckIn__PollSeconds=1 \
    Summit__Csp__Enabled="$csp" \
    Summit__Database__Path="$(native_path "$work/$name.db")" \
    Summit__DemoOrganizer__Email=organizer@summit.test \
    Summit__DemoOrganizer__Password=summit-demo-2027 \
    Logging__LogLevel__Default=Warning \
    dotnet Summit.Web.dll
  ) > "$work/$name.log" 2>&1 &
  pids+=($!)
}

echo "==> Start the published servers (Production, test hooks on)"
start_server standard "$port" false
start_server csp "$csp_port" true
for url in "http://127.0.0.1:$port/" "http://127.0.0.1:$csp_port/"; do
  for _ in $(seq 1 90); do
    if curl -fsS "$url" >/dev/null 2>&1; then break; fi
    for pid in "${pids[@]}"; do
      if ! kill -0 "$pid" 2>/dev/null; then
        echo "error: a published server exited during startup" >&2
        cat "$work"/*.log >&2
        exit 1
      fi
    done
    sleep 1
  done
  curl -fsS "$url" >/dev/null || { echo "error: $url did not start" >&2; cat "$work"/*.log >&2; exit 1; }
done

echo "==> Browser tests against the published servers"
(
  cd "$e2e"
  SUMMIT_BASE_URL="http://127.0.0.1:$port" SUMMIT_CSP_BASE_URL="http://127.0.0.1:$csp_port" npx playwright test
) || {
  for name in standard csp; do echo "--- $name server log ---"; tail -n 200 "$work/$name.log"; done
  exit 1
}

echo "==> Summit passed against RizzyUI $version"
