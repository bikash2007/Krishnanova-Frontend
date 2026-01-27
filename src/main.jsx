import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./animations.css";
import "./premium.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductPage from "./components/Products/ProductPage.jsx";

import { ApiProvider } from "./Context/baseUrl.jsx";
import SingleProduct from "./components/Products/SingleProduct.jsx";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./components/Dashboard/AdminDashboard.jsx";
import AdminLayout from "./components/Dashboard/AdminLayout.jsx";
import ProductManagement from "./components/Dashboard/ProductManagement.jsx";
import EventManagement from "./components/Dashboard/EventManagement.jsx";
import UserManagement from "./components/Dashboard/UserManagement.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import WishdomPortal from "./components/WisdomPortal/WishdomPortal.jsx";
import GitaModule from "./components/WisdomPortal/components/Gita/GitaModule.jsx";
import CommunityBlog from "./components/Community/CommunityBlog.jsx";
import BlogManagment from "./components/Dashboard/BlogManagment.jsx";
import Cart from "./pages/Cart.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import CheckoutPage from "./components/CheckOut.jsx";
import OrderManagement from "./components/Dashboard/OrderManagment.jsx";
import BlogPost from "./components/Community/BlogPost.jsx";
import KrishnaKeychainCustomize from "./pages/KrishnaKeychainCustomize.jsx";
import GitaManager from "./components/Admin/GitaManager/GitaManager.jsx";

import Layout from "./components/Layout/Layout.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Layout>
          <App />
        </Layout>
      ),
    },
    {
      path: "/productpage",
      element: (
        <Layout>
          <ProductPage />
        </Layout>
      ),
    },
    {
      path: "/product/:id",
      element: (
        <Layout>
          <SingleProduct />
        </Layout>
      ),
    },
    {
      path: "/admin", // This is the base path for all admin functionalities
      element: <AdminLayout />, // This will render the AdminSidebar and an <Outlet />
      children: [
        {
          index: true, // This makes /admin render AdminDashboard by default
          element: <AdminDashboard />,
        },
        {
          path: "dashboard", // Full path: /admin/dashboard
          element: <AdminDashboard />,
        },
        {
          path: "products", // Full path: /admin/products
          element: <ProductManagement />,
        },
        {
          path: "events", // Full path: /admin/events
          element: <EventManagement />,
        },
        {
          path: "users", // Full path: /admin/users
          element: <UserManagement />,
        },
        {
          path: "blogs", // Full path: /admin/users
          element: <BlogManagment />,
        },
        {
          path: "orders", // Full path: /admin/users
          element: <OrderManagement />,
        },
        {
          path: "gita", // Full path: /admin/gita
          element: <GitaManager />,
        },

        // Add more admin-specific routes here as needed
      ],
    },
    {
      path: "/cart",
      element: (
        <Layout>
          <Cart />
        </Layout>
      ),
    },
    {
      path: "/orders",
      element: (
        <Layout>
          <MyOrders />
        </Layout>
      ),
    },

    {
      path: "/login",
      element: (
        <Layout>
          <Login />
        </Layout>
      ),
    },
    {
      path: "/signup",
      element: (
        <Layout>
          <Signup />
        </Layout>
      ),
    },
    {
      path: "/profile",
      element: (
        <Layout>
          <Profile />
        </Layout>
      ),
    },
    {
      path: "/wishdomportal",
      element: (
        <Layout>
          <WishdomPortal />
        </Layout>
      ),
    },
    {
      path: "/readvagwatgita",
      element: (
        <Layout>
          <GitaModule />
        </Layout>
      ),
    },
    {
      path: "/communityblog",
      element: (
        <Layout>
          <CommunityBlog />
        </Layout>
      ),
    },
    {
      path: "/blog/:id",
      element: (
        <Layout>
          <BlogPost />
        </Layout>
      ),
    },

    {
      path: "/checkout",
      element: (
        <Layout>
          <CheckoutPage />
        </Layout>
      ),
    },
    {
      path: "/customize-krishna",
      element: (
        <Layout>
          <KrishnaKeychainCustomize />
        </Layout>
      ),
    },
  ],
  {
    basename: "/test", // 🎯 ADD THIS LINE
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApiProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ApiProvider>
  </StrictMode>
);
