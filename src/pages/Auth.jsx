import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";

export default function Auth() {
    const location = useLocation();
    const navigate = useNavigate();

    const isLogin = location.pathname === "/login";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ======================================
    // LOGIN / REGISTER
    // ======================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            if (isLogin) {
                // ===== LOGIN =====
                const res = await loginUser({ email, password });

                // 🔥 SAVE BOTH TOKENS
                localStorage.setItem("token", res.access_token);
                localStorage.setItem("refresh", res.refresh_token);

                navigate("/dashboard");
            } else {
                // ===== REGISTER =====
                await registerUser({ name, email, password });

                navigate("/login");
            }
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // AUTO REDIRECT IF ALREADY LOGGED IN
    // ======================================
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/dashboard");
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100 px-6 relative overflow-hidden">

            <div className="absolute w-200 h-200 bg-blue-500/20 blur-[180px] rounded-full -z-10" />

            <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden">

                {/* LEFT */}
                <div className="p-14 flex flex-col justify-center">

                    <h2 className="text-3xl font-semibold mb-2">
                        {isLogin ? "Welcome back" : "Create your account"}
                    </h2>

                    <p className="text-gray-500 mb-8 text-sm">
                        {isLogin
                            ? "Login to continue managing your money"
                            : "Start tracking your finances in seconds"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {!isLogin && (
                            <Input
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        )}

                        <Input
                            placeholder="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <button
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
                        >
                            {loading
                                ? "Please wait..."
                                : isLogin
                                    ? "Login"
                                    : "Create account"}
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        {isLogin ? "New here?" : "Already have an account?"}

                        <button
                            onClick={() => navigate(isLogin ? "/register" : "/login")}
                            className="ml-2 text-blue-500 font-medium"
                        >
                            {isLogin ? "Register" : "Login"}
                        </button>
                    </p>
                </div>

                {/* RIGHT */}
                <div className="hidden md:flex relative items-center justify-center bg-linear-to-br from-blue-500 to-blue-600 text-white p-16">

                    <div className="absolute w-96 h-96 bg-white/10 blur-3xl rounded-full" />

                    <div className="relative text-center max-w-sm">
                        <h3 className="text-3xl font-semibold mb-4">exPtrack</h3>

                        <p className="text-blue-100 mb-8 text-sm leading-relaxed">
                            A modern personal finance dashboard to manage income,
                            expenses, savings and debt - simple, fast and secure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Input(props) {
    return (
        <input
            {...props}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
    );
}
