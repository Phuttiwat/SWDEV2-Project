import Link from "next/link";

export default function Unauthorized() {
    return (
        <main className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-800">403 - Unauthorized</h1>
                <p className="text-lg text-gray-600">
                    You don't have permission to access this page.
                </p>
                <p className="text-sm text-gray-500">
                    Please contact administrator if you believe this is an error.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                    <Link 
                        href="/"
                        className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link 
                        href="/api/auth/signin"
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    );
}

