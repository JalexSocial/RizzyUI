#!/usr/bin/env python3
"""Check the RizzyUI NuGet and npm packages the way a consumer receives them.

Usage:
    python eng/check-package-contents.py <nupkg-dir> [<npm-tarball>]

Fails (exit code 1) when a package:
  * is missing the runtime entry points (rizzyui.js, rizzyui-csp.js, chunks, CSS);
  * ships unit tests or repository tooling files (package.json, lock files) as content;
  * does not depend on Rizzy 6.x (NuGet);
  * has a `file:`/`link:` dependency, a non-peer htmx dependency, an `exports` target that is
    not in the tarball, or CSS that imports a package it does not depend on (npm).

When <nupkg-dir> also holds a RizzyUI.Templates package, it must be a Template package with the
starter app, no build output, and RizzyUI and @jalexsocial/rizzyui pinned to its own version.

When <nupkg-dir> also holds a RizzyUI.Tasks package, it must contain the task assembly and its
build/buildTransitive targets, and its version must be the one RizzyUI depends on.
"""
from __future__ import annotations

import io
import json
import re
import sys
import tarfile
import zipfile
from pathlib import Path

errors: list[str] = []


def fail(message: str) -> None:
    errors.append(message)


def is_test_file(name: str) -> bool:
    return "/__tests__/" in name or re.search(r"\.test\.m?js$", name) is not None


def check_nupkg(path: Path) -> str | None:
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        nuspec_name = next((n for n in names if n.endswith(".nuspec")), None)
        if nuspec_name is None:
            fail(f"{path.name}: no .nuspec")
            return
        nuspec = archive.read(nuspec_name).decode("utf-8-sig")

    print(f"{path.name}: {len(names)} entries")

    required = [
        "lib/net10.0/RizzyUI.dll",
        "lib/net10.0/RizzyUI.xml",
        "staticwebassets/js/rizzyui.js",
        "staticwebassets/js/rizzyui-csp.js",
        "staticwebassets/css/rizzyui.css",
        "build/RizzyUI.targets",
        "types/rizzyui.d.ts",
        "README.md",
        "LICENSE.md",
    ]
    for entry in required:
        if entry not in names:
            fail(f"{path.name}: missing {entry}")

    if not any(n.startswith("staticwebassets/js/chunks/") for n in names):
        fail(f"{path.name}: no lazily loaded chunks under staticwebassets/js/chunks/")

    tests = [n for n in names if is_test_file(n)]
    if tests:
        fail(f"{path.name}: ships unit tests: {tests[:5]}")

    content = [n for n in names if n.startswith("content/") or n.startswith("contentFiles/")]
    if content:
        fail(f"{path.name}: ships content files that would be added to consuming projects: {content}")

    rizzy = re.search(r'<dependency id="Rizzy" version="([^"]+)"', nuspec)
    if rizzy is None:
        fail(f"{path.name}: no dependency on Rizzy")
    elif not re.match(r"\[?6\.", rizzy.group(1)):
        fail(f"{path.name}: depends on Rizzy {rizzy.group(1)}; RizzyUI targets Rizzy 6.x")
    else:
        print(f"  depends on Rizzy {rizzy.group(1)}")

    tasks = re.search(r'<dependency id="RizzyUI.Tasks" version="([^"]+)"', nuspec)
    if tasks is None:
        fail(f"{path.name}: no dependency on RizzyUI.Tasks")
        return None
    print(f"  depends on RizzyUI.Tasks {tasks.group(1)}")
    return tasks.group(1).strip("[]")


def check_tasks_nupkg(path: Path) -> str | None:
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        nuspec_name = next((n for n in names if n.endswith(".nuspec")), None)
        if nuspec_name is None:
            fail(f"{path.name}: no .nuspec")
            return None
        nuspec = archive.read(nuspec_name).decode("utf-8-sig")

    print(f"{path.name}: {len(names)} entries")

    for entry in ("build/RizzyUI.Tasks.targets", "buildTransitive/RizzyUI.Tasks.targets", "README.md", "LICENSE.md"):
        if entry not in names:
            fail(f"{path.name}: missing {entry}")

    # netstandard2.0 so the task also loads in .NET Framework MSBuild (Visual Studio).
    task_dll = "tasks/netstandard2.0/RizzyUI.Tasks.dll"
    if task_dll not in names:
        found = [n for n in names if re.fullmatch(r"tasks/[^/]+/RizzyUI\.Tasks\.dll", n)]
        fail(f"{path.name}: missing {task_dll} (found {found or 'no task assembly'}); RizzyUI.Tasks must target netstandard2.0")
    else:
        print(f"  {task_dll}")

    msbuild = [n for n in names if re.fullmatch(r"tasks/[^/]+/Microsoft\.Build(\.[A-Za-z.]+)?\.dll", n)]
    if msbuild:
        fail(f"{path.name}: ships MSBuild's own assemblies, which the host MSBuild provides: {msbuild}")

    if any(n.startswith("lib/") for n in names):
        fail(f"{path.name}: ships lib/ assets; the task assembly belongs under tasks/<tfm>/ only")

    version = re.search(r"<version>([^<]+)</version>", nuspec)
    return version.group(1) if version else None


