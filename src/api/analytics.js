import { apiFetch } from "./client";

export const fetchAnalyticsData = (year) =>
    apiFetch(`/month/analytics/${year}`);
