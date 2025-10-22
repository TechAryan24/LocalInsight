import React, { useState } from "react";
import { db } from "../config/firebase"; // 1. Import your Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // 2. Import Firestore functions
import { useAuth } from "../context/auth"; // 3. Import useAuth to get the user

const Form = () => {
  const initialState = {
    businessName: "",
    category: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    targetCustomers: [],
    location: "",
  };

  const [formData, setFormData] = useState(initialState);
  // 4. Add state for loading and feedback messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { currentUser } = useAuth(); // Get the logged-in user from your context

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      if (checked) {
        return { ...prevData, targetCustomers: [...prevData.targetCustomers, value] };
      } else {
        return { ...prevData, targetCustomers: prevData.targetCustomers.filter((item) => item !== value) };
      }
    });
  };

  // 5. Update handleSubmit to be an async function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if a user is logged in
    if (!currentUser) {
        setError("You must be logged in to submit this form.");
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 6. Add the form data to a "businesses" collection in Firestore
      const docRef = await addDoc(collection(db, "businesses"), {
        ...formData,
        ownerId: currentUser.uid, // Tag the data with the user's ID
        createdAt: serverTimestamp(), // Add a server-side timestamp
      });

      console.log("Document written with ID: ", docRef.id);
      setSuccess("Form submitted successfully!");
      setFormData(initialState); // Reset form on success
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to submit form. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Business Form
        </h2>

        {/* --- Feedback Messages --- */}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{success}</p>}

        {/* Business Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter business name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        {/* Business Category */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Business Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            required
          >
            <option value="">-- Select Category --</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food & Beverages</option>
            <option value="electronics">Electronics</option>
            <option value="healthcare">Healthcare</option>
            <option value="grocery">Grocery</option>
            <option value="fitness">Fitness/Wellness</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Business Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Business Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about your business idea or what you want to sell."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            rows="4"
            required
          />
        </div>

        {/* Market & Pricing */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Expected Price Range (₹)</label>
          <div className="flex space-x-4">
            <input
              type="number"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleChange}
              placeholder="Min ₹"
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
            <input
              type="number"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleChange}
              placeholder="Max ₹"
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Target Customer Type */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Target Customer Type</label>
          <div className="space-y-2">
            {["Students / Youth", "Families", "Professionals", "Tourists"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleCheckboxChange}
                  checked={formData.targetCustomers.includes(type)}
                  className="h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Location */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Preferred Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter preferred location"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-red-300"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Form;
