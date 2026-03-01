# Queries

## 1. Single Query

Use `useQuery` to fetch one resource in a component.

**Pattern:**

```ts
const { data, isFetching, isError } = useQuery({
  queryKey: [QUERY_KEYs.RESOURCE, ...params],
  queryFn: () => ResourceService.GetAll(params),
});
```

**Data access** — API responses are typically nested, so chain safely:

```ts
const items = data?.data?.items ?? [];
const total = data?.data?.total ?? 0;
```

**Example from codebase (`src/routes/dashboard/index.tsx`)**

```ts
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYs } from "@/constants/core";
import { FlaggedMsisdnService } from "@/services/msisdn";

const { data, isFetching } = useQuery({
  queryKey: [QUERY_KEYs.MSISDN_AGGREGATES, 0, 15],
  queryFn: () => FlaggedMsisdnService.GetSystemMsisdnAggregates(0, 15),
});

const recentEntries = data?.data?.items ?? [];
```

**With pagination from route search params:**

```ts
const { page, size } = Route.useSearch();

const { data, isFetching } = useQuery({
  queryKey: [QUERY_KEYs.USERS_LIST, { page, size }],
  queryFn: () => UserService.GetAll(page, size),
});
```

**Useful destructured values:**

| Value | Description |
|---|---|
| `data` | The resolved response from `queryFn` |
| `isFetching` | True while a request is in flight (including background refetches) |
| `isPending` | True only on the initial load (no cached data yet) |
| `isError` | True if the last request failed |
| `error` | The thrown error object |
| `refetch` | Manually trigger a refetch |

---

## 2. Multiple Queries (Parallel)

Use `useQueries` when a page needs data from two or more independent endpoints at the same time. All queries run in parallel.

**Pattern:**

```ts
const [queryA, queryB] = useQueries({
  queries: [
    { queryKey: [QUERY_KEYs.RESOURCE_A, id], queryFn: () => ServiceA.Get(id) },
    { queryKey: [QUERY_KEYs.RESOURCE_B, id], queryFn: () => ServiceB.Get(id) },
  ],
});

const isLoading = queryA.isFetching || queryB.isFetching;
const dataA = queryA.data;
const dataB = queryB.data;
```

**Example from codebase (`src/routes/dashboard/institutions/$id.tsx`)**

```ts
import { useQueries } from "@tanstack/react-query";
import { QUERY_KEYs } from "@/constants/core";
import { FlaggedMsisdnService } from "@/services/msisdn";
import { SysAdminService } from "@/services/sysadmin";

const { id: institutionId } = Route.useParams();
const { page, size } = Route.useSearch();

const [aggregatesQuery, detailsQuery] = useQueries({
  queries: [
    {
      queryKey: [QUERY_KEYs.MSISDN_AGGREGATES, institutionId, page, size],
      queryFn: () =>
        FlaggedMsisdnService.GetInstitutionMsisdnAggregates(institutionId, page, size),
    },
    {
      queryKey: [QUERY_KEYs.INSTITUTION_AGGREGATES, institutionId],
      queryFn: async () => {
        const response = await SysAdminService.GetInstitutionDetails(institutionId);
        return response.data;
      },
    },
  ],
});

const isLoading = aggregatesQuery.isFetching || detailsQuery.isFetching;
const institutionDetails = detailsQuery.data;
const msisdnAggregates = aggregatesQuery.data;
```

**Why `useQueries` over two `useQuery` calls:**
- Both start simultaneously — no sequential waterfall
- Easy to compute a combined loading state
- The result array maps 1:1 to the queries array, so destructuring is clean
