export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const YEAR = new Date().getFullYear();
const ACTIVE_MONTH_KEY = "active_month_index";

export function getInitialMonthIndex() {
    const saved = localStorage.getItem(ACTIVE_MONTH_KEY);
    return saved !== null ? Number(saved) : new Date().getMonth();
}

export function getMonthKey(monthIndex) {
    return `${YEAR}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function persistMonthIndex(monthIndex) {
    localStorage.setItem(ACTIVE_MONTH_KEY, monthIndex);
}

export { YEAR };
