import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { setCredentials } from "../store/slices/authSlice";
import { LogIn } from "lucide-react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await axios.post("/api/auth/signin", {
        email: email,
        password: password,
      });

      const data = response.data;
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success("Login successful!");
      navigate(-1);
    } catch (error: any) {
      
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-8">
          <LogIn className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold ml-2">Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;
