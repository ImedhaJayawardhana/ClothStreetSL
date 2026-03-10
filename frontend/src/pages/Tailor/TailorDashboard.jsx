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
