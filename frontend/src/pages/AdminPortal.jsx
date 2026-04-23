import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AdminPortal = () => {
  const initialFormState = {
    date: '',
    time: '',
    location: '',
    severity: 'minor',
    strayAnimalsInvolved: false,
    weatherConditions: 'clear',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (formData.date > today) {
      newErrors.date = 'Date cannot be in the future';
    }

    if (!formData.time) newErrors.time = 'Time is required';

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 5) {
      newErrors.location = 'Location must be at least 5 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Connect to Avinash's endpoint
      await axios.post('/api/v1/accidents', formData);
      
      setStatus({ type: 'success', message: 'Accident report successfully submitted!' });
      setFormData(initialFormState); // Reset form
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to submit report. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">New Accident Report</h2>
        <p className="text-gray-600 mt-2">Enter the details of the incident below to ingest data into the system.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-lg mb-6 flex items-center space-x-3 ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.date ? 'text-red-600' : 'text-gray-700'}`}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.time ? 'text-red-600' : 'text-gray-700'}`}>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.time ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${errors.location ? 'text-red-600' : 'text-gray-700'}`}>Location</label>
              <input
                type="text"
                name="location"
                placeholder="E.g., Intersection of MG Road and Brigade Road"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Severity Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="minor">Minor (No injuries)</option>
                <option value="moderate">Moderate (Minor injuries, vehicle damage)</option>
                <option value="severe">Severe (Major injuries/fatalities)</option>
              </select>
            </div>

            {/* Weather Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
              <select
                name="weatherConditions"
                value={formData.weatherConditions}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="clear">Clear</option>
                <option value="rain">Rain</option>
                <option value="fog">Fog</option>
                <option value="snow">Snow/Ice</option>
              </select>
            </div>

            {/* Stray Animals Checkbox */}
            <div className="md:col-span-2 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="strayAnimalsInvolved"
                name="strayAnimalsInvolved"
                checked={formData.strayAnimalsInvolved}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="strayAnimalsInvolved" className="text-sm font-medium text-gray-700 cursor-pointer">
                Stray Animals Involved (Check if yes)
              </label>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description & Details</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Provide details about the incident scene..."
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPortal;
