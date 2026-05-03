// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useApi } from "../Context/baseUrl";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs uppercase tracking-wider text-blue-200/60 font-medium ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all font-light"
    />
  </div>
);

function CheckoutForm({ onOrderSuccess }) {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [shipping, setShipping] = useState({
    fullName: user?.name || "",
    phone: "",
    email: user?.email || "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validationItems = cart.map((i) => ({
        product: i.productId,
        quantity: i.quantity,
        variantId: i.selectedVariantId || null,
        selectedVariant: i.selectedVariant || null,
        selectedColor: i.selectedColor || null,
      }));

      await axios.post(import.meta.env.VITE_API_URL + "/cart", {
        items: validationItems,
      });

      // 1. Get client secret from backend
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/stripe/create-payment-intent",
        { amount: total, currency: "usd" },
      );
      const clientSecret = data.clientSecret;

      // 2. Stripe: collect card and pay
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shipping.fullName,
            email: shipping.email,
            phone: shipping.phone,
            address: {
              line1: shipping.address1,
              line2: shipping.address2,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zip,
              country: shipping.country === "United States" ? "US" : "NP",
            },
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        // 3. Place order in your DB as paid
        const items = cart.map((i) => ({
          product: i.productId,
          title: i.title,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedVariant: i.selectedVariant,
          variantId: i.selectedVariantId || null,
          sku: i.sku || null,
          isPreOrder: !!i.isPreOrder,
        }));
        const res = await axios.post(
          import.meta.env.VITE_API_URL + "/orders",
          {
            items,
            shippingInfo: shipping,
            total,
            paymentStatus: "paid",
            paymentId: result.paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        clearCart();
        if (onOrderSuccess) onOrderSuccess(res.data._id);
      }
    } catch (err) {
      setError(err.message || err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact & Shipping Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          placeholder="Arjuna Das"
          value={shipping.fullName}
          onChange={(e) =>
            setShipping((s) => ({ ...s, fullName: e.target.value }))
          }
          required
        />
        <InputField
          label="Phone"
          placeholder="+1 (555) 000-0000"
          value={shipping.phone}
          onChange={(e) =>
            setShipping((s) => ({ ...s, phone: e.target.value }))
          }
          required
        />
        <div className="md:col-span-2">
          <InputField
            label="Email Address"
            placeholder="devotee@example.com"
            value={shipping.email}
            onChange={(e) =>
              setShipping((s) => ({ ...s, email: e.target.value }))
            }
            required
          />
        </div>
        <div className="md:col-span-2">
          <InputField
            label="Address"
            placeholder="108 Krishna Way"
            value={shipping.address1}
            onChange={(e) =>
              setShipping((s) => ({ ...s, address1: e.target.value }))
            }
            required
          />
        </div>
        <InputField
          label="City"
          placeholder="Vrindavan"
          value={shipping.city}
          onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
          required
        />
        <div className="flex gap-4">
          <div className="w-1/2">
            <InputField
              label="State"
              placeholder="UP"
              value={shipping.state}
              onChange={(e) =>
                setShipping((s) => ({ ...s, state: e.target.value }))
              }
              required
            />
          </div>
          <div className="w-1/2">
            <InputField
              label="Zip"
              placeholder="281121"
              value={shipping.zip}
              onChange={(e) =>
                setShipping((s) => ({ ...s, zip: e.target.value }))
              }
              required
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs uppercase tracking-wider text-blue-200/60 font-medium ml-1">
            Country
          </label>
          <div className="relative">
            <select
              className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-amber-400/50"
              value={shipping.country}
              onChange={(e) =>
                setShipping((s) => ({ ...s, country: e.target.value }))
              }
            >
              <option className="bg-indigo-900 text-white">
                United States
              </option>
              <option className="bg-indigo-900 text-white">Nepal</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <label className="block mb-4 text-blue-100 font-medium text-lg">
          Secure Payment
        </label>
        <div className="p-4 bg-white rounded-xl border border-white/10">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  fontFamily: '"Inter", sans-serif',
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-blue-100">
          <p className="text-xs uppercase tracking-wider opacity-60">
            Total to Pay
          </p>
          <p className="text-2xl font-bold text-amber-300 font-serif">
            ${total.toFixed(2)}
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || !cart.length}
          className="bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              Complete Order <span className="text-xl">→</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}
    </form>
  );
}

export default function CheckoutPage() {
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const { cart } = useCart();
  const baseUrl = useApi();
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Redirect to /orders after successful order
  useEffect(() => {
    if (orderId) {
      const timer = setTimeout(() => navigate("/orders"), 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 py-24 px-4 relative">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Summary */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="sticky top-28 space-y-6">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-serif text-white mb-6">
                  Order Review
                </h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId || item.productId}
                      className="flex gap-4 items-center"
                    >
                      <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                        <img
                          src={baseUrl + item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {item.title}
                        </h4>
                        {(item.selectedVariant || item.selectedColor) && (
                          <div className="flex flex-wrap gap-1 mt-0.5 mb-0.5">
                            {item.selectedVariant && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-amber-200/80 uppercase">
                                Var: {item.selectedVariant}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-amber-200/80 uppercase">
                                Col: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-blue-200/60 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-amber-200">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-blue-200/80">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-blue-200/80">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white pt-2">
                    <span>Total</span>
                    <span className="text-amber-300">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 text-blue-300/60 hover:text-white transition-colors text-sm"
              >
                <span>←</span> Return to Cart
              </Link>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
              <div className="mb-8">
                <h1 className="text-3xl font-serif text-white mb-2">
                  Checkout
                </h1>
                <p className="text-blue-200/60">
                  Complete your details to finalize your offering.
                </p>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm onOrderSuccess={setOrderId} />
              </Elements>

              {orderId && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-200 text-center font-bold animate-pulse">
                  Order placed successfully! Redirecting...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
