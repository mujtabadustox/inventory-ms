# JWT Authentication Setup

This project includes a lightweight JWT authentication system built on top of React Query, without requiring axios interceptors.

## 🎯 Why This Approach?

### ✅ Advantages of Current Setup

- **Lighter Bundle**: No axios dependency (saves ~13KB gzipped)
- **React Query Integration**: Leverages React Query's built-in retry and error handling
- **Simplicity**: Less complexity for straightforward auth flows
- **Type Safety**: Full TypeScript support
- **Easy Migration**: Can upgrade to axios later if needed

### 🤔 When to Consider Axios

- Complex request/response transformations
- Advanced interceptor patterns
- Multiple API endpoints with different auth requirements
- Need for request cancellation
- Advanced error handling requirements

## 🔧 Current Implementation

### 1. Auth Utilities (`src/lib/auth.ts`)

```typescript
// Token storage utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    /* ... */
  },
  setAccessToken: (token: string): void => {
    /* ... */
  },
  clearTokens: (): void => {
    /* ... */
  },
  isAuthenticated: (): boolean => {
    /* ... */
  },
};

// Auth service
export const authService = {
  login: async (credentials) => {
    /* ... */
  },
  logout: () => {
    /* ... */
  },
  refreshToken: async () => {
    /* ... */
  },
};
```

### 2. Enhanced API Client (`src/services/api.ts`)

The API client automatically:

- ✅ Adds JWT tokens to requests
- ✅ Handles 401 responses with token refresh
- ✅ Retries failed requests with new tokens
- ✅ Logs out user on refresh failure

```typescript
private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get auth token
  const token = tokenStorage.getAccessToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Handle 401 with automatic token refresh
  if (response.status === 401) {
    // Try refresh, retry request, or logout
  }
}
```

### 3. React Query Hooks (`src/hooks/useAuth.ts`)

```typescript
export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (tokens) => {
      // Update auth state
      queryClient.setQueryData(authKeys.isAuthenticated, true);
      // Invalidate cached data
      queryClient.invalidateQueries();
    },
  });
}
```

## 🚀 Usage Examples

### Login Flow

```tsx
import { useLogin } from "../hooks/useAuth";

function LoginForm() {
  const loginMutation = useLogin();

  const handleSubmit = (credentials) => {
    loginMutation.mutate(credentials, {
      onSuccess: () => {
        // Redirect or update UI
      },
    });
  };
}
```

### Protected Routes

```tsx
import { useIsAuthenticated } from "../hooks/useAuth";

function Layout() {
  const { isAuthenticated } = useIsAuthenticated();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <ProtectedContent />;
}
```

### API Calls (Automatic Auth)

```tsx
import { useInventoryItems } from "../hooks/useInventory";

function InventoryList() {
  // JWT token automatically added to requests
  const { data: items } = useInventoryItems();

  return <div>{/* render items */}</div>;
}
```

## 🔄 Token Refresh Flow

1. **API Request** → 401 Unauthorized
2. **Automatic Refresh** → Call `/api/auth/refresh`
3. **Success** → Retry original request with new token
4. **Failure** → Logout user and redirect to login

## 🛡️ Security Features

- **Automatic Token Injection**: All API requests include JWT
- **Token Refresh**: Seamless token renewal
- **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **Automatic Logout**: On refresh failure or auth errors
- **Cache Invalidation**: Clear user-specific data on logout

## 🔧 Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend API Endpoints Expected

```typescript
// POST /api/auth/login
{
  email: string,
  password: string
}
// Response: { accessToken: string, refreshToken?: string }

// POST /api/auth/refresh
{
  refreshToken: string
}
// Response: { accessToken: string }

// All other endpoints expect Authorization: Bearer <token>
```

## 🚀 Migration to Axios (If Needed)

If you later decide to use axios, here's the migration path:

1. **Install axios**: `npm install axios`
2. **Replace fetch client** with axios instance
3. **Add interceptors** for auth
4. **Update React Query hooks** (minimal changes needed)

The React Query hooks would remain largely unchanged, only the underlying API client would be different.

## 🎯 Best Practices

1. **Token Storage**: Consider httpOnly cookies for production
2. **Refresh Strategy**: Implement refresh token rotation
3. **Error Handling**: Graceful degradation on auth failures
4. **Loading States**: Show appropriate loading indicators
5. **Security**: Implement proper CORS and CSP headers

## 🔍 Debugging

### React Query DevTools

- Monitor auth-related queries
- Check cache invalidation
- Debug token refresh issues

### Browser DevTools

- Check localStorage for tokens
- Monitor network requests for auth headers
- Verify 401 handling

## 📚 Next Steps

1. **Backend Integration**: Connect to your JWT backend
2. **User Management**: Add user profile and settings
3. **Role-Based Access**: Implement RBAC if needed
4. **Security Hardening**: Add CSRF protection, rate limiting
5. **Testing**: Add auth flow tests

This setup provides a solid foundation for JWT authentication while keeping the bundle size minimal and leveraging React Query's powerful features.
