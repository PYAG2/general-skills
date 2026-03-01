# API Documentation Patterns & Best Practices

Reusable patterns and best practices for developing with the RANCARD F8 Portal API documentation system.

## Content Structure Patterns

### Pattern 1: Standard Endpoint Documentation

This is the most common pattern for documenting a single API endpoint.

**Structure:**
```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="Endpoint Name"
      description="Brief description of what it does"
      method="GET|POST|PUT|DELETE|PATCH"
      path="/api/v1/endpoint-path"
    />

    ## Overview
    Detailed explanation...

    ### Parameters/Request
    Documentation of inputs...

    ### Examples
    Code examples...

    ### Response
    Response documentation...

  </ApiDocSection>

  {/* Right-side TOC - Desktop only */}
  <div className="hidden lg:block">
    <ApiDocExample>
      <div className="space-y-1">
        <p className="font-semibold text-sm mb-3">On This Page</p>
        <TocLink href="#overview">Overview</TocLink>
        <TocLink href="#parameters">Parameters</TocLink>
        <TocLink href="#examples">Examples</TocLink>
        <TocLink href="#response">Response</TocLink>
      </div>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

### Pattern 2: Query Endpoint with Multiple Parameters

For endpoints that accept many optional query parameters.

**Structure:**
```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="Query Data"
      description="Search and filter data with optional parameters"
      method="GET"
      path="/api/v1/endpoint"
    />

    ## Parameters

    <ParamSection title="Query Parameters">
      <Param
        name="search"
        type="string"
        description="Search term"
      />
      <Param
        name="page"
        type="number"
        defaultValue="1"
        description="Page number"
      />
      <Param
        name="size"
        type="number"
        defaultValue="10"
        description="Items per page"
      />
      <Param
        name="sort"
        type="string"
        description="Sort by field (e.g., 'name:asc')"
      />
    </ParamSection>

    ## Examples

    <CodeExample
      languages={{
        cURL: `curl ...`,
        JavaScript: `const response = fetch(...)`
      }}
    />

    ## Response

    <ResponseExample
      status={200}
      description="Success - paginated results"
      body={{
        status: "success",
        data: {
          page: 1,
          total: 250,
          size: 10,
          items: []
        }
      }}
    />

  </ApiDocSection>

  <div className="hidden lg:block">
    <ApiDocExample>
      <p className="font-semibold text-sm mb-3">On This Page</p>
      <TocLink href="#parameters">Parameters</TocLink>
      <TocLink href="#examples">Examples</TocLink>
      <TocLink href="#response">Response</TocLink>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

### Pattern 3: POST Endpoint with Complex Request Body

For endpoints accepting JSON body with nested fields.

**Structure:**
```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="Create Resource"
      description="Create a new resource"
      method="POST"
      path="/api/v1/endpoint"
    />

    ## Request Body

    <ParamSection title="Body Fields">
      <Param
        name="field1"
        type="string"
        required
        description="Required field"
      />
      <Param
        name="nested"
        type="object"
        required
        description="Nested object"
      />
    </ParamSection>

    ### Example Request

    <RequestBody
      description="Complete request example:"
      body={{
        field1: "value",
        nested: {
          subfield: "value"
        }
      }}
    />

    ## Examples

    <CodeExample
      languages={{
        cURL: `curl -X POST ...`,
        JavaScript: `const res = await fetch(...)`
      }}
    />

    ## Responses

    <ResponseExample
      status={201}
      description="Resource created successfully"
      body={{ id: "123", status: "CREATED" }}
    />

    <ResponseExample
      status={400}
      description="Validation error"
      body={{
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body"
        }
      }}
    />

  </ApiDocSection>

  <div className="hidden lg:block">
    <ApiDocExample>
      <p className="font-semibold text-sm mb-3">On This Page</p>
      <TocLink href="#request-body">Request Body</TocLink>
      <TocLink href="#example-request">Example Request</TocLink>
      <TocLink href="#examples">Examples</TocLink>
      <TocLink href="#responses">Responses</TocLink>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

### Pattern 4: File Upload Endpoint

For endpoints accepting file uploads.

**Structure:**
```mdx
<ApiDocLayout>
  <ApiDocSection>
    <ApiDocHeader
      title="Upload File"
      description="Upload a CSV file"
      method="POST"
      path="/api/v1/endpoint"
    />

    ## CSV Format

    <CsvExample
      columns={[
        {
          name: "column1",
          required: true,
          description: "Description of column1"
        },
        {
          name: "column2",
          required: true,
          description: "Description of column2"
        }
      ]}
      rows={[
        {
          column1: "value1",
          column2: "value2"
        },
        {
          column1: "value3",
          column2: "value4"
        }
      ]}
      caption="Example CSV"
    />

    ## Upload Request

    <CodeExample
      languages={{
        cURL: `curl -X POST -F "file=@file.csv" ...`,
        JavaScript: `const formData = new FormData();
formData.append('file', file);
const res = await fetch(...)`
      }}
    />

    ## Response

    <ResponseExample
      status={202}
      description="File received - processing started"
      body={{
        status: "success",
        data: {
          batchId: "batch-123",
          status: "PROCESSING"
        }
      }}
    />

  </ApiDocSection>

  <div className="hidden lg:block">
    <ApiDocExample>
      <p className="font-semibold text-sm mb-3">On This Page</p>
      <TocLink href="#csv-format">CSV Format</TocLink>
      <TocLink href="#upload-request">Upload Request</TocLink>
      <TocLink href="#response">Response</TocLink>
    </ApiDocExample>
  </div>
