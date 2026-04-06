import axios from "axios";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  ArrowLeft,
  User,
  Loader,
  AlertCircle,
  Utensils,
  IceCream,
  QrCode,
  RefreshCw,
  Check,
  X,
  Clock,
  Camera,
} from "lucide-react";

// Define the type for our API response
interface UserData {
  _id: string;
  email: string;
  idNumber: string;
  year: string;
  isCheckIn: boolean;
  checkInTime: string | null;
  checkInScannedBy: any | null;
  isTakenFood: boolean;
  foodTakenAt: string | null;
  foodScannedBy: any | null;
  isTakenIcecream: boolean;
  iceCreamTakenAt: string | null;
  iceCreamScannedBy: any | null;
}

const StudentSearch = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // Initialize QR Scanner with mobile optimization
  const initScanner = () => {
    // Clear previous scanner if exists
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((e) => console.error("Error clearing scanner:", e));
      scannerRef.current = null;
    }

    // Reset scan result
    setUserData(null);
    setError(null);

    // Calculate qrbox size based on container width for better mobile experience
    const containerWidth = scannerContainerRef.current?.clientWidth || 300;
    const qrboxSize = Math.min(containerWidth - 20, 250); // Slightly larger scanning area for mobile

    // Create new scanner instance with mobile-optimized settings
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: qrboxSize, height: qrboxSize },
        rememberLastUsedCamera: true,
        aspectRatio: 1,
        showTorchButtonIfSupported: true, // Show flashlight button if available
        showZoomSliderIfSupported: true, // Show zoom slider if available
        defaultZoomValueIfSupported: 2, // Default zoom for better scanning on mobile
      },
      false
    );

    scannerRef.current = scanner;

    const success = async (decodedText: string) => {
      // Stop scanning immediately to prevent multiple scans
      await scanner.pause();

      setScanning(true);
      setIsLoading(true);

      try {
        // Use the token from QR code to fetch student data
        const response = await axios.get(`/api/student/${decodedText}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.data;
        setUserData(data);

        // Vibrate on successful scan (for mobile devices)
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }

        // Clear scanner
        await scanner.clear();
        scannerRef.current = null;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Scanning failed, please try again";
        toast.error(errorMessage);
        setUserData(null);
        setError(errorMessage);

        // Clear scanner
        await scanner.clear();
        scannerRef.current = null;
      } finally {
        setScanning(false);
        setIsLoading(false);
      }
    };

    const error = (err: any) => {
      console.error("Scan error:", err);
    };

    scanner.render(success, error);

    // Add custom styles for mobile optimization after render
    setTimeout(() => {
      // Make camera selection more touch-friendly
      const selectElement = document.querySelector("#qr-reader select");
      if (selectElement) {
        (selectElement as HTMLElement).style.height = "40px";
        (selectElement as HTMLElement).style.fontSize = "16px";
        (selectElement as HTMLElement).style.padding = "8px";
      }

      // Make buttons more touch-friendly
      const buttons = document.querySelectorAll("#qr-reader button");
      buttons.forEach((button) => {
        (button as HTMLElement).style.minHeight = "44px";
        (button as HTMLElement).style.padding = "10px 15px";
        (button as HTMLElement).style.fontSize = "16px";
      });
    }, 500);
  };

  useEffect(() => {
    initScanner();

    // Handle window resize and orientation changes for responsive qrbox
    const handleResize = () => {
      if (scannerRef.current) {
        // Re-initialize scanner on significant size change
        initScanner();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((e) => console.error("Cleanup error:", e));
        scannerRef.current = null;
      }
    };
  }, []);

  const handleReset = () => {
    setUserData(null); // Clear result before resetting
    setError(null);
    setTimeout(() => {
      initScanner();
    }, 300); // Slight delay allows DOM to reset cleanly
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Mobile-optimized header - Sticky and compact */}
      <div className="sticky top-0 bg-white shadow-md z-10 p-3 flex items-center border-b border-gray-200">
        <button
          onClick={handleGoBack}
          className="mr-2 p-2 hover:bg-gray-100 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-blue-600" />
        </button>
        <h1 className="text-base font-semibold text-blue-800 flex items-center truncate">
          <QrCode className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0" />
          <span className="truncate">Student QR Search</span>
        </h1>
        <button
          onClick={handleReset}
          className="ml-auto flex items-center px-2 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Main Content with mobile padding adjustments */}
      <div className="p-3 flex-grow max-w-xl mx-auto w-full">
        {/* Scanner Card - Optimized for mobile */}
        {!userData && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <div className="p-3 bg-blue-700 text-white text-center">
              <p className="font-medium text-sm sm:text-base flex items-center justify-center">
                <Camera className="h-4 w-4 mr-2" />
                Scan Student QR Code
              </p>
            </div>

            <div className="p-3 sm:p-4" ref={scannerContainerRef}>
              <div
                id="qr-reader"
                className="overflow-hidden rounded-lg mx-auto"
                style={{ maxWidth: "100%" }}
              ></div>

              {scanning && (
                <div className="flex items-center justify-center mt-3 p-3 bg-blue-50 rounded-lg">
                  <Loader className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                  <p className="text-blue-600 font-medium text-sm">
                    Processing...
                  </p>
                </div>
              )}
            </div>

            {/* Mobile-optimized instructions */}
            <div className="p-3 bg-blue-50 text-gray-600 text-xs sm:text-sm border-t border-blue-100">
              <h3 className="font-medium text-gray-800 mb-1">
                Tips for scanning:
              </h3>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Ensure good lighting</li>
                <li>Hold camera steady</li>
                <li>Position QR code in frame</li>
              </ul>
            </div>
          </div>
        )}

        {/* Error Message - Compact for mobile */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-200 flex items-center text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* User Data Card - Mobile optimized */}
        {userData && (
          <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-md transition-all duration-300 ease-in-out">
            <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <User size={18} className="mr-2 text-blue-600 flex-shrink-0" />
              Student Information
            </h2>

            <div className="space-y-3">
              {/* Basic Information */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <h3 className="text-xs uppercase text-blue-700 font-medium mb-2">
                  Basic Details
                </h3>
                <InfoItem
                  label="ID Number"
                  value={userData.idNumber}
                  icon={<User size={14} />}
                />
              </div>

              {/* Status Cards - Single column on mobile, three columns on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {/* Check-in Card */}
                <StatusCard
                  title="Check-in"
                  icon={<User size={16} />}
                  isCompleted={userData.isCheckIn}
                  completedTime={
                    userData.checkInTime
                      ? formatDate(userData.checkInTime)
                      : null
                  }
                  completedBy={userData.checkInScannedBy?.email}
                />

                {/* Food Card */}
                <StatusCard
                  title="Food"
                  icon={<Utensils size={16} />}
                  isCompleted={userData.isTakenFood}
                  completedTime={
                    userData.foodTakenAt
                      ? formatDate(userData.foodTakenAt)
                      : null
                  }
                  completedBy={userData.foodScannedBy?.email}
                />

                {/* Ice Cream Card */}
                <StatusCard
                  title="Ice Cream"
                  icon={<IceCream size={16} />}
                  isCompleted={userData.isTakenIcecream}
                  completedTime={
                    userData.iceCreamTakenAt
                      ? formatDate(userData.iceCreamTakenAt)
                      : null
                  }
                  completedBy={userData.iceCreamScannedBy?.email}
                />
              </div>
            </div>

            {/* Action button - Mobile friendly with larger touch target */}
            <div className="mt-4">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Scan Another QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable info item component - Mobile optimized
const InfoItem = ({
  label,
  value,
  icon = null,
  noBorder = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  noBorder?: boolean;
}) => (
  <div
    className={`flex flex-col sm:flex-row sm:justify-between py-2 ${
      noBorder ? "" : "border-b border-blue-100"
    }`}
  >
    <span className="font-medium text-gray-700 flex items-center mb-1 sm:mb-0 text-sm">
      {icon && <span className="mr-2 text-blue-600">{icon}</span>}
      {label}
    </span>
    <span className="text-gray-800 break-all sm:text-right text-sm">
      {value}
    </span>
  </div>
);

// Enhanced status card component - Mobile optimized
const StatusCard = ({
  title,
  icon,
  isCompleted,
  completedTime,
  completedBy,
}: {
  title: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  completedTime: string | null;
  completedBy: string | null;
}) => {
  return (
    <div
      className={`p-3 rounded-xl ${
        isCompleted
          ? "bg-green-50 border border-green-200"
          : "bg-gray-50 border border-gray-200"
      } transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center text-gray-800 text-sm">
          <span
            className={`mr-2 ${
              isCompleted ? "text-green-600" : "text-gray-600"
            }`}
          >
            {icon}
          </span>
          {title}
        </h3>
        <span
          className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } flex items-center`}
        >
          {isCompleted ? (
            <>
              <Check size={12} className="mr-0.5" />
              Completed
            </>
          ) : (
            <>
              <X size={12} className="mr-0.5" />
              Pending
            </>
          )}
        </span>
      </div>

      {isCompleted ? (
        <div className="space-y-1 text-xs">
          {completedTime && (
            <div className="flex items-center text-gray-700">
              <Clock size={12} className="text-blue-500 mr-1 flex-shrink-0" />
              <div>
                <span className="font-medium mr-1">Time:</span>
                <span className="break-all">{completedTime}</span>
              </div>
            </div>
          )}

          {completedBy && (
            <div className="flex items-center text-gray-700">
              <User size={12} className="text-blue-500 mr-1 flex-shrink-0" />
              <div>
                <span className="font-medium mr-1">By:</span>
                <span className="break-all">{completedBy}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-gray-500 italic">No data available</div>
      )}
    </div>
  );
};

export default StudentSearch;
