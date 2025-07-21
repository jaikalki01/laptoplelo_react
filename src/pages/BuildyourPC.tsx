import React, { useState } from 'react';
import { AiOutlineDesktop } from 'react-icons/ai';
import { BASE_URL } from "@/routes";
const BuildYourPC = () => {
  const fields = [
    { name: 'processor', label: 'Processor' },
    { name: 'graphics_card', label: 'Graphics Card' },
    { name: 'ram', label: 'RAM' },
    { name: 'storage', label: 'Storage' },
    { name: 'cooling', label: 'Cooling System' },
    { name: 'case_style', label: 'Case Style' },
    { name: 'monitor', label: 'Monitor' },
    { name: 'rgb_lights', label: 'RGB Lights' },
    { name: 'mouse', label: 'Mouse' },
    { name: 'keyboard', label: 'Keyboard' },
    { name: 'headset', label: 'Headset' },
    { name: 'speakers', label: 'Speakers' },
    { name: 'power_supply', label: 'Power Supply' },
    { name: 'os', label: 'Operating System' },
  ];

  const [formData, setFormData] = useState({});
  const [modal, setModal] = useState({ isOpen: false, message: '', isError: false });
const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${BASE_URL}/api/pcbuilds/`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setModal({
        isOpen: true,
        message: 'Build submitted successfully!',
        isError: false,
      });
      setFormData({}); // Reset form
    } else {
      const errorData = await response.json();
      console.error('Error details:', errorData); // Log FastAPI error
      setModal({
        isOpen: true,
        message: 'Failed to submit build.',
        isError: true,
      });
    }
  } catch (err) {
    console.error('Error:', err);
    setModal({
      isOpen: true,
      message: 'Error submitting build.',
      isError: true,
    });
  }
};


  const closeModal = () => {
    setModal({ isOpen: false, message: '', isError: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f3a] to-black flex items-center justify-center p-6">
      <div className="relative w-full max-w-2xl rounded-xl p-8 bg-[#1c1c2e] overflow-hidden z-10 
        border-purple-900/40 shadow-[0_10px_40px_rgba(0,0,0,0.8),_0_4px_12px_rgba(128,0,255,0.3)] 
        backdrop-blur-sm transition duration-300">

        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-xl opacity-70 animate-rgb-glow z-0"></div>

        <div className="relative z-10 text-white">
          <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide uppercase flex items-center justify-center space-x-3">
            <AiOutlineDesktop className="text-4xl" />
            <span>Build Your Gaming Beast</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-semibold mb-1 text-purple-300">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full bg-[#2b2a3d] text-white border border-purple-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 animate-glow"
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}

            <button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
            >
              Submit Build 🚀
            </button>
          </form>
        </div>
      </div>

      {/* Modal Dialog */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1c2e] rounded-lg p-6 max-w-sm w-full text-white shadow-lg border border-purple-600">
            <h3 className={`text-lg font-bold mb-4 ${modal.isError ? 'text-red-400' : 'text-green-400'}`}>
              {modal.isError ? 'Error' : 'Success'}
            </h3>
            <p className="mb-6">{modal.message}</p>
            <button
              onClick={closeModal}
              className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildYourPC;