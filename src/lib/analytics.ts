// Lightweight, provider-agnostic analytics wrapper.
// Default provider: Plausible (script loaded in index.html).
// Falls back to a `lovable:track` CustomEvent on `window` so other tools
// (GTM, Segment, etc.) can listen without code changes.

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props; callback?: () => void }) => void;
  }
}

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    window.dispatchEvent(new CustomEvent("lovable:track", { detail: { event, props } }));
  } catch {
    /* swallow — analytics must never break UX */
  }
}

/** Convenience: open an external URL in a new tab while firing a tracking event. */
export function trackedHref(event: string, props?: Props) {
  return () => track(event, props);
}
