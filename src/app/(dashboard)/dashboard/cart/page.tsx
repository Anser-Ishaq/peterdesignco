"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

interface Lead {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    slug: string;
    thumbnail: {
      url: string;
      alt: string;
    };
    pricing: {
      original: number;
      sale: number | null;
      discountPercent: number | null;
    };
    stock: {
      quantity: number;
      status: 'in_stock' | 'low_stock' | 'out_of_stock';
    };
    quality: 'Basic' | 'Standard' | 'Premium' | 'Luxury';
    category: string;
  };
  quantity: number;
  addedAt: string;
  status: 'active' | 'ordered' | 'removed';
  createdAt: string;
  updatedAt: string;
}

export default function CartPage() {
  const { user, isAuthenticated } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leads", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setLeads(data.data);
      } else {
        setError(data.error || "Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "User") {
      fetchLeads();
    }
  }, [isAuthenticated, user]);

  const updateQuantity = async (leadId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(leadId);
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();

      if (data.success) {
        setLeads(leads.map(lead => 
          lead._id === leadId ? data.data : lead
        ));
      } else {
        alert(data.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (leadId: string) => {
    if (!confirm("Are you sure you want to remove this item from your cart?")) return;

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setLeads(leads.filter(lead => lead._id !== leadId));
      } else {
        alert(data.error || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return leads.reduce((total, lead) => {
      const price = lead.productId.pricing.sale || lead.productId.pricing.original;
      return total + (price * lead.quantity);
    }, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your cart.</p>
          <Link href="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== "User") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only users can access the cart.</p>
          <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
        <Link
          href="/shop"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchLeads}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link
              href="/shop"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="p-6">
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative w-20 h-20 bg-gray-200 rounded">
                      {lead.productId.thumbnail?.url ? (
                        <Image
                          src={lead.productId.thumbnail.url}
                          alt={lead.productId.thumbnail.alt}
                          fill
                          className="object-cover rounded"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{lead.productId.name}</h3>
                      <p className="text-gray-600 text-sm">Quality: {lead.productId.quality}</p>
                      <p className="text-gray-600 text-sm">Category: {lead.productId.category}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-blue-600">
                          ${lead.productId.pricing.sale || lead.productId.pricing.original}
                        </span>
                        {lead.productId.pricing.sale && (
                          <span className="text-sm text-gray-500 line-through">
                            ${lead.productId.pricing.original}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(lead._id, lead.quantity - 1)}
                        disabled={lead.quantity <= 1 || updating === lead._id}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {updating === lead._id ? "..." : lead.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(lead._id, lead.quantity + 1)}
                        disabled={lead.quantity >= lead.productId.stock.quantity || updating === lead._id}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${((lead.productId.pricing.sale || lead.productId.pricing.original) * lead.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(lead._id)}
                        className="text-red-600 hover:text-red-800 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="border-t p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</span>
                <div className="space-x-4">
                  <Link
                    href="/shop"
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Continue Shopping
                  </Link>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {leads.length} item{leads.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}