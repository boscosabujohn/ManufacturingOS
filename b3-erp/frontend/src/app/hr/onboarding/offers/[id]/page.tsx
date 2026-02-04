"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Briefcase, MapPin, IndianRupee, BadgeCheck } from "lucide-react";

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const data = useMemo(
    () => ({
      id,
      candidate: "Candidate Name",
      role: "Role Title",
      department: "Department",
      location: "Location",
      ctcLpa: 8.5,
      offerDate: "2025-10-10",
      expiryDate: "2025-10-25",
      status: "Pending" as const,
      recruiter: "Recruiter Name",
    }),
    [id]
  );

  return (
    <div className="w-full h-full px-3 py-2">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-2">
        <ArrowLeft className="h-4 w-4" /> Back to Offers
      </button>

      <div className="bg-white rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Offer {data.id}</h1>
            <p className="text-sm text-gray-500">{data.candidate}</p>
          </div>
          <span
            className={
              "px-2 py-1 text-xs font-semibold rounded-full " +
              (data.status === "Pending"
                ? "bg-amber-100 text-amber-700"
                : data.status === "Accepted"
                ? "bg-green-100 text-green-700"
                : data.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700")
            }
          >
            {data.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Candidate</p>
              <p className="font-medium">{data.candidate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="font-medium">{data.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium">{data.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <IndianRupee className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">CTC</p>
              <p className="font-medium">₹{data.ctcLpa.toFixed(1)} LPA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Offer Date</p>
              <p className="font-medium">{data.offerDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Expiry Date</p>
              <p className="font-medium">{data.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
