import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  QrCode,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

function ScanIceCream() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    text: string;
    success?: boolean;
    message?: string;
  } | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  const initScanner = () => {
    // Clear previous scanner if exists
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((e) => console.error("Error clearing scanner:", e));
      scannerRef.current = null;
    }

    // Reset scan result
    setScanResult(null);

    // Calculate qrbox size based on container width for better mobile experience
    const containerWidth = scannerContainerRef.current?.clientWidth || 300;
    const qrboxSize = Math.min(containerWidth - 40, 250); // Ensure it fits within container with padding

    // Create new scanner instance
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: qrboxSize, height: qrboxSize },
        rememberLastUsedCamera: true,
        aspectRatio: 1,
      },
      false
    );

    scannerRef.current = scanner;

    const success = async (decodedText: string) => {
      // Stop scanning immediately to prevent multiple scans
      await scanner.pause();

      setScanning(true);

      try {
        const response = await axios.patch(
          "api/scanner/scanicecream",
          { token: decodedText },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Set success result
        setScanResult({
          text: decodedText,
          success: true,
          message: response.data.message,
        });

        // Clear scanner
        await scanner.clear();
        scannerRef.current = null;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Scanning failed, please try again";

        // Set error result
        setScanResult({
          text: decodedText,
          success: false,
          message: errorMessage,
        });

        // Clear scanner
        await scanner.clear();
        scannerRef.current = null;
      } finally {
        setScanning(false);
      }
    };

    const error = (err: any) => {
      console.error("Scan error:", err);
    };

    scanner.render(success, error);
  };

  useEffect(() => {
    initScanner();

    // Handle window resize for responsive qrbox
    const handleResize = () => {
      if (scannerRef.current) {
        // Re-initialize scanner on significant size change
        initScanner();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((e) => console.error("Cleanup error:", e));
        scannerRef.current = null;
      }
    };
  }, []);

  const handleReset = () => {
    setScanResult(null); // Clear result before resetting
    setTimeout(() => {
      initScanner();
    }, 300); // Slight delay allows DOM to reset cleanly
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header with back button for mobile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/" className="mr-3 lg:hidden">
              <ArrowLeft className="h-6 w-6 text-blue-700" />
            </Link>
            <div className="flex items-center">
              <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 mr-2" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Scan IceCream
              </h1>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span>Reset</span>
          </button>
        </div>

        {/* Scanner container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {!scanResult ? (
            <>
              <div className="p-4 bg-blue-700 text-white text-center">
                <p className="font-medium">
                  Position the QR code within the frame
                </p>
              </div>

              <div className="p-4 sm:p-6" ref={scannerContainerRef}>
                <div
                  id="qr-reader"
                  className="overflow-hidden rounded-lg"
                ></div>

                {scanning && (
                  <div className="flex items-center justify-center mt-4 p-4 bg-blue-50 rounded-lg">
                    <RefreshCw className="h-5 w-5 text-blue-600 animate-spin mr-2" />
                    <p className="text-blue-600 font-medium">
                      Processing scan...
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-5 sm:p-8">
              {/* Result header with success/error icon */}
              <div className="flex items-center mb-4">
                {scanResult.success ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500 mr-3" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  {scanResult.success ? "Scan Successful" : "Scan Failed"}
                </h2>
              </div>

              {/* Result message */}
              <div
                className={`p-4 rounded-lg mb-4 ${
                  scanResult.success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="font-medium">{scanResult.message}</p>
              </div>

              

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Scan Again
                </button>
                <Link to="/" className="flex-1">
                  <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Helpful instructions */}
        {!scanResult && (
          <div className="mt-5 bg-white p-4 rounded-lg shadow text-gray-600 text-sm">
            <h3 className="font-medium text-gray-800 mb-2">
              Tips for scanning:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure good lighting on the QR code</li>
              <li>Hold the camera steady</li>
              <li>Position the entire QR code within the frame</li>
              <li>If scanning fails, try resetting the scanner</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScanIceCream;
