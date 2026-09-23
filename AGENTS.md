# AGENTS.md

Project guidelines for AI agents working in this repository.

## Loading rules (lazy loading)

- Do NOT load all rules and instructions up front.
- Read this file first, then load additional guidance only when the current prompt requires it.
- Load dependency documentation on demand, never preemptively.

## Dependency documentation

- When dependency docs must be read, search the **Context7 MCP connection first** (highest priority).
- Only fall back to other sources if Context7 does not have the content.

## File naming

- All files MUST be named using **kebab-case**: `user-profile.ts`, `get-courses.py`, `my-component.tsx`.
- No camelCase, PascalCase, snake_case, or spaces in file names.

##general rules

- All the code generated must be inside the /src directory.
- All dependencies must be installed using the last stable version.
- When creating functions, the classic function syntax must be a priority.
- Always try to use the typescript inferential typing whenever possible.
- Always try to use named imports.

## Development Guidelines

- For entities creation: @./agents/rules/new-entity.md
