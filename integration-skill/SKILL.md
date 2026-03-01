# Integration Skill — TanStack Query + Axios

Data fetching stack: QueryClient configuration, axios setup (session & JWT), query key conventions, queries, and mutations.

## Structure

```
integration-skill/
├── SKILL.md          ← you are here
├── setup.md          ← QueryClient config + axios instance + app wiring
├── query-keys.md     ← QUERY_KEYs constant + queryOptions pattern
├── queries.md        ← Single query + parallel queries (useQueries)
└── mutations.md      ← Simple / with confirmation / with invalidation
```

## Where to Start

| Task | File |
|---|---|
| First time setup | [setup.md](setup.md) |
| Defining query keys | [query-keys.md](query-keys.md) |
| Fetching data in a component | [queries.md](queries.md) |
| Submitting a form | [mutations.md](mutations.md) |
| Deleting / destructive action | [mutations.md → Mutation with Confirmation](mutations.md) |
| Refreshing data after a mutation | [mutations.md → Mutation with Invalidation](mutations.md) |

## Quick Reference — Mutation Patterns

```ts
// 1. Simple — fire and toast
const { mutateAsync, isPending } = useMutation({
  mutationFn: (data) => ResourceService.Create(data),
  onSuccess: () => { /* side effects */ },
});
toast.promise(mutateAsync(data), { loading: "...", success: "...", error: (e) => e.message });

// 2. With confirmation — guard destructive actions
const { showConfirmation } = useConfirmationContext();
showConfirmation({
  title: "Delete item?",
  description: "This cannot be undone.",
  btnTitle: "Yes, delete",
  btnVariant: "destructive",
  onConfirm: () => {
    toast.promise(deleteItem(id), { loading: "...", success: "...", error: (e) => e.message });
    return true; // closes the dialog
  },
});

// 3. With invalidation — refresh cache after success
const { mutateAsync } = useMutation({
  mutationFn: (data) => ResourceService.Create(data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.RESOURCE] });
  },
});
```
