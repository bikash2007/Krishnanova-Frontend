import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import Navigation from "../components/Navigation/Navigation";
import { useApi } from "../Context/baseUrl";

// Quantity Selector Component
const QuantitySelector = ({ quantity, onIncrease, onDecrease, onRemove }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onDecrease}
      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
      disabled={quantity <= 1}
    >
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 12H4"
        />
      </svg>
    </button>
    <span className="w-8 text-center font-semibold text-gray-800">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
    >
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  </div>
);

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove, index }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.productId), 300);
  };
  const baseUrl = useApi();

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-200 ${
        isRemoving
          ? "opacity-0 transform scale-95"
          : "opacity-100 transform scale-100"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center space-x-6">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <img
            src={baseUrl + item.image}
            alt={item.title}
            className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100"
          />
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {item.quantity}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Price: ${(item.price || 0).toFixed(2)} each
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={() =>
                onUpdateQuantity(item.productId, item.quantity + 1)
              }
              onDecrease={() =>
                onUpdateQuantity(item.productId, item.quantity - 1)
              }
              onRemove={() => handleRemove()}
            />

            {/* Item Total */}
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
          title="Remove item"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        {/* Empty Cart Icon */}
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Looks like you haven't added any items to your cart yet. Start
          shopping to fill it up!
        </p>

        <div className="space-y-4">
          <Link
            to="/productpage"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Shopping
          </Link>

          <Link
            to="/"
            className="block w-full bg-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Main Cart Component
export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);

  const total = cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 mt-10">
        {/* Header with Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            {/* Navigation Breadcrumb */}
            <nav className="hidden md:flex items-center space-x-2 text-sm">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Home
              </Link>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <Link
                to="/productpage"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Products
              </Link>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-500 font-medium">Cart</span>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <Link
              to="/productpage"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart Items */}
        <div
          className={`space-y-6 mb-8 ${
            isClearing ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {cart.map((item, index) => (
            <CartItem
              key={item.productId}
              item={item}
              index={index}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Order Summary */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      Total:
                    </span>
                    <span className="text-3xl font-bold text-green-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-4 lg:ml-8">
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="px-8 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClearing ? "Clearing..." : "Clear Cart"}
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/productpage"
                className="flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </Link>

              <button className="flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Save for Later
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Secure Checkout</p>
                <p className="text-sm text-gray-600">SSL encrypted</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">On all orders</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Easy Returns</p>
                <p className="text-sm text-gray-600">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
