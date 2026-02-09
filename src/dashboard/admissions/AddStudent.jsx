import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import SignatureCanvas from "react-signature-canvas";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
const image_hosting_key = import.meta.env.VITE_Image_Hosting_Key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
export default function AddStudent() {
  const [show, setShow] = useState(false);
  const [department, setDepartment] = useState(false);
  const [session, setSession] = useState(false);
  const [session_time, setSessionTime] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [signature, setSignature] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { setLoading } = useAuth();
  const [error, setError] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [formSnapshot, setFormSnapshot] = useState(null);
  const formRef = useRef(); // Add this with other useRef
  const { data: departments, isLoading } = useGetDepartmentsQuery();
  const selectedDepartment = departments?.find(
    (dept) => dept?._id === department,
  );
  const sigRef = useRef();

  const clearSignature = () => sigRef.current.clear();
  // Better compression function - reduces PDF quality
  const optimizePDF = async (pdfBlob) => {
    return new Promise((resolve) => {
      const originalSizeMB = (pdfBlob.size / 1024 / 1024).toFixed(2);
      console.log("📊 Optimizing PDF. Original size:", originalSizeMB, "MB");

      // If already small, return as is
      if (pdfBlob.size < 3 * 1024 * 1024) {
        // Less than 3MB
        console.log("✅ PDF is already optimized (< 3MB)");
        resolve(pdfBlob);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const pdfDataUrl = event.target.result;

          // Create image from first page only (for form snapshot)
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = pdfDataUrl;

          img.onload = () => {
            // Calculate new dimensions (max 800px width)
            const maxWidth = 800;
            const scale = Math.min(maxWidth / img.width, 1);
            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw with quality settings
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert to blob with compression
            canvas.toBlob(
              (compressedBlob) => {
                const compressedSizeMB = (
                  compressedBlob.size /
                  1024 /
                  1024
                ).toFixed(2);
                const reduction = (
                  (1 - compressedBlob.size / pdfBlob.size) *
                  100
                ).toFixed(1);

                console.log(
                  `✅ PDF Optimized: ${originalSizeMB}MB → ${compressedSizeMB}MB (${reduction}% reduction)`,
                );

                if (compressedBlob.size > 10 * 1024 * 1024) {
                  console.warn(
                    "⚠️ Still too large after compression:",
                    compressedSizeMB,
                    "MB",
                  );
                }

                resolve(compressedBlob);
              },
              "image/jpeg", // Better compression than PNG
              0.7, // Quality: 0.7 (70%)
            );
          };

          img.onerror = () => {
            console.warn("⚠️ Image load failed, using original PDF");
            resolve(pdfBlob);
          };
        } catch (error) {
          console.error("Optimization error:", error);
          resolve(pdfBlob);
        }
      };

      reader.onerror = () => {
        console.error("FileReader error");
        resolve(pdfBlob);
      };

      reader.readAsDataURL(pdfBlob);
    });
  };

  const compressImage = async (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize to a smaller canvas size (e.g., 300x100)
        canvas.width = 300;
        canvas.height = 100;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL("image/png", 0.7); // 0.7 quality
        resolve(compressedDataUrl);
      };
    });
  };

  const saveSignature = async () => {
    console.log("Saving signature...");

    try {
      // 1. Check if signature canvas exists and has content
      if (!sigRef.current) {
        toast.error("Signature canvas not found");
        return;
      }

      if (sigRef.current.isEmpty()) {
        toast.error("Please draw your signature first");
        return;
      }

      // 2. Get signature as data URL
      let dataUrl = sigRef.current.toDataURL("image/png");
      console.log("Signature data URL created, length:", dataUrl.length);

      // 3. Compress it (optional)
      dataUrl = await compressImage(dataUrl);

      // 4. Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // 5. Create a file from blob
      const file = new File([blob], "signature.png", { type: "image/png" });
      console.log("File created:", file.name, file.size, "bytes");

      // 6. Show loading toast
      const loadingToast = toast.loading(
        "Uploading signature to Cloudinary...",
      );

      // 7. Upload to Cloudinary using your existing function
      const signatureUrl = await uploadToCloudinary(file, "signatures");

      // 8. Update state
      setSignature(signatureUrl);

      // 9. Show success
      toast.dismiss(loadingToast);
      toast.success("Signature uploaded successfully!");

      console.log("Signature URL saved:", signatureUrl);

      // 10. Scroll to submit button
      if (submitButtonRef.current) {
        submitButtonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } catch (error) {
      console.error("❌ Signature save error:", error);

      // Handle specific errors
      let errorMessage = "Failed to save signature";

      if (error.message.includes("Cloudinary upload failed")) {
        errorMessage = "Cloudinary upload failed. Please try again.";
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Check your connection.";
      }

      toast.error(errorMessage);
    }
  };

  // const saveSignature = async () => {
  //   let dataUrl = sigRef.current.toDataURL("image/png");

  //   // Compress it
  //   dataUrl = await compressImage(dataUrl);

  //   const blob = await (await fetch(dataUrl)).blob();
  //   const file = new File([blob], "signature.png", { type: "image/png" });

  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const res = await axiosPublic.post(image_hosting_api, formData);
  //     const url = res.data?.data?.display_url;
  //     setSignature(url);
  //     toast.success("Signature uploaded!");
  //   } catch (err) {
  //     toast.error("Upload failed");
  //   }
  // };

  const navigate = useNavigate();
  // Generate a unique submission ID
  const generateSubmissionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `SUB-${timestamp}-${random}`;
  };

  // Enhanced PDF creation with beautiful formatting
  const captureFormSnapshot = async () => {
    try {
      const sid = generateSubmissionId();
      setSubmissionId(sid);

      const formElement = formRef.current;
      if (!formElement) return null;

      // Get form data
      const formData = new FormData(formElement);
      const data = {};
      for (let [key, value] of formData.entries()) {
        if (key !== "password" && key !== "confirmPassword") {
          data[key] = value;
        }
      }

      // Calculate monthly fee
      let monthlyFeeValue = "0";
      if (selectedDepartment) {
        monthlyFeeValue =
          session === "weekend"
            ? selectedDepartment?.weekend_fee || "0"
            : selectedDepartment?.weekdays_fee || "0";
      }

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth - 40; // Account for margins
      let currentY = 15;
      let pageNumber = 1;

      // Add new page function
      const addNewPage = () => {
        pdf.addPage();
        pageNumber++;
        currentY = 15;

        // Add header to new page
        pdf.setFillColor(41, 128, 185); // Blue color
        pdf.rect(0, 0, pageWidth, 10, "F");

        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Page ${pageNumber} - Alyaqeen Academy Application`, 105, 7, {
          align: "center",
        });
        pdf.setTextColor(100);

        currentY += 10;
      };

      // Function to draw a box with content
      const drawBox = (title, contentLines, boxColor = [41, 128, 185]) => {
        if (currentY > pageHeight - 40) {
          addNewPage();
        }

        // Box header
        pdf.setFillColor(...boxColor);
        pdf.rect(15, currentY, pageWidth - 30, 8, "F");

        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255);
        pdf.text(title, 20, currentY + 6);

        currentY += 10;

        // Box content background
        pdf.setFillColor(245, 245, 245);
        pdf.rect(
          15,
          currentY,
          pageWidth - 30,
          contentLines.length * 7 + 10,
          "F",
        );

        // Box border
        pdf.setDrawColor(...boxColor);
        pdf.setLineWidth(0.5);
        pdf.rect(
          15,
          currentY - 10,
          pageWidth - 30,
          contentLines.length * 7 + 20,
        );

        // Content
        pdf.setFontSize(11);
        pdf.setTextColor(50, 50, 50);

        let contentY = currentY + 8;
        contentLines.forEach((line) => {
          pdf.text(line, 20, contentY);
          contentY += 7;
        });

        currentY += contentLines.length * 7 + 15;
      };

      // Function to add signature image
      const addSignature = async () => {
        if (!signature) return;

        if (currentY > pageHeight - 50) {
          addNewPage();
        }

        try {
          // Create image element
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = signature;

          await new Promise((resolve, reject) => {
            img.onload = () => {
              // Draw signature box
              pdf.setFillColor(245, 245, 245);
              pdf.rect(15, currentY, pageWidth - 30, 40, "F");

              pdf.setFontSize(12);
              pdf.setTextColor(41, 128, 185);
              pdf.text("Parent/Guardian Signature", 20, currentY + 8);

              // Add signature image
              const imgWidth = 80;
              const imgHeight = 30;
              pdf.addImage(img, "PNG", 20, currentY + 12, imgWidth, imgHeight);

              // Add signature date
              pdf.setFontSize(10);
              pdf.setTextColor(100);
              pdf.text(
                `Signed on: ${new Date().toLocaleDateString()}`,
                20,
                currentY + 48,
              );

              currentY += 50;
              resolve();
            };

            img.onerror = () => {
              // Fallback text if image fails
              pdf.text(
                "Signature: [Digitally Signed and Stored]",
                20,
                currentY + 8,
              );
              currentY += 20;
              resolve();
            };

            setTimeout(resolve, 1000); // Timeout after 1 second
          });
        } catch (error) {
          console.log("Signature image error:", error);
          pdf.text("Signature: [Digitally Signed]", 20, currentY + 8);
          currentY += 20;
        }
      };

      // ========== PAGE 1: HEADER & STUDENT INFO ==========

      // Header with logo/background
      pdf.setFillColor(41, 128, 185); // Blue
      pdf.rect(0, 0, pageWidth, 40, "F");

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text("ALYAQEEN ACADEMY", 105, 20, { align: "center" });

      pdf.setFontSize(16);
      pdf.text("Application Form", 105, 30, { align: "center" });

      // Submission info
      pdf.setFontSize(10);
      pdf.text(`Submission ID: ${sid}`, 20, 45);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 45, {
        align: "right",
      });

      currentY = 55;

      // 1. STUDENT INFORMATION (Box 1)
      const studentInfoLines = [
        `Full Name: ${data.student_name || ""}`,
        `Date of Birth: ${data.std_dob || ""}`,
        `Gender: ${data.std_gender || ""}`,
        `School Year: ${data.school_year || ""}`,
        `Mother Language: ${data.language || ""}`,
        `Family Name: ${data.family_name || ""}`,
      ];
      drawBox("STUDENT INFORMATION", studentInfoLines, [41, 128, 185]); // Blue

      // 2. CONTACT INFORMATION (Box 2)
      const contactInfoLines = [
        `Emergency Contact: ${data.emergency_number || ""}`,
        `Email: ${data.student_email || ""}`,
        `Address: ${data.address || ""}`,
        `Post Code: ${data.post_code || ""}`,
      ];
      drawBox("CONTACT INFORMATION", contactInfoLines, [39, 174, 96]); // Green

      // 3. PARENT/GUARDIAN INFORMATION (Box 3)
      const parentInfoLines = [
        `Father Name: ${data.father_name || ""}`,
        `Father Occupation: ${data.father_occupation || ""}`,
        `Father Contact: ${data.father_number || ""}`,
        `Mother Name: ${data.mother_name || ""}`,
        `Mother Occupation: ${data.mother_occupation || ""}`,
        `Mother Contact: ${data.mother_number || ""}`,
      ];
      drawBox("PARENT/GUARDIAN INFORMATION", parentInfoLines, [142, 68, 173]); // Purple

      // ========== PAGE 2: COURSE, MEDICAL & SIGNATURE ==========
      if (currentY > pageHeight - 100) {
        addNewPage();
      } else {
        // Add page break line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(15, currentY, pageWidth - 15, currentY);
        currentY += 15;
      }

      // 4. COURSE INFORMATION (Box 4)
      const courseInfoLines = [
        `Department: ${selectedDepartment?.dept_name || ""}`,
        `Session: ${data.std_session || ""}`,
        `Session Time: ${data.std_time || ""}`,
        `Starting Date: ${data.starting_date || ""}`,
        `Monthly Fee: £${monthlyFeeValue}`,
      ];
      drawBox("COURSE INFORMATION", courseInfoLines, [230, 126, 34]); // Orange

      // 5. MEDICAL INFORMATION (Box 5)
      const medicalInfoLines = [
        `Doctor/Surgery: ${data.doctor_name || ""}`,
        `Surgery Address: ${data.surgery_address || ""}`,
        `Surgery Contact: ${data.surgery_number || ""}`,
        `Allergies: ${data.allergies || "None"}`,
        `Medical Conditions: ${data.medical_condition || "None"}`,
      ];
      drawBox("MEDICAL INFORMATION", medicalInfoLines, [231, 76, 60]); // Red

      // ========== PAGE 3: GUIDELINES ==========
      if (currentY > pageHeight - 150) {
        addNewPage();
      }

      // ========== DETAILED GUIDELINES (Optional - If you want the full guidelines) ==========
      // If you want to include the actual guidelines text from your form, add this:
      if (currentY > pageHeight - 150) {
        addNewPage();
      }

      // Detailed guidelines header
      pdf.setFillColor(41, 128, 185);
      pdf.rect(15, currentY, pageWidth - 30, 8, "F");
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text("DETAILED GUIDELINES", 20, currentY + 6);
      currentY += 12;

      // Detailed guidelines content
      const detailedGuidelines = [
        "1. Admission Fee: A one-time fee of £20 per course is required before the start of classes.",
        "2. Fees are made on a monthly basis and are paid upfront for every month in our facility and centre. This means the total sum of: (£50) for each child should be paid from 1st to 7th of the month.",
        "3. Monthly Fees Policy:",
        "   a. Admission before the 10th: Full monthly fee is due, payable within the first 7 days of each month.",
        "   b. Admission after the 10th: You have two options:",
        "      i. Pay only for the remaining days of that month, then continue with regular monthly payments in the first week of each month.",
        "      ii. Fix the fee date according to the admission date (e.g., if admitted on the 15th, then every month the fee is due on the 15th).",
        "4. Once the fee has been paid and after submitting the application form, the fee (Admission & Monthly Fee) will not be refunded in any case either by the student leaving or by the academy by withdrawing the student.",
        "5. Please note this agreement is for the duration of 6 months including any absences or holidays taken. Fees must be paid on a monthly basis.",
        "6. A month's notice to end this contract is required otherwise fees will be payable for the month. It should be noted that until a months' notice is not provided that fees will continue to be payable.",
        "7. Required course books and materials will be paid for by parent(s) and will not be covered by the fees.",
        "8. In the case of any intentionally damaged furniture or equipment (etc) at the centre The Academy is entitled to require parents to pay for the cost of damage caused by their child.",
        "9. Alyaqeen Academy can at any time terminate the contract for a legitimate reason.",
        "10. Supporting documents including a copy of the student's birth certificate and passport must be  provided with this application; otherwise, the enrolment and contract might not be accepted.",
        "11. Student Supervision: The Academy is only responsible for supervising students up to 10 minutes before and after their class time. Please ensure timely drop-off and pick-up.",
        "12. Dress Code: While there is no strict uniform, we kindly encourage modest and simple attire. Branded or fashion-label clothing is discouraged to help maintain a focused Islamic learning environment.",
        "13. Progress Reports: Parents may discuss their child’s progress with the Head Teacher by arranging an appointment or contacting the Academy at any time. Progress updates will be shared upon request.",
      ];

      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);

      let detailY = currentY;
      detailedGuidelines.forEach((guideline, index) => {
        // Check for page break
        if (detailY > pageHeight - 30) {
          addNewPage();
          detailY = currentY;
        }

        const lines = pdf.splitTextToSize(guideline, maxWidth - 10);
        lines.forEach((line) => {
          pdf.text(line, 20, detailY);
          detailY += 6;
        });
        detailY += 2; // Extra spacing between guidelines
      });

      currentY = detailY + 10;

      // Add some spacing before signature
      if (currentY > pageHeight - 100) {
        addNewPage();
      }

      // 6. SIGNATURE
      await addSignature();
      // ========== FOOTER ON LAST PAGE ==========

      // Add footer
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);

      // Contact info footer
      const contactFooter = [
        "Alyaqeen Academy | 116-118 Church Road, Yardley Birmingham B25 8UX",
        "Phone: 07869636849 | Email: contact@alyaqeen.co.uk | Website: www.alyaqeen.co.uk",
      ];

      contactFooter.forEach((line, index) => {
        pdf.text(line, 105, pageHeight - 20 + index * 5, { align: "center" });
      });

      // Page number and ID
      pdf.text(`Page ${pageNumber} of ${pageNumber} `, 105, pageHeight - 8, {
        align: "center",
      });

      // ========== FINALIZE PDF ==========

      const pdfBlob = pdf.output("blob");

      console.log(
        `📄 Beautiful PDF created: ${(pdfBlob.size / 1024 / 1024).toFixed(
          2,
        )} MB, ${pageNumber} pages`,
      );

      return {
        pdfBlob: pdfBlob,
        metadata: {
          submissionId: sid,
          timestamp: new Date().toISOString(),
          pageCount: pageNumber,
          fileSizeMB: (pdfBlob.size / 1024 / 1024).toFixed(2),
          type: "formatted_pdf",
          includesSignature: !!signature,
        },
      };
    } catch (error) {
      console.error("❌ Error creating formatted PDF:", error);
      // Remove the toast.error() call here since it's handled in handleRegister
      throw new Error("Failed to create PDF snapshot");
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (localLoading) return;

    setLocalLoading(true);
    const form = e.target;

    let snapshotUrl = null;
    let loadingToastId; // This variable is declared but not properly used

    // In handleRegister, update the upload section:
    try {
      // Dismiss any existing toasts first
      toast.dismiss();

      // Store the toast ID when creating loading toast
      loadingToastId = toast.loading("Creating form snapshot...");

      // 1. Capture snapshot
      const snapshotData = await captureFormSnapshot();

      if (!snapshotData) {
        throw new Error("Snapshot generation failed");
      }

      console.log(
        "📊 PDF size before compression:",
        (snapshotData.pdfBlob.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      // 2. Compress the PDF if it's too large
      let pdfBlobToUpload = snapshotData.pdfBlob;

      if (snapshotData.pdfBlob.size > 3 * 1024 * 1024) {
        // If > 3MB
        // Dismiss previous toast and show new one
        toast.dismiss(loadingToastId);
        loadingToastId = toast.loading("Compressing PDF for upload...");
        pdfBlobToUpload = await optimizePDF(snapshotData.pdfBlob);

        console.log(
          "📦 PDF size after compression:",
          (pdfBlobToUpload.size / 1024 / 1024).toFixed(2),
          "MB",
        );
      }

      // Dismiss previous toast and show new one
      toast.dismiss(loadingToastId);
      loadingToastId = toast.loading("Uploading compressed PDF...");

      // 4. Create PDF file
      const pdfFile = new File(
        [snapshotData.pdfBlob],
        `application_${snapshotData.metadata.submissionId}.pdf`,
        { type: "application/pdf" },
      );

      // 5. Upload to Cloudinary
      snapshotUrl = await uploadToCloudinary(pdfFile, "application-snapshots");

      console.log("✅ Upload successful:", snapshotUrl);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
    } catch (error) {
      console.error("❌ Error:", error);
      // Dismiss any loading toast on error
      toast.dismiss(loadingToastId);
      toast.error(error.message || "Failed to process form snapshot");
      setLocalLoading(false);
      setLoading(false);
      return;
    }

    // --- Basic Info ---
    const student_name = form.student_name.value.trim();
    const student_email = form.student_email.value.toLowerCase().trim();
    const student_dob = form.std_dob.value;
    const family_name = form.family_name.value.trim();
    const student_gender = form.std_gender.value;
    const school_year = form.school_year.value;
    const language = form.language.value;
    const emergency_number = form.emergency_number.value.trim();
    const address = form.address.value.trim();
    const post_code = form.post_code.value.trim();

    // --- Parent Info ---
    const mother_name = form.mother_name.value.trim();
    const mother_occupation = form.mother_occupation.value.trim();
    const mother_number = form.mother_number.value.trim();
    const father_name = form.father_name.value.trim();
    const father_occupation = form.father_occupation.value.trim();
    const father_number = form.father_number.value.trim();

    // --- Academic Info ---
    const std_department = form.std_department.value;
    const std_time = form.std_time.value;
    const std_session = form.std_session.value;
    const student_class = null;

    // --- Health Info ---
    const doctor_name = form.doctor_name.value.trim();
    const surgery_address = form.surgery_address.value.trim();
    const surgery_number = form.surgery_number.value.trim();
    const allergies = form.allergies.value.trim();
    const medical_condition = form.medical_condition.value.trim();
    const starting_date = form.starting_date.value;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const monthly_fee =
      session === "weekend"
        ? selectedDepartment?.weekend_fee
        : selectedDepartment?.weekdays_fee;
    const today = new Date().setHours(0, 0, 0, 0); // current date at midnight
    const selectedDate = new Date(starting_date).setHours(0, 0, 0, 0); // user date at midnight
    const validateRequiredFields = (form) => {
      const requiredFields = [
        { name: "student_name", label: "Student Name" },
        { name: "student_email", label: "Student Email", type: "email" },
        { name: "std_dob", label: "Date of Birth" },
        { name: "family_name", label: "Family Name" },
        { name: "std_gender", label: "Gender" },
        { name: "school_year", label: "School Year" },
        { name: "language", label: "Language" },
        { name: "emergency_number", label: "Emergency Number" },
        { name: "post_code", label: "Post Code" },
        { name: "address", label: "Home Address" },
        { name: "mother_name", label: "Mother Name" },
        { name: "mother_occupation", label: "Mother Occupation" },
        { name: "mother_number", label: "Mother Contact Number" },
        { name: "father_name", label: "Father Name" },
        { name: "father_occupation", label: "Father Occupation" },
        { name: "father_number", label: "Father Contact Number" },
        { name: "std_department", label: "Department" },
        { name: "std_session", label: "Session" },
        { name: "std_time", label: "Session Time" },
        { name: "doctor_name", label: "Doctor Name" },
        { name: "surgery_address", label: "Surgery Address" },
        { name: "surgery_number", label: "Surgery Number" },
        { name: "allergies", label: "Allergies" },
        { name: "medical_condition", label: "Medical Condition" },
        { name: "password", label: "Password" },
        { name: "confirmPassword", label: "Confirm Password" },
        { name: "starting_date", label: "Starting Date" },
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      for (let field of requiredFields) {
        const value = form[field.name]?.value.trim();
        if (!value) {
          toast.error(`${field.label} is required`);
          return false; // Stop at the first error
        }
        if (field.type === "email" && !emailRegex.test(value)) {
          toast.error(`${field.label} is not a valid email`);
          return false;
        }
      }

      return true;
    };
    if (!validateRequiredFields(form)) {
      setLocalLoading(false);
      setLoading(false);
      return; // Stop before doing anything else
    }
    if (selectedDate < today) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Starting date cannot be in the past");
    }

    // --- Validation ---
    if (password !== confirmPassword) {
      setLocalLoading(false); // ✅ Unblock double click

      setLoading(false);
      return setError("Passwords do not match");
    }
    // if (!/[A-Z]/.test(password)) {
    //   setLocalLoading(false); // ✅ Unblock double click

    //   setLoading(false);
    //   return setError("Password must contain an uppercase letter");
    // }
    // if (!/[a-z]/.test(password)) {
    //   setLocalLoading(false); // ✅ Unblock double click

    //   setLoading(false);
    //   return setError("Password must contain a lowercase letter");
    // }
    if (password.length < 6) {
      setLocalLoading(false); // ✅ Unblock double click

      setLoading(false);
      return setError("Password must be at least 6 characters long");
    }

    try {
      if (!signature) {
        setLocalLoading(false); // ✅ Unblock double click
        setLoading(false);
        return setError("Please save signature first");
      }
      // 🔁 1. Check if parent already exists
      const { data: existingParent } = await axiosPublic.get(
        `/families/by-email/${student_email}`,
      );
      let parentUid;
      const studentUid = crypto.randomUUID();

      if (existingParent) {
        parentUid = existingParent.uid;
      } else {
        // 🔧 Create Firebase user for parent
        const parentRes = await axiosPublic.post("/create-student-user", {
          email: student_email,
          password,
          displayName: family_name,
        });

        parentUid = parentRes?.data?.uid;

        const newFamily = {
          uid: parentUid,
          name: family_name,
          familyId: `${family_name}-${student_email}`,
          email: student_email,
          feeChoice: null,
          phone: father_number,
          fatherName: father_name,
          children: [studentUid], // will push child after
          createdAt: new Date(),
        };

        const parentData = {
          uid: parentUid,
          name: family_name,
          email: student_email,
          role: "parent",
          createdAt: new Date(),
        };

        await axiosPublic.post("/families", newFamily);
        await axiosPublic.post("/users", parentData);
      }

      // ✅ 2. Generate student UID

      if (monthly_fee) {
        // ✅ 2. Prepare student data
        const studentData = {
          uid: studentUid,
          name: student_name,
          email: student_email,
          dob: student_dob,
          parentUid,
          address,
          post_code,
          gender: student_gender,
          school_year,
          status: "under review",
          activity: "active",
          language,
          emergency_number,
          family_name,
          mother: {
            name: mother_name,
            occupation: mother_occupation,
            number: mother_number,
          },
          father: {
            name: father_name,
            occupation: father_occupation,
            number: father_number,
          },
          academic: {
            enrollments: [
              {
                dept_id: std_department,
                class_id: student_class,
                session: std_session,
                session_time: std_time,
              },
            ],
          },
          medical: {
            doctorName: doctor_name,
            surgeryAddress: surgery_address,
            surgeryNumber: surgery_number,
            allergies,
            condition: medical_condition,
          },
          startingDate: starting_date,
          signature,
          monthly_fee,
          createdAt: new Date(),
          applicationPdfUrl: snapshotUrl, // Cloudinary URL instead of data URL
        };
        const notification = {
          type: "admission",
          message: `${student_name} has joined.`,
          isRead: false,
          createdAt: new Date(),
          link: "/dashboard/online-admissions",
        };

        // ✅ 4. Save student and notification
        await axiosPublic.post("/students", studentData);
        await axiosPublic.post("/notifications", notification);

        // ✅ 5. If parent existed, add student UID
        if (existingParent) {
          await axiosPublic.patch(`/families/${student_email}/add-child`, {
            studentUid,
          });
        }
        // --- 5. Success Notification ---
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Student added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        form.reset();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>Add New Student</h3>
      {/* <p className="text-center mb-3">
        Manage all students here—approve, track, and ensure the right
        connections are made.
      </p> */}
      <form
        onSubmit={handleFormSubmit}
        action="#"
        method="POST"
        noValidate
        ref={formRef}
        className="row g-3"
      >
        {/* basic details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Basic Details
        </div>
        {/* full name */}
        <div className="col-md-4">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="student_name"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        {/* dob */}
        <div className="col-md-4">
          <label className="form-label">Date of Birth</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="std_dob"
            required
          />
        </div>

        {/* gender */}
        <div className="col-md-4">
          <label className="form-label">Gender</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="std_gender"
            className="form-control"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* school year */}
        <div className="col-md-4">
          <label className="form-label">School Year</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="school_year"
            className="form-control"
            required
          >
            <option value="">Select year</option>
            <option value="reception">Reception</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
            <option value="Year 5">Year 5</option>
            <option value="Year 6">Year 6</option>
            <option value="Year 7">Year 7</option>
            <option value="Year 8">Year 8</option>
            <option value="Year 9">Year 9</option>
            <option value="Year 10">Year 10</option>
            <option value="Year 11">Year 11</option>
            <option value="A level 1st Year">A level 1st Year</option>
            <option value="A level 2nd Year">A level 2nd Year</option>
            <option value="University">University</option>
          </select>
        </div>

        {/* language */}
        <div className="col-md-4">
          <label className="form-label">Mother Language</label>
          <input
            type="text"
            name="language"
            style={{ borderColor: "var(--border2)" }}
            id="name"
            placeholder=""
            className="form-control bg-light"
            required
          />
        </div>
        {/* family name */}
        <div className="col-md-4">
          <label className="form-label">Family Name</label>
          <input
            type="text"
            style={{ borderColor: "var(--border2)" }}
            name="family_name"
            placeholder="e.g. Rahman / Khan"
            className="form-control bg-light"
            id="name"
            required
          />
        </div>
        {/* contact */}
        <div className="col-md-4">
          <label className="form-label">Preferred Contact Number</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="emergency_number"
            id="number"
            placeholder=""
            required
          />
        </div>
        {/* email */}
        <div className="col-md-4">
          <label className="form-label">
            Preferred Email*(not same as other one)
          </label>
          <input
            type="email"
            style={{ borderColor: "var(--border2)" }}
            // disabled
            className="form-control bg-light"
            name="student_email"
            id="name"
            placeholder=""
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Post Code</label>
          <input
            type="text"
            style={{ borderColor: "var(--border2)" }}
            // disabled
            className="form-control bg-light"
            name="post_code"
            id="post_code"
            required
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Home Address</label>
          <input
            type="text"
            style={{ borderColor: "var(--border2)" }}
            // disabled
            className="form-control bg-light"
            name="address"
            id="address"
            placeholder=""
            required
          />
        </div>

        {/* parents details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Parent/Guardian Details
        </div>
        {/* mother name */}
        <div className="col-md-4">
          <label className="form-label">Mother Name</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="mother_name"
            id="name"
            placeholder=""
          />
        </div>
        {/* mother occupation */}
        <div className="col-md-4">
          <label className="form-label">Occupation:</label>

          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="mother_occupation"
            id="name"
            placeholder=""
          />
        </div>
        {/* mother number */}
        <div className="col-md-4">
          <label className="form-label">Contact Number:</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="mother_number"
            id="name"
            placeholder=""
            required
          />
        </div>

        {/* father */}
        <div className="col-md-4">
          <label className="form-label">Father Name</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="father_name"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* father occupation */}
        <div className="col-md-4">
          <label className="form-label">Occupation</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="father_occupation"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/*father contact number */}
        <div className="col-md-4">
          <label className="form-label">Contact Number</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="father_number"
            id="name"
            placeholder=""
            required
          />
        </div>

        {/* Academic Details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Select Course
        </div>
        <div className="col-md-6">
          <label className="form-label">Select Subject</label>
          <select
            name="std_department"
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select department</option>
            {departments?.map((dept) => (
              <option key={dept?._id} value={dept?._id}>
                {dept?.dept_name}
              </option>
            ))}

            {/* <option value="Qaidah, Quran & Islamic Studies">
              Qaidah, Quran & Islamic Studies
            </option>
            <option value="Primary Maths & English Tuition">
              Primary Maths & English Tuition
            </option>
            <option value="GCSE Maths English & Science Tuition">
              GCSE Maths English & Science Tuition
            </option>
            <option value="Hifz Memorisation">Hifz Memorisation</option>
            <option value="Arabic Language">Arabic Language</option> */}
          </select>
        </div>

        {/* session */}
        <div className="col-md-6">
          <label className="form-label">Session</label>
          <select
            name="std_session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select Session</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>

        {/* time */}
        <div className="col-md-6">
          <label className="form-label">Session Time</label>
          <select
            name="std_time"
            value={session_time}
            onChange={(e) => setSessionTime(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select Session Time</option>
            {department && session === "weekdays" ? (
              <>
                <option value="S1">Early - 4:30 PM – 6:00 PM (1½ hrs)</option>
                <option value="S2">Late - 5:45 PM – 7:15 PM (1½ hrs)</option>
              </>
            ) : department && session === "weekend" ? (
              <>
                <option value="WM">
                  Morning - 10:00 AM – 12:30 PM (2½ hrs)
                </option>
                <option value="WA">
                  Afternoon - 12:30 PM – 2:30 PM (2 hrs)
                </option>
              </>
            ) : null}
          </select>
        </div>

        {/* class */}
        <div className="col-md-6">
          <label className="form-label">Class</label>
          <select
            disabled
            className="form-control bg-light"
            style={{
              backgroundColor: "var(--theme2)",
              cursor: "not-allowed",
              borderColor: "var(--border2)",
            }}
            name="student_class"
          >
            <option value="">Class Can be selected from the update form</option>
          </select>
        </div>
        {/* Health Information */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Health Information
        </div>
        {/* doctor name */}
        <div className="col-md-4">
          <label className="form-label">Surgery/Doctor name</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="doctor_name"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* address */}
        <div className="col-md-4">
          <label className="form-label">Surgery address</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="surgery_address"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* surgery contact */}
        <div className="col-md-4">
          <label className="form-label">Surgery contact</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="surgery_number"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* known allergy */}
        <div className="col-md-6">
          <label className="form-label">Known Allergies</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="allergies"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* medical condition */}
        <div className="col-md-6">
          <label className="form-label">Any Other Medical Conditions</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="medical_condition"
            id="name"
            placeholder=""
            required
          />
        </div>
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Credentials
        </div>
        <div className="col-md-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-group">
            <input
              id="password"
              style={{ borderColor: "var(--border2)" }}
              name="password"
              type={show ? "text" : "password"}
              className="form-control border border-secondary"
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="btn btn-outline-secondary"
              tabIndex={-1}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="input-group">
            <input
              id="confirmPassword" // ✅ fix here
              style={{ borderColor: "var(--border2)" }}
              name="confirmPassword"
              type={confirmShow ? "text" : "password"}
              className="form-control border border-secondary"
              required
            />
            <button
              type="button"
              onClick={() => setConfirmShow(!confirmShow)}
              className="btn btn-outline-secondary"
              tabIndex={-1}
            >
              {confirmShow ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Signatures
        </div>
        {/* Parents Signature */}
        <div className="col-lg-6 ">
          <div className="form-clt">
            <span>Parents Signature*</span>
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                // width: 550,
                height: 150,
                className: "w-100",
                style: {
                  border: "1px solid var(--border2)", // or use a fixed color like "#333"
                  borderRadius: "5px", // optional
                },
              }}
              ref={sigRef}
            />
            <div className="mt-2 d-flex gap-2">
              <button
                type="button"
                style={{ backgroundColor: "var(--border2)" }}
                className="btn text-white"
                onClick={clearSignature}
                // className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
              >
                Clear
              </button>
              <button
                type="button"
                style={{ backgroundColor: "var(--border2)" }}
                className="btn text-white"
                onClick={saveSignature}
                // className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
              >
                Save & Submit
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6" style={{ marginTop: "50px" }}>
          <label className="form-label">Expected Starting Date</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="starting_date"
            required
          />
        </div>
        {error && <p className="text-danger text-center col-span-2">{error}</p>}

        {/* Submit Button */}
        <div className="col-12 text-center py-3">
          <button
            disabled={localLoading}
            type="submit"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            {localLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
