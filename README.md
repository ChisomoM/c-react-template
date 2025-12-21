# React Template

A modern, full-featured React template with authentication, admin dashboard, public pages, and a complete backend API. Built with Next.js 16, TypeScript, Tailwind CSS, and Radix UI components.

## Features

- **Authentication System**: Login/logout with JWT tokens, protected routes based on account types (can be replaced with Firebase Auth)
- **Admin Dashboard**: Comprehensive admin interface with sidebar navigation, user management, and analytics
- **Public Pages**: Landing page with hero section, features, API documentation, and contact forms
- **Backend API**: Complete REST API with authentication, CRUD operations, and middleware
- **SEO Optimization**: Generic SEO component for managing meta tags, Open Graph, and Twitter Cards
- **Responsive Design**: Mobile-first design using Tailwind CSS and Radix UI components
- **TypeScript**: Full type safety throughout the application
- **Modern Tooling**: Next.js for full-stack development, ESLint for code quality, and pnpm for package management
- **Routing**: Next.js App Router with API routes and client-side navigation
- **Optional Firebase Integration**: Authentication, database (Firestore), and file storage

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Backend**: Next.js API Routes
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS, Radix UI
- **Routing**: Next.js App Router
- **State Management**: React Context (for auth)
- **Authentication**: JWT tokens
- **Database**: In-memory storage (template - replace with PostgreSQL, MongoDB, etc.)
- **Icons**: Lucide React
- **Forms**: Custom form components with validation
- **Notifications**: Sonner for toast notifications

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChisomoM/c-react-template.git
   cd c-react-template
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm start
```

### Linting

```bash
pnpm lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with AuthProvider and Toaster
│   ├── globals.css                # Global styles
│   ├── (public)/                  # Public pages route group
│   │   ├── layout.tsx             # MainLayout (Navbar + Footer)
│   │   ├── page.tsx               # Home page
│   │   └── home/
│   │       └── components/        # Home page components
│   ├── login/
│   │   └── page.tsx               # Login page
│   └── (admin)/                   # Admin pages route group
│       ├── layout.tsx             # AdminLayout with ProtectedRoute
│       └── admin/
│           ├── dashboard/
│           │   └── page.tsx       # Admin dashboard
│           └── LoginPage.tsx      # Login page component
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── auth/                      # Authentication components
│   ├── footer.tsx                 # Site footer
│   ├── navbar.tsx                 # Navigation bar
│   └── ...
├── layouts/                       # Legacy layouts (can be removed)
├── lib/
│   ├── context/                   # React contexts
│   ├── api/                       # API utilities
│   └── utils.ts                   # Utility functions
├── types/
│   └── auth.ts                    # TypeScript types
└── assets/                        # Static assets (logos, images)
```

## Key Components

### Authentication
- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Wraps routes that require authentication
- **LoginForm**: Handles user login with email/password

### Routing
- Public routes: `/` (home), `/login`
- Admin routes: `/admin/dashboard` (protected)

### UI Components
- Built with Radix UI primitives for accessibility
- Custom components for forms, navigation, and layouts
- Responsive design with Tailwind CSS

### SEO Component

The template includes a generic SEO component for managing meta tags, Open Graph, and Twitter Cards. It's built using `react-helmet-async` for dynamic document head management.

**Usage:**

```tsx
import SEO from '../components/SEO';

function MyPage() {
  return (
    <>
      <SEO
        title="Page Title"
        description="Page description for search engines"
        keywords="keyword1, keyword2, keyword3"
        image="https://example.com/image.jpg"
        url="https://example.com/page"
        type="website"
        siteName="Your Site Name"
        twitterCard="summary_large_image"
        canonical="https://example.com/page"
      />
      {/* Your page content */}
    </>
  );
}
```

**Props:**

- `title`: Page title (defaults to "Default Title")
- `description`: Meta description
- `keywords`: Comma-separated keywords
- `image`: URL for Open Graph/Twitter image
- `url`: Canonical URL (defaults to current URL)
- `type`: Open Graph type (defaults to "website")
- `siteName`: Site name for Open Graph
- `twitterCard`: Twitter card type (defaults to "summary_large_image")
- `canonical`: Canonical URL
- `children`: Additional head elements

## Backend API

This template includes a complete REST API built with Next.js API routes. The API provides authentication, user management, and CRUD operations for items.

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

#### Items (CRUD)
- `GET /api/items` - Get all user's items (protected)
- `POST /api/items` - Create new item (protected)
- `GET /api/items/[id]` - Get single item (protected)
- `PUT /api/items/[id]` - Update item (protected)
- `DELETE /api/items/[id]` - Delete item (protected)

#### Health Check
- `GET /api/health` - API health status

### API Documentation

See `API_DOCUMENTATION.md` for detailed API documentation with examples.

### Database

The template uses in-memory storage for demonstration. For production:

1. **Choose a Database**: PostgreSQL, MongoDB, MySQL, etc.
2. **Install Database Library**: `pnpm add prisma` or `pnpm add mongoose`
3. **Update Database Connection**: Replace in-memory storage in `src/lib/database.ts`
4. **Migrate Data Models**: Update User and Item interfaces

### Environment Variables

Add to your `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Customization

### Adding New Pages
1. Create your component in the appropriate folder (`(public)` or `(admin)`)
2. Add the route to `App.tsx`
3. Use `ProtectedRoute` if authentication is required

### Styling
- Modify `tailwind.config.js` for custom themes
- Update component classes directly or use CSS modules
- Global styles in `src/index.css`

### API Integration
- Update endpoints in `src/lib/api/end_points.tsx`
- Modify API calls in `src/lib/api/crud.tsx`
- Adjust authentication logic in `src/lib/context/auth.tsx`
- **Optional**: Use Firebase for backend services (see Firebase Integration section)

## Firebase Integration (Optional)

This template includes optional Firebase integration for authentication, database, and storage. Firebase is not required and can be easily removed.

### Setup Firebase

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage as needed
3. Get your Firebase config from Project Settings

### Environment Variables

Add to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Using Firebase Auth

```tsx
import { signInWithFirebase, signUpWithFirebase, signOutFromFirebase } from '@/lib/firebase';

const handleLogin = async () => {
  try {
    const user = await signInWithFirebase(email, password);
    console.log('Logged in:', user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Using Firestore

```tsx
import { FirebaseFirestore } from '@/lib/firebase';

const getUsers = async () => {
  const users = await FirebaseFirestore.getCollection('users');
  console.log(users);
};

const addUser = async () => {
  const userId = await FirebaseFirestore.addDocument('users', {
    name: 'John Doe',
    email: 'john@example.com'
  });
  console.log('Added user with ID:', userId);
};
```

### Using Storage

```tsx
import { FirebaseStorage } from '@/lib/firebase';

const uploadFile = async (file: File) => {
  const downloadURL = await FirebaseStorage.uploadFile(`uploads/${file.name}`, file);
  console.log('File uploaded:', downloadURL);
};
```

### Removing Firebase

To remove Firebase integration:

1. Delete the `src/lib/firebase/` directory
2. Delete `src/lib/auth/firebaseAuth.ts`
3. Remove `firebase` from `package.json`
4. Remove Firebase environment variables from `.env`
5. Remove any Firebase imports from your components

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.
