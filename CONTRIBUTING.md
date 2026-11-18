# Contributing to RizzyUI

Thank you for considering a contribution to RizzyUI, the SSR-first Razor component library for
[Rizzy](https://github.com/JalexSocial/Rizzy).

- **Questions and ideas:** use the GitHub Discussions or Issues of
  [JalexSocial/RizzyUI](https://github.com/JalexSocial/RizzyUI). For a significant change, open an
  issue first.
- **Workflow:** fork, branch from `main`, and open a pull request against `main`. `main` is the only
  long-lived branch; CI must pass before a pull request is merged. Use
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Component conventions:** [AGENTS.md](AGENTS.md) and `docs/agents/` define how components,
  styling, Alpine behavior, accessibility, tests and documentation pages are written. RizzyUI is
  SSR-only: interactivity uses Alpine.js and htmx, never Blazor interactive rendering.
- **Build and test:** [docs/contributing/development.md](docs/contributing/development.md) lists the
  commands CI runs.
- **Breaking changes:** list them in `CHANGELOG.md` with a migration note. CI fails on an
  unrecorded public API change; see
  [docs/contributing/api-compatibility.md](docs/contributing/api-compatibility.md).
- **Releases** are cut by maintainers from a version tag:
  [docs/contributing/releasing.md](docs/contributing/releasing.md).

Contributions are licensed under the [MIT License](LICENSE.md).
