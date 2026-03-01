# Dashboard Layout

The root layout for all dashboard pages. Lives at `src/routes/dashboard.tsx`.

## Source

```tsx
// src/routes/dashboard.tsx

export const Route = createFileRoute("/dashboard")({
  validateSearch: PaginationValidator,
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(
        currentUserQueryOptions(),
      );
      return { user };
    } catch {
      throw redirect({ to: "/auth/signin", search: {} });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="relative flex w-full">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col !m-0 !rounded-none w-full overflow-x-hidden min-h-screen">
          <Header />
          <main className="flex-1 w-full overflow-x-hidden px-3 sm:px-4 md:px-6 lg:px-8 xl:px-14 py-4 sm:py-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
```

## How it works

- `beforeLoad` fetches the current user. If the fetch throws (401, network error, etc.) it redirects to sign-in. This is the **authentication gate** for the entire dashboard.
- `validateSearch: PaginationValidator` makes `page` and `size` available as typed search params on every dashboard route. Child routes extend this validator with their own fields.
- `<DashboardSidebar />` and `<Header />` are always rendered. Child route content renders into `<Outlet />` inside `<main>`.

## Adding a New Dashboard Route

Create a file at `src/routes/dashboard/my-page/index.tsx`. TanStack Router picks it up automatically:

```tsx
export const Route = createFileRoute("/dashboard/my-page/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Page" description="..." />
      {/* page content */}
    </div>
  );
}
```

The `px-3 sm:px-4 ... xl:px-14 py-4 sm:py-6` padding on `<main>` applies to all pages — don't add extra wrapper padding inside your page component.
