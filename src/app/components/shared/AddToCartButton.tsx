"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
// import { setRedirectAfterLogin } from "@/app/utils/redirectUtils";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  stockQuantity: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  className?: string;
  quantity?: number;
}

export default function AddToCartButton({
  productId,
  productName,
  stockQuantity,
  stockStatus,
  className = "",
  quantity = 1,
}: AddToCartButtonProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    // Wait for auth loading to complete
    if (isLoading) {
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      // Clear any stale cookies that might be causing middleware issues
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Store the current page to redirect back after login
      // setRedirectAfterLogin(window.location.pathname);
      router.push("/login");
      return;
    }

    // Check if user has the correct role
    if (user?.role !== "User") {
      alert("Only users can add products to cart");
      return;
    }

    // Check stock availability
    if (stockStatus === "out_of_stock") {
      alert("This product is out of stock");
      return;
    }

    if (quantity > stockQuantity) {
      alert(`Only ${stockQuantity} items available in stock`);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`${productName} added to cart successfully!`);
        // Optionally redirect to cart or update cart count
      } else {
        alert(data.error || "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = stockStatus === "out_of_stock" || loading || isLoading;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`
        ${className}
        ${isDisabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-gold text-white hover:bg-gold/90"
        }
        px-6 py-2 rounded-lg font-medium transition-colors
      `}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Loading...</span>
        </div>
      ) : loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Adding...</span>
        </div>
      ) : stockStatus === "out_of_stock" ? (
        "Out of Stock"
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}