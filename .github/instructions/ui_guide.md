# Superadmin Frontend UI Style Guide

## 🎨 Design Philosophy
The UI follows a **modern, clean, professional admin dashboard aesthetic** with:
- Material Design-inspired components
- Card-based layouts
- Subtle gradients and shadows
- Color-coded status indicators
- Responsive grid systems

---
## 📐 Layout Structure

### 1. Page Container
```tsx
<div className="w-full space-y-6">
  {/* Page Header */}
  {/* Stats Cards Row */}
  {/* Content Cards */}
  {/* Tables */}
</div>
```

### 2. Page Headers
```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
    <p className="text-gray-600 mt-1">Subtitle description</p>
  </div>
  <div className="flex items-center gap-4">
    {/* Action buttons */}
  </div>
</div>
```

---

## 🧱 Component Patterns

### 1. Stats Cards (Dashboard KPIs)
```tsx
<StatsCard
  icon={Users}
  title="Metric Name"
  primaryValue={1234}
  primaryLabel="Primary metric"
  secondaryValue={56}
  secondaryLabel="Secondary metric"
  colorScheme="blue" // blue | green | yellow | purple | rose
/>
```

**Features:**
- Gradient backgrounds (subtle, color-coded)
- Icon with gradient background in corner
- Two-column stat grid (primary/secondary)
- Hover effects with scale transforms
- Shadow elevations

### 2. Data Cards
```tsx
<Card>
  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
    <CardTitle className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3>Title</h3>
          <p className="text-sm text-gray-600">Description</p>
        </div>
      </div>
      {/* Right side stats/badges */}
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

**Card Variants:**
- **Info Cards** - Blue border, blue-50 background
- **Warning Cards** - Yellow border, yellow-50 background
- **Success Cards** - Green border, green-50 background
- **Error Cards** - Red border, red-50 background

### 3. Activity Feed Items
```tsx
<div className="flex items-start space-x-4 p-4 rounded-lg border-l-4
     bg-white border border-gray-200 shadow-sm hover:shadow-md
     transition-all hover:border-blue-300"
     style={{ borderLeftColor: severityColor }}>

  {/* Status dot */}
  <div className="w-3 h-3 rounded-full bg-severity-color mt-1" />

  <div className="flex-1 space-y-1">
    {/* Activity header with badge */}
    {/* Details with icons */}
    {/* Timestamp */}
  </div>
</div>
```

---

## 🎭 Component Styling Patterns

### Tables
```tsx
<TableHeader className="bg-gray-900">
  <TableRow className="border-b border-gray-700">
    <TableHead className="text-white font-semibold py-3 px-4">
      Header
    </TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {/* Alternating row colors */}
  <TableRow className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
    <TableCell>Data</TableCell>
  </TableRow>
</TableBody>
```

**Features:**
- Dark header (gray-900) with white text
- Alternating row backgrounds (gray-50 / white)
- Hover states
- Inline actions with dropdown menus

### Badges
```tsx
<Badge className="bg-status-100 text-status-800 border-status-200">
  Status Text
</Badge>
```

**Status Badge Colors:**
- Pending: yellow-100 / yellow-800
- Active/Approved: green-100 / green-800
- Verified: blue-100 / blue-800
- Rejected/Inactive: red-100 / red-800
- Default: gray-100 / gray-800

### Buttons
```tsx
// Primary (gradient orange)
<Button className="gap-2">
  <Icon className="h-4 w-4" />
  Button Text
</Button>

// Outline
<Button variant="outline" size="sm">
  Action
</Button>

// Icon Only
<Button variant="ghost" className="h-8 w-8 p-0">
  <Icon className="h-4 w-4" />
</Button>
```

---

## 📊 Data Visualization

### Simple Bar/Line Charts
```tsx
<div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between gap-2">
  {data.map((item, i) => (
    <div key={i} className="flex flex-col items-center gap-2 flex-1">
      <div
        className="bg-color-500 rounded-t w-full"
        style={{ height: `${scaledValue}px` }}
      />
      <span className="text-xs text-gray-500">Label</span>
    </div>
  ))}
</div>
```

---

## 🎪 Interactive Elements

### Filters Section
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      Filter Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
      {/* Search with icon */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search..." className="pl-10" />
      </div>

      {/* Select filters */}
      <Select>...</Select>

      {/* Action buttons */}
      <Button>Apply</Button>
    </div>
  </CardContent>
</Card>
```

