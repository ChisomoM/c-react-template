# Zambian E-commerce Template

A modern, full-featured e-commerce template with Supabase backend, admin dashboard, product catalog, shopping cart, and mock checkout. Built specifically for Zambian businesses with ZMW currency support. Uses Next.js 15, TypeScript, Tailwind CSS, and Radix UI components.

## Features

- **Supabase Backend**: PostgreSQL database, authentication, and storage
- **Service Layer Architecture**: Repository pattern to decouple UI from database
- **Authentication System**: Supabase Auth with email/password, protected routes
- **Admin Dashboard**: Product management, order tracking, user management, and analytics
- **Product Catalog**: Browse products, search, filter by category
- **Shopping Cart**: Persistent cart with Supabase sync
- **Mock Checkout**: Complete checkout flow with Mobile Money simulation
- **SEO Optimization**: Generic SEO component for managing meta tags
- **Responsive Design**: Mobile-first design using Tailwind CSS and Radix UI components
- **TypeScript**: Full type safety throughout the application
- **Modern Tooling**: Next.js for full-stack development, ESLint for code quality, and pnpm for package management

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: React Context (Auth, Cart)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm/yarn
- A Supabase account ([Sign up here](https://supabase.com))

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

3. Set up Supabase:
   - Create a new project at [database.new](https://database.new)
   - Run the SQL scripts in order:
     1. `src/scripts/schema.sql` (creates tables, RLS policies, functions)
     2. `src/scripts/seed_data.sql` (seeds sample products and combos)
   - Get your Project URL and anon key from Settings > API

4. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

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
│   │   ├── shop/
│   │   │   └── page.tsx           # Product catalog
│   │   └── HomeClient.tsx         # Home page client component
│   ├── login/
│   │   └── page.tsx               # Login page
│   └── (admin)/                   # Admin pages route group
│       ├── layout.tsx             # AdminLayout with ProtectedRoute
│       └── admin/
│           ├── dashboard/
│           │   └── page.tsx       # Admin dashboard
│           └── products/
│               └── page.tsx       # Product management
├── components/
│   ├── ui/                        # Reusable UI components (Radix)
│   ├── auth/                      # Authentication components
│   ├── footer.tsx                 # Site footer
│   ├── navbar.tsx                 # Site navigation
├── layouts/
│   ├── AdminLayout.tsx            # Admin sidebar layout
│   └── MainLayout.tsx             # Public page layout
├── lib/
│   ├── context/                   # React contexts (Auth, Cart)
│   ├── supabase/                  # Supabase client/server setup
│   ├── api/                       # API utilities (legacy)
│   └── utils.ts                   # Utility functions
├── services/                      # Service layer (Repository pattern)
│   ├── types.ts                   # Service interfaces
│   ├── SupabaseAuthService.ts     # Auth implementation
│   ├── SupabaseProductService.ts  # Product CRUD
│   └── SupabaseCartService.ts     # Cart management
├── scripts/                       # SQL migration scripts
│   ├── schema.sql                 # Database schema
│   └── seed_data.sql              # Sample data
├── types/
│   └── auth.ts                    # TypeScript types
└── assets/                        # Static assets (logos, images)
```

## Key Features

### Service Layer Architecture
- **Repository Pattern**: Decouples UI from Supabase
- **IAuthService**: Authentication interface
- **IProductService**: Product CRUD interface
- **ICartService**: Cart management interface
- Easy to swap Supabase for another backend

### Authentication
- **Supabase Auth**: Email/password authentication
- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Wraps routes that require authentication
- **Role-based Access**: Admin vs Customer routes

### Admin Dashboard
- Product management (CRUD operations)
- Order tracking and management
- User management
- Analytics and reports
- Sidebar navigation with collapse/expand

### Product Catalog
- Browse all products
- Search functionality
- Category filtering
- Product variants (size, color)
- Stock management
- Image galleries

### Shopping Cart
- Persistent cart (synced to Supabase)
- Add/remove items
- Update quantities
- Guest cart support
- Cart sync on login

### Routing
- Public routes: `/`, `/shop`, `/shop/[id]`
- Admin routes: `/admin/dashboard`, `/admin/products`, `/admin/orders`
- Auth routes: `/login`, `/register`

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
