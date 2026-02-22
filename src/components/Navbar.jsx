import { useNavigate, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useAuthUser } from "../hooks/useAuthUser";

export default function Navbar({
    // Dashboard-specific props
    monthIndex,
    year,
    onPrevMonth,
    onNextMonth,
    pickerMonth,
    pickerYear,
    onPickerMonthChange,
    onPickerYearChange,
    onGoToSelectedMonth,
    // Analytics-specific props
    analyticsYear,
    onAnalyticsYearChange,
    // Common props
    onExportPdf,
    isExporting,
    onRecurringBills,
    MONTHS,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthUser();
    const isDashboard = location.pathname === "/dashboard";
    const isAnalytics = location.pathname === "/analytics";

    return (
        <header className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
                <span
                    onClick={() => navigate("/dashboard")}
                    className="text-xl font-bold text-blue-500 cursor-pointer hover:text-blue-600 transition"
                >
                    exPtrack
                </span>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 ml-4">
                    <NavLink
                        active={isDashboard}
                        onClick={() => navigate("/dashboard")}
                        label="Dashboard"
                    />
                    <NavLink
                        active={isAnalytics}
                        onClick={() => navigate("/analytics")}
                        label="Analytics"
                    />
                </nav>
            </div>

            {/* Center: Page-specific controls */}
            <div className="flex items-center gap-3 flex-1 justify-center">
                {isDashboard && (
                    <>
                        {/* Month Navigation */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                            <button
                                onClick={onPrevMonth}
                                className="h-8 w-8 rounded hover:bg-white transition flex items-center justify-center"
                                title="Previous month"
                            >
                                ‹
                            </button>
                            <span className="min-w-25 text-center text-xs px-2">
                                {MONTHS[monthIndex]}/{year}
                            </span>
                            <button
                                onClick={onNextMonth}
                                className="h-8 w-8 rounded hover:bg-white transition flex items-center justify-center"
                                title="Next month"
                            >
                                ›
                            </button>
                        </div>

                        {/* Direct Month/Year Picker */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                            <select
                                value={pickerMonth}
                                onChange={(e) => onPickerMonthChange(Number(e.target.value))}
                                className="h-8 border-0 bg-transparent px-2 text-xs focus:outline-none focus:ring-0"
                            >
                                {MONTHS.map((label, idx) => (
                                    <option key={label} value={idx}>
                                        {label.slice(0, 3)}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={pickerYear}
                                onChange={(e) => onPickerYearChange(e.target.value)}
                                className="h-8 w-16 border-0 bg-transparent px-2 text-xs focus:outline-none focus:ring-0"
                            />
                            <button
                                onClick={onGoToSelectedMonth}
                                className="h-8 px-3 rounded text-xs bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                Go
                            </button>
                        </div>
                    </>
                )}

                {isAnalytics && (
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <label className="text-xs text-gray-600 px-2">Year:</label>
                        <select
                            value={analyticsYear}
                            onChange={(e) => onAnalyticsYearChange(Number(e.target.value))}
                            className="h-8 border-0 bg-transparent px-2 text-xs focus:outline-none focus:ring-0"
                        >
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-2">
                {/* Action Buttons */}
                {isDashboard && (
                    <>
                        <button
                            onClick={onRecurringBills}
                            className="px-3 py-1.5 rounded-md border border-gray-300 text-xs hover:bg-gray-50 transition"
                            title="Manage recurring bills"
                        >
                            Recurring
                        </button>
                        <button
                            onClick={onExportPdf}
                            disabled={isExporting}
                            className="px-4 py-1.5 rounded-md border border-gray-300 text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            title="Export PDF report"
                        >
                            {isExporting ? "Exporting..." : "Export PDF"}
                        </button>
                    </>
                )}

                {/* User Info */}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                    <span className="text-xs text-gray-600 hidden sm:inline">
                        {user?.name}
                    </span>
                    <ProfileMenu user={user} />
                </div>
            </div>
        </header>
    );
}

function NavLink({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${active
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            {label}
        </button>
    );
}
