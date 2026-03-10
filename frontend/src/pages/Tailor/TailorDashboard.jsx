import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

//  Dummy data (replace with real data / Firestore later)
const DUMMY_USER = {
    name: "Dfgyh",
    role: "Master Tailor",
    newRequests: 2,
};

//  Helper: first letter avatar
function Avatar({ name }) {
    return (
        <div className="w-16 h-16 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-3xl font-bold shadow-inner select-none flex-shrink-0">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

function WelcomeBanner({ user }) {
    return (
        <div className="w-full bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 rounded-2xl shadow-lg px-8 py-6 flex items-center gap-5">
            {/* Avatar */}
            <Avatar name={user.name} />

            {/* Text block */}
            <div className="flex-1 min-w-0">
                <p className="text-purple-200 text-sm font-medium mb-0.5">Welcome back,</p>
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-white text-3xl font-extrabold leading-tight truncate">
                        {user.name}
                    </h1>

                    {/* Master Tailor badge */}
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-sm whitespace-nowrap">
                        ✦ {user.role}
                    </span>

                    {/* New requests pill */}
                    {user.newRequests > 0 && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-orange-400 text-white shadow-sm whitespace-nowrap">
                            {user.newRequests} new requests
                        </span>
                    )}
                </div>
            </div>

            {/* My Profile button */}
            <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/30 text-white text-sm font-semibold transition-all duration-200 shadow-sm backdrop-blur-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                My Profile
            </button>
        </div>
    );
}
const DUMMY_STATS = [
    {
        id: 1,
        label: "Active Orders",
        value: 4,
        color: "text-blue-500",
        bg: "bg-blue-50",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
            </svg>
        ),
    },
    {
        id: 2,
        label: "In Progress",
        value: 2,
        color: "text-violet-500",
        bg: "bg-violet-50",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                <line x1="20" x2="8.12" y1="4" y2="15.88" />
                <line x1="14.47" x2="20" y1="14.48" y2="20" />
                <line x1="8.12" x2="12" y1="8.12" y2="12" />
            </svg>
        ),
    },
    {
        id: 3,
        label: "Ready to Deliver",
        value: 1,
        color: "text-orange-500",
        bg: "bg-orange-50",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" />
                <line x1="23" x2="23" y1="13" y2="11" />
                <polyline points="11 6 7 12 13 12 9 18" />
            </svg>
        ),
    },
    {
        id: 4,
        label: "Completed",
        value: 1,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
            {/* Icon */}
            <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
            </div>
            {/* Number */}
            <p className="text-4xl font-extrabold text-gray-800 leading-none">{stat.value}</p>
            {/* Label */}
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
        </div>
    );
}

const DUMMY_EARNINGS = {
    total: "Rs 18,000",
    fromOrders: 1,
    growthPercent: 24,
};

const DUMMY_RATINGS = {
    average: 4.9,
    total: 407,
    breakdown: [
        { stars: 5, count: 312 },
        { stars: 4, count: 85 },
        { stars: 3, count: 8 },
        { stars: 2, count: 2 },
        { stars: 1, count: 0 },
    ],
};

// ─── Earnings Card ────────────────────────────────────────────────────────────
function EarningsCard({ data }) {
    return (
        <div className="bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-700 rounded-2xl p-6 flex flex-col gap-3 shadow-lg text-white h-full">
            {/* Header */}
            <div className="flex items-center gap-2 text-purple-200 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                </svg>
                Total Earnings
            </div>

            {/* Amount */}
            <p className="text-4xl font-extrabold leading-tight tracking-tight">{data.total}</p>

            {/* Sub-label */}
            <p className="text-purple-300 text-sm">from {data.fromOrders} completed order{data.fromOrders !== 1 ? "s" : ""}</p>

            {/* Growth badge */}
            <div className="mt-auto flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
                <span className="text-green-400 text-sm font-semibold">+{data.growthPercent}% vs last month</span>
            </div>
        </div>
    );
}

// ─── Ratings Card ─────────────────────────────────────────────────────────────
function StarIcon({ filled = true, size = 16 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
            fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function RatingsCard({ data }) {
    const maxCount = Math.max(...data.breakdown.map((b) => b.count), 1);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 h-full">
            {/* Title row */}
            <div className="flex items-center justify-between">
                <h2 className="text-gray-800 font-bold text-base flex items-center gap-2">
                    <span className="text-yellow-400">⭐</span> Ratings &amp; Reviews
                </h2>
                <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= Math.round(data.average)} size={14} />)}
                    </div>
                    <span className="text-yellow-500 font-bold text-sm">{data.average}</span>
                    <span className="text-gray-400 text-sm">({data.total} reviews)</span>
                </div>
            </div>

            {/* Breakdown rows */}
            <div className="flex flex-col gap-2">
                {data.breakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-4 text-right">{row.stars}</span>
                        <StarIcon filled size={13} />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                style={{ width: `${(row.count / maxCount) * 100}%` }}
                            />
                        </div>
                        <span className="text-gray-400 text-sm w-6 text-right">{row.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
