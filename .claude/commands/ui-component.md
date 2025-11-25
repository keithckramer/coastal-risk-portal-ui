---
description: Create a UI Component in /components/ui
argument-hint: Component name | Component summary
---
# Create New React Component

## Command ID

`COMMAND_ID`: ui-component

## Summary

* **Intent:** Create a new TypeScript React component in the Coastal Risk Portal UI repo following existing conventions, with optional test and story files, and barrel export updates.
* **Repo:** Coastal Risk Portal UI
* **Scope:** Front-end React components under `src/**` (e.g. `src/components`, feature folders, or other established UI directories).
* **When to use:** When you want to add a new UI component to this project and have the AI generate the component file (and optionally test/story files) in a way that matches the repo’s current patterns and code style.

## Inputs

| Name                | Type    | Required | Default                        | Description                                                                                                                                                                               |
| ------------------- | ------- | -------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| component_name      | string  | No       | *Prompt user if missing*       | PascalCase component name, e.g. `DashboardCard`.                                                                                                                                          |
| target_folder       | string  | No       | Auto-detect / `src/components` | Target folder **relative to repo root** (e.g. `src/components`, `src/features/renewals/components`). If not provided, AI infers the main components directory and confirms with user.     |
| description         | string  | No       | `""`                           | Short description of what the component does and any important behavior.                                                                                                                  |
| props_spec          | string  | No       | `""`                           | Free-form description of expected props and their types (e.g. `title: string; value: number; onClick?: () => void`).                                                                      |
| include_test        | boolean | No       | Auto-detect                    | If `true`, always create a test file. If `false`, skip. If omitted, AI inspects repo to see if tests exist and follows that convention.                                                   |
| include_story       | boolean | No       | Auto-detect / `false`          | If `true`, create a Storybook (or equivalent) story file **if the repo uses one**. If omitted, AI inspects for Storybook/other story tooling and only generates a story when appropriate. |
| export_from_index   | boolean | No       | `true`                         | If `true`, and the target folder has a barrel file (`index.ts`/`index.tsx`), export the new component from it.                                                                            |
| overwrite_if_exists | boolean | No       | `false`                        | If `true`, AI may overwrite an existing component file **after clearly confirming with the user**. If `false`, never overwrite; instead, warn and/or propose an alternative name.         |

## Preconditions

* User is in the repo root of `coastal-risk-portal-ui` (or Claude Code / workspace is attached to this repo).
* Node modules are installed (`npm install` or `pnpm install` or `yarn` has been run previously) so tooling and config files exist.
* Git workspace is clean or changes are intentionally staged; user understands this command will create/modify files.

## Behaviour

1. **Understand context & inputs**

   * Read the command inputs (`component_name`, `target_folder`, `description`, `props_spec`, flags).
   * If `component_name` is missing, ask the user for a PascalCase component name. Validate it (letters/numbers only, starts with uppercase letter).
   * If `target_folder` is missing, scan `src/**` to infer the primary components directory (e.g. `src/components`); if ambiguous, present 2–3 plausible options and ask the user to choose.

2. **Infer project conventions**

   * Inspect `package.json`, `tsconfig*.json`, `eslint.config.js`, and existing files under `src/**` to determine:

     * React + TypeScript + Vite usage (already implied by project template).
     * Whether components are `.tsx` and how they are structured (functional components, hooks, etc.).
     * Whether tests exist (look for `*.test.tsx`, `*.spec.tsx`, `vitest`, `jest`, React Testing Library, etc.).
     * Whether stories exist (look for `*.stories.tsx` or Storybook config).
     * Import style (relative vs alias paths), semicolons/quotes, and default vs named exports.
   * Use these conventions when generating new files.

3. **Determine paths & file names**

   * Normalize `target_folder` so it’s a path relative to repo root (e.g. `src/components`, no leading `./`).
   * Ensure the folder exists; if it doesn’t, propose creating it and confirm with the user.
   * Derive file names:

     * Component file: `<target_folder>/<ComponentName>.tsx`
     * Test file:

       * If repo convention is colocated tests: `<target_folder>/<ComponentName>.test.tsx` or `.spec.tsx`.
       * If repo uses a `__tests__` pattern: `<target_folder>/__tests__/<ComponentName>.test.tsx` (or matching pattern).
     * Story file (if applicable): `<target_folder>/<ComponentName>.stories.tsx` (or whichever extension matches existing stories).
   * If any of these files already exist:

     * When `overwrite_if_exists` is `false` (default):

       * Do **not** overwrite.
       * Tell the user which files already exist and suggest options such as `NewComponentName` or `ComponentNameV2`.
       * Only proceed after the user explicitly chooses a new name or confirms overwriting.
     * When `overwrite_if_exists` is `true`:

       * Explicitly ask the user to confirm overwriting each file before making destructive changes.
       * If the user declines, abort or use an alternative name.

