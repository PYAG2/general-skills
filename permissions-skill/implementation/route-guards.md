# Route Guards with TanStack Router

Protecting routes using `beforeLoad` in TanStack Router. The guard fetches (or reuses cached) user data before the component renders, and redirects if the user lacks the required role.

## Pattern

```typescript
// src/routes/dashboard/some-protected-page/index.tsx

export const Route = createFileRoute("/dashboard/some-protected-page/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const response = await context.queryClient.ensureQueryData(
      currentUserQueryOptions(),
    );
    if (!hasRole(["SUPER_ADMIN", "INSTITUTION_ADMIN"], response.data)) {
      throw redirect({
        to: "/dashboard",
        search: {},
      });
    }
  },
});
```

**Key points:**

- `ensureQueryData` returns the cached result immediately if available, otherwise fetches. No double fetch on page load.
- Pass `response.data` directly to `hasRole` — do not use `getCurrentUser()` here since the query hasn't settled into cache yet at this point.
- Throw `redirect` to abort navigation. TanStack Router catches this and redirects.
- `search: {}` clears any existing query params from the URL on redirect.

## Role-Only Guard (admin area)

```typescript
beforeLoad: async ({ context }) => {
  const response = await context.queryClient.ensureQueryData(
    currentUserQueryOptions(),
  );
  if (!hasRole(["SUPER_ADMIN"], response.data)) {
    throw redirect({ to: "/dashboard", search: {} });
  }
},
```

## Multi-Role Guard (any admin level)

```typescript
beforeLoad: async ({ context }) => {
  const response = await context.queryClient.ensureQueryData(
    currentUserQueryOptions(),
  );
  if (!hasRole(["SUPER_ADMIN", "INSTITUTION_ADMIN"], response.data)) {
    throw redirect({ to: "/dashboard", search: {} });
  }
},
```

## currentUserQueryOptions

The query options used in `ensureQueryData`. Defined once and reused in both `beforeLoad` and `useCurrentUser`:

```typescript
// src/hooks/queries/use-current-user.ts

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: [QUERY_KEYs.CURRENT_USER],
    queryFn: () => UserService.GetUserProfile(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 404) return false;
      }
      return failureCount < 2;
    },
  });

export function useCurrentUser() {
  return useQuery({
    ...currentUserQueryOptions(),
    select: (response: GetUserProfileResponse) => response.data,
  });
}
```

`staleTime: Infinity` means the cached user data is treated as always fresh — it won't be refetched unless you explicitly invalidate or clear the cache (e.g. on logout).