</ApiDocLayout>
```

## Component Usage Patterns

### Pattern 1: Parameter Documentation

```mdx
<ParamSection title="Query Parameters">
  <Param name="id" type="string" required description="Resource ID" />
  <Param name="page" type="number" defaultValue="1" description="Page number" />
  <Param name="sort" type="string" description="Sort field" />
</ParamSection>
```

### Pattern 2: Multiple Response Examples

Show different response codes:

```mdx
## Responses

<ResponseExample
  status={200}
  description="Success"
  body={{ message: "Success" }}
/>

<ResponseExample
  status={400}
  description="Bad request"
  body={{ error: "Invalid input" }}
/>

<ResponseExample
  status={401}
  description="Unauthorized"
  body={{ error: "Missing API key" }}
/>
```

### Pattern 3: Code Examples

Support multiple languages:

```mdx
<CodeExample
  languages={{
    cURL: `curl --request GET \\
--url 'http://api.example.com/endpoint' \\
--header 'X-API-Key: YOUR_KEY'`,
    JavaScript: `const response = await fetch('http://api.example.com/endpoint', {
  headers: {
    'X-API-Key': 'YOUR_KEY'
  }
});`,
    Python: `import requests
response = requests.get(
  'http://api.example.com/endpoint',
  headers={'X-API-Key': 'YOUR_KEY'}
)`
  }}
/>
```

### Pattern 4: Informational Notes

```mdx
<Note>
  This endpoint requires authentication. Include your API key in the
  <code>X-API-Key</code> header.
</Note>

<Note>
  Rate limited to 1000 requests per hour. Check response headers for
  remaining quota.
</Note>
```

### Pattern 5: Related Resources Cards

```mdx
<Card
  title="Related Endpoint"
  icon="📚"
  href="/docs/other-endpoint"
>
  Link to related documentation page
</Card>

<Card
  title="See Code Examples"
  icon="💻"
  href="/docs/quick-start"
>
  View full integration examples
</Card>
```

## Common Structures by Use Case

### Use Case 1: GET List/Query Endpoint

Elements needed:
1. Overview paragraph
2. Query parameters section
3. Multiple example requests (simple, filtered, paginated)
4. Single success response
5. Error responses (400, 401, 429)
6. Related links to similar endpoints

### Use Case 2: POST Create/Action Endpoint

Elements needed:
1. Overview paragraph
2. Request body schema
3. Explanation of each field
4. Example request (in code block)
5. Success response (with new ID)
6. Validation error response
7. Related endpoints for update/delete

### Use Case 3: Bulk/Batch Operation Endpoint

Elements needed:
1. Overview - what is processed in bulk
2. Input format (CSV columns or JSON array)
3. Column/field definitions
4. Multiple example rows
5. Processing status explanation
6. How to check results/status
7. Error handling (partial failures)

### Use Case 4: CSV Upload Endpoint

Elements needed:
1. Overview - file format and limits
2. Column definitions with types
3. Example CSV data
4. Upload instructions (cURL, JS)
5. Processing response format
6. How to retrieve results
7. Error response (invalid CSV)

## Best Practices

### Content Organization

1. **Always include headers** - Main heading with method/path badge
2. **Group related params** - Use sections for query, body, headers
3. **Show realistic examples** - Use actual data from your system
4. **Multiple code languages** - At least cURL and JavaScript
5. **All response codes** - Show 200, 400, 401, 429 at minimum

### Code Examples

1. **Copy-paste ready** - Examples should work when copied
2. **Variable placeholders** - Use `YOUR_API_KEY`, `YOUR_ID`, etc.
3. **Real URLs** - Use actual API base URLs
4. **Proper formatting** - Consistent indentation and syntax highlighting

### Component Selection

| Situation | Component | Why |
|-----------|-----------|-----|
| Single parameter | `<Param>` | Clean, simple display |
| Multiple parameters | `<ParamSection>` containing `<Param>` | Grouped with visual separation |
| Simple response | `<ResponseExample>` | Shows status badge + JSON |
| Multiple responses | Multiple `<ResponseExample>` | Easy comparison |
| Code multiple languages | `<CodeExample>` | Tabbed interface |
| CSV file structure | `<CsvExample>` | Shows definitions + table |
| Extra info/warnings | `<Note>` | Visually distinct |

### Responsive Design

- Always wrap in `<ApiDocLayout>` for 3-column layout
- Always include `<ApiDocExample>` with TOC for desktop
- Use `hidden lg:block` to hide TOC on mobile
- Test on mobile to ensure readability

## Performance Considerations

1. **Keep pages focused** - One endpoint per page
2. **Use lazy loading for images** - Not applicable here
3. **Minimize custom components** - Use built-in MDX components
4. **Keep code examples reasonably sized** - Break into multiple examples if needed

## Accessibility

1. **Use semantic HTML** - All components generate proper semantic HTML
2. **Color not sole indicator** - Method badges have both color and text
3. **Code syntax highlighting** - Improves readability
4. **Proper heading hierarchy** - Use h2, h3, h4 correctly
5. **Alt text for images** - Include in markdown

## Example Files Reference

See actual implementations:
- [quick-start.mdx](../../src/assets/docs/quick-start.mdx) - Simple overview
- [single-report.mdx](../../src/assets/docs/single-report.mdx) - POST endpoint
- [bulk-report.mdx](../../src/assets/docs/bulk-report.mdx) - File upload
- [system-aggregates.mdx](../../src/assets/docs/system-aggregates.mdx) - Query endpoint
