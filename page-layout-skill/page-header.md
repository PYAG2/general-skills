# PageHeader Component

Used at the top of every dashboard page. Lives at `src/components/shared/page-header/index.tsx`.

## Source

```tsx
export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  children?: ReactNode; // escape hatch for dropdowns etc.
  show?: boolean;       // hide the button entirely when false
}

export interface PageHeaderProps {
  title: string;
  description?: string;

  showBackButton?: boolean;
  backButtonText?: string;
  backButtonTo?: string;

  primaryAction?: PageHeaderAction;
  secondaryAction?: PageHeaderAction;
  customActions?: ReactNode; // for anything that doesn't fit a simple button

  className?: string;
}
```

The actions section only renders if at least one action is visible. `show: false` removes the button from the DOM entirely (not just disabled).

## Usage Examples

### Title + description only

```tsx
<PageHeader
  title="Institutions"
  description="View and manage institutions"
/>
```

### With a primary action (permission-gated)

```tsx
const { data: user } = useCurrentUser();

<PageHeader
  title="Institutions"
  description="View institutions"
  primaryAction={{
    label: "Add new institution",
    variant: "outline",
    onClick: handleAddInstitution,
    show: hasPermission([APP_PERMISSIONS.INSTITUTION.CREATE], false, user),
  }}
/>
```

`show` accepts the result of `hasPermission` directly. When the user lacks the permission the button is not rendered at all.

### Primary action + custom actions slot

```tsx
<PageHeader
  title="User management"
  description="View and manage users"
  customActions={<AdvancedExport ... />}
  primaryAction={{
    label: "Invite new user",
    variant: "outline",
    onClick: handleInviteUser,
    show: hasPermission([APP_PERMISSIONS.USER.CREATE], false, user),
  }}
/>
```

`customActions` renders after the primary and secondary buttons. Use it for components that don't fit the standard button interface (e.g. an export dropdown).

### With a back button

```tsx
<PageHeader
  title="Edit User"
  showBackButton
  backButtonText="Back to users"
  backButtonTo="/dashboard/user-management"
/>
```

`backButtonTo` defaults to `".."` (parent route) if omitted.

### With an icon on the button

```tsx
import { Plus } from "lucide-react";

<PageHeader
  title="API Keys"
  primaryAction={{
    label: "Create key",
    icon: Plus,
    iconPosition: "left",
    onClick: handleCreate,
  }}
/>
```

## Props Reference

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | required | Page heading |
| `description` | `string` | — | Subtext below title |
| `showBackButton` | `boolean` | `false` | Show back navigation |
| `backButtonText` | `string` | `"Back"` | Back button label |
| `backButtonTo` | `string` | `".."` | Back navigation target |
| `primaryAction` | `PageHeaderAction` | — | Main CTA button |
| `secondaryAction` | `PageHeaderAction` | — | Secondary button |
| `customActions` | `ReactNode` | — | Arbitrary action area |
| `className` | `string` | — | Extra classes on wrapper |

### PageHeaderAction Props

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `label` | `string` | required | Button text |
| `onClick` | `() => void` | — | Click handler |
| `variant` | `string` | `"default"` | Button variant |
| `icon` | `LucideIcon` | — | Icon component |
| `iconPosition` | `"left" \| "right"` | `"right"` | Icon placement |
| `disabled` | `boolean` | `false` | Disable the button |
| `show` | `boolean` | `undefined` | `false` hides the button entirely |
| `children` | `ReactNode` | — | Replace button content entirely |
