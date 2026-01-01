# Frontend Implementation Guidelines

**Project**: Evolution of Todo - Frontend
**Framework**: Next.js 16+ with App Router
**Language**: TypeScript (strict mode)
**Styling**: Tailwind CSS
**Authentication**: Better Auth client
**Development Method**: Spec-Driven Development (SDD)

---

## Core Requirements

### 1. App Router Only (NOT Pages Router) ⚠️

**CRITICAL:** MUST use App Router, NOT Pages Router

```
✅ CORRECT:
src/app/page.tsx           # App Router
src/app/dashboard/page.tsx # App Router

❌ WRONG:
pages/index.tsx            # Pages Router (FORBIDDEN)
pages/dashboard.tsx        # Pages Router (FORBIDDEN)
```

**Why:** Per CONSTITUTION.md Section II - Next.js 16 App Router required

**Structure:**
- All pages in `src/app/`
- Use Server Components by default
- Client Components only when necessary ('use client' directive)
- Layouts in `layout.tsx` files

---

### 2. TypeScript Strict Mode

**tsconfig.json MUST have:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Requirements:**
- All functions MUST have type annotations
- No `any` types without explicit justification
- Use interfaces for data structures
- Define types in `src/types/`

**Example:**
```typescript
// ✅ CORRECT
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

async function getTasks(userId: string): Promise<Task[]> {
  // ...
}

// ❌ WRONG
function getTasks(userId) {  // Missing types
  // ...
}
```

---

### 3. Tailwind CSS Only

**NO inline styles, NO CSS modules**

```typescript
// ✅ CORRECT
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">

// ❌ WRONG
<div style={{display: 'flex', padding: '16px'}}>  // NO inline styles

// ❌ WRONG
<div className={styles.container}>  // NO CSS modules
```

**Responsive Design:**
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Test on 320px minimum width

---

### 4. Environment Variables

**Client-Side Variables:**
- MUST be prefixed with `NEXT_PUBLIC_`
- Example: `NEXT_PUBLIC_API_URL`

**Server-Side Variables:**
- No prefix needed
- Only accessible in Server Components

**Files:**
- `.env.local` - Local development (NEVER commit)
- `.env.example` - Template (ALWAYS commit)

**Example:**
```typescript
// Client Component
const API_URL = process.env.NEXT_PUBLIC_API_URL

// Server Component
const SECRET = process.env.API_SECRET
```

---

## File Organization

```
frontend/
├── src/
│   ├── app/                  # Next.js pages (App Router)
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   ├── register/
│   │   │   └── page.tsx      # Register page
│   │   └── dashboard/
│   │       └── page.tsx      # Dashboard page
│   ├── components/           # React components
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   └── AddTaskForm.tsx
│   ├── lib/                  # Utilities and clients
│   │   ├── api.ts            # API client (axios)
│   │   ├── auth.ts           # Authentication utilities
│   │   └── config.ts         # Configuration
│   ├── types/                # TypeScript types
│   │   ├── task.ts
│   │   └── user.ts
│   └── styles/               # Global styles
│       └── globals.css
├── public/                   # Static files
├── .env.example              # Environment template
├── .env.local                # Local env (gitignored)
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## Component Guidelines

### Server Components (Default)

**Use for:**
- Data fetching
- Database queries
- Rendering static content

**Example:**
```typescript
// src/app/dashboard/page.tsx
// No 'use client' = Server Component
export default async function DashboardPage() {
  // Can fetch data directly
  return <div>Dashboard</div>
}
```

### Client Components ('use client')

**Use ONLY for:**
- Interactive elements (onClick, onChange)
- React hooks (useState, useEffect)
- Browser APIs

**Example:**
```typescript
'use client'  // Required for Client Component

import { useState } from 'react'

export default function AddTaskForm() {
  const [title, setTitle] = useState('')
  // ...
}
```

---

## API Communication

### API Client (src/lib/api.ts)

**Centralized API calls:**
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const taskAPI = {
  getTasks: (userId: string) => api.get(`/api/v1/${userId}/tasks`),
  createTask: (userId: string, data: CreateTaskData) =>
    api.post(`/api/v1/${userId}/tasks`, data),
  // ...
}
```

**Usage in components:**
```typescript
import { taskAPI } from '@/lib/api'

const tasks = await taskAPI.getTasks(userId)
```

---

## Authentication Flow

### Better Auth Integration

**Login Flow:**
1. User submits credentials
2. Call backend `/api/v1/auth/login`
3. Receive JWT token
4. Store token in localStorage
5. Redirect to dashboard

**Protected Routes:**
```typescript
// src/app/dashboard/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  // ...
}
```

---

## Error Handling

### Display User-Friendly Errors

```typescript
try {
  await taskAPI.createTask(userId, data)
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message || 'An error occurred'
    toast.error(message)  // User-friendly toast notification
  }
}
```

### Error Response Format (from backend)

```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
    timestamp: string
  }
}
```

---

## Styling Guidelines

### Tailwind Best Practices

**Consistent Spacing:**
```typescript
<div className="p-4">       // Padding
<div className="m-4">       // Margin
<div className="gap-4">     // Gap in flex/grid
```

**Colors:**
```typescript
<div className="bg-white text-gray-900">      // Light mode
<div className="bg-gray-800 text-white">      // Dark sections
<div className="bg-blue-500 hover:bg-blue-600">  // Primary action
```

**Responsive:**
```typescript
<div className="text-sm md:text-base lg:text-lg">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## Testing Checklist

Before marking feature complete:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] No `any` types without justification
- [ ] All environment variables in `.env.example`
- [ ] Mobile responsive (tested at 320px, 768px, 1024px)
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Authentication protected routes work
- [ ] API calls use centralized client
- [ ] Tailwind classes only (no inline styles)

---

## Common Pitfalls

### ❌ Mistake 1: Using Pages Router
```typescript
// ❌ WRONG
pages/index.tsx  // Pages Router

// ✅ CORRECT
src/app/page.tsx  // App Router
```

### ❌ Mistake 2: Missing 'use client'
```typescript
// ❌ WRONG - useState in Server Component
export default function MyComponent() {
  const [state, setState] = useState(0)  // Error!
}

// ✅ CORRECT
'use client'
export default function MyComponent() {
  const [state, setState] = useState(0)  // Works!
}
```

### ❌ Mistake 3: Inline Styles
```typescript
// ❌ WRONG
<div style={{padding: '16px'}}>

// ✅ CORRECT
<div className="p-4">
```

---

## References

**Parent Documentation:**
- [CONSTITUTION.md](../.specify/memory/constitution.md) - Architectural principles
- [specs/api/rest-endpoints.md](../todo-app/specs/api/rest-endpoints.md) - API specification
- [specs/ui/components.md](../todo-app/specs/ui/components.md) - Component specifications

**External Documentation:**
- [Next.js 16 App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Better Auth](https://better-auth.com/docs)

---

**Version:** 1.0.0
**Created:** 2025-12-25
**Development Method:** Spec-Driven Development (SDD)
