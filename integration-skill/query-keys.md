# Query Keys

Query keys are how TanStack Query identifies, caches, and invalidates data. Consistent key conventions prevent stale data and duplicate requests.

## 1. QUERY_KEYs Constant

Define a flat object of string constants — one key per resource — in `src/constants/core/index.ts`.

**Example from codebase (`src/constants/core/index.ts`)**

```ts
export const QUERY_KEYs = {
  CURRENT_USER:    "current-user",
  USERS_LIST:      "users-list",
  USER_DETAILS:    "user-details",
  RESOURCE_LIST:   "resource-list",
  RESOURCE_DETAIL: "resource-detail",
  // add a new key for each new resource
};
```

**Rules:**
- Always wrap in an array when passed to `queryKey`: `queryKey: [QUERY_KEYs.USERS_LIST]`
- Append dynamic parameters as additional array elements:

```ts
// Static — all users
queryKey: [QUERY_KEYs.USERS_LIST]

// With pagination
queryKey: [QUERY_KEYs.USERS_LIST, { page, size }]

// With ID
queryKey: [QUERY_KEYs.USER_DETAILS, userId]

// With multiple filters
queryKey: [QUERY_KEYs.USERS_LIST, { page, size, status, query }]
```

**Partial key matching for invalidation:**

```ts
// This invalidates ALL variants of USERS_LIST,
// including [QUERY_KEYs.USERS_LIST, { page: 0, size: 20 }]
queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.USERS_LIST] });
```

Use partial invalidation after mutations — you don't need to know which exact page/filter the user was on.

---

## 2. queryOptions Pattern

For queries that are used in more than one place — both inside a component and in a route's `beforeLoad` loader — extract them with `queryOptions()` to avoid duplicating the config.

**Example from codebase (`src/hooks/queries/use-current-user.ts`)**

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { QUERY_KEYs } from "@/constants/core";
import { UserService } from "@/services";
import { ApiError } from "@/utils/api";
import type { GetUserProfileResponse } from "@/types/api";

// Shared options object — reusable in both hooks and loaders
export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: [QUERY_KEYs.CURRENT_USER],
    queryFn: () => UserService.GetUserProfile(),
    staleTime: Infinity,               // user data is stable for the session
    gcTime: 24 * 60 * 60 * 1000,      // keep in cache 24h
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 404) return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

// Hook — uses select to transform the response shape
export function useCurrentUser() {
  return useQuery({
    ...currentUserQueryOptions(),
    select: (response: GetUserProfileResponse) => response.data,
  });
}
```

**Usage in a route loader (`beforeLoad`):**

```ts
beforeLoad: async ({ context }) => {
  // Uses the same queryOptions — hits cache if already fetched
  const response = await context.queryClient.ensureQueryData(currentUserQueryOptions());
  if (!hasRole(["ADMIN"], response.data)) {
    throw redirect({ to: "/dashboard" });
  }
},
```

**Why this pattern:**
- `queryOptions()` is just a typed wrapper — it doesn't fetch anything, just creates the config object
- `ensureQueryData` in the loader returns cached data if fresh, otherwise fetches. No duplicate network calls.
- The `select` transform only applies when called via `useQuery`, not in the loader — so the loader gets the raw response and the hook gets the unwrapped `.data`
