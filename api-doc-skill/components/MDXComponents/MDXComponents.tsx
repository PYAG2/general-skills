// Complete MDX Components for API Documentation
// Copy this file to: src/components/docs/mdx-components.tsx

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { CodeBlock } from "@/components/ui/code-block";
import { CopyPageButton } from "@/features/docs/copy-page-button";

// Utility function to generate slug from heading text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

function ApiDocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 my-6">
      {children}
    </div>
  );
}

function ApiDocSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 lg:col-span-2">{children}</div>;
}

function ApiDocExample({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
      {children}
    </div>
  );
}

// ============================================================================
// HEADER COMPONENTS
// ============================================================================

interface ApiDocHeaderProps {
  title: string;
  description?: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
}

function ApiDocHeader({ title, description, method, path }: ApiDocHeaderProps) {
  const methodColors = {
    GET: "bg-blue-500 text-white",
    POST: "bg-green-500 text-white",
    PUT: "bg-orange-500 text-white",
    DELETE: "bg-red-500 text-white",
    PATCH: "bg-purple-500 text-white",
  };

  return (
    <div className="mb-8">
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground mb-6">{description}</p>
          )}
        </div>
        <CopyPageButton />
      </div>
      {method && path && (
        <div className="rounded-xl border bg-card overflow-hidden p-2">
          <div className="flex items-center border rounded-2xl gap-3 p-2">
            <span
              className={cn(
                "px-3 py-1 rounded-md text-xs font-bold uppercase",
                methodColors[method],
              )}
            >
              {method}
            </span>
            <code className="flex-1 text-sm font-mono">{path}</code>
          </div>
        </div>
      )}
    </div>
  );
}

