# AI Rules and Tech Stack Overview

This document outlines the core technologies used in this project and provides guidelines for their appropriate use.

## Tech Stack

*   **React**: The primary JavaScript library for building user interfaces.
*   **TypeScript**: Used for type-safe JavaScript, enhancing code quality and maintainability.
*   **Vite**: The build tool that provides a fast development experience.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development and responsive design.
*   **shadcn/ui**: A collection of reusable UI components built on Radix UI and styled with Tailwind CSS.
*   **React Router**: For declarative routing within the application.
*   **Supabase**: The backend-as-a-service for authentication, database, storage, and edge functions.
*   **React Query**: For efficient data fetching, caching, and state management with server data.
*   **Lucide React**: A library for modern, customizable SVG icons.
*   **Zod & React Hook Form**: For robust form management and schema validation.

## Library Usage Guidelines

To maintain consistency and efficiency, please adhere to the following guidelines when using libraries:

*   **UI Components**: Always prioritize `shadcn/ui` components for building the user interface. If a specific component is not available in `shadcn/ui`, you may create a new, small component following the existing styling conventions.
*   **Styling**: All styling must be done using `Tailwind CSS` classes. Avoid inline styles or custom CSS files unless absolutely necessary for very specific, isolated cases. Use the `cn` utility from `src/lib/utils.ts` for combining Tailwind classes.
*   **Routing**: Use `react-router-dom` for all navigation and route management. Keep the main routes defined in `src/App.tsx`.
*   **Data Fetching & Caching**: For interacting with server data (e.g., Supabase), use `@tanstack/react-query`. This helps manage loading states, errors, and data synchronization efficiently.
*   **Backend Interactions**: All authentication, database operations, storage, and serverless functions should be handled via the `supabase-js` client, configured in `src/integrations/supabase/client.ts`.
*   **Icons**: Use icons from the `lucide-react` library.
*   **Forms**: Implement forms using `react-hook-form` for state management and `zod` for schema-based validation. This ensures consistent and robust form handling.
*   **Toasts/Notifications**: For simple, non-dismissible notifications, use `sonner`. For more interactive or dismissible toasts, use the `useToast` hook from `src/hooks/use-toast.ts` (which leverages `@radix-ui/react-toast`).
*   **Date Pickers**: For date input, use `react-day-picker` along with `date-fns` for date manipulation utilities.