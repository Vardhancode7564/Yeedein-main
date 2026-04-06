import React, { useState, useRef } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react"; // You'll need to install this package

const AddStudentPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    idNumber: "",
    year: "E3",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [showQR, setShowQR] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/student",
        {
          email: formData.email,
          idNumber: formData.idNumber,
          year: formData.year,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      setQrToken(data.token); // This is the token received from your API
      setShowQR(true);
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

    // Get the SVG element
    const svgElement = qrCodeRef.current.querySelector("svg");
    if (!svgElement) return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const svgRect = svgElement.getBoundingClientRect();
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;

    // Convert SVG to dataURL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Convert canvas to dataURL and download
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qrcode-${formData.idNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(svgUrl);
      }
    };
    img.src = svgUrl;
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center shadow-md">
        <ArrowLeft onClick={handleBackClick} size={24} />
        <h1 className="text-xl font-bold ml-4">Add New Student</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-lg mx-auto">
        {!showQR ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Student Registration
              </h2>
              <p className="text-gray-600">
                Enter student details to register and generate a QR code
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="idNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="E3">E3</option>
                    <option value="E4">E4</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Processing..." : "Register Student"}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold">
                Student Registered Successfully!
              </h2>
              <p className="text-gray-600 mt-1">
                QR Code has been generated for {formData.idNumber}
              </p>
            </div>

            <div className="flex flex-col items-center my-6">
              <div
                ref={qrCodeRef}
                className="bg-white border border-gray-300 rounded p-4 mb-4"
              >
                {/* Generate QR code using qrcode.react */}
                <QRCodeSVG
                  value={qrToken}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={true}
                />
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <p>ID: {formData.idNumber}</p>
                <p>Year: {formData.year}</p>
              </div>

              <button
                onClick={downloadQRCode}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700"
              >
                <Download size={18} className="mr-2" /> Download QR Code
              </button>

              <button
                  onClick={() => {
                    setShowQR(false);
                    setFormData({
                      email: "",
                      idNumber: "",
                      year: "E3",
                    });
                }}
                className="mt-3 text-blue-600 hover:underline"
              >
                Register Another Student
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AddStudentPage;
