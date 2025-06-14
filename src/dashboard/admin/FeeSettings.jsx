import React, { useEffect, useState } from "react";
import { useGetFullFamilyQuery } from "../../redux/features/families/familiesApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { FaEye, FaPen, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import FamilyUpdateModal from "../shared/FamilyUpdateModal";
import AdminPayModal from "../shared/AdminPayModal";

export default function FeeSettings() {
  const [showModal, setShowModal] = useState(false);
  const [adminShowModal, setAdminShowModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedAdminFamilyId, setSelectedAdminFamilyId] = useState(null);
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();
  const {
    data: families,
    isLoading,
    refetch,
  } = useGetFullFamilyQuery(user?.email, {
    skip: loading || !user?.email, // Prevent fetching until user is fully loaded
  });

  const filteredFamily = families?.filter(
    (family) => family?.childrenDocs?.length > 0
  );

  console.log(filteredFamily);

  useEffect(() => {
    refetch();
  }, []);

  const handleShow = (id) => {
    setSelectedFamilyId(id);
    setShowModal(true);
  };
  const handleAdminShow = (id) => {
    setSelectedAdminFamilyId(id);
    setAdminShowModal(true);
  };
  const handleClose = () => setShowModal(false);
  const handleAdminClose = () => setAdminShowModal(false);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/families/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Family has been deleted.",
              icon: "success",
            });
            refetch();
          }
        });
      }
    });
  };

  if (isLoading || loading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  return (
    <div>
      {" "}
      {/* Table */}
      <div className="table-responsive mb-3">
        <table
          className="table mb-0"
          style={{
            minWidth: 700,
          }}
        >
          <thead>
            <tr>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                #
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Families
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Students
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Jan
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Feb
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Mar
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Apr
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                May
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                June
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                July
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Aug
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Sep
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Oct
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Nov
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Dec
              </th>
              {/* <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Mode
              </th> */}
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Discount
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFamily?.length > 0 ? (
              filteredFamily?.map((family, idx) => (
                <tr key={family?._id}>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {family?.name}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {family?.childrenDocs?.map((child) => (
                      <span key={child?._id}>
                        {child?.name}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    paid
                  </td>
                  {/* <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {family?.paymentMode}
                  </td> */}
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {family?.discount ? family?.discount : 0}
                  </td>
                  <td className="border h6 text-center text-nowrap align-middle">
                    <div className="d-flex flex-column gap-2 justify-content-center align-items-center h-100">
                      <div className="d-flex gap-2 justify-content-center align-items-center">
                        <button
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() => handleShow(family?._id)}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() => handleDelete(family?._id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                      <button
                        className="text-white py-1 px-3 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                        onClick={() => handleAdminShow(family?._id)}
                      >
                        Pay
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={17}>
                  <h5>No Families Student is enrolled yet .</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminPayModal
          key={selectedAdminFamilyId || "admin-modal"}
          familyId={selectedAdminFamilyId}
          adminShowModal={adminShowModal}
          handleAdminClose={handleAdminClose}
          refetch={refetch}
        />

        <FamilyUpdateModal
          key={selectedFamilyId || "family-update-modal"}
          familyId={selectedFamilyId}
          showModal={showModal}
          handleClose={handleClose}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
