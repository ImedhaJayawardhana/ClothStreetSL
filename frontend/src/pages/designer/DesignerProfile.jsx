import React from "react";
import { useParams } from "react-router-dom";

export default function DesignerProfile() {
  const { designerId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100 text-center max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Designer Profile</h1>
        <p className="text-gray-500 mb-6">
          {designerId ? `Viewing profile ID: ${designerId}` : "Viewing your designer profile"}
        </p>
        
        <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-xl border border-purple-100 font-medium text-sm">
          ⏳ Step 1 Scaffold complete. Ready for Step 2.
        </div>
      </div>
    </div>
  );
}
