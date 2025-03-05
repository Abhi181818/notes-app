"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Mic, X, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "react-hot-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VoiceTranscription = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [recognition, setRecognition] = useState(null);
  const { user } = useAuth();
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  // Create speech recognition instance
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setTranscription(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Speech recognition error occurred");
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error("Speech recognition not supported in this browser");
    }
  }, []);

  // Start listening
  const handleStartListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        setTranscription("");
        setGeneratedTitle("");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Failed to start speech recognition");
      }
    }
  }, [recognition]);

  // Cancel listening
  const handleCancel = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setTranscription("");
      setGeneratedTitle("");
    }
  }, [recognition]);

  // Generate title using Gemini AI
  const handleGetTitle = useCallback(async () => {
    if (!transcription.trim()) {
      toast.error("No transcription available");
      return null;
    }

    setIsGeneratingTitle(true);
    try {
      // Ensure API key is available
      const apiKey = "AIzaSyCK-WnkK3bSENw3bLAcefhH3Hv4Uj7vQwA";
      if (!apiKey) {
        throw new Error("Gemini API key is not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Changed to gemini-pro
      const prompt = `Generate a concise 2-3 word title that captures the essence of this text: "${transcription}"`;

      console.log("Generating title with prompt:", prompt); // Debugging log

      const result = await model.generateContent(prompt);
      const title = result.response.text().trim();

      console.log("Generated title:", title); // Debugging log

      setGeneratedTitle(title);
      return title;
    } catch (error) {
      console.error("Detailed error generating title:", error);

      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          toast.error(
            "Gemini API key is missing. Please check your configuration."
          );
        } else if (error.message.includes("fetch")) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(`Failed to generate title: ${error.message}`);
        }
      } else {
        toast.error("An unexpected error occurred while generating title");
      }

      return null;
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [transcription]);

  // Confirm and save note
  const handleConfirm = useCallback(async () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);

      // Validate transcription
      if (!transcription.trim()) {
        toast.error("No transcription available");
        return;
      }

      try {
        // Generate title if not already generated
        const titleToUse =
          generatedTitle || (await handleGetTitle()) || "Untitled Note";

        const newNote = {
          userId: user?.uid,
          title: titleToUse,
          content: transcription,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isBookMarked: false,
        };

        // Add note to Firestore
        const docRef = await addDoc(collection(db, "notes"), newNote);

        // Reset states
        setTranscription("");
        setGeneratedTitle("");

        // Show success toast
        toast.success("New note created successfully");
      } catch (error) {
        console.error("Error creating note:", error);
        toast.error("Failed to create note");
      }
    }
  }, [recognition, transcription, generatedTitle, user, handleGetTitle]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      {/* Transcription Display */}
      <div className="w-full mb-4 p-3 border rounded-lg min-h-[150px] bg-gray-50">
        <p
          className={`text-gray-600 ${transcription ? "text-black" : "italic"}`}
        >
          {transcription || "Transcription will appear here..."}
        </p>
      </div>

      {/* Generated Title Display */}
      {generatedTitle && (
        <div className="w-full mb-4 p-2 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-700 font-semibold">
            Generated Title: {generatedTitle}
          </p>
        </div>
      )}

      {/* Voice Button Interface */}
      <div className="flex items-center justify-center">
        {!isListening ? (
          <button
            onClick={handleStartListening}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"
            disabled={isGeneratingTitle}
          >
            <Mic size={24} />
          </button>
        ) : (
          <div className="flex space-x-4 items-center">
            {/* Cancel Button */}
            <div className="relative animate-fadeIn">
              <div className="absolute -inset-2 rounded-full bg-red-400 opacity-75 animate-pulse" />
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg relative z-10 transition-transform hover:scale-110 active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg animate-fadeIn transition-transform hover:scale-110 active:scale-90"
              disabled={isGeneratingTitle || !transcription.trim()}
            >
              <Check size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Error Handling */}
      {!recognition && (
        <div className="mt-4 text-red-500 text-sm">
          Speech recognition is not supported in this browser.
        </div>
      )}
    </div>
  );
};

export default VoiceTranscription;
