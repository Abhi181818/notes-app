"use client";
import VoiceButton from "@/components/voice-button";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="container mx-auto flex items-center justify-center h-screen p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to Notes App</h1>
          <p className="text-lg text-gray-600 mb-6">Please login to continue</p>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95"
            onClick={() => router.push("/auth")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
        </SidebarProvider>
      </div>
      <div className="flex-1 flex flex-col justify-between p-8">
        <span className="font-bold">
          {" "}
          Welcome, <span>{user.displayName}</span>{" "}
        </span>
        <div className="flex flex-1 gap-8">
          <div className="w-1/2 border-r border-gray-300 p-6">
            <h1 className="text-2xl font-bold mb-4">Individual notes</h1>
          </div>
          <div className="w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-4">Details</h1>
          </div>
        </div>

        {/* Voice button centered at bottom */}
        <div className="flex justify-center items-center mb-8">
          <VoiceButton />
        </div>
      </div>
    </div>
  );
}