### Bulk Operations Bar
```tsx
<Card className="border-blue-200 bg-blue-50">
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <CheckSquare className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-blue-900">
          {count} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        {/* Bulk action buttons */}
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 🔔 Feedback & Notifications

### Alert Cards
```tsx
<Card className="border-severity-200 bg-severity-50">
  <CardContent className="pt-6">
    <div className="flex items-center space-x-2 text-severity-800">
      <Icon className="h-5 w-5" />
      <span>Message</span>
    </div>
  </CardContent>
</Card>
```

### Toast Notifications
Uses `sonner` library with custom styling matching the theme.

---

## ✨ Animation & Transitions

```css
/* Standard transitions */
transition-all duration-300
transition-colors duration-200
transition-transform duration-200

/* Hover effects */
hover:shadow-lg hover:-translate-y-0.5
hover:bg-accent hover:text-accent-foreground
group-hover:scale-110

/* Loading states */
animate-spin /* For Loader2 icon */
```

---

## 📱 Responsive Breakpoints

```css
sm: 640px  /* Small devices */
md: 768px  /* Medium devices */
lg: 1024px /* Large devices */
xl: 1280px /* Extra large */
2xl: 1536px /* 2X large */
```

**Grid Patterns:**
```tsx
/* Stats cards */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Content cards */
grid-cols-1 lg:grid-cols-2

/* Form fields */
grid-cols-1 md:grid-cols-3
```

---

## 🎯 Typography

### Font Families:
- **Primary:** Outfit (400-900 weights)
- **Secondary:** Poppins (400-700)
- **Monospace:** Space Grotesk (400-700)
- **Fallback:** system-ui, sans-serif

### Type Scale:
```css
text-xs: 0.75rem      /* 12px - captions, badges */
text-sm: 0.875rem     /* 14px - labels, body */
text-base: 1rem       /* 16px - default body */
text-lg: 1.125rem     /* 18px - card titles */
text-xl: 1.25rem      /* 20px - section headers */
text-2xl: 1.5rem      /* 24px - service metrics */
text-3xl: 1.875rem    /* 30px - page titles */
```

---

## 🎨 Shadows & Borders

```css
/* Card shadows */
shadow-sm: subtle elevation
shadow-md: moderate elevation
shadow-lg: high elevation
shadow-soft: custom soft shadow (0 1px 8px rgba(0,0,0,0.02))

/* Border radius */
rounded: 0.25rem      /* 4px - badges */
rounded-lg: 0.5rem    /* 8px - cards, buttons */
rounded-xl: 0.75rem   /* 12px - icons */
rounded-2xl: 1rem     /* 16px - sidebar */
rounded-full: 50%     /* circles */
```

---

## 🔧 Utility Patterns

### Spacing System
```tsx
gap-2: 0.5rem   /* 8px */
gap-4: 1rem     /* 16px */
gap-6: 1.5rem   /* 24px */
space-y-6: vertical spacing
```

### Common Class Combos
```tsx
/* Flex containers */
"flex items-center justify-between"
"flex items-center gap-3"
"flex flex-col space-y-4"

/* Text styling */
"text-sm font-medium text-gray-600"
"text-3xl font-bold text-gray-900"
"text-xs text-gray-500"

/* Interactive elements */
"cursor-pointer hover:bg-gray-100 transition-colors"
"disabled:pointer-events-none disabled:opacity-50"
```

---

## 📦 Key Component Libraries

- **UI Components:** Radix UI primitives (shadcn/ui)
- **Icons:** Lucide React
- **Forms:** React Hook Form (implied)
- **Toasts:** Sonner
- **Styling:** Tailwind CSS + CVA (class-variance-authority)

---

## 🎬 Implementation Checklist

When creating new pages, follow this pattern:

1. ✅ Full-width container with `space-y-6`
2. ✅ Header section with title and actions
3. ✅ Stats cards row (if dashboard-style)
4. ✅ Filters card (if listing page)
5. ✅ Main content card(s)
6. ✅ Tables with dark headers
7. ✅ Modals/dialogs for actions
8. ✅ Loading skeletons
9. ✅ Empty states with icons
10. ✅ Toast notifications for feedback

This style guide captures the professional, data-dense, and highly functional aesthetic of your superadmin dashboard. The design prioritizes clarity, status visibility, and efficient workflows for admin users.