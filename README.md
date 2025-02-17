# Chama WebApp

A modern web application for managing Chama (Investment Group) activities, built with React, TypeScript, Tailwind CSS, and Supabase.

<div align="center">
  <img src="assets/screenshots/register-page.png" alt="Chama WebApp Register Page" width="600"/>
</div>

## Features

- 🔐 Secure Authentication System
- 📊 User Dashboard
- 👥 Member Number Management
- 🎯 Activity Tracking
- 📱 Responsive Design
- 🔄 Real-time Updates
- 👑 Admin Dashboard
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend:**

  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Router v6
  - Zustand (State Management)

- **Backend:**

  - Supabase
  - PostgreSQL

- **Development Tools:**
  - Vite
  - ESLint
  - PostCSS
  - Node.js

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Kevinjulu/Chama-WebApp.git
   cd Chama-WebApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   - Copy the `.env.example` file to `.env`
   - Update the Supabase credentials in `.env`:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Database Setup**

   - The Supabase migrations are located in `supabase/migrations/`
   - Apply migrations using Supabase CLI or dashboard

5. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── hooks/        # Custom React hooks
├── layouts/      # Layout components
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── lib/          # Utility functions and configurations
├── pages/        # Application pages
│   ├── auth/     # Authentication pages
│   ├── dashboard/# User dashboard pages
│   └── admin/    # Admin pages
└── main.tsx      # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- Authentication is handled by Supabase
- Row Level Security (RLS) policies are implemented
- Environment variables are used for sensitive data
- Protected routes for authenticated users

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [your-email@example.com] or open an issue on GitHub.

## Acknowledgments

- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
