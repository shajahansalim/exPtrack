import { apiFetch } from "./client";

export const copyMonth = async (from, to, categories) => {
    // Ensure categories is always an array
    if (!Array.isArray(categories)) {
        console.error("Categories must be an array, received:", categories);
        throw new Error("Categories must be an array");
    }
    
    console.log("API call - Copying from", from, "to", to, "categories:", categories);
    
    return apiFetch("/month/copy", {
        method: "POST",
        body: JSON.stringify({ from, to, categories }),
    });
};