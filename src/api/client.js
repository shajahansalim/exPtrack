const API = import.meta.env.VITE_API_URL;
export default API;

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
    };

    // only add JSON header when body exists (POST/PUT)
    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        console.error(`API error ${res.status}: ${errorText}`);
        throw new Error(`API error: ${res.status} ${errorText}`);
    }

    return res.json();
}
