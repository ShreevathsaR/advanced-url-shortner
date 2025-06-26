import { createBrowserRouter, RouterProvider } from "react-router";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Children, useState } from "react";
import { Toaster } from "sonner";
import Urls from "./pages/Urls";
import DashboardLayout from "./pages/DashboardLayouts";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [{
        path:'dashboard',
        element: <Dashboard/>
      },
      {
        path:'urls',
        element:<Urls/>
      }
    ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <div>Not found</div>,
    },
  ]);

  const [queryClient] = useState(new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <Toaster/>
    </QueryClientProvider>
  );
}

export default App;
