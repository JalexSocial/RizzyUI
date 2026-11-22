#!/usr/bin/env bash
# Installs the packed RizzyUI.Templates package in an isolated template hive, creates an app with
# `dotnet new rizzyui` for each target framework, builds and publishes it against the locally
# packed RizzyUI packages, runs it and checks its pages over HTTP.
#
# Usage: bash eng/template-test.sh <nupkg-dir> <rizzyui-version> [<npm-tarball>] [<framework>...]
#
# <nupkg-dir> must hold RizzyUI.Templates.<version>.nupkg and RizzyUI.<version>.nupkg (and
# RizzyUI.Tasks when RizzyUI depends on a version that is not on nuget.org yet). With
# <npm-tarball>, the generated app installs @jalexsocial/rizzyui from it instead of the registry,
# for versions that are not published yet. Frameworks default to net10.0; the release workflow
# passes net10.0 net11.0.
#
# Requires: a .NET SDK for each framework tested, Node.js 20+, curl. The app builds outside this
# repository, so the newest installed SDK is used, not the one global.json selects.
set -euo pipefail

nupkg_dir="$(cd "${1:?nupkg directory required}" && pwd)"
version="${2:?RizzyUI version required}"
npm_tarball="${3:-}"
shift $(( $# < 3 ? $# : 3 ))
frameworks=("$@")
if [[ ${#frameworks[@]} -eq 0 ]]; then frameworks=(net10.0); fi
port="${TEMPLATE_TEST_PORT:-5198}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

work="$(mktemp -d)"
server_pid=""

native_path() {
  if command -v cygpath >/dev/null 2>&1; then cygpath -w "$1"; else printf '%s' "$1"; fi
}
cleanup() {
  if [[ -n "$server_pid" ]]; then kill "$server_pid" 2>/dev/null || true; fi
  rm -rf "$work"
}
trap cleanup EXIT

template_pkg="$nupkg_dir/RizzyUI.Templates.$version.nupkg"
if [[ ! -f "$template_pkg" ]]; then
  echo "error: $template_pkg not found" >&2
  exit 1
fi
if [[ -n "$npm_tarball" ]]; then
  npm_tarball="$(cd "$(dirname "$npm_tarball")" && pwd)/$(basename "$npm_tarball")"
fi

hive="$(native_path "$work/hive")"
echo "==> Install the template package in an isolated hive"
dotnet new install "$(native_path "$template_pkg")" --debug:custom-hive "$hive"

# Isolated package cache and sources: RizzyUI must come from <nupkg-dir>, never nuget.org or the
# machine cache.
export NUGET_PACKAGES="$(native_path "$work/.nuget/packages")"

expect_status() {
  local expected="$1" path="$2" body
  body="$work/response.html"
  local status
  status=$(curl -sS -o "$body" -w '%{http_code}' "${@:3}" "http://127.0.0.1:$port$path")
  if [[ "$status" != "$expected" ]]; then
    echo "error: GET $path returned $status, expected $expected" >&2
    head -c 2000 "$body" >&2 || true
    return 1
  fi
}
expect_text() {
  if ! grep -q -- "$1" "$work/response.html"; then
    echo "error: response does not contain '$1'" >&2
    head -c 2000 "$work/response.html" >&2 || true
    return 1
  fi
}

expect_no_text() {
  if grep -q -- "$1" "$work/response.html"; then
    echo "error: response unexpectedly contains '$1'" >&2
    return 1
  fi
}

# Each check returns on the first failure (set -e does not apply inside a function called in a
# condition).
http_checks() {
  local partial=(-H 'HX-Request: true' -H 'HX-Request-Type: partial')

  # Full pages render inside the sidebar layout.
  expect_status 200 / || return 1
  expect_text 'data-slot="sidebar"' || return 1
  expect_text 'Newest customers' || return 1
  expect_text '/css/app.css' || return 1
  # The dashboard's code-behind component: its module is referenced by a fingerprinted URL
  # (MapStaticAssets + WithStaticAssets) that is served with a long-lived cache.
  local module
  module=$(grep -o 'x-load-src="[^"]*WelcomeTip[^"]*"' "$work/response.html" | head -1 | sed 's/x-load-src="//; s/"$//')
  if [[ ! "$module" =~ ^/Features/Home/WelcomeTip\.[a-z0-9]+\.razor\.js$ ]]; then
    echo "error: expected a fingerprinted WelcomeTip module URL on /, found '$module'" >&2; return 1
  fi
  expect_status 200 "$module" -D "$work/headers.txt" || return 1
  if ! grep -qi 'cache-control: max-age=31536000, immutable' "$work/headers.txt"; then
    echo "error: $module is not served with an immutable cache header" >&2; cat "$work/headers.txt" >&2; return 1
  fi
  expect_status 200 /customers || return 1
  expect_text 'id="customer-table"' || return 1
  expect_text 'data-slot="sidebar"' || return 1

  # Fragments render without the layout.
  expect_status 200 '/customers/table?q=ada&page=1' "${partial[@]}" || return 1
  expect_text 'id="customer-table"' || return 1
  expect_no_text 'data-slot="sidebar"' || return 1
  expect_status 200 /fragments/activity "${partial[@]}" || return 1
  expect_text 'id="activity-feed"' || return 1
  expect_no_text 'data-slot="sidebar"' || return 1

  # The settings form: an invalid post returns 422 with the errors and keeps the posted values;
  # a valid post confirms the save.
  local jar="$work/cookies.txt" token
  rm -f "$jar"
  expect_status 200 /settings -c "$jar" || return 1
  expect_text 'id="settings-form"' || return 1
  token=$(grep -o 'name="__RequestVerificationToken" type="hidden" value="[^"]*"\|name="__RequestVerificationToken" value="[^"]*"' "$work/response.html" | head -1 | sed 's/.*value="//; s/"$//')
  if [[ -z "$token" ]]; then echo "error: no antiforgery token on /settings" >&2; return 1; fi
  expect_status 422 /settings -b "$jar" "${partial[@]}" \
    --data-urlencode "__RequestVerificationToken=$token" --data-urlencode "_handler=Profile" \
    --data-urlencode "Profile.DisplayName=Grace" --data-urlencode "Profile.Email=not-an-email"     --data-urlencode "Profile.Bio=Compiler pioneer" || return 1
  expect_text 'not a valid e-mail address' || return 1
  expect_text 'value="not-an-email"' || return 1
  expect_text '>Compiler pioneer</textarea>' || return 1
  expect_no_text 'data-slot="sidebar"' || return 1
  expect_status 200 /settings -b "$jar" "${partial[@]}" \
    --data-urlencode "__RequestVerificationToken=$token" --data-urlencode "_handler=Profile" \
    --data-urlencode "Profile.DisplayName=Grace" --data-urlencode "Profile.Email=grace@example.com" || return 1
  expect_text 'Your profile was updated' || return 1

  # Unknown URLs render the 404 page inside the layout.
  expect_status 404 /does-not-exist || return 1
  expect_text 'Page not found' || return 1
  expect_text 'data-slot="sidebar"' || return 1
  # ...but not into an htmx partial request's target (SF-020): the 404 stays empty.
  expect_status 404 /does-not-exist "${partial[@]}" || return 1
  expect_no_text 'Page not found' || return 1
  # Other error statuses keep their code instead of becoming "page not found" (SF-020).
  expect_status 400 /settings -X POST --data-urlencode "_handler=Profile" || return 1
  expect_text 'Bad request' || return 1
  # Body-level boosting: htmx 4 inherits only hx-boost:inherited (SF-021).
  expect_status 200 / || return 1
  expect_text 'hx-boost:inherited="true"' || return 1

  # The stylesheet holds RizzyUI's component classes (from the npm package's safelist), not only
  # the classes the app's own markup uses.
  expect_status 200 /css/app.css || return 1
  expect_text '\.bg-sidebar{' || return 1
}

for framework in "${frameworks[@]}"; do
  app="$work/$framework/Contoso.Web"
  echo "==> dotnet new rizzyui ($framework)"
  dotnet new rizzyui -o "$(native_path "$app")" -n Contoso.Web --framework "$framework" --no-restore --debug:custom-hive "$hive"

  if grep -rq "RizzyUI.Starter\|RIZZYUI_VERSION" "$app" --exclude-dir=node_modules; then
    echo "error: the generated app still contains template tokens:" >&2
    grep -rn "RizzyUI.Starter\|RIZZYUI_VERSION" "$app" >&2
    exit 1
  fi
  grep -q "<TargetFramework>$framework</TargetFramework>" "$app/Contoso.Web.csproj"

  echo "==> dotnet new rizzyui-codebehind"
  dotnet new rizzyui-codebehind -n Counter -o "$(native_path "$app/Features/Home")" --debug:custom-hive "$hive"
  for file in Counter.razor Counter.razor.js; do
    if [[ ! -f "$app/Features/Home/$file" ]]; then echo "error: rizzyui-codebehind did not create $file" >&2; exit 1; fi
  done
  if [[ -f "$app/Features/Home/Counter.razor.ts" ]]; then echo "error: rizzyui-codebehind created a .razor.ts without --typescript" >&2; exit 1; fi
  grep -q "Include=\"RizzyUI\" Version=\"$version\"" "$app/Contoso.Web.csproj"

  cat > "$app/nuget.config" <<EOF
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

  if [[ -n "$npm_tarball" ]]; then
    echo "==> npm: use the packed @jalexsocial/rizzyui"
    (cd "$app" && npm pkg set "devDependencies.@jalexsocial/rizzyui=file:$(native_path "$npm_tarball")")
  fi

  echo "==> Build (runs npm install and Tailwind) and publish"
  (cd "$app" && dotnet build -c Release --nologo)
  if [[ ! -s "$app/wwwroot/css/app.css" ]]; then
    echo "error: Tailwind did not produce wwwroot/css/app.css" >&2
    exit 1
  fi
  if [[ ! -s "$app/obj/rizzyui/rizzyui.d.ts" ]]; then
    echo "error: the build did not copy RizzyUI's type declarations to obj/rizzyui/rizzyui.d.ts" >&2
    exit 1
  fi
  (cd "$app" && dotnet publish -c Release -o "$work/$framework/publish" --nologo)
  for file in wwwroot/css/app.css wwwroot/_content/RizzyUI/js/rizzyui.min.js; do
    if [[ ! -f "$work/$framework/publish/$file" ]]; then
      echo "error: published app is missing $file" >&2
      exit 1
    fi
  done
  if [[ -f "$work/$framework/publish/package.json" ]]; then
    echo "error: package.json was published" >&2
    exit 1
  fi

  echo "==> Run the published app on port $port"
  (
    cd "$work/$framework/publish"
    ASPNETCORE_URLS="http://127.0.0.1:$port" ASPNETCORE_ENVIRONMENT=Production dotnet Contoso.Web.dll
  ) > "$work/server.log" 2>&1 &
  server_pid=$!
  for _ in $(seq 1 60); do
    if curl -fsS "http://127.0.0.1:$port/" >/dev/null 2>&1; then break; fi
    if ! kill -0 "$server_pid" 2>/dev/null; then
      echo "error: the app exited during startup" >&2
      cat "$work/server.log" >&2
      exit 1
    fi
    sleep 1
  done

  echo "==> HTTP checks"
  if ! http_checks; then
    echo "--- server log ---"
    cat "$work/server.log"
    exit 1
  fi

  # Browser checks: boosted navigation and the 404 page's link button. They use the docs app's
  # Playwright install (src/RizzyUI.Docs: npm ci && npx playwright install chromium).
  if [[ -d "$repo_root/src/RizzyUI.Docs/node_modules/@playwright/test" ]]; then
    echo "==> Browser checks"
    if ! (cd "$repo_root/src/RizzyUI.Docs" && TEMPLATE_BASE_URL="http://127.0.0.1:$port" npx playwright test -c playwright.template.config.ts); then
      echo "--- server log ---"
      cat "$work/server.log"
      exit 1
    fi
  else
    echo "==> Browser checks skipped (no Playwright in src/RizzyUI.Docs/node_modules)"
  fi

  kill "$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
  server_pid=""
  echo "==> $framework passed"
done

echo "==> Template test passed for RizzyUI.Templates $version"
