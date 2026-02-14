import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CityDataForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_category: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false); // ✅ new state for loading

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ show loading screen

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict_city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Frontend Prediction:", data);
        navigate("/dashboard", { state: { locations: [data] } });
      } else {
        alert(`Prediction failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch prediction. Please check the backend connection.");
    } finally {
      setLoading(false); // ✅ hide loading screen
    }
  };

  const cities = [
    "Ahmednagar", "Achalpur", "Akola", "Ambarnath", "Amravati", "Badlapur",
    "Barshi", "Beed", "Bhiwandi-Nizampur", "Bhusawal", "Chandrapur",
    "Chattrapati Sambhaji Nagar", "Dhule", "Gondia", "Hinganghat",
    "Ichalkaranji", "Jalgaon", "Jalna", "Kalyan-Dombivli", "Kolhapur",
    "Latur", "Malegaon", "Mira-Bhayandar", "Mumbai", "Nagpur",
    "Nanded-Waghala", "Nandurbar", "Nashik", "Navi Mumbai", "Osmanabad",
    "Panvel", "Parbhani", "Pimpri-Chinchwad", "Pune", "Sangli", "Satara",
    "Solapur", "Thane", "Udgir", "Ulhasnagar", "Vasai-Virar", "Wardha",
    "Yavatmal",
  ];

  return (
    <>
      {/* ✅ Fullscreen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full"
          />
          <p className="mt-6 text-cyan-300 text-lg font-medium">
            Evaluating city data...
          </p>
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full bg-transparent rounded-xl max-w-lg mx-auto mt-10"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Evaluate City for Business
        </h2>

        {/* Business Category Dropdown */}
        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="business_category"
            value={formData.business_category}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#0f1535]/90 backdrop-blur-md border-none 
                       text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 
                       focus:ring-cyan-400 cursor-pointer transition-all duration-200"
          >
            <option value="" className="bg-[#0f1535] text-cyan-300">
              Select Business Category
            </option>
            <option value="bakery" className="bg-[#11193f] text-cyan-200">
              Bakery
            </option>
            <option value="cafe" className="bg-[#11193f] text-cyan-200">
              Cafe
            </option>
            <option value="shoes" className="bg-[#11193f] text-cyan-200">
              Shoes
            </option>
            <option value="watch" className="bg-[#11193f] text-cyan-200">
              Watch
            </option>
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
            ▼
          </div>
        </div>

        {/* City Dropdown */}
        <div className="relative mb-8 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#0f1535]/90 backdrop-blur-md border-none 
                       text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 
                       focus:ring-cyan-400 cursor-pointer transition-all duration-200"
          >
            <option value="" className="bg-[#0f1535] text-cyan-300">
              Select City
            </option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-[#11193f] text-cyan-200">
                {city}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
            ▼
          </div>
        </div>

        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#0f1535]/90 backdrop-blur-md border-none 
                       text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 
                       focus:ring-cyan-400 cursor-pointer transition-all duration-200"
          >
            <option value="" className="bg-[#0f1535] text-cyan-300">
             Pincode
            </option>
            <option value="400082" className="bg-[#11193f] text-cyan-200">
              400082
            </option>
            <option value="421201" className="bg-[#11193f] text-cyan-200">
              421201
            </option>
            <option value="421306" className="bg-[#11193f] text-cyan-200">
              421306
            </option>
            <option value="412503" className="bg-[#11193f] text-cyan-200">
              412503
            </option>
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
            ▼
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(34,211,238,0.9)",
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 font-semibold text-gray-900 rounded-lg bg-gradient-to-r 
          from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 
          transition-all duration-300 shadow-lg shadow-cyan-500/30"
        >
          Evaluate City
        </motion.button>
      </motion.form>
    </>
  );
};

export default CityDataForm;
