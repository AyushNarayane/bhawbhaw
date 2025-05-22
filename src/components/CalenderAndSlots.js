import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CalendarAndSlot = ({ nextStep, prevStep, handleFormDataChange }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState({});
  const [minDate, setMinDate] = useState('');

  // Set minimum date to today when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    setMinDate(formattedDate);
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for proper comparison
    
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(0, 0, 0, 0);
    
    if (selectedDateTime < today) {
      setErrors({...errors, date: 'Cannot select a past date'});
      toast.error('Cannot book a date in the past');
      return;
    }
    
    setErrors({...errors, date: ''});
    setDate(selectedDate);
  };

  const handleNextStep = () => {
    const newErrors = {};

    if (!date) newErrors.date = 'Please select a date';
    if (!timeSlot) newErrors.timeSlot = 'Please select a time slot';
    if (!duration) newErrors.duration = 'Please select a duration';

    // Additional check for past dates
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Cannot select a past date';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleFormDataChange({date, timeSlot, duration});
      nextStep();
    }
  };

  // const availableDates = ["2025-02-01", "2025-02-03", "2025-02-05"];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          min={minDate} // Prevent selecting dates before today
          className={`w-full p-2 border text-black rounded mt-1 ${errors.date ? 'border-red-600' : 'border-gray-300'}`}
        />
        {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Time Slot</label>
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className={`w-full p-2 border text-black rounded mt-1 ${errors.timeSlot ? 'border-red-600' : 'border-gray-300'}`}
        >
          <option value="">Choose</option>
          <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
          <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
        </select>
        {errors.timeSlot && <span className="text-red-500 text-sm">{errors.timeSlot}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className={`w-full p-2 border text-black rounded mt-1 ${errors.duration ? 'border-red-600' : 'border-gray-300'}`}
        >
          <option value="">Choose</option>
          <option value="30 minutes">30 minutes</option>
          <option value="1 hour">1 hour</option>
        </select>
        {errors.duration && <span className="text-red-500 text-sm">{errors.duration}</span>}
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="border border-pink-500 text-pink-500 px-4 py-2 rounded"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded"
          onClick={handleNextStep}
        >
          Confirm Slot
        </button>
      </div>
    </div>
  );
};

export default CalendarAndSlot;
