"use client";
import React, { useState } from "react";
import { Mic, X, Check } from "lucide-react";

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);

  const handleStartListening = () => {
    setIsListening(true);
  };

  const handleCancel = () => {
    setIsListening(false);
  };

  const handleConfirm = () => {
    setIsListening(false);
  };

  return (
    <div className="flex items-center justify-center p-4">
      {!isListening ? (
        <button
          onClick={handleStartListening}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"
        >
          <Mic size={24} />
        </button>
      ) : (
        <div className="flex space-x-4 items-center">
          <div className="relative animate-fadeIn">
            {/* Pulsing circle animation */}
            <div className="absolute -inset-2 rounded-full bg-red-400 opacity-75 animate-pulse" />
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg relative z-10 transition-transform hover:scale-110 active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* <button
            onClick={handleConfirm}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg animate-fadeIn transition-transform hover:scale-110 active:scale-90"
          >
            <Check size={24} />
          </button> */}
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
