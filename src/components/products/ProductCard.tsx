"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InteractiveCard from "../InteractiveCard";
import { Rating } from "@mui/material";
import ConfirmModal from "../requests/ConfirmModal";

type ProductCardProps = {
  productId: string;
  productName: string;
  productImage: string;
  isAdmin: boolean;
  deleteProductAction: (formData: FormData) => Promise<void>;
  // Product info
  sku?: string;
  stockQuantity?: number;
  unit?: string;
  // Optional props for rating functionality (for ProductCardPanel)
  onRatingChange?: (productName: string, rating: number) => void;
  initialRating?: number;
  actionButtons?: React.ReactNode;
};

export default function ProductCard({
  productId,
  productName,
  productImage,
  isAdmin,
  deleteProductAction,
  sku,
  stockQuantity,
  unit,
  onRatingChange,
  initialRating = 0,
  actionButtons = null,
}: ProductCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rating, setRating] = useState<number>(initialRating);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    const newRating = newValue || 0;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(productName, newRating);
    }
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    router.push(`/product/manage?id=${productId}`);
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", productId);
      await deleteProductAction(formData);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on buttons, menu, or dropdown
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('[data-menu-button]') || // Prevent navigation when clicking on menu button
      target.closest('[data-menu-dropdown]') // Prevent navigation when clicking on dropdown menu
    ) {
      return;
    }
    router.push(`/product/${productId}`);
  };

  return (
    <>
      <div 
        ref={cardRef}
        onClick={handleCardClick}
        className="block cursor-pointer"
      >
        <InteractiveCard contentName={productName}>
          <div className='w-full h-[170px] relative rounded-t-lg overflow-hidden flex-shrink-0'>
            <Image 
              src={productImage}
              alt="card"
              fill={true}
              className="object-cover rounded-t-lg"
            />
            {/* Three vertical dots button */}
            {isAdmin && (
              <>
                <button
                  ref={buttonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-300 rounded-full transition-colors bg-white/80 backdrop-blur-sm z-10"
                  aria-label="Menu"
                  data-menu-button="true"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute top-10 right-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]"
                    data-menu-dropdown="true"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className='w-full p-[10px] flex flex-col justify-start h-[85px] overflow-hidden flex-shrink-0'>
            <div className="font-semibold text-lg text-gray-800 leading-tight line-clamp-2 mb-1.5 flex-shrink-0">
              {productName}
            </div>
            {sku && (
              <div className="text-xs text-gray-500 font-mono tracking-wide truncate mb-1.5 flex-shrink-0">
                {sku}
              </div>
            )}
            {(stockQuantity !== undefined && unit) && (
              <div className="text-sm text-gray-700 flex-shrink-0">
                <span className="font-semibold text-gray-900">{stockQuantity.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">{unit}</span>
              </div>
            )}
          </div>

          <div className='w-full h-[45px] px-4 py-2 flex justify-between items-center flex-shrink-0'>
            {/* ส่วนของ Rating (อยู่ซ้าย) */}
            <div>
              {onRatingChange && (
                <Rating
                  id={`${productName} Rating`}
                  name={`${productName} Rating`}
                  data-testid={`${productName} Rating`}
                  value={rating}
                  onChange={handleRatingChange}
                  onClick={(e) => { e.stopPropagation(); }}
                  size="large" 
                />
              )}
            </div>
            
            <div className="mt-3">{actionButtons}</div>
          </div>
        </InteractiveCard>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
