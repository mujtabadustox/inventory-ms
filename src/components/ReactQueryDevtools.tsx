import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function DevTools() {
  if (import.meta.env.DEV) {
    return <ReactQueryDevtools initialIsOpen={false} />;
  }

  return null;
}
