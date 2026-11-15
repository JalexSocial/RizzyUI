#!/usr/bin/env bash
# Packs RizzyUI.Tasks into <out-dir> and prints its version on stdout.
#
# RizzyUI and RizzyUI.Docs reference RizzyUI.Tasks as a package, at the version set in
# src/Directory.Build.props (RizzyUITasksVersion). When that version is not on nuget.org yet, restore
# them with <out-dir> as an extra package source:
#
#   bash eng/pack-tasks.sh ./artifacts/nupkgs
#   dotnet restore src/RizzyUI.sln -p:RestoreAdditionalProjectSources="$PWD/artifacts/nupkgs"
#
# Usage: eng/pack-tasks.sh <out-dir>
set -euo pipefail
out="${1:?usage: eng/pack-tasks.sh <out-dir>}"
project="$(dirname "$0")/../src/RizzyUI.Tasks/RizzyUI.Tasks.csproj"

dotnet pack "$project" -c Release -o "$out" --nologo >&2
dotnet msbuild "$project" -nologo -getProperty:Version | tr -d '\r'
