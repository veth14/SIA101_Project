import React, { useEffect, useState } from "react";
import { SupplierBackground } from "./SupplierBackground";
import { SupplierStats } from "./SupplierStats";
import { SupplierGrid } from "./SupplierGrid";
import useGetInvSupplier from "@/api/getInvSupplier";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "suspended";
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const { getInvSuppliers, loadingForGetInvSupplier } = useGetInvSupplier();

  useEffect(() => {
    const useGetInvSupplierFunc = async () => {
      const response = await getInvSuppliers();

      if (!response.success) {
        alert(response.message);
        return;
      }

      setSuppliers(response.data);
    };
    useGetInvSupplierFunc();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      inactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactive" },
      suspended: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Suspended",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["active"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-fill)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter((s) => s.status === "active").length,
    inactiveSuppliers: suppliers.filter((s) => s.status === "inactive").length,
    suspendedSuppliers: suppliers.filter((s) => s.status === "suspended").length,
    totalValue: suppliers.reduce((sum, s) => sum + (s.totalValue || 0), 0),
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <SupplierBackground />

      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {loadingForGetInvSupplier ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green"></div>
            <span className="ml-3 text-gray-600">Loading suppliers...</span>
          </div>
        ) : (
          <>
            <SupplierStats stats={stats} formatCurrency={formatCurrency} />
            <SupplierGrid
              suppliers={suppliers}
              formatCurrency={formatCurrency}
              getStatusBadge={getStatusBadge}
              getRatingStars={getRatingStars}
              setSuppliers={setSuppliers}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;
