import { useTheme } from "@/hooks/theme";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Languages, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TranslatedContent = ({ contentToTranslate }) => {
  const [contentAfter, setTranslatedContent] = useState("");
  const { isDark } = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [language, setLanguage] = useState("Hindi");

  useEffect(() => {
    if (contentToTranslate && showContent) {
      translateContent();
    }
  }, [contentToTranslate, showContent, language]);

  const translateContent = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const apiKey = "AIzaSyCK-WnkK3bSENw3bLAcefhH3Hv4Uj7vQwA";
      if (!apiKey) {
        throw new Error("Gemini API key is not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `strictly translate this text to ${language} and only give output as just the translated text: "${contentToTranslate}"`;
      const result = await model.generateContent(prompt);
      const contentTranslated = result.response.text().trim();
      if (language == "Kannada")
        setTranslatedContent("No kannada saaaar!!! only hindiiii");
      else {
        setTranslatedContent(contentTranslated);
      }
      setIsTranslated(true);
      toast.success("Translation completed!");
    } catch (error) {
      console.error("Error translating content:", error);
      toast.error("Failed to translate content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = () => {
    setShowContent(!showContent);
    setIsTranslated(false);
  };

  return (
    <div
      className={`mt-2 container ${isDark ? "text-gray-100" : "text-black"}`}
    >
      <div className="flex gap-3">
        <button
          className={`flex items-center gap-2 ${
            isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded-md text-sm`}
          onClick={handleTranslate}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} /> : <Languages size={16} />}
          {isLoading ? "Translating..." : "Translate"}
        </button>
        <select
          className={`border-b-3 p-1 rounded-md  hover:border-b-2 ${
            isDark ? "text-white bg-gray-800" : "text-gray-800"
          }`}
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
        >
          <option value="Bhojpuri">Bhojpuri</option>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
          <option value="Kannada">Kannada</option>
          <option value="Punjabi">Punjabi</option>
          {/* <option value={}> */}
        </select>
      </div>

      {showContent && (
        <div
          className={`container flex flex-col mt-4 rounded-lg p-4 ${
            isDark ? "bg-slate-800/70" : "bg-blue-50/70"
          } shadow-md`}
        >
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Languages size={18} />
            Translated Content
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    isDark ? "bg-blue-400" : "bg-blue-500"
                  } rounded-full`}
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          ) : (
            <div
              className={`p-2 rounded border ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p>{contentAfter || "Translation will appear here..."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslatedContent;
