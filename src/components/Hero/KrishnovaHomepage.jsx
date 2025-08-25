import React, { useEffect, useState } from "react";

const KrishnovaHomepage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Peacock Feather SVG */}
      <div className="absolute top-20 right-10 animate-float opacity-20">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="text-indigo-600"
        >
          <circle cx="50" cy="30" r="15" fill="currentColor" opacity="0.6" />
          <ellipse
            cx="50"
            cy="60"
            rx="8"
            ry="25"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M50 85 Q45 70 50 45 Q55 70 50 85"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between min-h-screen">
        {/* Left Content */}
        <div
          className={`lg:w-1/2 space-y-8 transform transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-20 opacity-0"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg animate-pulse-slow">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-700 font-medium">
              Divine Collection Available
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Krishnova
              </span>
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-700 font-light">
              Where Devotion Meets
              <span className="block font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Modern Elegance
              </span>
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
            Discover our exclusive collection of Lord Krishna inspired products.
            From sacred Bhagavad Gita editions to beautifully crafted keychains,
            bring divine blessings into your everyday life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>

            <button className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm bg-white/50">
              Read Bhagavad Gita
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 animate-count">
                5000+
              </div>
              <div className="text-sm text-gray-600">Happy Devotees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 animate-count">
                100+
              </div>
              <div className="text-sm text-gray-600">Sacred Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 animate-count">
                4.9★
              </div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image/Animation */}
        <div
          className={`lg:w-1/2 relative transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          <div className="relative">
            {/* Glowing Circle Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>

            {/* Main Circle Container */}
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
              {/* Rotating Ring */}
              <div className="absolute inset-0 border-4 border-dashed border-indigo-300 rounded-full animate-spin-slow"></div>

              {/* Inner Content Circle */}
              <div className="absolute inset-8 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center overflow-hidden group">
                {/* Krishna Flute Symbol */}
                <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                  🪈
                </div>

                {/* Orbiting Elements */}
                <div className="absolute w-full h-full animate-spin-slow">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg flex items-center justify-center text-white font-bold animate-bounce-slow">
                      ॐ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Product Cards */}
            <div className="absolute -top-10 -left-10 bg-white rounded-2xl shadow-xl p-4 animate-float animation-delay-2000">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                  📿
                </div>
                <div>
                  <p className="text-sm font-semibold">Krishna Keychain</p>
                  <p className="text-xs text-gray-500">Bestseller</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 bg-white rounded-2xl shadow-xl p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                  📖
                </div>
                <div>
                  <p className="text-sm font-semibold">Bhagavad Gita</p>
                  <p className="text-xs text-gray-500">Premium Edition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-indigo-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-indigo-600 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>
    </section>
  );
};

export default KrishnovaHomepage;
