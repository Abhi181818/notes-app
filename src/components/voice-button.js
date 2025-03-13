"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Mic, X, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "react-hot-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useTheme } from "@/hooks/theme";

const VoiceTranscription = ({ updateNotes }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [recognition, setRecognition] = useState(null);
  const { user } = useAuth();
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility

  const { isDark } = useTheme();

  // Create speech recognition instance
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionNew = new SpeechRecognition();

      recognitionNew.continuous = true;
      recognitionNew.interimResults = true;
      recognitionNew.lang = "hi";

      recognitionNew.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((result) => result[0].transcript)
          .join("");

        setTranscription(transcript);
      };

      recognitionNew.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        toast.error("Speech recognition error occurred");
      };

      setRecognition(recognitionNew);
    } else {
      toast.error("Speech recognition not supported in this browser");
    }
  }, []);

  // start listening
  const handleStartListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        setTranscription("");
        setGeneratedTitle("");
        setShowDialog(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Failed to start speech recognition");
      }
    }
  }, [recognition]);

  // Cancel
  const handleCancel = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setTranscription("");
      setGeneratedTitle("");
      setShowDialog(false);
    }
  }, [recognition]);

  // using Gemini to generate Title
  const handleGetTitle = useCallback(async () => {
    if (!transcription.trim()) {
      toast.error("No transcription available");
      return null;
    }

    setIsGeneratingTitle(true);
    try {
      const apiKey = "AIzaSyCK-WnkK3bSENw3bLAcefhH3Hv4Uj7vQwA";
      if (!apiKey) {
        throw new Error("Gemini API key is not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `strictly Generate a single, concise 2-3 word title that captures the essence of this text in the same language it is given in: "${transcription}"`;

      const result = await model.generateContent(prompt);
      const title = result.response.text().trim();
      const newTitle = title.substring(1, title.length - 2);

      setGeneratedTitle(newTitle);
      return title;
    } catch (error) {
      console.error("Error generating title:", error);
      toast.error("Failed to generate title");
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [transcription]);

  // 
  const handleConfirm = useCallback(async () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      if (!transcription.trim()) {
        toast.error("No transcription available");
        return;
      }

      try {
        const titleToUse =
          generatedTitle.substring(1, generatedTitle.length - 2) ||
          (await handleGetTitle()) ||
          "Untitled Note";

        const newNote = {
          userId: user?.uid,
          title: titleToUse,
          content: transcription,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isBookMarked: false,
        };

        const docRef = await addDoc(collection(db, "notes"), newNote);

        setTranscription("");
        setGeneratedTitle("");

        toast.success("New note created successfully");
        updateNotes((prev) => [...prev, newNote]);
      } catch (error) {
        console.error("Error creating note:", error);
        toast.error("Failed to create note");
      }
    }
  }, [recognition, transcription, generatedTitle, user, handleGetTitle]);

  return (
    <div className="flex flex-col">
      {/* Transcription Container */}
      {/* <div className="p-3 border rounded-lg bg-gray-50">
        <p
          className={`text-gray-600 ${transcription ? "text-black" : "italic"}`}
        >
          {transcription || "Transcription will appear here..."}
        </p>
      </div> */}

      {/* Dialog for displaying transcription */}
      {showDialog && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-opacity-60 ${
            isDark ? "bg-gray-600" : "bg-white"
          }`}
          style={{ background: "none", backgroundColor: "#44464863" }}
        >
          <div
            className={` p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out scale-95 hover:scale-100 ${
              isDark ? "bg-gray-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Transcription
            </h2>
            <p className={` mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
              asasa{transcription}
            </p>
            <button
              onClick={() => setShowDialog(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div>
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
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"
            >
              <X size={24} />
            </button>

            <button
              onClick={handleConfirm}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"
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
