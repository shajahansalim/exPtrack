import { useEffect, useState } from "react";
import { fetchMe } from "../api/auth";

export function useAuthUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMe();
                setUser(data);
            } catch {
                setUser(null);
            }
        };

        load();
    }, []);

    return user;
}