function ApiEndpoint({
  method,
  path,
  description,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description?: string;
}) {
  const methodColors = {
    GET: "bg-blue-500 text-white",
    POST: "bg-green-500 text-white",
    PUT: "bg-orange-500 text-white",
    DELETE: "bg-red-500 text-white",
    PATCH: "bg-purple-500 text-white",
  };

  return (
    <div className="my-6 rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b bg-muted/50">
        <span
          className={cn(
            "px-3 py-1 rounded-md text-xs font-bold uppercase",
            methodColors[method],
          )}
        >
          {method}
        </span>
        <code className="flex-1 text-sm font-mono">{path}</code>
      </div>
      {description && (
        <div className="p-4 text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  );
}

// ============================================================================
// PARAMETER COMPONENTS
// ============================================================================

interface ParamProps {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  defaultValue?: string;
}

function Param({
  name,
  type,
  required = false,
  description,
  defaultValue,
}: ParamProps) {
  return (
    <div className="border-b last:border-b-0 py-3 px-4">
      <div className="flex items-start gap-2 mb-1">
        <code className="text-sm font-mono text-green-600 dark:text-green-400">
          {name}
        </code>
        <span className="text-xs text-muted-foreground">{type}</span>
        {required ? (
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
            required
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded">
            optional
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {defaultValue && (
        <p className="text-xs text-muted-foreground mt-1">
          Default: <code className="text-xs">{defaultValue}</code>
        </p>
      )}
    </div>
  );
}

function ParamField({
  name,
  type,
  required = false,
  children,
}: ParamProps & { children?: React.ReactNode }) {
  return (
    <div className="border-b last:border-b-0 py-3 px-4">
      <div className="flex items-start gap-2 mb-1">
        <code className="text-sm font-mono text-green-600 dark:text-green-400">
          {name}
        </code>
        <span className="text-xs text-muted-foreground">{type}</span>
        {required ? (
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
            required
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded">
            optional
          </span>
        )}
      </div>
      {children && (
        <div className="text-sm text-muted-foreground mt-1">{children}</div>
      )}
    </div>
  );
}

function ParamSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6">
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <div className="rounded-lg border bg-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// CODE & REQUEST/RESPONSE COMPONENTS
// ============================================================================

interface CodeExampleProps {
  languages: {
    [key: string]: string;
  };
}

function CodeExample({ languages }: CodeExampleProps) {
  const tabs = Object.entries(languages).map(([label, code]) => ({
    label,
    code,
    language: label.toLowerCase(),
  }));

  return <CodeBlock tabs={tabs} />;
}

interface ResponseExampleProps {
  status: number;
  description: string;
  body: string | object;
  schema?: string | object;
}

function ResponseExample({
  status,
  description,
  body,
  schema,
}: ResponseExampleProps) {
  const statusColors = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    error: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  const statusType =
    status >= 200 && status < 300
      ? "success"
      : status >= 400
        ? "error"
        : "info";

  const formattedBody =
    typeof body === "string" ? body : JSON.stringify(body, null, 2);

  const formattedSchema = schema
    ? typeof schema === "string"
      ? schema
      : JSON.stringify(schema, null, 2)
    : undefined;

  const tabs = formattedSchema
    ? [
        { label: "Example", code: formattedBody, language: "json" },
        { label: "Schema", code: formattedSchema, language: "json" },
      ]
    : undefined;

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            "px-3 py-1 rounded-md text-xs font-bold",
            statusColors[statusType],
          )}
        >
          {status}
        </span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
      {tabs ? (
        <CodeBlock tabs={tabs} />
      ) : (
        <CodeBlock code={formattedBody} language="json" />
      )}
    </div>
  );
}

interface RequestBodyProps {
  body: string | object;
  description?: string;
}

function RequestBody({ body, description }: RequestBodyProps) {
  const formattedBody =
    typeof body === "string" ? body : JSON.stringify(body, null, 2);

  return (
    <div className="my-4">
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      <CodeBlock code={formattedBody} language="json" />
    </div>
  );
}

// ============================================================================
// CSV EXAMPLE COMPONENT
// ============================================================================

interface CsvColumn {
  name: string;
  required: boolean;
  description: string;
}

interface CsvRow {
  [key: string]: string;
}

interface CsvExampleProps {
  columns: CsvColumn[];
  rows: CsvRow[];
  caption?: string;
}

function CsvExample({ columns, rows, caption }: CsvExampleProps) {
  return (
    <div className="my-6 space-y-4">
      {/* Column Definitions */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 border-b">
          <span className="text-sm font-semibold">Column Definitions</span>
        </div>
        <div className="divide-y">
          {columns.map((col) => (
            <div key={col.name} className="flex items-start gap-3 px-4 py-3">
              <code className="text-sm font-mono text-green-600 dark:text-green-400 min-w-[120px]">
                {col.name}
              </code>
              {col.required ? (
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
                  required
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded">
                  optional
                </span>
              )}
              <span className="text-sm text-muted-foreground flex-1">
                {col.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Example Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
          <span className="text-sm font-semibold">
            {caption || "Example Data"}
          </span>
          <span className="text-xs text-muted-foreground font-mono">.csv</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.name}
                    className="px-4 py-2 text-left font-mono font-medium"
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-zinc-950 text-zinc-300 font-mono">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-zinc-800">
                  {columns.map((col) => (
                    <td key={col.name} className="px-4 py-2">
                      {row[col.name] || (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INFORMATIONAL COMPONENTS
// ============================================================================

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-sm text-blue-900 dark:text-blue-100">
          {children}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  href,
  children,
}: {
  title?: string;
  icon?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const content = (
    <div className="flex items-start gap-3">
      {icon && <div className="text-2xl">{icon === "leaf" ? "🍃" : icon}</div>}
      <div className="flex-1">
        {title && <h3 className="font-semibold text-lg mb-1">{title}</h3>}
        {children && (
          <div className="text-sm text-muted-foreground">{children}</div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block my-6 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary no-underline"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="my-6 rounded-lg border bg-card p-6 shadow-sm">
      {content}
    </div>
  );
}

// ============================================================================
// TABLE OF CONTENTS COMPONENTS
// ============================================================================

interface TocLinkProps {
  href: string;
  children: React.ReactNode;
  indent?: boolean;
}

function TocLink({ href, children, indent = false }: TocLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      // Get element position and account for fixed navbar (64px) + some padding (20px)
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 84;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, "", href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors no-underline",
        indent && "pl-4",
      )}
    >
      {children}
    </a>
  );
}

// ============================================================================
// CUSTOM HEADING COMPONENTS
// ============================================================================

// All headings get auto-generated IDs for anchor links
const headingComponent = (Tag: "h1" | "h2" | "h3" | "h4") => {
  return ({ className, children, ...props }: ComponentPropsWithoutRef<typeof Tag>) => {
    const id = typeof children === "string" ? slugify(children) : undefined;

    const headingStyles = {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-8 mb-4",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-4",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-4",
    };

    return (
      <Tag
        id={id}
        className={cn(headingStyles[Tag], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  };
};

// ============================================================================
// HTML ELEMENT COMPONENTS
// ============================================================================

// Export all MDX components for use in MDXProvider
export const MDXComponents = {
  // Layout
  ApiDocLayout,
  ApiDocSection,
  ApiDocExample,

  // Headers
  ApiDocHeader,
  ApiEndpoint,

  // Parameters
  Param,
  ParamField,
  ParamSection,

  // Code & Requests
  CodeExample,
  ResponseExample,
  RequestBody,

  // Data
  CsvExample,

  // Info
  Note,
  Card,

  // TOC
  TocLink,

  // Headings with auto-generated IDs
  h1: headingComponent("h1"),
  h2: headingComponent("h2"),
  h3: headingComponent("h3"),
  h4: headingComponent("h4"),

  // Standard HTML elements with Tailwind styling
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({
    className,
    ...props
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg border bg-zinc-950 p-4",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
};
