import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    targetCustomers: [],
    location: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Business Form Submitted:", formData);
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
          <p className="text-sm text-gray-500 mt-1">
            Example: ₹500 – ₹2000
          </p>
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
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