def check_templates_nupkg(path: Path) -> None:
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        nuspec_name = next((n for n in names if n.endswith(".nuspec")), None)
        if nuspec_name is None:
            fail(f"{path.name}: no .nuspec")
            return
        nuspec = archive.read(nuspec_name).decode("utf-8-sig")
        content = {n: archive.read(n) for n in names if n.startswith("content/")}

    print(f"{path.name}: {len(names)} entries")

    if not re.search(r'<packageType name="Template"', nuspec):
        fail(f"{path.name}: package type is not Template")
    version_match = re.search(r"<version>([^<]+)</version>", nuspec)
    version = version_match.group(1) if version_match else None

    root = "content/RizzyUI.Starter/"
    for entry in (".template.config/template.json", ".template.config/dotnetcli.host.json", "RizzyUI.Starter.csproj",
                  "package.json", "Program.cs", "Styles/app.css", ".gitignore"):
        if root + entry not in content:
            fail(f"{path.name}: missing {root}{entry}")

    unwanted = [n for n in content if re.search(r"/(bin|obj|node_modules)/", n) or n.endswith("wwwroot/css/app.css")]
    if unwanted:
        fail(f"{path.name}: ships build output or packages: {unwanted[:5]}")

    tokens = [n for n, data in content.items() if b"RIZZYUI_VERSION" in data]
    if tokens:
        fail(f"{path.name}: RIZZYUI_VERSION was not replaced in {tokens}")

    # The template must pin the RizzyUI packages of its own version.
    csproj = content.get(root + "RizzyUI.Starter.csproj", b"").decode("utf-8")
    pinned = re.search(r'<PackageReference Include="RizzyUI" Version="([^"]+)"', csproj)
    if not pinned or pinned.group(1) != version:
        fail(f"{path.name}: the starter references RizzyUI {pinned.group(1) if pinned else None}, expected {version}")
    package_json = json.loads(content.get(root + "package.json", b"{}"))
    npm_pin = (package_json.get("devDependencies") or {}).get("@jalexsocial/rizzyui")
    if npm_pin != version:
        fail(f"{path.name}: the starter's package.json pins @jalexsocial/rizzyui {npm_pin!r}, expected {version}")
    print(f"  pins RizzyUI and @jalexsocial/rizzyui {version}")


def check_npm(path: Path) -> None:
    with tarfile.open(path, "r:gz") as archive:
        names = [m.name for m in archive.getmembers() if m.isfile()]
        manifest = json.load(io.TextIOWrapper(archive.extractfile("package/package.json"), "utf-8"))
        css = {m.name: archive.extractfile(m).read().decode("utf-8", "replace")
               for m in archive.getmembers() if m.isfile() and m.name.startswith("package/dist/css/") and m.name.endswith(".css")}

    # Consumers compile rizzyui-plugin.css with Tailwind, so every package its CSS imports by name
    # must be installed with it.
    installed = set(manifest.get("dependencies") or {}) | set(manifest.get("peerDependencies") or {})
    for name, text in css.items():
        for spec in re.findall(r'@(?:import|plugin)\s+"([^"./][^"]*)"', text):
            package = "/".join(spec.split("/")[:2]) if spec.startswith("@") else spec.split("/")[0]
            if package != "tailwindcss" and package not in installed:
                fail(f"{path.name}: {name.removeprefix('package/')} imports {spec!r}, but {package} is not a dependency")

    files = {n.removeprefix("package/") for n in names}
    print(f"{path.name}: {len(files)} files, version {manifest.get('version')}")

    tests = [n for n in files if is_test_file(n)]
    if tests:
        fail(f"{path.name}: ships unit tests: {tests[:5]}")

    for section in ("dependencies", "optionalDependencies"):
        for name, spec in (manifest.get(section) or {}).items():
            if spec.startswith(("file:", "link:", "workspace:")):
                fail(f"{path.name}: {section}.{name} is a local reference ({spec})")
            if name == "htmx.org":
                fail(f"{path.name}: htmx.org must be a peer dependency, not {section}")

    peer = (manifest.get("peerDependencies") or {}).get("htmx.org")
    if peer is None or not re.match(r"\^?4\.", peer):
        fail(f"{path.name}: peerDependencies.htmx.org should allow htmx 4 (found {peer!r})")

    def targets(value):
        if isinstance(value, str):
            yield value
        elif isinstance(value, dict):
            for nested in value.values():
                yield from targets(nested)

    for key, value in (manifest.get("exports") or {}).items():
        for target in targets(value):
            if "*" in target:
                continue
            if target.removeprefix("./") not in files:
                fail(f"{path.name}: exports[{key!r}] -> {target} is not in the package")

    for field in ("main", "module"):
        target = manifest.get(field)
        if target and target.removeprefix("./") not in files:
            fail(f"{path.name}: {field} -> {target} is not in the package")

    for entry in ("dist/js/rizzyui.js", "dist/js/rizzyui-csp.js", "dist/css/rizzyui-plugin.css"):
        if entry not in files:
            fail(f"{path.name}: missing {entry}")


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2

    nupkg_dir = Path(argv[1])
    packages = sorted(p for p in nupkg_dir.glob("RizzyUI.*.nupkg")
                      if not p.name.startswith(("RizzyUI.Tasks.", "RizzyUI.Templates.")))
    if not packages:
        fail(f"no RizzyUI.*.nupkg in {nupkg_dir}")
    required_tasks_versions = {v for v in (check_nupkg(p) for p in packages) if v}

    for templates in sorted(nupkg_dir.glob("RizzyUI.Templates.*.nupkg")):
        check_templates_nupkg(templates)

    tasks_packages = sorted(nupkg_dir.glob("RizzyUI.Tasks.*.nupkg"))
    tasks_versions = {v for v in (check_tasks_nupkg(p) for p in tasks_packages) if v}
    if tasks_packages:
        for required in sorted(required_tasks_versions - tasks_versions):
            fail(f"RizzyUI depends on RizzyUI.Tasks {required}, but {nupkg_dir} only has {sorted(tasks_versions)}")

    if len(argv) > 2:
        check_npm(Path(argv[2]))

    if errors:
        print("\nPackage check FAILED:")
        for error in errors:
            print(f"  - {error}")
        return 1

    print("\nPackage check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
