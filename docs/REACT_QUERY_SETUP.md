# React Query (TanStack Query) Setup Guide

This project has been configured with React Query (TanStack Query) for optimal data fetching, caching, and state management.

## 🚀 Features

- **Optimized Query Client**: Pre-configured with sensible defaults
- **Custom Hooks**: Reusable hooks for common patterns
- **Type Safety**: Full TypeScript support
- **Error Handling**: Centralized error management
- **Cache Management**: Intelligent caching with query keys
- **DevTools**: Development tools for debugging (dev mode only)
- **Optimistic Updates**: Support for optimistic UI updates

## 📁 File Structure

```
src/
├── lib/
│   └── queryClient.ts          # Query client configuration
├── hooks/
│   ├── useApi.ts               # Base API hooks
│   └── useInventory.ts         # Domain-specific hooks
├── services/
│   └── api.ts                  # API client and functions
├── components/
│   ├── ReactQueryDevtools.tsx  # DevTools component
│   └── InventoryExample.tsx    # Example usage
└── App.tsx                     # Query provider setup
```

## 🔧 Configuration

### Query Client Setup (`src/lib/queryClient.ts`)

The query client is configured with optimal defaults:

- **Stale Time**: 5 minutes (data considered fresh)
- **GC Time**: 10 minutes (cache retention)
- **Retry Logic**: Smart retry with 4xx error handling
- **Window Focus**: Disabled refetch on focus
- **Reconnect**: Enabled refetch on reconnect

### Provider Setup (`src/App.tsx`)

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { DevTools } from "./components/ReactQueryDevtools";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
      <DevTools />
    </QueryClientProvider>
  );
};
```

## 🎣 Custom Hooks

### Base API Hooks (`src/hooks/useApi.ts`)

Provides enhanced versions of React Query hooks with better error handling:

- `useApiQuery`: Enhanced query hook
- `useApiMutation`: Enhanced mutation hook
- `useInvalidateQueries`: Query invalidation utilities
- `usePrefetchQuery`: Query prefetching utilities

### Domain-Specific Hooks (`src/hooks/useInventory.ts`)

Example hooks for inventory management:

- `useInventoryItems`: Fetch all inventory items
- `useInventoryItem(id)`: Fetch single item
- `useCreateInventoryItem`: Create new item
- `useUpdateInventoryItem`: Update existing item
- `useDeleteInventoryItem`: Delete item
- `useInventoryItemsWithOptimistic`: Optimistic updates

## 🔑 Query Keys

Organized query keys for better cache management:

```tsx
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};
```

## 📡 API Client (`src/services/api.ts`)

Generic API client with:

- Base URL configuration
- Request/response interceptors
- Error handling
- TypeScript support

## 🛠 Usage Examples

### Basic Query

```tsx
import { useInventoryItems } from "../hooks/useInventory";

function InventoryList() {
  const { data: items, isLoading, error } = useInventoryItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {items?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Mutation with Cache Invalidation

```tsx
import { useCreateInventoryItem } from "../hooks/useInventory";

function AddItemForm() {
  const createItem = useCreateInventoryItem();

  const handleSubmit = (data) => {
    createItem.mutate(data, {
      onSuccess: () => {
        // Form will be reset automatically
        // Cache will be invalidated automatically
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createItem.isPending}>
        {createItem.isPending ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
}
```

### Optimistic Updates

```tsx
import { useInventoryItemsWithOptimistic } from "../hooks/useInventory";

function InventoryWithOptimistic() {
  const {
    data: items,
    createItem,
    isCreating,
  } = useInventoryItemsWithOptimistic();

  const handleCreate = (newItem) => {
    createItem(newItem); // UI updates immediately
  };

  return (
    <div>
      {/* UI shows optimistic updates */}
      {items?.map((item) => (
        <div key={item.id}>
          {item.name} {item.id.startsWith("temp-") && "(Saving...)"}
        </div>
      ))}
    </div>
  );
}
```

## 🐛 Development Tools

React Query DevTools are automatically included in development mode:

- **Query Explorer**: View all queries and their states
- **Cache Inspector**: Examine cached data
- **Mutation Log**: Track mutations
- **Performance**: Monitor query performance

## 🔄 Best Practices

1. **Query Keys**: Use structured, hierarchical query keys
2. **Stale Time**: Set appropriate stale times for your data
3. **Error Handling**: Always handle errors gracefully
4. **Loading States**: Show loading indicators for better UX
5. **Cache Invalidation**: Invalidate related queries after mutations
6. **Optimistic Updates**: Use for better perceived performance
7. **TypeScript**: Leverage TypeScript for type safety

## 🚀 Performance Tips

- Use `staleTime` to reduce unnecessary refetches
- Implement optimistic updates for better UX
- Use `enabled` option to control when queries run
- Leverage `select` option for data transformations
- Use `keepPreviousData` for pagination

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Best Practices Guide](https://tanstack.com/query/latest/docs/react/guides/best-practices)
