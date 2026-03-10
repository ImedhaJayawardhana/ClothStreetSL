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