4. **Generate the component file**

   * Create a new `.tsx` component that:

     * Imports React and any other necessary types/functions using the repo’s import style.
     * Defines a typed props interface or type alias based on `props_spec` and the repo’s pattern.
     * Defines a functional component (no class components) using TypeScript (e.g. `const ComponentName: React.FC<Props> = (props) => { ... }` or preferred pattern inferred from existing components).
     * Exports the component using the repo’s convention (named export vs default export).
     * Includes a minimal, semantically reasonable JSX structure tailored to `description`, such as wrapper `div`s or simple layout elements.
     * Includes clear `// TODO` comments indicating where to add:

       * Layout and styling.
       * Business logic.
       * Event handlers and state (if applicable).
   * Keep the initial implementation intentionally simple and non-opinionated while matching project conventions.

5. **Generate test file (if appropriate)**

   * Decide whether to create a test file:

     * If `include_test === true`, always create.
     * If `include_test === false`, skip.
     * If `include_test` is undefined, inspect repo; create tests when there is clear precedent (existing tests + test tooling).
   * When creating a test file:

     * Use the project’s established test framework (Vitest/Jest) and testing library (React Testing Library, etc.).
     * Import the component using the same path style used in existing tests.
     * Include a simple smoke test, e.g. “renders without crashing” and a minimal assertion based on a visible text or role.
     * Keep tests focused and small; add `// TODO` for additional test cases.

6. **Generate story file (if appropriate)**

   * If `include_story` is `true` or auto-detection indicates Storybook (or similar) is used:

     * Create a story file that follows existing stories’ structure and metadata format (`Meta`, `StoryObj`, CSF, etc.).
     * Include a simple default story with reasonable example props.
     * Add `// TODO` notes for additional variants and controls.
   * If the repo does not appear to use Storybook/any story framework, skip story generation and briefly note that in the response.

7. **Update barrel file (index) if present**

   * Check if the `target_folder` contains an `index.ts` or `index.tsx` barrel file.
   * If `export_from_index` is `true` and a barrel file exists:

     * Append a new export line following the existing pattern, e.g.:

       * `export { ComponentName } from './ComponentName';` **or**
       * `export * from './ComponentName';`
     * Do not reorder or drastically rewrite the barrel file; only append minimal changes.
   * If no barrel file exists, do nothing unless the user explicitly asks to create one.

8. **Respect safety & non-destructive behavior**

   * Never delete files.
   * Never overwrite existing files without explicit user confirmation.
   * Keep changes minimal and localized to:

     * The new component file.
     * The optional test file.
     * The optional story file.
     * The optional barrel export update.

9. **Summarize changes to the user**

   * After making changes, provide a concise summary including:

     * Created/updated file paths.
     * A short description of what each file contains.
     * Any remaining `TODO` items.
   * If you had to deviate from the inputs (e.g., different test naming convention discovered), explain why.

## Implementation Notes (For the AI / Tooling)

* **Tech stack assumptions:**

  * React + TypeScript + Vite front-end.
  * Modern React (function components and hooks).
  * Typical test tooling likely includes Vitest or Jest plus React Testing Library (verify from `package.json` and existing tests).
  * No assumptions about state management (Redux, Zustand, etc.); do not introduce new dependencies unless clearly in use.

* **File locations:**

  * Components:

    * Prefer an existing `src/components` directory if present.
    * Otherwise, identify the most appropriate folder based on existing patterns (e.g. `src/features/<feature>/components`, `src/pages`, etc.).
    * Always confirm with the user if there is uncertainty.
  * Tests:

    * Follow whichever pattern the repo uses: colocated tests (`ComponentName.test.tsx` / `.spec.tsx`) or `__tests__` directories.
  * Stories:

    * Only generate if repo clearly uses Storybook/another story framework.
    * Match existing extensions and naming conventions, e.g. `*.stories.tsx`.

* **Code style:**

  * Functional components only.
  * Use hooks when/if local state or side effects are needed; otherwise keep components stateless by default.
  * Use TypeScript interfaces/types for props; mirror patterns from existing components.
  * Respect import ordering, alias usage, semicolons, and quote style observed in the current codebase.
  * Use the same export style as the majority of components in the chosen folder (default vs named).

