import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../services/apiClient';
import { CheckCircle2, AlertCircle, Calendar, Clock, MapPin, AlertTriangle, Activity, Car, Cloud, FileText, Send, ShieldAlert, Loader2 } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 py-8 lg:py-10 animate-fade-in">
      {/* Header Section */}
      <div className="mb-10 flex items-center gap-5">
        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Accident Report Portal</h2>
          <p className="text-slate-500 mt-1 font-medium text-lg">Securely log critical incident data.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Context Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/80 px-8 py-5">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" /> 
              Time & Location
            </h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'} ${errors.date ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200'}`}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Time <span className="text-red-500">*</span></label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'} border-slate-200`}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Exact Location <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter precise location coordinates or address..."
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'} border-slate-200`}
              />
            </div>
          </div>
        </div>

        {/* Severity & Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/80 px-8 py-5">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> 
              Incident Parameters
            </h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Severity Level <span className="text-red-500">*</span></label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'} border-slate-200`}
                >
                  <option value="Minor">Minor</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Accident Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'} border-slate-200`}
                >
                  <option value="Collision">Collision</option>
                  <option value="Rollover">Rollover</option>
                  <option value="Pedestrian">Pedestrian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Vehicles Involved</label>
              <input 
                type="number" 
                min="1"
                name="vehicles"
                value={formData.vehicles}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'} border-slate-200`}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Weather Conditions</label>
              <div className="relative">
                <Cloud className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'} border-slate-200`}
                >
                  <option value="Clear">Clear</option>
                  <option value="Rain">Rain</option>
                  <option value="Snow">Snow</option>
                  <option value="Fog">Fog</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/80 px-8 py-5">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> 
              Detailed Narrative
            </h3>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              <textarea
                name="description"
                rows="5"
                placeholder="Provide a comprehensive narrative of the incident..."
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full p-4 border rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-y ${errors.description ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200'} ${isSubmitting ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white hover:border-slate-300'}`}
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm font-medium flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.description}</p>}
            </div>

            <div className="mt-6 flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
              <input 
                type="checkbox" 
                id="injuries"
                name="injuries"
                checked={formData.injuries}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              />
              <label htmlFor="injuries" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                Flag as resulting in physical injuries
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative group overflow-hidden px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-600/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                Submit Report to Database
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPortal;
