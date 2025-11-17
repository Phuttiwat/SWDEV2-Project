// app/request/page.tsx
'use client';
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import RequestList from "@/components/requests/RequestList";
import EditRequestModalInner from "@/components/requests/EditRequestModalInner";
import CreateRequestModalInner from "@/components/requests/CreateRequestModalInner";
import getUserRole from "@/libs/getUserRole";
import Footer from "@/components/Footer";

export default function RequestPage() {
    const { data: session } = useSession();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // default: newest first

    const [mounted, setMounted] = useState(false);
    const modalRootRef = useRef<HTMLElement | null>(null);

    // role state: null = unknown / loading, 'staff' | 'admin' | etc.
    const [userRole, setUserRole] = useState<string | null>(null);

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

    // fetch role when session ready
    useEffect(() => {
        let mountedFlag = true;
        const fetchRole = async () => {
            try {
                if (session?.user?.token) {
                    const role = await getUserRole(session.user.token);
                    if (mountedFlag) setUserRole(role ?? null);
                } else {
                    // no session -> clear role
                    if (mountedFlag) setUserRole(null);
                }
            } catch (err) {
                console.error("Failed to fetch user role:", err);
                if (mountedFlag) setUserRole(null);
            }
        };
        fetchRole();
        return () => { mountedFlag = false; };
    }, [session]);

    // Freeze background scroll when any modal open
    useEffect(() => {
        if (!mounted) return;
        const original = document.body.style.overflow;
        if (isCreateOpen || isEditOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = original || '';
        return () => {
            document.body.style.overflow = original || '';
        };
    }, [isCreateOpen, isEditOpen, mounted]);

    const handleCreateSuccess = () => {
        setIsCreateOpen(false);
        setRefreshKey(k => k + 1);
    };

    const modalRoot = modalRootRef.current;

    // Open edit modal from RequestList
    const handleOpenEdit = (id: string) => {
        setSelectedEditId(id);
        setIsEditOpen(true);
    };

    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setSelectedEditId(null);
        // Don't refresh when just closing - only refresh on successful update
    };

    const handleEditSuccess = () => {
        setIsEditOpen(false);
        setSelectedEditId(null);
        setRefreshKey(k => k + 1); // refresh list after successful edit
    };

    // helper: only show create button to staff
    const canCreate = userRole === 'staff';

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex flex-col space-y-6 p-8 flex-1">
                <div className="flex items-center justify-between gap-4">
                    <div className="text-2xl font-semibold text-gray-800">Requests</div>

                    <div className="flex items-center gap-3">
                        {/* Sort toggle button */}
                        <button
                            onClick={handleSortToggle}
                            className="inline-flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-600 px-3 py-1 text-black hover:text-white shadow-md font-semibold text-sm h-8"
                            title={sortOrder === 'newest' ? 'Sort: Newest First' : 'Sort: Oldest First'}
                        >
                            {sortOrder === 'newest' ? '↓ Newest' : '↑ Oldest'}
                        </button>

                        {/* Create button: compact size, only visible to staff */}
                        {canCreate && (
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="inline-flex items-center justify-center rounded-md bg-blue-500 hover:bg-blue-600 px-3 py-1 text-white shadow-md font-semibold text-sm h-8"
                            >
                                New Request
                            </button>
                        )}
                    </div>
                </div>

                {/* Pass onEditClick and sortOrder to RequestList */}
                <RequestList key={refreshKey} onEditClick={handleOpenEdit} sortOrder={sortOrder} />

                {/* Create Modal */}
                {mounted && isCreateOpen && modalRoot && createPortal(
                    <CreateRequestModalInner
                        modalRoot={modalRoot}
                        onClose={() => setIsCreateOpen(false)}
                        onSuccess={handleCreateSuccess}
                    />,
                    modalRoot
                )}

                {/* Edit Modal - mount EditRequestModalInner only when needed */}
                {mounted && isEditOpen && selectedEditId && modalRoot && createPortal(
                    <EditRequestModalInner
                        requestId={selectedEditId}
                        modalRoot={modalRoot}
                        onClose={handleCloseEdit}
                        onSuccess={handleEditSuccess}
                    />,
                    modalRoot
                )}
            </main>
            <Footer />
        </div>
    );
}
