import { useTheme } from "@/hooks/theme";
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TranslatedContent = ({ contentToTranslate }) => {
  const [contentAfter, setTranslatedContent] = useState("");
  const { isDark } = useTheme();
  useEffect(() => {
    if (contentToTranslate) {
      translateContent();
    }
  }, [contentToTranslate]);
  const translateContent = async () => {
    try {
      const apiKey = "AIzaSyCK-WnkK3bSENw3bLAcefhH3Hv4Uj7vQwA";
      if (!apiKey) {
        throw new Error("Gemini API key is not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `strictly translate this text given to kannada language only: "${contentToTranslate}"`;
      const result = await model.generateContent(prompt);
      const contentTranslated = result.response.text().trim();
      //   const newTitle = title.substring(1, title.length - 2);

      setTranslatedContent(contentTranslated);
      //   return title;
    } catch (error) {
      console.error("Error translating content:", error);
      toast.error("Failed to translate content");
    }
  };
  return (
    <div className={`${isDark ? "text-gray-100" : "text-black"}`}>
      {contentAfter}
    </div>
  );
};

export default TranslatedContent;
