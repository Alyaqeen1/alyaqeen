import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useGetAllFullFamilyQuery } from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import EducationalInfoCard from "./EducationalInfoCard";

export default function EducationalInfo() {
  const { user } = useAuth();
  const { data: family, isLoading } = useGetAllFullFamilyQuery(user?.email, {
    skip: !user?.email,
  });

  const [activeTab, setActiveTab] = useState(null);

  // Gradient styles for tabs
  const tabGradients = {
    active: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
    },
    inactive: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      color: "#6c757d",
      border: "1px solid #dee2e6",
    },
  };

  // Set active tab when family data loads
  useEffect(() => {
    if (family?.childrenDocs?.length > 0 && !activeTab) {
      setActiveTab(family.childrenDocs[0]._id);
    }
  }, [family, activeTab]);

  // Show loading state
  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  // Show empty state if no children
  if (!family?.childrenDocs?.length) {
    return (
      <div
        className="d-flex align-items-center justify-content-center rounded-4 border-0 shadow"
        style={{
          minHeight: "400px",
          background: "white",
          padding: "40px",
        }}
      >
        <div className="text-center text-muted">
          <div style={{ fontSize: "4rem", opacity: 0.5 }}>🎓</div>
          <h3 className="mt-3 mb-2">No Students Found</h3>
          <p className="mb-0">No children registered under your account</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tab Navigation with Gradient Theme */}
      <div className="d-flex justify-content-center my-5">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {family?.childrenDocs?.map((student) => (
            <button
              key={student?._id}
              className="btn fw-semibold px-4 py-2 rounded-pill border-0 shadow-sm transition-all"
              style={{
                ...(activeTab === student?._id
                  ? tabGradients.active
                  : tabGradients.inactive),
                minWidth: "120px",
                transition: "all 0.3s ease",
                transform:
                  activeTab === student?._id ? "scale(1.05)" : "scale(1)",
                boxShadow:
                  activeTab === student?._id
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setActiveTab(student?._id)}
            >
              <div className="d-flex flex-column align-items-center">
                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                  {student.name.length > 5
                    ? student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : student.name}
                </span>
                {activeTab === student?._id && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content container */}
      <div className="tab-content mt-4">
        {activeTab &&
          family.childrenDocs.map(
            (student) =>
              activeTab === student._id && (
                <EducationalInfoCard
                  key={student._id}
                  studentId={student._id}
                />
              )
          )}
      </div>
    </div>
  );
}
