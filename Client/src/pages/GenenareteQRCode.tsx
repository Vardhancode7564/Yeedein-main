import React, { useState, useRef } from "react";
import { ArrowLeft, Download, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";

const GenerateQrPage: React.FC = () => {
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    year: "",
  });

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!idNumber.trim()) {
      setError("Please enter a valid ID number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API call to get student token
      const response = await axios.get(`/api/student/token/${idNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;

      // Make sure to handle potential undefined values
      const studentData = {
        name: data.student?.idNumber || "Unknown",
        email: data.student?.email || "Unknown",
        year: data.student?.year || "Unknown",
      };

      setQrToken(data.token || "");
      setStudentInfo(studentData);
      setSuccess(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Scanning failed, please try again";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    try {
      // Get the canvas element inside the QR code div
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (!canvas) {
        toast.error("QR Code not found");
        return;
      }

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `student-qr-${studentInfo.name || "code"}.png`;

      // Append to document, trigger click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR Code downloaded successfully");
    } catch (error) {
      toast.error("Failed to download QR code");
      console.error("QR download error:", error);
    }
  };

  const resetForm = () => {
    setIdNumber("");
    setSuccess(false);
    setQrToken("");
    setStudentInfo({
      name: "",
      email: "",
      year: "",
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center shadow-md">
        <button
          onClick={handleBackClick}
          className="mr-3 bg-transparent border-0 cursor-pointer text-white flex items-center"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Generate QR Code</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-lg mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Student QR Code Generator
          </h2>
          <p className="text-gray-600">
            Enter a student ID to generate a verification QR code
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-700 bg-transparent border-0"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {!success ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="idNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Student ID Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter student ID"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Searching..." : "Generate QR Code"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student Found</h3>
              <div className="flex items-center text-green-600">
                <CheckCircle size={18} className="mr-1" />
                <span className="text-sm">Verified</span>
              </div>
            </div>

            <div className="flex flex-col items-center mt-4">
              <div
                ref={qrCodeRef}
                className="bg-white border border-gray-300 rounded p-4 mb-4"
              >
                {qrToken ? (
                  <QRCodeCanvas
                    value={qrToken}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                    No QR data available
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg w-full mb-6">
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">ID:</span>
                    <span>{studentInfo.name}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Email:</span>
                    <span>{studentInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Year:</span>
                    <span>{studentInfo.year}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadQRCode}
                disabled={!qrToken}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center ${
                  !qrToken ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <Download size={18} className="mr-2" /> Download QR Code
              </button>

              <button
                onClick={resetForm}
                className="mt-3 text-blue-600 hover:underline"
              >
                Generate Another QR Code
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerateQrPage;
