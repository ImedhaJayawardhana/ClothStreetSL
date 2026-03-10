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

