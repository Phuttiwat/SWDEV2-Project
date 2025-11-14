import RegisterForm from "@/components/RegisterForm";

export default function Register() {
    return (
        <main className="w-full flex flex-col items-center space-y-6 p-8 min-h-screen bg-gray-50">
            <div className="text-3xl font-semibold text-gray-800">User Registration</div>
            <RegisterForm />
        </main>
    );
}

