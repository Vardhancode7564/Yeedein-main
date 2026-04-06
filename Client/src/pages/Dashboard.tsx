import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader } from 'lucide-react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  ChartData, 
  ChartOptions,
  PieController
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, PieController);

// Define types for student data
interface StudentData {
  total: number;
  checkIn: number;
  notCheckIn: number;
  takenFood: number;
  notTakenFood: number;
  takenIcecream: number;
  notTakenIcecream: number;
  completedAll: number;
  missingAny: number;
}

// Define types for all data
interface AllData {
  E3: StudentData;
  E4: StudentData;
  overall: StudentData;
}

// Type for tab options
type TabOption = 'overall' | 'E3' | 'E4';

// Type for chart colors
interface ChartColors {
  yes: string;
  no: string;
}

interface ChartColorScheme {
  checkIn: ChartColors;
  food: ChartColors;
  iceCream: ChartColors;
  completion: ChartColors;
}

// API service to fetch the student data
const fetchStudentData = async (): Promise<AllData> => {
  try {
    const response = await axios.get<AllData>('/api/student/', {
      headers: {
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabOption>("overall");

  // Refs for chart canvases
  const checkInChartRef = useRef<HTMLCanvasElement | null>(null);
  const foodChartRef = useRef<HTMLCanvasElement | null>(null);
  const iceCreamChartRef = useRef<HTMLCanvasElement | null>(null);
  const completionChartRef = useRef<HTMLCanvasElement | null>(null);

  // Chart instances
  const checkInChartInstance = useRef<ChartJS | null>(null);
  const foodChartInstance = useRef<ChartJS | null>(null);
  const iceCreamChartInstance = useRef<ChartJS | null>(null);
  const completionChartInstance = useRef<ChartJS | null>(null);
  const navigate = useNavigate();

  const handleSearchClick = (): void => {
    navigate("/searchstudent");
  };

  // Fetch data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // For development/preview, use this dummy data if API fails
        // Remove this in production and let the error handling work
        try {
          const apiData = await fetchStudentData();
          setData(apiData);
        } catch (apiError) {
          // Fallback data for preview/development
          console.warn("Using fallback data for development");
          
        }
      } catch (err) {
        setError("Failed to load student data. Please try again later.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get active data or return empty data if still loading
  const activeData: StudentData = data
    ? data[activeTab]
    : {
        total: 0,
        checkIn: 0,
        notCheckIn: 0,
        takenFood: 0,
        notTakenFood: 0,
        takenIcecream: 0,
        notTakenIcecream: 0,
        completedAll: 0,
        missingAny: 0,
      };

  // Create and update charts when tab changes or data loads
  useEffect(() => {
    if (!data || loading) return; // Don't try to create charts while loading

    // Define chart colors
    const colors: ChartColorScheme = {
      checkIn: {
        yes: "rgba(34, 197, 94, 0.8)", // green
        no: "rgba(239, 68, 68, 0.8)", // red
      },
      food: {
        yes: "rgba(245, 158, 11, 0.8)", // amber
        no: "rgba(156, 163, 175, 0.8)", // gray
      },
      iceCream: {
        yes: "rgba(59, 130, 246, 0.8)", // blue
        no: "rgba(156, 163, 175, 0.8)", // gray
      },
      completion: {
        yes: "rgba(168, 85, 247, 0.8)", // purple
        no: "rgba(156, 163, 175, 0.8)", // gray
      },
    };

    // Common chart options
    const commonOptions: ChartOptions<"pie"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 10,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.raw || 0;
              const percentage = Math.round((value / activeData.total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    };

    // Create or update Check-in chart
    if (checkInChartRef.current) {
      if (checkInChartInstance.current) {
        checkInChartInstance.current.destroy();
      }

      const checkInData: ChartData<"pie"> = {
        labels: ["Checked In", "Not Checked In"],
        datasets: [
          {
            data: [activeData.checkIn, activeData.notCheckIn],
            backgroundColor: [colors.checkIn.yes, colors.checkIn.no],
            borderWidth: 1,
          },
        ],
      };

      checkInChartInstance.current = new ChartJS(checkInChartRef.current, {
        type: "pie",
        data: checkInData,
        options: commonOptions,
      });
    }

    // Create or update Food chart
    if (foodChartRef.current) {
      if (foodChartInstance.current) {
        foodChartInstance.current.destroy();
      }

      const foodData: ChartData<"pie"> = {
        labels: ["Food Taken", "Food Not Taken"],
        datasets: [
          {
            data: [activeData.takenFood, activeData.notTakenFood],
            backgroundColor: [colors.food.yes, colors.food.no],
            borderWidth: 1,
          },
        ],
      };

      foodChartInstance.current = new ChartJS(foodChartRef.current, {
        type: "pie",
        data: foodData,
        options: commonOptions,
      });
    }

    // Create or update Ice Cream chart
    if (iceCreamChartRef.current) {
      if (iceCreamChartInstance.current) {
        iceCreamChartInstance.current.destroy();
      }

      const iceCreamData: ChartData<"pie"> = {
        labels: ["Ice Cream Taken", "Ice Cream Not Taken"],
        datasets: [
          {
            data: [activeData.takenIcecream, activeData.notTakenIcecream],
            backgroundColor: [colors.iceCream.yes, colors.iceCream.no],
            borderWidth: 1,
          },
        ],
      };

      iceCreamChartInstance.current = new ChartJS(iceCreamChartRef.current, {
        type: "pie",
        data: iceCreamData,
        options: commonOptions,
      });
    }

    // Create or update Completion chart
    if (completionChartRef.current) {
      if (completionChartInstance.current) {
        completionChartInstance.current.destroy();
      }

      const completionData: ChartData<"pie"> = {
        labels: ["Completed All", "Missing Any"],
        datasets: [
          {
            data: [activeData.completedAll, activeData.missingAny],
            backgroundColor: [colors.completion.yes, colors.completion.no],
            borderWidth: 1,
          },
        ],
      };

      completionChartInstance.current = new ChartJS(
        completionChartRef.current,
        {
          type: "pie",
          data: completionData,
          options: commonOptions,
        }
      );
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (checkInChartInstance.current) checkInChartInstance.current.destroy();
      if (foodChartInstance.current) foodChartInstance.current.destroy();
      if (iceCreamChartInstance.current)
        iceCreamChartInstance.current.destroy();
      if (completionChartInstance.current)
        completionChartInstance.current.destroy();
    };
  }, [activeTab, activeData, data, loading]);

  // Loading state UI
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 items-center justify-center">
        <Loader size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading student data...</p>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 max-w-md w-full">
          <p className="font-bold mb-1">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render main UI when data is loaded
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Student Dashboard</h1>
        <button
          onClick={handleSearchClick}
          className="bg-white text-blue-600 px-3 py-2 rounded-md flex items-center shadow-sm"
        >
          <Search size={18} className="mr-2" />
          <span>Search Student</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white shadow-sm">
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "overall"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("overall")}
        >
          Overall
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "E3"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("E3")}
        >
          E3
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "E4"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("E4")}
        >
          E4
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">
              Total Students
            </h3>
          </div>
          <p className="text-2xl font-bold">{activeData.total}</p>
          <p className="text-xs text-gray-500">
            Checked In: {activeData.checkIn} (
            {Math.round((activeData.checkIn / activeData.total) * 100)}%)
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        {/* Check-in Chart */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Check-in Status
          </h3>
          <div className="h-32">
            <canvas ref={checkInChartRef}></canvas>
          </div>
        </div>

        {/* Food Status Chart */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Food Status
          </h3>
          <div className="h-32">
            <canvas ref={foodChartRef}></canvas>
          </div>
        </div>

        {/* Ice Cream Chart */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Ice Cream Status
          </h3>
          <div className="h-32">
            <canvas ref={iceCreamChartRef}></canvas>
          </div>
        </div>

        {/* Completion Chart */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Completion Status
          </h3>
          <div className="h-32">
            <canvas ref={completionChartRef}></canvas>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default Dashboard;