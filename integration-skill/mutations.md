# Mutations

Three patterns ordered from simplest to most involved.

---

## 1. Simple Mutation

A form submission or create action with a loading toast.

**Pattern:**

```ts
const { mutateAsync, isPending } = useMutation({
  mutationFn: (data: SchemaType) => ResourceService.Create(data),
  onSuccess: () => {
    form.reset();
    // any other side effects
  },
});

async function onSubmit(data: SchemaType) {
  toast.promise(mutateAsync(data), {
    loading: "Creating...",
    success: "Created successfully",
    error: (error: Error) => error.message || "Failed to create",
  });
}
```

**Key points:**
- Use `mutateAsync` (not `mutate`) when you need to `await` the result or chain it with `toast.promise`
- `toast.promise` handles all three states — loading spinner, success, and error message — in one call
- `isPending` drives the button's `isLoading` + `disabled` props to prevent double-submit
- `onSuccess` runs after the API call resolves — good for resetting the form or closing the dialog

**Example from codebase (`src/features/dashboard/institutions/add-institution-dialog.tsx`)**

```ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const { mutateAsync: createInstitution, isPending: isCreating } = useMutation({
  mutationFn: (data: AddInstitutionSchemaType) =>
    SysAdminService.CreateInstitution(data),
  onSuccess: () => {
    form.reset();
    setOpen?.(false);
  },
});

const onSubmit = async (data: AddInstitutionSchemaType) => {
  toast.promise(createInstitution(data), {
    loading: "Creating institution...",
    success: "Institution created successfully",
    error: (error: Error) => error.message || "Failed to create institution",
  });
};

// In JSX:
<Button type="submit" isLoading={isCreating} disabled={isCreating}>
  Submit
</Button>
```

---

## 2. Mutation with Confirmation

For destructive actions (delete, revoke, suspend) that need a confirm dialog before firing.

**How it works:**
1. User clicks the action button
2. `showConfirmation()` opens the dialog with a title, description, and custom button
3. User clicks confirm → `onConfirm` callback fires the mutation + toast
4. Returning `true` from `onConfirm` closes the dialog automatically

**Setup — `ConfirmationProvider` must wrap the app (or the relevant subtree):**

```ts
// src/main.tsx or the relevant layout
import { ConfirmationProvider } from "@/context/confirmation";

<ConfirmationProvider>
  <App />
</ConfirmationProvider>
```

**Pattern:**

```ts
import { useConfirmationContext } from "@/context/confirmation";

const { showConfirmation } = useConfirmationContext();
const { mutateAsync: deleteItem, isPending: isDeleting } = useMutation({
  mutationFn: (id: string) => ResourceService.Delete(id),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.RESOURCE_LIST] });
  },
});

const handleDelete = () => {
  showConfirmation({
    title: "Delete item?",
    description: "This action cannot be undone.",
    isLoading: isDeleting,
    btnTitle: "Yes, delete",
    btnVariant: "destructive",
    onConfirm: () => {
      toast.promise(deleteItem(id), {
        loading: "Deleting...",
        success: "Deleted successfully",
        error: (err) => err?.message || "Failed to delete",
      });
      return true; // returning true closes the dialog
    },
  });
};
```

**`showConfirmation` options:**

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Dialog heading |
| `description` | `string` | Explanation shown below title |
| `btnTitle` | `string` | Confirm button label |
| `btnVariant` | `"default" \| "destructive"` | Use `"destructive"` for delete/revoke |
| `isLoading` | `boolean` | Shows spinner on confirm button |
| `onConfirm` | `() => boolean` | Action to run; return `true` to close |

**Example from codebase (`src/features/dashboard/api-keys/row-actions.tsx`)**

```ts
import { useConfirmationContext } from "@/context/confirmation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/config";

const { showConfirmation } = useConfirmationContext();

const { mutateAsync: deleteApiKey, isPending: isDeleting } = useMutation({
  mutationFn: (keyId: string) => ApiKeyService.DeleteApiKey(keyId),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.ALL_API_KEYS] });
  },
});

const handleDelete = () => {
  showConfirmation({
    title: "Delete API Key",
    description: `Are you sure you want to permanently delete "${keyName}"? This action cannot be undone.`,
    isLoading: isDeleting,
    onConfirm: () => {
      toast.promise(deleteApiKey(id), {
        loading: `Deleting ${keyName}...`,
        success: `${keyName} has been deleted successfully`,
        error: (err) => err?.message || `Failed to delete ${keyName}`,
      });
      return true;
    },
    btnTitle: "Yes, delete",
    btnVariant: "destructive",
  });
};
```

---

## 3. Mutation with Invalidation

After a mutation succeeds, invalidate the relevant query keys so the UI automatically refetches fresh data.

**Key rule:** Import `queryClient` directly from `@/lib/config` — do not use the `useQueryClient` hook, which requires a component context.

**Single invalidation:**

```ts
import { queryClient } from "@/lib/config";

const { mutateAsync } = useMutation({
  mutationFn: (data) => ResourceService.Create(data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEYs.RESOURCE_LIST],
    });
  },
});
```

**Multiple invalidations in parallel:**

```ts
onSuccess: async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.RESOURCE_LIST] }),
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.DASHBOARD_METRICS] }),
  ]);
},
```

**How invalidation works:**
- `invalidateQueries` marks matching cached data as stale
- Any component currently subscribed to those keys will immediately trigger a background refetch
- The partial key match means `[QUERY_KEYs.RESOURCE_LIST]` invalidates all pages/filter variants

**Example from codebase (`src/features/report/single-report-form.tsx`)**

```ts
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/config";
import { QUERY_KEYs } from "@/constants/core";

const { mutateAsync: submitReport, isPending: isSubmitting } = useMutation({
  mutationFn: (data: MakeSingleReportSchemaType) =>
    FlaggedMsisdnService.MakeSingleReport(data),
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.MSISDN_AGGREGATES] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYs.DASHBOARD_METRICS] }),
    ]);
    form.reset();
    onSuccess?.();
  },
});

async function handleSubmit(data: MakeSingleReportSchemaType) {
  toast.promise(submitReport(data), {
    loading: "Submitting report...",
    success: "Report submitted successfully",
    error: (error: Error) => error.message || "Failed to submit report",
  });
}
```
