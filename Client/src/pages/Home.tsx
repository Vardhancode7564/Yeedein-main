import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  QrCode,
  BarChart3,
  IceCream,
  LogOut,
  LogIn,
  Utensils,
  Shield,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const Home: React.FC = () => {
  const user = useSelector((store: RootState) => store.auth.user);
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {

      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user, dispatch]);
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isLoggedIn) {
      dispatch(logout());
      toast.success("Logged out successfully");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Header with Auth Button */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.png" className="w-7 h-7 text-indigo-600 mr-2" />
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800">
            Yaadein
          </h1>
        </div>
        <button
          onClick={handleAuthAction}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all text-sm"
        >
          {isLoggedIn ? (
            <>
              <LogOut className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-600">Logout</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-600">Sign In</span>
            </>
          )}
        </button>
      </header>

      <div className="text-center mb-2">
        <p className="text-gray-600 text-sm">Food Token Management System</p>
      </div>

      {/* Main Content */}
      <main className="flex flex-col flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-indigo-600 p-5 text-white text-center">
            <h2 className="text-xl font-semibold">Welcome to Yaadein</h2>
            <p className="text-indigo-100 mt-1 text-sm">
              Select an option to continue
            </p>
          </div>

          {/* Card Content - Scanner Options */}
          <div className="p-5 space-y-4">
            {user && (
              <>
                {(user.category === "Admin" || user.category === "CheckIn") && (
                  <Link to="/checkin" className="block w-full">
                    <button className="flex items-center justify-between w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                      <span className="font-medium">Scan Food</span>
                      <QrCode className="w-5 h-5" />
                    </button>
                  </Link>
                )}

                {(user.category === "Admin" || user.category === "Food") && (
                  <Link to="/scanfood" className="block w-full">
                    <button className="flex items-center justify-between w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                      <span className="font-medium">Scan Pan</span>
                      <Utensils className="w-5 h-5" />
                    </button>
                  </Link>
                )}

                {(user.category === "Admin" ||user.category === "IceCream") && (
                  <Link to="/scanicecream" className="block w-full">
                    <button className="flex items-center justify-between w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                      <span className="font-medium">Scan Ice Cream</span>
                      <IceCream className="w-5 h-5" />
                    </button>
                  </Link>
                )}
              </>
            )}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {user && user.category === "Admin" && (
              <Link to="/adminDashBoard" className="block w-full">
                <button className="flex items-center justify-between w-full p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md">
                  <span className="font-medium">Admin DashBoard</span>
                  <Shield className="w-5 h-5" />
                </button>
              </Link>
            )}

            <Link to="/dashboard" className="block w-full">
              <button className="flex items-center justify-between w-full p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md">
                <span className="font-medium">View Dashboard</span>
                <BarChart3 className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Info Cards - Mobile Optimized Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-5">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-blue-600 text-base font-semibold mb-1">
              Scanner
            </div>
            <p className="text-gray-600 text-sm">
              Scan QR codes to validate food tokens
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-indigo-600 text-base font-semibold mb-1">
              Dashboard
            </div>
            <p className="text-gray-600 text-sm">
              View statistics and manage tokens
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Yaadein Food Token System</p>
      </footer>
    </div>
  );
};

export default Home;
