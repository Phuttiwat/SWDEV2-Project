'use client';
import { Select, MenuItem, TextField, Alert } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import userRegister from "@/libs/userRegister";

export default function RegisterForm() {
    const router = useRouter();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [role, setRole] = useState<"admin" | "staff">("staff");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!name || !email || !tel || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
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
            const result = await userRegister(name, email, tel, role, password);
            // Registration successful
            alert("Registration successful! Please log in.");
            router.push("/login");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again.";
            setError(errorMessage);
            console.error("Registration error:", err);
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
                    name="name"
                    label="Name"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />

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
                    name="tel"
                    label="Telephone Number"
                    fullWidth
                    required
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    disabled={loading}
                />

                <Select
                    variant="standard"
                    name="role"
                    id="role"
                    fullWidth
                    value={role}
                    onChange={(e) => setRole(e.target.value as "admin" | "staff")}
                    disabled={loading}
                >
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>

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
                    helperText="Password must be at least 6 characters"
                />

                <TextField
                    variant="standard"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg bg-sky-600 hover:bg-indigo-600 text-white font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <a 
                    href="/login" 
                    className="text-sky-600 hover:text-indigo-600 underline"
                >
                    Sign In
                </a>
            </div>
        </div>
    );
}

