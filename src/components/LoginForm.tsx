'use client';
import { TextField, Alert } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else if (result?.ok) {
                // Login successful - redirect to home or dashboard
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
            setError(errorMessage);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-4 bg-white p-8 rounded-lg shadow-md">
            {error && (
                <Alert severity="error" onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    variant="standard"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />

                <TextField
                    variant="standard"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg bg-sky-600 hover:bg-indigo-600 text-white font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <Link 
                    href="/register" 
                    className="text-sky-600 hover:text-indigo-600 underline"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}

