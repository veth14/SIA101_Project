# Firebase Integration Guide

## Files to Copy to Your Project

### 1. Components
- `src/components/TaskCard.tsx` - Individual task card display
- `src/components/TaskFilters.tsx` - Filter buttons for classification

### 2. Types
- `src/types/task.ts` - Task interface definition

### 3. Page
- `src/pages/Index.tsx` - Main dashboard (replace mock data with Firebase)

### 4. Design System Updates

#### In your `src/index.css`, add these CSS variables:
```css
:root {
  /* Add these custom variables */
  --maintenance: 25 95% 53%;
  --housekeeping: 186 85% 45%;
}

.dark {
  /* Add these for dark mode */
  --maintenance: 25 95% 58%;
  --housekeeping: 186 85% 50%;
}
```

#### In your `tailwind.config.ts`, add these colors:
```typescript
colors: {
  // ... your existing colors
  maintenance: {
    DEFAULT: "hsl(var(--maintenance))",
  },
  housekeeping: {
    DEFAULT: "hsl(var(--housekeeping))",
  },
}
```

## Firebase Integration Steps

### 1. Install Firebase
```bash
npm install firebase
```

### 2. Create Firebase Config
Create `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 3. Replace Mock Data with Firebase
In `src/pages/Index.tsx`, replace the mock data section with:

```typescript
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect } from 'react';

// Inside the Index component:
const [tasks, setTasks] = useState<Task[]>([]);

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'tasks'),
    (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
    }
  );

  return () => unsubscribe();
}, []);

// Then use 'tasks' instead of 'mockTasks' in the filter
```

### 4. Firebase Data Structure
Your Firebase collection should be named `tasks` with documents containing:
```json
{
  "staffName": "Maria Santos",
  "roomNumber": "301",
  "actionNeeded": "Deep cleaning required",
  "classification": "housekeeping"
}
```

## Required Dependencies
Make sure you have these installed:
- `lucide-react` (for icons)
- `@radix-ui/react-*` (for UI components via shadcn)
- `firebase` (for database connection)

## Notes
- The Task interface is typed for TypeScript
- Colors use HSL format for better theme support
- Real-time updates are automatic with onSnapshot
- Add error handling and loading states as needed
