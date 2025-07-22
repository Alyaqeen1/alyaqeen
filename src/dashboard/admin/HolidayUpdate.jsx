import React, { useState } from "react";
import {
  useAddHolidayMutation,
  useDeleteHolidayMutation,
  useGetHolidaysQuery,
} from "../../redux/features/holidays/holidaysApi";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export default function HolidayUpdate() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });

  const [addHoliday, { isLoading: isAdding }] = useAddHolidayMutation();
  const [deleteHoliday] = useDeleteHolidayMutation();
  const { data: holidays = [], isLoading, isError } = useGetHolidaysQuery();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error("Title and Date are required");
      return;
    }

    try {
      const res = await addHoliday(formData).unwrap();
      if (res?.insertedId) {
        toast.success("Holiday added successfully");
        setFormData({ title: "", date: "", description: "" });
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error("Failed to add holiday");
      console.error(err);
    }
  };

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
        deleteHoliday(id)
          .unwrap()
          .then((res) => {
            if (res?.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Holiday has been deleted successfully.",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Something went wrong.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text:
                error.response?.data?.message || "Failed to delete holiday.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div>
      <h4 className="my-3">Add Holiday</h4>
      <form onSubmit={handleSubmit} className="border border-black p-3">
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn text-white mt-2"
          style={{ backgroundColor: "var(--border2)" }}
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add Holiday"}
        </button>
      </form>

      {/* Holidays Table */}
      <div className="border border-black mt-4">
        <h5
          className="text-white p-2"
          style={{ backgroundColor: "var(--border2)" }}
        >
          Holidays List
        </h5>
        <table className="table mb-0">
          <thead>
            <tr>
              <th
                className="text-white text-center border"
                style={{ backgroundColor: "var(--border2)" }}
              >
                #
              </th>
              <th
                className="text-white text-center border"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Title
              </th>
              <th
                className="text-white text-center border"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Date
              </th>
              <th
                className="text-white text-center border"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Description
              </th>
              <th
                className="text-white text-center border"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!holidays.length ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No holidays found.
                </td>
              </tr>
            ) : (
              holidays.map((h, idx) => (
                <tr key={h._id}>
                  <td className="text-center border">{idx + 1}</td>
                  <td className="text-center border">{h.title}</td>
                  <td className="text-center border">
                    {format(new Date(h.date), "dd-MM-yyyy")}
                  </td>
                  <td className="text-center border">{h.description || "-"}</td>
                  <td className="text-center border">
                    {" "}
                    <button
                      type="submit"
                      className="btn text-white mt-2"
                      style={{ backgroundColor: "var(--border2)" }}
                      onClick={() => handleDelete(h._id)}
                    >
                      <FaTrashAlt></FaTrashAlt>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
