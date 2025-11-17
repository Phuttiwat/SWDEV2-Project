"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import CreateRequestModalInner from "../requests/CreateRequestModalInner";
import getUserRole from "@/libs/getUserRole";

type ProductRequestButtonProps = {
  productId: string;
  productName: string;
  isActive?: boolean;
};

export default function ProductRequestButton({
  productId,
  productName,
  isActive = true,
}: ProductRequestButtonProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const modalRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    modalRootRef.current = root;
  }, []);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.token) {
        try {
          const role = await getUserRole(session.user.token);
          setUserRole(role);
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        }
      }
    };

    fetchUserRole();
  }, [session]);

  // Freeze background scroll when modal open
  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = original || '';
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [isModalOpen, mounted]);

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  const canCreate = userRole === 'staff';
  const isDisabled = !isActive;
  const modalRoot = modalRootRef.current;

  if (!canCreate) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => {
          if (!isDisabled) {
            setIsModalOpen(true);
          }
        }}
        disabled={isDisabled}
        className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors shadow-md ${
          isDisabled
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        title={isDisabled ? 'Cannot create request: Product is inactive' : 'Create request for this product'}
      >
        Request
      </button>
      {isDisabled && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-xs text-yellow-800 font-semibold">
            ⚠️ Product is inactive. Cannot create request.
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {mounted && isModalOpen && modalRoot && createPortal(
        <CreateRequestModalInner
          modalRoot={modalRoot}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          fixedProductId={productId}
        />,
        modalRoot
      )}
    </>
  );
}