* **Safety rules:**

  * Allowed: create new files, append exports to existing barrel files, update new files you just created within this command execution.
  * Not allowed by default: overwriting existing component/test/story files, deleting files, or large-scale refactors.
  * Destructive changes (overwrites) require:

    * `overwrite_if_exists === true` **and** explicit confirmation from the user in the current conversation.
  * If in doubt, stop and ask the user before changing existing files.

## Prompt Template (Used When The Command Runs)

Below is the **exact prompt** that should be sent to the AI when this command is executed.
It may reference the inputs above using `{{variable_name}}` syntax.

---

You are an expert React + TypeScript + Vite front-end engineer working in the **Coastal Risk Portal UI** repository.

Your task: **create a new React component (and optional test/story files) following this repo’s existing conventions**, with minimal, safe changes.

### 1. Context & Inputs

Parse $ARGUMENTS to get the following values:

- [name]: Component name from $ARGUMENTS, converted to PascalCase
- [summary]: Comonent summary from $ARGUMENTS


You are running in a local checkout of the `coastal-risk-portal-ui` repo (branch `claude-edit-v2` or similar).

Use these inputs (they may be empty):

* `component_name`: `{{component_name}}`
* `target_folder`: `{{target_folder}}`
* `description`: `{{description}}`
* `props_spec`: `{{props_spec}}`
* `include_test`: `{{include_test}}`
* `include_story`: `{{include_story}}`
* `export_from_index`: `{{export_from_index}}`
* `overwrite_if_exists`: `{{overwrite_if_exists}}`

If any of these are blank/undefined, apply the rules below.

### 2. Infer project structure & conventions

1. Inspect the repo structure under `src/**` to identify:

   * Main components directories (e.g. `src/components`, feature-specific components).
   * Any existing `*.tsx` component files, their export patterns, and prop typing style.
   * Any existing test files: `*.test.tsx`, `*.spec.tsx`, `__tests__` folders.
   * Any existing story files: `*.stories.tsx` or similar.
2. Read:

   * `package.json` to discover test tooling (Vitest/Jest) and Storybook or similar.
   * `tsconfig*.json` for TS config and base paths.
   * `eslint.config.js` (or similar) to infer style rules if helpful.
3. Choose conventions that match the majority usage in the repo:

   * Use `.tsx` for React components.
   * Use functional components with TypeScript-typed props.
   * Use the repo’s typical import paths, export style, semicolons, and quotes.

If you are uncertain about a convention, briefly explain the options and choose the simplest, most idiomatic pattern.

### 3. Determine component name and folder

Make a UI Component according to the [name] and [summary] provided, following these guidelines:

- Create the component file in `src/components/ui/[name]/[name].tsx
- Use a functional component with the name [name]
- Reference the [summary] when making the comonent

1. **Component name:**

   * If `component_name` is empty, ask the user for a PascalCase name (e.g. `DashboardCard`, `PolicySummaryPanel`).
   * Validate: letters/numbers only, must start with an uppercase letter.
2. **Target folder:**

   * If `target_folder` is empty:

     * Look for an existing `src/components` folder.
     * If found, propose it as the default and confirm with the user.
     * If multiple reasonable options exist (e.g. feature-specific component directories), present 2–3 likely options and let the user choose.
   * Normalize `target_folder` to a path relative to repo root (no leading `./`).
   * If the folder does not exist, propose creating it and confirm with the user before doing so.

### 4. Determine file paths & handle existing files

Given the final `component_name` and `target_folder`:

* Component file path:

  * `<target_folder>/<ComponentName>.tsx`
* Test file path (if applicable):

  * Follow existing conventions:

    * Either colocated: `<target_folder>/<ComponentName>.test.tsx` or `.spec.tsx`
    * Or `__tests__` style: `<target_folder>/__tests__/<ComponentName>.test.tsx`
* Story file path (if applicable):

  * `<target_folder>/<ComponentName>.stories.tsx` (or matching the repo’s existing story extension pattern)

Before creating any file:

1. Check whether a file already exists at each path.
2. If a file exists and `overwrite_if_exists` is **not** truthy:

   * **Do not overwrite.**
   * Tell the user which file(s) already exist.
   * Suggest either:

     * A new component name (e.g. `New<ComponentName>` or `<ComponentName>V2`), or
     * Explicit confirmation to overwrite.
   * Wait for explicit user instruction before proceeding.
3. If `overwrite_if_exists` is truthy:

   * Explicitly ask the user: “Do you want to overwrite `<path>`? This is destructive.”
   * Only proceed with overwriting if the user answers affirmatively for **each** file.

### 5. Create the component file

Create a new `.tsx` file for the component with:

1. Imports:

   * Import React and any necessary types according to the repo’s style.
   * Do **not** introduce new dependencies unless they are already used in this repo.

2. Props typing:

   * Derive props from `props_spec` (if provided) and common sense from `description`.
   * Use the same pattern used by existing components in the chosen folder, e.g.:

     * `interface ComponentNameProps { ... }`
       `const ComponentName = ({ ... }: ComponentNameProps) => { ... }`
     * **or** `type ComponentNameProps = { ... }` with `React.FC<ComponentNameProps>`.
   * Keep types accurate but simple; add `// TODO` for props that might evolve.

