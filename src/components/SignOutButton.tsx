'use client';
import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
    userName: string;
};

export default function SignOutButton({ userName }: Props) {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                buttonRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal]);

    const handleSignOut = async () => {
        setShowModal(false);
        await signOut({ redirect: false });
        router.push('/');
        router.refresh();
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setShowModal(!showModal)}
                className="text-[#232f3e] text-sm font-normal hover:text-[#ff9900] transition-colors"
            >
                Sign out of {userName}
            </button>

            {/* Confirmation Modal */}
            {showModal && (
                <div
                    ref={modalRef}
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[280px]"
                >
                    <div className="px-4 py-3 border-b border-gray-200">
                        <div className="font-semibold text-gray-800">Confirm Sign Out</div>
                        <div className="text-sm text-gray-600 mt-1">
                            Are you sure you want to sign out as <span className="font-medium">{userName}</span>?
                        </div>
                    </div>
                    <div className="px-4 py-2 flex gap-2">
                        <button
                            onClick={handleSignOut}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

