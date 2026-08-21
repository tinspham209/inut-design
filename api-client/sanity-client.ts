/**
 * Backward-compatible tokenless read-only entry point.
 *
 * New code should import `sanity-browser`, `sanity-server`, or `sanity-image`
 * explicitly so the access boundary remains obvious.
 */
export { client, urlFor } from "./sanity-browser";
