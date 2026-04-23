import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../services/apiClient';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
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
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Submitting accident report...');

    try {
      // Connect using dedicated API Service instead of raw Axios endpoint
      await apiClient.post('/accidents', formData);
      
      toast.success('Accident report successfully submitted!', { id: loadingToastId });
      setFormData(initialFormState); // Reset form
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.parsedMessage || 'Failed to submit report. Please try again.', { id: loadingToastId });
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="date"
                value={formData.date}
                disabled={isSubmitting}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Time <span className="text-red-500">*</span>
              </label>
              <input 
                type="time" 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="time"
                value={formData.time}
                disabled={isSubmitting}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-slate-700">
              Location <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter precise location"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              name="location"
              value={formData.location}
              disabled={isSubmitting}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <select 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="severity"
                value={formData.severity}
                disabled={isSubmitting}
                onChange={handleChange}
              >
                <option value="Minor">Minor</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Accident Type <span className="text-red-500">*</span>
              </label>
              <select 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="type"
                value={formData.type}
                disabled={isSubmitting}
                onChange={handleChange}
              >
                <option value="Collision">Collision</option>
                <option value="Rollover">Rollover</option>
                <option value="Pedestrian">Pedestrian</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Vehicles Involved
              </label>
              <input 
                type="number" 
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="vehicles"
                value={formData.vehicles}
                disabled={isSubmitting}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Weather Conditions
              </label>
              <select 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="weather"
                value={formData.weather}
                disabled={isSubmitting}
                onChange={handleChange}
              >
                <option value="Clear">Clear</option>
                <option value="Rain">Rain</option>
                <option value="Snow">Snow</option>
                <option value="Fog">Fog</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className={`rounded text-blue-500 focus:ring-blue-500 w-4 h-4 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="injuries"
                checked={formData.injuries}
                disabled={isSubmitting}
                onChange={handleChange}
              />
              <span className="text-sm font-medium text-slate-700">Includes reported injuries</span>
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
              disabled={isSubmitting}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.description ? 'border-red-500' : 'border-gray-300'} ${isSubmitting ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
