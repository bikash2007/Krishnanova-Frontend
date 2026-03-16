import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./animations.css";
import "./premium.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ApiProvider } from "./Context/baseUrl.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./Context/CartContext.jsx";
import Layout from "./components/Layout/Layout.jsx";

// ============================================
// iOS Safari viewport fix
// - Updates CSS var --vh based on the *actual* visible viewport height.
// - Our CSS maps Tailwind `min-h-screen`/`h-screen` to `var(--app-height)`.
// ============================================
const installViewportUnitFix = () => {
  if (typeof window === "undefined") return;

  let raf = 0;
  let lastHeight = 0;
  const update = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      if (Math.abs(height - lastHeight) < 1) return;
      lastHeight = height;
      const vh = height * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    });
  };

  update();

  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("orientationchange", update, { passive: true });
  window.visualViewport?.addEventListener("resize", update, { passive: true });
};

const installBrowserPerformanceMode = () => {
  if (typeof window === "undefined") return;

  const ua = navigator.userAgent;
  const isWindows = /Windows/i.test(ua);
  const isChromium = /Chrome|Chromium|Edg\//i.test(ua);

  // Brave exposes navigator.brave in Chromium builds.
  const isBrave = typeof navigator.brave !== "undefined";

  if (isWindows && isChromium) {
    document.documentElement.classList.add("windows-chromium");
    if (isBrave) {
      document.documentElement.classList.add("brave-browser");
    }
  }

  let scrollTimer = 0;
  const onScroll = () => {
    document.documentElement.classList.add("is-scrolling");
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("is-scrolling");
    }, 120);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
};

installViewportUnitFix();
installBrowserPerformanceMode();

// ============================================
// PERFORMANCE OPTIMIZATION: Lazy load all routes
// This reduces initial bundle size significantly
// ============================================

// Eagerly loaded - needed immediately
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

// Lazy loaded - loaded only when user navigates to them
const ProductPage = lazy(() => import("./components/Products/ProductPage.jsx"));
const SingleProduct = lazy(
  () => import("./components/Products/SingleProduct.jsx"),
);
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const CheckoutPage = lazy(() => import("./components/CheckOut.jsx"));
const WishdomPortal = lazy(
  () => import("./components/WisdomPortal/WishdomPortal.jsx"),
);
const GitaModule = lazy(
  () => import("./components/WisdomPortal/components/Gita/GitaModule.jsx"),
);
const CommunityBlog = lazy(
  () => import("./components/Community/CommunityBlog.jsx"),
);
const BlogPost = lazy(() => import("./components/Community/BlogPost.jsx"));
const KrishnaKeychainCustomize = lazy(
  () => import("./pages/KrishnaKeychainCustomize.jsx"),
);

// Admin routes - lazy loaded
const AdminLayout = lazy(
  () => import("./components/Dashboard/AdminLayout.jsx"),
);
const AdminDashboard = lazy(
  () => import("./components/Dashboard/AdminDashboard.jsx"),
);
const ProductManagement = lazy(
  () => import("./components/Dashboard/ProductManagement.jsx"),
);
const EventManagement = lazy(
  () => import("./components/Dashboard/EventManagement.jsx"),
);
const UserManagement = lazy(
  () => import("./components/Dashboard/UserManagement.jsx"),
);
const BlogManagment = lazy(
  () => import("./components/Dashboard/BlogManagment.jsx"),
);
const OrderManagement = lazy(
  () => import("./components/Dashboard/OrderManagment.jsx"),
);
const GitaManager = lazy(
  () => import("./components/Admin/GitaManager/GitaManager.jsx"),
);

// Loading spinner for lazy routes
const RouteLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-amber-300/80 text-sm">Loading...</p>
    </div>
  </div>
);

// Wrapper for lazy components
const LazyRoute = ({ children }) => (
  <Suspense fallback={<RouteLoader />}>{children}</Suspense>
);

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
          <LazyRoute>
            <ProductPage />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/product/:id",
      element: (
        <Layout>
          <LazyRoute>
            <SingleProduct />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/admin",
      element: (
        <LazyRoute>
          <AdminLayout />
        </LazyRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <LazyRoute>
              <AdminDashboard />
            </LazyRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <LazyRoute>
              <AdminDashboard />
            </LazyRoute>
          ),
        },
        {
          path: "products",
          element: (
            <LazyRoute>
              <ProductManagement />
            </LazyRoute>
          ),
        },
        {
          path: "events",
          element: (
            <LazyRoute>
              <EventManagement />
            </LazyRoute>
          ),
        },
        {
          path: "users",
          element: (
            <LazyRoute>
              <UserManagement />
            </LazyRoute>
          ),
        },
        {
          path: "blogs",
          element: (
            <LazyRoute>
              <BlogManagment />
            </LazyRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <LazyRoute>
              <OrderManagement />
            </LazyRoute>
          ),
        },
        {
          path: "gita",
          element: (
            <LazyRoute>
              <GitaManager />
            </LazyRoute>
          ),
        },
      ],
    },
    {
      path: "/cart",
      element: (
        <Layout>
          <LazyRoute>
            <Cart />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/orders",
      element: (
        <Layout>
          <LazyRoute>
            <MyOrders />
          </LazyRoute>
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
          <LazyRoute>
            <Profile />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/wishdomportal",
      element: (
        <Layout>
          <LazyRoute>
            <WishdomPortal />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/readvagwatgita",
      element: (
        <Layout>
          <LazyRoute>
            <GitaModule />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/communityblog",
      element: (
        <Layout>
          <LazyRoute>
            <CommunityBlog />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/blog/:id",
      element: (
        <Layout>
          <LazyRoute>
            <BlogPost />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/checkout",
      element: (
        <Layout>
          <LazyRoute>
            <CheckoutPage />
          </LazyRoute>
        </Layout>
      ),
    },
    {
      path: "/customize-krishna",
      element: (
        <Layout>
          <LazyRoute>
            <KrishnaKeychainCustomize />
          </LazyRoute>
        </Layout>
      ),
    },
  ],
  {
    basename: "/test",
  },
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
  </StrictMode>,
);