3. Component body:

   * Functional component only, no class components.
   * Minimal JSX structure with semantic HTML where obvious.
   * Include clear `// TODO` comments where the developer should:

     * Add layout and styling (e.g. CSS modules, Tailwind, or the repo’s styling approach).
     * Add business logic / event handlers.
     * Integrate with data fetching or state if that’s expected.

4. Export:

   * Follow the export style used by existing components in the same directory:

     * If most components are default exports, use `export default ComponentName;`.
     * If most are named exports, use `export const ComponentName = ...;`.

Make sure the component compiles under TypeScript and adheres to the repo’s lint rules as best as you can.

### 6. Create a test file (when appropriate)

Decide based on:

* `include_test` input:

  * If explicitly `true`: always create a test file.
  * If explicitly `false`: skip.
* If `include_test` is undefined:

  * Inspect the repo for existing test tooling and test files.
  * If there is a clear testing setup and existing tests, create a test file following the predominant pattern.

When creating the test:

1. Use the project’s test framework (Vitest/Jest) and React Testing Library or whatever the repo uses.

2. Import the component using the same style as existing tests.

3. Add a minimal smoke test, e.g.:

   * Render the component.
   * Assert that a key text or role from the default JSX is present.

4. Add `// TODO` comments for more specific tests later.

Keep the test small, readable, and idiomatic.

### 7. Create a story file (when appropriate)

Only create a story file if:

* `include_story` is explicitly `true`, **and/or**
* The repo clearly uses Storybook (dependencies and existing stories are present).

If so:

1. Match the existing Storybook configuration:

   * Use the same CSF version, `Meta`, `StoryObj`, decorators, etc.
   * Use the same file extension and folder placement patterns.
2. Define:

   * A default `Meta` for the component, including title, component, and tags/args as used in other stories.
   * A `Default` story with sensible example props.
3. Add `// TODO` comments for more story variants and controls.

If the repo does not use Storybook, explain that you are skipping story generation.

### 8. Update barrel (index) file if present

If `export_from_index` is truthy:

1. Check whether the `target_folder` has `index.ts` or `index.tsx`.
2. If it does, append a new export for the component using whichever pattern exists:

   * `export { ComponentName } from './ComponentName';`
   * or `export * from './ComponentName';`
3. Do **not** reorder or refactor the entire file; only append the necessary export line.

If no index file is present, do nothing unless the user explicitly asks you to add one.

### 9. Safety & scope limitations

* **Do not:**

  * Delete any files.
  * Overwrite existing files without explicit confirmation.
  * Perform large refactors or modify unrelated files.
* **Do:**

  * Keep changes local to:

    * The new component file.
    * Its optional test file.
    * Its optional story file.
    * An existing barrel index file (append-only).
  * Ask the user when you are uncertain about destructive actions or major structural choices.

### 10. Final output

When you are done:

1. List all created/updated files with their paths.
2. For each file, briefly summarize what it contains.
3. Mention any `TODO` comments and suggested next steps (e.g. “hook this into the renewal dashboard”, “add real API data”, etc.).
4. Confirm that you did **not** overwrite any existing files without explicit consent.

## Review the Work

- **Invoke the ui-ux-reviewer subagent** to review your work and implement suggestions where needed
- Iterate on the review process when needed
- Review all pages and give an overall rating

## Carry out these steps now to create the requested component and any associated files.

## Examples

### Example 1 – Simple Usage

* **User Input:**

  * `component_name`: `DashboardCard`
  * `target_folder`: `src/components`
  * `description`: `"A small summary card showing a title and numeric value used on the main dashboard."`
  * `props_spec`: `"title: string; value: number; variant?: 'primary' | 'secondary'"`
  * `include_test`: `true`
  * `include_story`: `false`

* **Result:**

  * New file: `src/components/DashboardCard.tsx`

    * Functional React+TS component with typed props, simple JSX layout, and `// TODO` comments for styling and logic.
  * New file: `src/components/DashboardCard.test.tsx` (or matching repo convention)

    * Smoke test that renders the card and asserts that the title/value are present.
  * Updated file: `src/components/index.ts` (if present)

    * Appended export, e.g. `export { DashboardCard } from './DashboardCard';`.
