# lib/course

Course catalog and route metadata live here.

- `catalog.ts` contains client-safe public course tool metadata for navigation, search, and route lookup.
- `source-materials.dev.ts` contains dev/server-only PDF provenance and must not be imported into client-facing UI.
- Keep raw lecture and homework browsing out of the V0 website.
