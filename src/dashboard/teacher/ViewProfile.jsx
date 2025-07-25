import React from "react";
import { useGetTeacherByEmailQuery } from "../../redux/features/teachers/teachersApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function ViewProfile() {
  const { user } = useAuth();
  const { data: teacher, isLoading } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  if (isLoading) return <LoadingSpinnerDash></LoadingSpinnerDash>;
  if (!teacher) return <div>No teacher found</div>;

  const {
    name,
    email,
    number,
    dob,
    qualification,
    address,
    post_code,
    marital_status,
    gender,
    department,
    experience,
    designation,
    departments_info,
    classes_info,
    subjects_info,
    teacher_photo,
    dbs_crb,
    cv,
    highest_degree_certificate,
    sord_code,
    emergency_number,
    account_holder_name,
    bank_account_number,
    status,
    joining_date,
  } = teacher || {};

  return (
    <div className="container my-4">
      <h3 className="mb-4">Your Details</h3>
      <div className="row">
        {/* Left Profile Card */}
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              {teacher_photo ? (
                <img
                  style={{ width: "80px" }}
                  className="rounded-5"
                  src={teacher_photo}
                  alt=""
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "var(--border2)",
                    color: "#fff",
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                >
                  {name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}

              <h5 className="card-title">{name}</h5>
              <p className="mb-1">
                <strong>Mobile #:</strong> {number}
              </p>
              <p className="mb-1">
                <strong>Qualification:</strong> {qualification}
              </p>
              <p className="mb-1">
                <strong>Designation:</strong> {designation}
              </p>
              <p className="mb-1">
                <strong>Department:</strong> {department}
              </p>
              <p>
                <strong>Date of Joining:</strong> {joining_date}
              </p>
            </div>
          </div>
        </div>

        {/* Right Profile Tab */}
        <div className="col-md-8">
          <div className="card p-3">
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Emergency Contact Number</strong>
              </div>
              <div className="col-md-6">{emergency_number}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Email</strong>
              </div>
              <div className="col-md-6">{email}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Gender</strong>
              </div>
              <div className="col-md-6">{gender}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Date of Birth</strong>
              </div>
              <div className="col-md-6">{dob}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Marital Status</strong>
              </div>
              <div className="col-md-6">{marital_status}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Experience</strong>
              </div>
              <div className="col-md-6">{experience}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Highest Degree Certificate</strong>
              </div>
              <div className="col-md-6">
                {highest_degree_certificate ? (
                  <a href={highest_degree_certificate}>Click Here</a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>CV</strong>
              </div>
              <div className="col-md-6">
                {cv ? <a href={cv}>Click Here</a> : "-"}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>DBS(CRB)</strong>
              </div>
              <div className="col-md-6">
                {" "}
                {dbs_crb ? <a href={dbs_crb}>Click Here</a> : "-"}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Work Experience</strong>
              </div>
              <div className="col-md-6">{experience}</div>
            </div>

            <div className="mt-4">
              <h6 className="fw-bold border-bottom pb-1 mb-3">
                Address Details
              </h6>
              <div className="row mb-2">
                <div className="col-md-6">
                  <strong>Current Address</strong>
                </div>
                <div className="col-md-6">{address}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <strong>Post Code</strong>
                </div>
                <div className="col-md-6">{post_code}</div>
              </div>
            </div>
            <div className="mt-4">
              <h6 className="fw-bold border-bottom pb-1 mb-3">Bank Details</h6>
              <div className="row mb-2">
                <div className="col-md-6">
                  <strong>Account Holder Name</strong>
                </div>
                <div className="col-md-6">{account_holder_name}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <strong>Bank Account Number</strong>
                </div>
                <div className="col-md-6">{bank_account_number}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <strong>Sord Code</strong>
                </div>
                <div className="col-md-6">{sord_code}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
