---
name: agent-browser-automation
description: "Use when you need to perform headless browser automation for UI verification, regression testing, or exploring external web content. This skill leverages the `agent-browser` CLI."
---

# Agent Browser Automation Skill

## When to use

Use this skill for:

- **UI Verification**: Confirming visual changes after styling updates.
- **Regression Testing**: Ensuring business-critical flows (cart, checkout) still work.
- **Content Exploration**: Reading external documentation or competitor pages for inspiration.
- **Dynamic Content Checks**: Verifying Sanity data renders correctly in the browser.

## Step-by-step workflow

1. **Start/Ensure Local Dev Server**
   - If testing the local project, ensure `pnpm dev` is running (usually on `http://localhost:3000`).
   - If not running, you may need to start it in a background terminal.

2. **Initialize Browser Session**
   - `agent-browser open <url>`
   - Use `http://localhost:3000` for local testing.

3. **Explore and Interact**
   - **Snapshot**: `agent-browser snapshot -i` to see the accessibility tree with refs (`@e1`, `@e2`, etc.).
   - **Click**: `agent-browser click @ref` to interact with elements.
   - **Type**: `agent-browser type @ref "text"` to fill forms.
   - **Scroll**: `agent-browser scroll down` or `agent-browser scroll up`.

4. **Verify and Assert**
   - **Screenshot**: `agent-browser screenshot path/to/image.png` for visual proof.
   - **Snapshot Check**: Use the snapshot output to confirm text presence or element visibility.

5. **Clean up**
   - `agent-browser close` to terminate the session and free resources.

## Common Flow Examples

### Verify Cart Functionality
1. `agent-browser open http://localhost:3000/lighters`
2. `agent-browser snapshot -i` (Find "Add to Cart" button ref)
3. `agent-browser click @ref`
4. `agent-browser open http://localhost:3000/cart`
5. `agent-browser snapshot -i` (Verify item is in cart)

### Check Blog Rendering
1. `agent-browser open http://localhost:3000/blog`
2. `agent-browser snapshot -i` (Find a blog post link ref)
3. `agent-browser click @ref`
4. `agent-browser snapshot -i` (Confirm content renders correctly)

## Guardrails

- **Token Efficiency**: Always use `snapshot -i` to get the compact accessibility tree instead of full DOM.
- **Wait for Load**: Give the page a few seconds to load before taking snapshots or interacting.
- **Relative Refs**: Refs can change after page updates/navigations. Always take a fresh snapshot before interacting.
- **Environment**: Ensure the browser is installed via `agent-browser install` (done by user).
