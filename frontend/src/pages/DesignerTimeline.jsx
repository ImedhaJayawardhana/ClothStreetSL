import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function DesignerTimeline() {
    const { quotationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotaion = async () => {
            try {
                const snap = await getDoc(doc(db, "quotations", quotationId));
                if (snap.exists()) {
                    const data = snap.data();
                    // Ensure the user is authorized to view this
                    if (data.customerId !== user?.uid && data.providerId !== user?.uid) {
                        toast.error("Unauthorized");
                        navigate("/");
                        return;
                    }
                    setQuotation({ id: snap.id, ...data });
                } else {
                    toast.error("Quotation not found");
                    navigate("/");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading timeline");
            } finally {
                setLoading(false);
            }
        };
        fetchQuotaion();
    }, [quotationId, user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!quotation) return null;

    // Define timeline steps based on status
    // Possible statuses: pending, quoted, accepted, design_in_progress, design_completed, design_delivered
    const STATUS_MAP = {
        "pending": 0,
        "quoted": 1,
        "accepted": 2, // accepted means payment done
        "design_in_progress": 2, 
        "design_completed": 3,
        "design_delivered": 4
    };

    const currentStepIndex = STATUS_MAP[quotation.status] || 0;

    const steps = [
        {
            title: "Quote Requested",
            desc: "You requested a design service",
            done: currentStepIndex >= 0,
            date: quotation.createdAt,
            icon: "📝"
        },
        {
            title: "Quote Received",
            desc: "Designer provided a price",
            done: currentStepIndex >= 1,
            date: quotation.quotedAt || quotation.createdAt,
            icon: "📩"
        },
        {
            title: "Quote Accepted",
            desc: "You paid the designer fee",
            done: currentStepIndex >= 2,
            date: quotation.acceptedAt,
            icon: "💳"
        },
        {
            title: "Design In Progress",
            desc: "Designer is working on your piece",
            done: currentStepIndex >= 2,
            isActive: quotation.status === "design_in_progress",
            date: quotation.acceptedAt, // starts immediately
            icon: "🎨"
        },
        {
            title: "Design Completed",
            desc: "Designer finished the work",
            done: currentStepIndex >= 3,
            isActive: quotation.status === "design_completed",
            date: quotation.designCompletedAt,
            icon: "✨"
        },
        {
            title: "Design Delivered",
            desc: "Files are ready for download",
            done: currentStepIndex >= 4,
            isActive: quotation.status === "design_delivered",
            date: quotation.designDeliveredAt,
            icon: "📦"
        }
    ];

    const formatDate = (ts) => {
        if (!ts) return "";
        // If it's a Firestore Timestamp
        if (ts.seconds) {
            return new Date(ts.seconds * 1000).toLocaleString("en-GB", { 
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
            });
        }
        // If it's an ISO string
        if (typeof ts === "string") {
            return new Date(ts).toLocaleString("en-GB", { 
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
            });
        }
        return "";
    };

    const handleContinueToTailor = () => {
        const comboTailorStr = sessionStorage.getItem("clothstreet_combo_tailor");
        if (comboTailorStr) {
            const tailor = JSON.parse(comboTailorStr);
            // Navigate to RequestQuote for the tailor, passing the deliverables
            navigate(`/request-quote/${tailor.id}?tailorId=${tailor.id}&combo=true`, {
                state: { 
                    provider: tailor,
                    designerDeliverables: quotation.designDeliverables || [],
                    designerNotes: quotation.providerRemarks || ""
                }
            });
        } else {
            // No saved tailor, but user might want to find one now
            navigate("/find-tailor-designer?mode=tailor");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-8 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-4 text-white shadow-inner backdrop-blur-sm">
                        {quotation.providerName?.charAt(0) || "🎨"}
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Design Timeline</h1>
                    <p className="text-violet-200">Tracking progress with {quotation.providerName}</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 mb-8">
                    
                    {/* TIMELINE */}
                    <div className="relative border-l-2 border-gray-100 ml-6 sm:ml-8 space-y-10 py-4">
                        {steps.map((step, idx) => {
                            const isLast = idx === steps.length - 1;
                            return (
                                <div key={idx} className="relative pl-8 sm:pl-10">
                                    {/* Icon / Bullet */}
                                    <div className={`absolute -left-6 top-0 w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 border-white shadow-md transition-all
                                        ${step.done 
                                            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white" 
                                            : step.isActive 
                                                ? "bg-purple-100 border-purple-200 animate-pulse text-purple-700" 
                                                : "bg-gray-100 text-gray-400 grayscale"
                                        }
                                    `}>
                                        {step.isActive ? <span className="animate-spin text-sm">⏳</span> : step.icon}
                                    </div>
                                    
                                    {/* Animated line fill for completed steps */}
                                    {step.done && !isLast && (
                                        <div className="absolute -left-[5px] top-12 bottom-[-40px] w-1 bg-gradient-to-b from-violet-500 to-violet-500 z-0" />
                                    )}

                                    <div className={`pt-2 transition-all ${step.done || step.isActive ? "opacity-100" : "opacity-50"}`}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                                            <h3 className={`font-bold text-lg ${step.isActive ? "text-violet-700" : "text-gray-900"}`}>
                                                {step.title}
                                            </h3>
                                            {step.date && (
                                                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                                                    {formatDate(step.date)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-sm">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FILE DELIVERY SECTION */}
                {quotation.status === "design_delivered" && quotation.designDeliverables?.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border-2 border-emerald-100 p-6 sm:p-10 mb-8 animate-fadeIn">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm">
                                📦
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Your Designs are Ready!</h2>
                            <p className="text-gray-500 mt-2">Download your custom design files below.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quotation.designDeliverables.map((url, idx) => {
                                const isPdf = url.toLowerCase().includes('.pdf');
                                return (
                                    <div key={idx} className="group relative rounded-2xl border border-gray-200 bg-gray-50 p-3 hover:border-violet-300 hover:shadow-md transition-all overflow-hidden flex flex-col items-center justify-center aspect-square">
                                        {isPdf ? (
                                            <div className="text-5xl mb-2">📄</div>
                                        ) : (
                                            <div className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-100 transition-opacity">
                                                <img src={url} alt={`Deliverable ${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="relative z-10 w-full mt-auto bg-white/90 backdrop-blur border rounded-xl p-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                            <span className="text-xs font-bold truncate w-full flex-1 mb-2 text-center">File {idx + 1}</span>
                                            <a 
                                                href={url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                download={`Design_${idx+1}`}
                                                className="w-full text-center py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ACTION BAR AT BOTTOM */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button 
                        onClick={() => navigate("/orders")}
                        className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                        View All Orders
                    </button>
                    
                    {quotation.status === "design_delivered" ? (
                        <button 
                            onClick={handleContinueToTailor}
                            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-emerald-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Continue to Tailor
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    ) : (
                        <button 
                            disabled
                            className="flex-1 py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Waiting for Designer...
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
