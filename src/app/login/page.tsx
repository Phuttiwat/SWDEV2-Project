import LoginForm from "@/components/LoginForm";

export default function Login() {
    return (
        <main className="w-full flex flex-col items-center space-y-6 p-8 min-h-screen bg-gray-50">
            <div className="text-3xl font-semibold text-gray-800">User Login</div>
            <LoginForm />
        </main>
    );
}

