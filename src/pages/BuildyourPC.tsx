/* BuildYourPC.jsx */
import React, { useState, useEffect } from 'react';
import { AiOutlineDesktop } from 'react-icons/ai';
import emailjs from '@emailjs/browser';

/**
 * Pull your IDs from environment variables
 * (rename to REACT_APP_* if you’re on CRA).
 */
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;   // e.g. 'service_123abc'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;  // e.g. 'template_buildpc'
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;   // e.g. 'g8HJK‑abcd12'

const BuildYourPC = () => {
  const fields = [
    { name: 'processor',     label: 'Processor' },
    { name: 'graphics_card', label: 'Graphics Card' },
    { name: 'ram',           label: 'RAM' },
    { name: 'storage',       label: 'Storage' },
    { name: 'cooling',       label: 'Cooling System' },
    { name: 'case_style',    label: 'Case Style' },
    { name: 'monitor',       label: 'Monitor' },
    { name: 'rgb_lights',    label: 'RGB Lights' },
    { name: 'mouse',         label: 'Mouse' },
    { name: 'keyboard',      label: 'Keyboard' },
    { name: 'headset',       label: 'Headset' },
    { name: 'speakers',      label: 'Speakers' },
    { name: 'power_supply',  label: 'Power Supply' },
    { name: 'os',            label: 'Operating System' },
  ];

  const [formData, setFormData] = useState({});
  const [sending, setSending]  = useState(false);

  /* Initialise the SDK once (optional but tidy) */
  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      /* 1️⃣  Send the e‑mail */
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData);

      /* 2️⃣  UX feedback */
      alert('✅ Build sent! Check your inbox.');
      setFormData({});               // clear state
      e.target.reset();              // clear inputs
    } catch (err) {
      console.error(err);
      alert('❌ Oops – could not send. Try again.');
    } finally {
      setSending(false);
    }
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
            {fields.map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1 text-purple-300">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}           /* MUST match EmailJS template variable */
                  onChange={handleChange}
                  className="w-full bg-[#2b2a3d] text-white border border-purple-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 animate-glow"
                  placeholder={`Enter ${label}`}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={sending}
              className="mt-6 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Submit Build 🚀'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuildYourPC;
