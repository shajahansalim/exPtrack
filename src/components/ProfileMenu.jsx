import { useState, useRef, useEffect } from "react";

export default function ProfileMenu({ user }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const initials =
        user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "U";

    return (
        <div ref={ref} className="relative">
            {/* Avatar button */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="h-9 w-9 rounded-full bg-blue-500 text-white font-semibold text-sm flex items-center justify-center cursor-pointer hover:bg-blue-400 transition"
            >
                {initials}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
