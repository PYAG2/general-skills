# Setup — TanStack Query + Axios

## 1. TanStack Query

### Install

```bash
npm install @tanstack/react-query
```

### QueryClient Configuration

Create `src/lib/config/query-client.ts`:

**Example from codebase (`src/lib/config/query-client.ts`)**

```ts
import { QueryClient } from "@tanstack/react-query";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,          // 1 min — how long before data is considered stale
        gcTime: 1000 * 60 * 10,        // 10 min — how long inactive queries stay in cache
        retry: 1,                       // retry failed requests once
        retryDelay: (attemptIndex) =>   // exponential backoff, max 30s
          Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,    // don't refetch when tab regains focus
        refetchOnReconnect: true,       // refetch when internet reconnects
        refetchOnMount: true,           // refetch when component mounts if data is stale
      },
    },
  });
}

export const queryClient = createQueryClient();
```

**Key trade-offs:**
- `staleTime` controls when `invalidateQueries` actually triggers a refetch. If staleTime is too high, invalidated queries may not refetch.
- `refetchOnWindowFocus: false` — recommended for dashboards to avoid surprising refetches mid-task.
- `gcTime` should be ≥ `staleTime` to avoid data disappearing from cache before it becomes stale.

### Wire into the app

Pass `queryClient` through the router context so `beforeLoad` guards can call `queryClient.ensureQueryData()`:

```ts
// src/main.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/config";

const router = createRouter({
  routeTree,
  context: { queryClient },  // makes queryClient available in beforeLoad
});

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
```

---

## 2. Axios

### Install

```bash
npm install axios
```

### Auth Strategy

Two common approaches:

| Strategy | How it works | Config |
|---|---|---|
| **Session (httpOnly cookie)** | Browser sends cookie automatically on every request | `withCredentials: true` |
| **JWT (Bearer token)** | Manually attach token in request interceptor | See JWT variant below |

### Session-Based Instance

**Example from codebase (`src/lib/config/axios.ts`)** — this codebase uses session cookies:

```ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(null);
  });
  failedQueue = [];
};

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,  // sends httpOnly session cookie automatically
    timeout: 30000,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;
      const currentPath = globalThis.location?.pathname || "";
      const isAuthPage = currentPath.startsWith("/auth");

      // 401 — attempt silent token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isAuthPage) throw normalizeError(error);

        if (originalRequest.url === "/auth/refresh") {
          globalThis.location.href = "/auth/signin";
          throw error;
        }

        // Queue concurrent requests while refresh is in progress
        if (isRefreshing) {
          const { promise, resolve, reject } = Promise.withResolvers();
          failedQueue.push({ resolve, reject });
          return promise.then(() => instance(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await instance.post("/auth/refresh");
          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);
          globalThis.location.href = "/auth/signin";
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response?.status === 403 && !isAuthPage) {
        globalThis.location.href = "/403";
        throw error;
      }

      if (error.response?.status === 404 && !isAuthPage) {
        globalThis.location.href = "/404";
        throw error;
      }

      throw normalizeError(error);
    },
  );

  return instance;
}

export const apiClient = createAxiosInstance();
```

**Key behaviours:**
- `withCredentials: true` — the browser automatically includes the session cookie on every request. No manual token management needed.
- **401 handling** — silently calls `/auth/refresh`. If refresh succeeds, all queued requests retry automatically. If it fails, redirect to sign in.
- **Concurrency queue** — `isRefreshing` + `failedQueue` ensures multiple simultaneous 401s only trigger one refresh, not N.
- **Error normalization** — all errors are converted to a consistent `ApiError` class before TanStack Query sees them.

### JWT Variant

If your API uses Bearer tokens instead of session cookies, swap `withCredentials` for a request interceptor:

```ts
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // or from your auth store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 3. Config Barrel

Re-export both from one place so the rest of the app imports from `@/lib/config`:

```ts
// src/lib/config/index.ts
export * from "./axios";
export * from "./query-client";
```

Usage anywhere in the app:

```ts
import { apiClient, queryClient } from "@/lib/config";
```
