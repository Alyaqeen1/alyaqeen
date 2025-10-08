import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useGetAllFullFamilyQuery } from "../../redux/features/families/familiesApi";
import StudentsInfo from "./StudentsInfo";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function StudentDetails() {
  const { user } = useAuth();
  const { data: family, isLoading } = useGetAllFullFamilyQuery(user?.email, {
    skip: !user?.email,
  });
  const [activeTab, setActiveTab] = useState(family?.childrenDocs[0]?._id);
  // Set active tab when family data loads
  useEffect(() => {
    if (family?.childrenDocs?.length > 0 && !activeTab) {
      setActiveTab(family.childrenDocs[0]._id);
    }
  }, [family, activeTab]); // Only depend on family and activeTab

  // Show loading state
  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  // Show empty state if no children
  if (!family?.childrenDocs?.length) {
    return <div>No students found</div>;
  }

  return (
    <div>
      <ul
        className="nav gap-2 my-5 flex justify-content-center align-items-center"
        role="tablist"
      >
        {family?.childrenDocs?.map((student) => (
          <li className="nav-item" key={student?._id}>
            <a
              className="nav-link text-uppercase box-shadow px-3"
              style={{
                backgroundColor:
                  activeTab === student?._id ? "var(--border2)" : undefined,
                color: activeTab === student?._id ? "white" : "black",
                borderRadius: "20px", // <-- added here
              }}
              onClick={() => setActiveTab(student?._id)}
            >
              {student.name.length > 5
                ? student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("") // initials
                : student.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Tab content container */}
      <div className="tab-content mt-4">
        {family?.childrenDocs?.map(
          (student) =>
            activeTab === student?._id && (
              <StudentsInfo
                key={student?._id}
                studentId={student?._id}
              ></StudentsInfo>
            )
        )}
      </div>
    </div>
  );
}
