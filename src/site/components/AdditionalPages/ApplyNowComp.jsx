import { useEffect, useRef, useState } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";
import SignatureCanvas from "react-signature-canvas";
import { FaEarthAfrica, FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useGetDepartmentsQuery } from "../../../redux/features/departments/departmentsApi";
import LoadingSpinner from "../LoadingSpinner";
import { useGetStudentsByEmailQuery } from "../../../redux/features/students/studentsApi";
import Select from "react-select";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import uploadToCloudinary from "../../../utils/uploadToCloudinary";
const image_hosting_key = import.meta.env.VITE_Image_Hosting_Key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
// const customSelectStyles = {
//   container: (provided) => ({
//     ...provided,
//     zIndex: 9999,
//     position: "relative",
//   }),
//   control: (provided) => ({
//     ...provided,
//     backgroundColor: "var(--theme2)",
//     borderColor: "#ccc",
//     minHeight: "44px",
//     borderRadius: "4px",
//   }),
//   menu: (provided) => ({
//     ...provided,
//     zIndex: 9999,
//     position: "absolute",
//   }),
//   menuList: (provided) => ({
//     ...provided,
//     zIndex: 9999,
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected ? "var(--theme)" : "white",
//     color: state.isSelected ? "white" : "black",
//     "&:hover": {
//       backgroundColor: "var(--theme2)",
//       color: "white",
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "white",
//   }),
//   input: (provided) => ({
//     ...provided,
//     color: "white",
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     color: "#ccc",
//   }),
// };
const ApplyNowComp = () => {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();
  const submitButtonRef = useRef();
  const { data, isLoading } = useGetDepartmentsQuery();
  console.log(data);
  const departments = data || [];
  const selectedDepartment = departments?.find(
    (dept) => dept?._id === department
  );
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFinding, setIsFinding] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submissionId, setSubmissionId] = useState("");
  const [formSnapshot, setFormSnapshot] = useState(null);
  const formRef = useRef(); // Add this with other useRef declarations
  const axiosPublic = useAxiosPublic();

  // Function to find students by email
  const handleFindStudent = async () => {
    if (!email) {
      return toast.error("Please enter an email to search");
    }

    // Reset previous selections
    setSelectedStudent(null);
    setSelectedOption(null);
    setStudents([]);
    setStudentOptions([]);

    setIsFinding(true);
    try {
      const response = await axiosPublic.get(`/students/by-email/${email}`);
      if (response.data && response.data.length > 0) {
        setStudents(response.data);

        // Format students for react-select options
        const options = response.data.map((student) => ({
          value: student._id,
          label: student.name,
        }));
        setStudentOptions(options);

        toast.success(`Found ${response.data.length} student(s)`);
      } else {
        setStudents([]);
        setStudentOptions([]);
        toast.error("No students found with this email");
      }
    } catch (error) {
      console.error("Error finding students:", error);
      toast.error("Failed to find students");
    } finally {
      setIsFinding(false);
    }
  };

  // Function to fetch complete student data when selected
  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axiosPublic.get(`/students/by-id/${studentId}`);
      setSelectedStudent(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load student details");
    }
  };

  const {
    name,
    email: emailOld,
    dob,
    gender,
    school_year,
    language,
    status,
    emergency_number,
    family_name,
    activity,
    post_code,
    address,
    mother,
    father,
    academic,
    medical,
    startingDate,
  } = selectedStudent || {};
  const { doctorName, surgeryAddress, surgeryNumber, allergies, condition } =
    medical || {};
  const {
    name: fatherName,
    occupation: fatherOcc,
    number: fatherNumber,
  } = father || {};

  const { name: motherName, occupation, number: motherNumber } = mother || {};

  const {
    session: sessionOld,
    department: deptOld,
    time,
    class: studentClass,
    dept_id,
    class_id,
  } = academic || {};

  const { createUser, setUser, updateUser, signInUser, setLoading } = useAuth();

  const sigRef = useRef();

  const clearSignature = () => sigRef.current.clear();
  // Add this function near your other utility functions
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
                  `✅ PDF Optimized: ${originalSizeMB}MB → ${compressedSizeMB}MB (${reduction}% reduction)`
                );

                if (compressedBlob.size > 10 * 1024 * 1024) {
                  console.warn(
                    "⚠️ Still too large after compression:",
                    compressedSizeMB,
                    "MB"
                  );
                }

                resolve(compressedBlob);
              },
              "image/jpeg", // Better compression than PNG
              0.7 // Quality: 0.7 (70%)
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
    let dataUrl = sigRef.current.toDataURL("image/png");

    // Compress it
    dataUrl = await compressImage(dataUrl);

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "signature.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosPublic.post(image_hosting_api, formData);
      const url = res.data?.data?.display_url;
      setSignature(url);
      toast.success("Signature uploaded!");

      // Scroll to submit button after saving signature
      if (submitButtonRef.current) {
        submitButtonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  useEffect(() => {
    setSession("");
    setSessionTime("");
  }, [department]);

  // Generate a unique submission ID
  const generateSubmissionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `SUB-${timestamp}-${random}`;
  };

  // Capture form as image/PDF - SIMPLIFIED AND RELIABLE VERSION
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
          "F"
        );

        // Box border
        pdf.setDrawColor(...boxColor);
        pdf.setLineWidth(0.5);
        pdf.rect(
          15,
          currentY - 10,
          pageWidth - 30,
          contentLines.length * 7 + 20
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
                currentY + 48
              );

              currentY += 50;
              resolve();
            };

            img.onerror = () => {
              // Fallback text if image fails
              pdf.text(
                "Signature: [Digitally Signed and Stored]",
                20,
                currentY + 8
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
          2
        )} MB, ${pageNumber} pages`
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
  const handleRegister = async (e) => {
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
        "MB"
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
          "MB"
        );
      }

      // 3. Check size limit again
      // if (pdfBlobToUpload.size > 10 * 1024 * 1024) {
      //   toast.error(
      //     "PDF is still too large after compression. Please try with less form data."
      //   );
      //   setLocalLoading(false);
      //   setLoading(false);
      //   return;
      // }

      // Dismiss previous toast and show new one
      toast.dismiss(loadingToastId);
      loadingToastId = toast.loading("Uploading compressed PDF...");

      // 4. Create PDF file
      const pdfFile = new File(
        [snapshotData.pdfBlob],
        `application_${snapshotData.metadata.submissionId}.pdf`,
        { type: "application/pdf" }
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
    // Extract form values
    const student_name = form.student_name.value;
    const student_email = form.student_email.value.toLowerCase().trim();
    const student_dob = form.std_dob.value;
    // const student_age = form.student_age.value;
    const family_name = form.family_name.value.trim();
    const student_gender = form.std_gender.value;
    const school_year = form.school_year.value;
    const language = form.language.value;
    const emergency_number = form.emergency_number.value;
    const address = form.address.value;
    const post_code = form.post_code.value;

    const mother_name = form.mother_name.value;
    const mother_occupation = form.mother_occupation.value;
    const mother_number = form.mother_number.value;
    const father_name = form.father_name.value;
    const father_occupation = form.father_occupation.value;
    const father_number = form.father_number.value;

    const std_department = form.std_department.value;
    const std_time = form.std_time.value;
    const std_session = form.std_session.value;

    const doctor_name = form.doctor_name.value;
    const surgery_address = form.surgery_address.value;
    const surgery_number = form.surgery_number.value;
    const allergies = form.allergies.value;
    const medical_condition = form.medical_condition.value;
    const starting_date = form.starting_date.value;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const student_class = null;

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
        { name: "address", label: "Home Address" },
        { name: "post_code", label: "Post Code" },
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
    // Password Validation
    if (password !== confirmPassword) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Password must be at least 6 characters");
    }

    try {
      if (!signature) {
        setLocalLoading(false); // ✅ Unblock double click
        setLoading(false);
        return setError("Please save signature first");
      }

      // 🔁 1. Check if parent already exists
      const { data: existingParent } = await axiosPublic.get(
        `/families/by-email/${student_email}`
      );
      const studentUid = crypto.randomUUID(); // ✅ Generate student UID early
      let parentUid;

      if (existingParent) {
        try {
          // ✅ Attempt to sign in using Firebase client SDK
          await signInUser(student_email, password); // from useAuth
          parentUid = existingParent.uid;
        } catch (err) {
          // ❌ Invalid password
          setLoading(false);
          setLocalLoading(false);
          return toast.error(
            "Incorrect email/password for existing family account"
          );
        }
      } else {
        // 🔧 Create new Firebase user for parent
        const parentRes = await createUser(student_email, password);
        const currentUser = parentRes.user;

        await updateUser({ displayName: family_name }); // optional but good for clarity
        setUser(currentUser);

        parentUid = currentUser.uid;

        const newFamily = {
          uid: parentUid,
          name: family_name,
          familyId: `${family_name}-${student_email}`,
          email: student_email,
          feeChoice: null,
          phone: father_number,
          fatherName: father_name,
          children: [studentUid],
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

      if (monthly_fee) {
        // ✅ 2. Prepare student data
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

        // ✅ 3. Save student and notify
        await axiosPublic.post("/students", studentData);
        await axiosPublic.post("/notifications", notification);

        // ✅ 4. If parent existed, patch to add student UID
        if (existingParent) {
          await axiosPublic.patch(`/families/${student_email}/add-child`, {
            studentUid,
          });
        }

        toast.success("Registration successful");
        navigate("/dashboard");
        form.reset();
      } else {
        return toast.error(
          "Monthly fee not found for this department and session"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // If email changes, reset the student selections
    if (newEmail !== email) {
      setSelectedStudent(null);
      setSelectedOption(null);
      setStudents([]);
      setStudentOptions([]);
    }
  };
  const reorderedDepartments = [...departments];

  if (reorderedDepartments.length >= 5) {
    // take Arabic (5th index)
    const arabicDept = reorderedDepartments.splice(4, 1)[0];
    // insert Arabic before Urdu (4th index)
    reorderedDepartments.splice(3, 0, arabicDept);
  }
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <section className="contact-section mt-2">
      <div className="line-1">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="line-2 text-end">
        <img src={two} className="w-50" alt="shape-img" />
      </div>

      <div className="container">
        <div className="d-flex justify-content-center align-content-center text-right mb-0">
          <a
            href="/file/updated2025/Arabic_Quran_Application_Form.docx"
            className="theme-btn px-2 d-flex text-nowrap justify-content-center align-items-center me-md-3 me-1 text-center text-wrap"
            // style={{
            //   marginRight: "10px",
            // }}
          >
            Download Form In Word File
          </a>
          <a
            href="/file/updated2025/Arabic_Quran_Application_Form.pdf"
            download
            className="theme-btn px-2 text-nowrap d-flex justify-content-center align-items-center me-md-3 me-1 text-center text-wrap"
          >
            Download Form In PDF File
          </a>
        </div>
        <div>
          {/* Student Search Section */}
          <ul
            className="nav gap-2 my-md-5 my-2 d-flex justify-content-center align-items-center"
            role="tablist"
          >
            <li
              className="nav-item"
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
              role="presentation"
            >
              <a
                className={`nav-link text-uppercase box-shadow px-2 px-md-3 py-1 py-md-3 ${
                  activeTabIndex === 0 ? " active" : ""
                }`}
                onClick={() => handleTabClick(0)}
              >
                <p className="fs-6 fs-md-4">Add a New Student</p>
                <p className="text-wrap lh-1" style={{ fontSize: "10px" }}>
                  If this is your first child or not a sibling, start a fresh
                  form.
                </p>
              </a>
            </li>
            <li
              className="nav-item"
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="500"
              role="presentation"
            >
              <a
                className={`nav-link text-uppercase box-shadow px-2 px-md-3 py-1 py-md-3 ${
                  activeTabIndex === 1 ? " active" : ""
                }`}
                onClick={() => handleTabClick(1)}
              >
                <p className="fs-6 fs-md-4">Add a Sibling</p>
                <p className="text-wrap lh-1" style={{ fontSize: "10px" }}>
                  Adding another child? Select an existing student to auto-fill
                  details.
                </p>
              </a>
            </li>
          </ul>
          {/* <div className="d-flex justify-content-center g-3">
            <button className="theme-btn text-center">Add a New Student</button>
            <button className="theme-btn bg-white text-center">
              Add a Sibling
            </button>
          </div> */}
          <div
            className={`card mb-4 c-tab-single ${
              activeTabIndex === 1 ? "active-tab" : ""
            }`}
            style={{
              borderColor: "var(--theme)",
            }}
          >
            <div className="card-body">
              <h5 className="card-title">Select Existing Student</h5>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group mb-2 mb-md-0">
                    {/* <label>Email Address</label> */}
                    <input
                      type="email"
                      style={{ borderColor: "var(--theme)" }}
                      className="form-control"
                      placeholder="Enter your email to find your child’s record"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    // style={{ backgroundColor: "var(--theme)" }}
                    onClick={handleFindStudent}
                    style={{ backgroundColor: "var(--theme)" }}
                    className="btn text-white w-100"
                    disabled={isFinding}
                  >
                    {isFinding ? "Searching..." : "Find Students"}
                  </button>
                </div>
              </div>

              {studentOptions.length > 0 && (
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Select Student</label>
                      <Select
                        options={studentOptions}
                        value={selectedOption}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: state.isFocused
                              ? "var(--theme)"
                              : "var(--theme)", // 🔹 green when focused, red otherwise
                            boxShadow: "none", // remove blue shadow
                            "&:hover": {
                              borderColor: "var(--theme)", // on hover
                            },
                          }),
                        }}
                        onChange={(selectedOption) => {
                          setSelectedOption(selectedOption);
                          if (selectedOption) {
                            fetchStudentDetails(selectedOption.value);
                          } else {
                            setSelectedStudent(null);
                          }
                        }}
                        placeholder="Select a student..."
                        isClearable
                        isSearchable
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="contact-wrapper mt-0 pt-0"
          style={{
            position: "relative",
            zIndex: 0,
            // Ensure proper colors for html2canvas if you still want to use it
            background: "var(--theme2)",
            color: "white",
          }}
          data-capture="true"
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="contact-content">
                <div className="section-title">
                  {/* <p
                    className="text-white text-center fs-4 mb-1"
                    data-aos-duration="800"
                    data-aos="fade-up"
                  >
                    Alyaqeen Academy
                  </p>
                  <p className="text-white text-center">
                    116 - 118 Church Road, Yardley Birmingham, B25 8UX :
                    +07869636849
                  </p> */}
                  <p className="text-white text-center">Registration Form</p>
                  <h2
                    className="text-white "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Apply Now!
                  </h2>
                </div>

                <form
                  onSubmit={handleRegister}
                  action="#"
                  id="contact-form"
                  method="POST"
                  className="contact-form-items"
                  noValidate
                  ref={formRef} // <-- Add this line
                >
                  <div className="row g-4">
                    {/* basic info */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Basic Info
                        </h6>
                      </div>
                    </div>
                    {/* full name */}
                    <div
                      className="col-lg-4 "
                      // data-aos-duration="800"
                      // data-aos="fade-up"
                      // data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Full Name*</span>
                        <input
                          type="text"
                          name="student_name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* date of birth */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Date of birth*</span>
                        <input type="date" name="std_dob" required />
                      </div>
                    </div>

                    {/* gender */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Gender*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
                          name="std_gender"
                          className="form-control"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    {/* school year */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>School Year*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
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
                          <option value="A level 1st Year">
                            A level 1st Year
                          </option>
                          <option value="A level 2nd Year">
                            A level 2nd Year
                          </option>
                          <option value="University">University</option>
                        </select>
                      </div>
                    </div>
                    {/* language */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Mother Language*</span>
                        <input
                          type="text"
                          defaultValue={language || ""}
                          name="language"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* parent/guardian name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Family Name (used to group your family)*</span>
                        <input
                          type="text"
                          defaultValue={family_name || ""}
                          name="family_name"
                          placeholder="e.g. Rahman / Khan"
                          id="name"
                          required
                        />
                      </div>
                    </div>

                    {/* contact */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Preferred Contact Number*</span>
                        <input
                          type="tel"
                          defaultValue={emergency_number || ""}
                          name="emergency_number"
                          id="number"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* email */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>
                          Preferred Email*(Where You Will get Updates)
                        </span>
                        <input
                          type="email"
                          defaultValue={emailOld || ""}
                          name="student_email"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* post code */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Post Code</span>
                        <input
                          type="text"
                          defaultValue={post_code || ""}
                          name="post_code"
                          id="post_code"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* address */}
                    <div
                      className="col-lg-12"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Home Address</span>
                        <input
                          type="text"
                          defaultValue={address || ""}
                          name="address"
                          id="address"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* parent or guardian details */}

                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Parent/Guardian Details
                        </h6>
                      </div>
                    </div>
                    {/* mothers name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Mother Name*</span>
                        <input
                          type="text"
                          defaultValue={motherName || ""}
                          name="mother_name"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* Occupation */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Occupation:*</span>
                        <input
                          type="text"
                          defaultValue={occupation || ""}
                          name="mother_occupation"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* contact number */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Contact Number:*</span>
                        <input
                          type="tel"
                          defaultValue={motherNumber || ""}
                          name="mother_number"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* fathers name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Father Name*</span>
                        <input
                          type="text"
                          defaultValue={fatherName || ""}
                          name="father_name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Occupation */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Occupation:*</span>
                        <input
                          type="text"
                          defaultValue={fatherOcc || ""}
                          name="father_occupation"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* contact number */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Contact Number:*</span>
                        <input
                          type="tel"
                          defaultValue={fatherNumber || ""}
                          name="father_number"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Select Course
                        </h6>
                      </div>
                    </div>

                    {/* department */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Select Subject*</span>
                        <select
                          onChange={(e) => setDepartment(e.target.value)}
                          name="std_department"
                          value={department}
                          className="form-control selectDepartment"
                          style={{ backgroundColor: "var(--theme2)" }}
                          required
                        >
                          <option value="">Select department</option>
                          {reorderedDepartments?.map((dept) => (
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
                          <option value="Hifz Memorisation">
                            Hifz Memorisation
                          </option>
                          <option value="Arabic Language">
                            Arabic Language
                          </option> */}
                        </select>
                      </div>
                    </div>
                    {/* session */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Session*</span>
                        <select
                          onChange={(e) => setSession(e.target.value)}
                          name="std_session"
                          value={session}
                          className="form-control font-light selectClassType"
                          style={{ backgroundColor: "var(--theme2)" }}
                          required
                        >
                          <option value="">Select Session</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="weekend">Weekend</option>
                        </select>
                        {/* <input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="info@example.com"
                        /> */}
                      </div>
                    </div>
                    {/* session timing */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Session Time*</span>
                        <select
                          name="std_time"
                          className="form-control font-light selectClassTime"
                          value={sessionTime}
                          style={{ backgroundColor: "var(--theme2)" }}
                          onChange={(e) => setSessionTime(e.target.value)}
                          required
                        >
                          <option value="">Select Session Time</option>
                          {department && session === "weekdays" ? (
                            <>
                              <option value="S1">
                                Early - 4:30 PM – 6:00 PM (1½ hrs)
                              </option>
                              <option value="S2">
                                Late - 5:45 PM – 7:15 PM (1½ hrs)
                              </option>
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
                    </div>
                    {/* class */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Class*</span>
                        <select
                          disabled
                          style={{
                            backgroundColor: "var(--theme2)",
                            cursor: "not-allowed",
                          }}
                          name="student_class"
                          className="form-control"
                        >
                          <option value="">
                            Class will be selected by Admin
                          </option>
                        </select>
                      </div>
                    </div>
                    {/* class name */}
                    {/* <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Class Name*</span>
                        <select
                          name="std_class_id"
                          className="form-control selectClass"
                          style={{ backgroundColor: "var(--theme2)" }}
                        >
                          <option value="">Select Class</option>
                          {getClassOptions()}
                        </select>
                     
                      </div>
                    </div> */}

                    {/* health details */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Health Information
                        </h6>
                      </div>
                    </div>
                    {/* doctor name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Surgery/Doctor name*</span>
                        <input
                          type="text"
                          defaultValue={doctorName || ""}
                          name="doctor_name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Surgery address */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Surgery address*</span>
                        <input
                          type="text"
                          defaultValue={surgeryAddress || ""}
                          name="surgery_address"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Surgery contact */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Surgery contact*</span>
                        <input
                          type="tel"
                          defaultValue={surgeryNumber || ""}
                          name="surgery_number"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* Known Allergies */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Known Allergies</span>

                        <input
                          type="text"
                          defaultValue={allergies || ""}
                          name="allergies"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Medical Conditions */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Any Other Medical Conditions</span>

                        <input
                          type="text"
                          name="medical_condition"
                          defaultValue={condition || ""}
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* credentials */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Credentials
                        </h6>
                      </div>
                    </div>

                    {/* password */}
                    <div
                      className="col-lg-6"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="">
                        <p
                          className="text-white"
                          style={{ marginBottom: "20px" }}
                        >
                          Password*
                        </p>
                        <div
                          className="input-group border"
                          style={{ padding: "14px 10px" }}
                        >
                          <input
                            name="password"
                            type={show ? "text" : "password"}
                            className="form-control border-0 text-white"
                            style={{
                              backgroundColor: "var(--theme2)",
                            }}
                            required
                          />
                          <button
                            onClick={() => setShow(!show)}
                            type="button"
                            className="text-white"
                          >
                            {show ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* confirm password */}
                    <div
                      className="col-lg-6"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="">
                        <p
                          className="text-white"
                          style={{ marginBottom: "20px" }}
                        >
                          Confirm Password*
                        </p>
                        <div
                          className="input-group border"
                          style={{ padding: "14px 10px" }}
                        >
                          <input
                            type={confirmShow ? "text" : "password"}
                            className="form-control border-0 text-white"
                            name="confirmPassword"
                            style={{
                              backgroundColor: "var(--theme2)",
                            }}
                            required
                          />
                          <button
                            onClick={() => setConfirmShow(!confirmShow)}
                            type="button"
                            className="text-white"
                          >
                            {confirmShow ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <div className="d-flex align-items-center">
                        <hr className="w-100 my-0 text-white" />
                        <span
                          className="mx-2 px-2 py-1 rounded text-white"
                          // style="background: linear-gradient(5deg, #B79879 100%, #FFFDDF  100%);"

                          style={{
                            background:
                              "linear-gradient(180deg, var(--theme) 60%, var(--theme2)  100%)",
                          }}
                        >
                          SIGNATURES
                        </span>
                        <hr className="w-100 my-0 text-white" />
                      </div>
                    </div>
                    {/* Expected Starting Date */}
                    <div
                      className="col-lg-6 mt-5"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Expected Starting Date*</span>
                        <input type="date" name="starting_date" required />
                      </div>
                    </div>
                    {/* Parents Signature */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Parents Signature*</span>
                        <SignatureCanvas
                          penColor="black"
                          canvasProps={{
                            // width: 550,
                            height: 150,
                            className: "border w-100",
                          }}
                          ref={sigRef}
                        />
                        <div className="mt-2 d-flex gap-2">
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={saveSignature}
                            className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Save & Submit
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-white">
                      <h5 className="text-white">
                        Important Guidelines for Parents & Guardians::
                      </h5>
                      <p>
                        1. Admission Fee: A one-time fee of £20 per course is
                        required before the start of classes.
                      </p>
                      <p>
                        2. Fees are made on a monthly basis and are paid upfront
                        for every month in our facility and centre. This means
                        the total sum of: (£50) for each child should be paid
                        from 1st to 7th of the month.
                      </p>

                      <div>
                        3. Monthly Fees Policy
                        <div className="ms-4">
                          <ul
                            className="list-inside ml-5 space-y-2"
                            style={{ listStyleType: "disc", color: "white" }}
                          >
                            <li>
                              Admission before the 10th: Full monthly fee is
                              due, payable within the first 7 days of each
                              month.
                            </li>
                            <li>
                              Admission after the 10th: You have two options:
                              <ol
                                className="list-decimal list-inside ml-6 space-y-1"
                                style={{ color: "white" }}
                              >
                                <li>
                                  Pay only for the remaining days of that month,
                                  then continue with regular monthly payments in
                                  the first week of each month.
                                </li>
                                <li>
                                  Fix the fee date according to the admission
                                  date (e.g., if admitted on the 15th, then
                                  every month the fee is due on the 15th).
                                </li>
                              </ol>
                            </li>
                          </ul>

                          {/* <p>
                            a.{" "}
                            <strong>
                              Admission After the 10th of the Month:
                            </strong>{" "}
                            Pay a pro-rated fee (such as 1/3 or 2/3 of the
                            monthly fee) for the remaining days of the current
                            month, and Begin regular full-month payments
                            starting from the first week of the next month.
                          </p>
                          <p>
                            b. <strong>Full-Month Enrollment:</strong>{" "}
                            Alternatively, if parents prefer the student to be
                            considered enrolled for the entire current month,
                            the full monthly fee must be paid within 7 days of
                            admission (e.g., admitted on the 10th → pay by the
                            17th).
                          </p> */}
                        </div>
                      </div>
                      <p>
                        4. Once the fee has been paid and after submitting the
                        application form, the fee (Admission & Monthly Fee) will
                        not be refunded in any case either by the student
                        leaving or by the academy by withdrawing the student.
                      </p>
                      <p>
                        5. Please note this agreement is for the duration of 6
                        months including any absences or holidays taken. Fees
                        must be paid on a monthly basis.
                      </p>
                      <p>
                        6. A month's notice to end this contract is required
                        otherwise fees will be payable for the month. It should
                        be noted that until a months' notice is not provided
                        that fees will continue to be payable.
                      </p>
                      <p>
                        7. Required course books and materials will be paid for
                        by parent(s) and will not be covered by the fees.
                      </p>
                      <p>
                        8. In the case of any intentionally damaged furniture or
                        equipment (etc) at the centre The Academy is entitled to
                        require parents to pay for the cost of damage caused by
                        their child.
                      </p>
                      <p>
                        9. Alyaqeen Academy can at any time terminate the
                        contract for a legitimate reason.
                      </p>
                      <p>
                        10. Supporting documents including a copy of the
                        student's birth certificate and passport must be
                        provided with this application; otherwise, the enrolment
                        and contract might not be accepted.
                      </p>
                      <p>
                        11. Student Supervision: The Academy is only responsible
                        for supervising students up to 10 minutes before and
                        after their class time. Please ensure timely drop-off
                        and pick-up.
                      </p>
                      <p>
                        12. Dress Code: While there is no strict uniform, we
                        kindly encourage modest and simple attire. Branded or
                        fashion-label clothing is discouraged to help maintain a
                        focused Islamic learning environment.
                      </p>
                      <p>
                        13. Progress Reports: Parents may discuss their child’s
                        progress with the Head Teacher by arranging an
                        appointment or contacting the Academy at any time.
                        Progress updates will be shared upon request.
                      </p>
                      <p className="mt-3 fw-bold fs-5">
                        We may occasionally take photos or shoot videos during
                        events and award ceremonies for marketing, social media
                        and other advertisement purposes, including publishing
                        pictures on leaflets. We kindly encourage parents to
                        give us permission to allow their child's/children's
                        pictures/videos to be taken/published as this will be a
                        source of engagement for all students to participate in
                        different events. Please note that no names or personal
                        data will be published We also do not take any picture
                        of the female child if she is above then 11 years old.
                      </p>
                      <p className="mt-3 fw-bold fs-5">
                        We are honored to be part of your child’s educational
                        journey.
                      </p>
                      <p className="fw-bold fs-5">
                        At Alyaqeen, our mission is to nurture strong Islamic
                        values, academic excellence, and a love for learning in
                        a warm and welcoming environment.
                      </p>
                      <p className="fw-bold fs-5">
                        Classes are available for boys and Girls aged 5 to 16
                        years.
                      </p>
                      <p className="mt-3">
                        To register your child, please fill out the admission
                        form, available at our office or downloadable via our
                        website.
                      </p>
                      <p className="my-2">
                        Jazakum Allahu Khayran – May Allah bless your efforts
                        and grant your child success.
                      </p>
                      <p>
                        For more information kindly visit our website or
                        contact.
                        <br />
                        116-118 Church Road Yew Tree Lane Yardley Birmingham B25
                        8UX
                      </p>
                      <div className="d-flex gap-4 align-items-center flex-wrap text-white mt-3">
                        <Link
                          className="text-white d-flex gap-2 align-items-center"
                          to={"https://www.alyaqeen.co.uk/"}
                        >
                          <FaEarthAfrica />
                          www.alyaqeen.co.uk
                        </Link>
                        <span>|</span>
                        <Link
                          className="text-white d-flex gap-2 align-items-center"
                          to="mailto:contact@alyaqeen.co.uk"
                        >
                          <FaEnvelope />
                          contact@alyaqeen.co.uk
                        </Link>
                        <span>|</span>
                        <Link
                          className="text-white d-flex gap-2 align-items-center"
                          to="tel:+07869636849"
                        >
                          <FaPhoneAlt />
                          07869636849
                        </Link>
                      </div>
                    </div>
                    {error && (
                      <p className="text-danger text-center col-span-2">
                        {error}
                      </p>
                    )}

                    <div
                      className="col-lg-12 d-flex justify-content-center"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      // data-aos-delay="900"
                    >
                      <button
                        type="submit"
                        ref={submitButtonRef}
                        disabled={localLoading}
                        className="theme-btn bg-white text-center"
                      >
                        {localLoading ? "Submitting..." : "Submit"}
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </button>
                    </div>
                    <p className="text-center text-white">
                      Already have an account? Please{" "}
                      <Link
                        style={{ color: "var(--theme)" }}
                        className=" font-bolder"
                        to="/login"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyNowComp;
