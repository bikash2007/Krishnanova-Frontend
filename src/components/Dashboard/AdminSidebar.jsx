import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Events", path: "/admin/events", icon: "📅" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Blogs", path: "/admin/blogs", icon: "📔" },
    { name: "Orders", path: "/admin/orders", icon: "📝" },
    { name: "Gita Manager", path: "/admin/gita", icon: "📖" },
  ];

  return (
    <motion.div
      className="w-64 bg-[#0f1f2e] text-white p-6 min-h-screen shadow-lg"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-8 text-[#f4c430]">Admin Panel</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <motion.li key={item.path} className="mb-4" whileHover={{ x: 5 }}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-[#01abfd] text-white font-semibold"
                    : "text-gray-300 hover:bg-[#0189d1]/20"
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-8 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-[#0189d1]/20 transition-colors duration-200"
        >
          <span className="mr-3 text-xl">🏠</span> Back to Site
        </Link>
      </div>
    </motion.div>
  );
}
