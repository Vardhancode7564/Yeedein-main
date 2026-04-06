import React, { useState } from "react";
import { Home, Users, User, QrCode, Menu } from "lucide-react";
import { Link } from "react-router-dom";

// Define types
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const AdminDashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Features list
  const features: Feature[] = [
    {
      id: "1",
      title: "Add Students",
      description: "Register new students and generate QR codes",
      icon: <Users size={24} />,
      path: "/add-student",
    },
    {
      id: "2",
      title: "Add Verifiers",
      description: "Register new verifiers to the system",
      icon: <User size={24} />,
      path: "/add-verifier",
    },
    {
      id: "3",
      title: "Generate QR Codes",
      description: "Generate QR codes for existing students",
      icon: <QrCode size={24} />,
      path: "/generate-qr",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-start items-center shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        
        
      </header>

    

      {/* Main Content */}
      <main className="p-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Welcome, Admin</h2>
          <p className="text-gray-600">
            Manage students, verifiers, and QR codes from your dashboard
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.path}
              className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>

       
      </main>
    </div>
  );
};

export default AdminDashboard;
