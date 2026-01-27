import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useApi } from "../Context/baseUrl";
import { motion, AnimatePresence } from "framer-motion";

// Quantity Selector Component
const QuantitySelector = ({ quantity, onIncrease, onDecrease }) => (
  <div className="flex items-center space-x-3 bg-white/5 rounded-full px-3 py-1 border border-white/10">
    <button
      onClick={onDecrease}
      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white disabled:opacity-50"
      disabled={quantity <= 1}
    >
      -
    </button>
    <span className="w-4 text-center font-medium text-amber-100">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
    >
      +
    </button>
  </div>
);

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove, index }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const baseUrl = useApi();

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.productId), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 hover:bg-white/10 transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95 pointer-events-none' : ''}`}
    >
      <div className="flex items-center gap-4 md:gap-6">
        {/* Product Image */}
        <div className="relative shrink-0">
          <img
            src={baseUrl + item.image}
            alt={item.title}
            className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10 shadow-lg"
          />
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-indigo-950 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {item.quantity}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
               <h3 className="text-base md:text-lg font-bold text-white truncate pr-4">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-blue-200/60">
                Unit Price: ${(item.price || 0).toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="text-white/40 hover:text-red-400 transition-colors p-1"
              title="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              onDecrease={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            />
            <p className="text-lg md:text-xl font-bold text-amber-300">
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Empty Cart Component
const EmptyCart = () => (
   <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md text-center relative z-10"
    >
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10 shadow-2xl">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-white/10 to-transparent rounded-full flex items-center justify-center border border-white/10">
          <span className="text-4xl">🛒</span>
        </div>

        <h2 className="text-3xl font-serif text-white mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-blue-100/60 mb-8 leading-relaxed">
          The path to divine connection begins with a single step. Explore our sacred collection.
        </p>

        <div className="space-y-4">
          <Link
            to="/productpage"
            className="block w-full bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 px-8 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all"
          >
            Start Shopping
          </Link>

          <Link
            to="/"
            className="block w-full text-blue-200 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
);

// Main Cart Component
export default function Cart() {
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
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

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Cart Items */}
          <div className="flex-1 space-y-6">
             <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl md:text-4xl font-serif text-white">Your Cart <span className="text-amber-300 text-lg md:text-xl font-sans ml-2">({totalItems} items)</span></h1>
                <button 
                  onClick={handleClearCart} 
                  disabled={isClearing}
                  className="text-sm text-red-300 hover:text-red-200 transition-colors disabled:opacity-50"
                >
                  Clear All
                </button>
             </div>

             <div className="space-y-4">
               <AnimatePresence>
                {cart.map((item, index) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    index={index}
                    onUpdateQuantity={(id, qty) => qty <= 0 ? removeFromCart(id) : updateQuantity(id, qty)}
                    onRemove={removeFromCart}
                  />
                ))}
               </AnimatePresence>
             </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96 shrink-0">
             <div className="sticky top-28">
               <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                 <h2 className="text-2xl font-serif text-white mb-6">Order Summary</h2>
                 
                 <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-blue-100/80">
                     <span>Subtotal</span>
                     <span>${total.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-blue-100/80">
                     <span>Shipping</span>
                     <span className="text-green-400">Free</span>
                   </div>
                   <div className="h-px bg-white/10 my-4" />
                   <div className="flex justify-between items-end">
                     <span className="text-lg text-white font-medium">Total</span>
                     <span className="text-3xl font-bold text-amber-300">${total.toFixed(2)}</span>
                   </div>
                 </div>

                 <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all text-lg mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  <Link to="/productpage" className="block text-center text-sm text-blue-200/60 hover:text-white transition-colors">
                     Or continue shopping
                  </Link>
                  
                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-8 opacity-60">
                     <div className="flex flex-col items-center text-center">
                       <span className="text-xl mb-1">🔒</span>
                       <span className="text-[10px] text-blue-100 uppercase tracking-wider">Secure</span>
                     </div>
                     <div className="flex flex-col items-center text-center">
                       <span className="text-xl mb-1">⚡</span>
                       <span className="text-[10px] text-blue-100 uppercase tracking-wider">Fast</span>
                     </div>
                     <div className="flex flex-col items-center text-center">
                       <span className="text-xl mb-1">↩️</span>
                       <span className="text-[10px] text-blue-100 uppercase tracking-wider">Easy Return</span>
                     </div>
                  </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
