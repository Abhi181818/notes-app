"use client";
import { useState, useEffect } from "react";
import VoiceButton from "@/components/voice-button";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { db } from "@/../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { BookmarkIcon, Edit, Trash, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const fetchNotes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const notesRef = collection(db, "notes");
      const q = query(
        notesRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const notesList = [];

      querySnapshot.forEach((doc) => {
        notesList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setNotes(notesList);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setEditedTitle(note.title || "");
    setEditedContent(note.content || "");
  };

  const handleEditNote = () => {
    setIsEditing(true);
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    try {
      const noteRef = doc(db, "notes", selectedNote.id);
      await updateDoc(noteRef, {
        title: editedTitle,
        content: editedContent,
        updatedAt: serverTimestamp(),
      });

      setIsEditing(false);
      setSelectedNote({
        ...selectedNote,
        title: editedTitle,
        content: editedContent,
      });
      setNotes(
        notes.map((note) =>
          note.id === selectedNote.id
            ? { ...note, title: editedTitle, content: editedContent }
            : note
        )
      );

      toast.success("Note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNote = {
        userId: user.uid,
        title: "New Note",
        content: "Start typing here...",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isBookMarked: false,
      };

      const docRef = await addDoc(collection(db, "notes"), newNote);
      const createdNote = {
        id: docRef.id,
        ...newNote,
        createdAt: new Date(),
      };

      setNotes([createdNote, ...notes]);
      setSelectedNote(createdNote);
      setIsEditing(true);
      setEditedTitle(createdNote.title);
      setEditedContent(createdNote.content);

      toast.success("New note created");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteDoc(doc(db, "notes", selectedNote.id));
        setNotes(notes.filter((note) => note.id !== selectedNote.id));
        setSelectedNote(null);
        toast.success("Note deleted successfully");
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
      }
    }
  };

  const handleToggleBookmark = async (note, e) => {
    e.stopPropagation(); // stops total seelction
    try {
      const noteRef = doc(db, "notes", note.id);
      const newBookmarkStatus = !note.isBookMarked;

      await updateDoc(noteRef, {
        isBookMarked: newBookmarkStatus,
        updatedAt: serverTimestamp(),
      });

      setNotes(
        notes.map((n) =>
          n.id === note.id ? { ...n, isBookMarked: newBookmarkStatus } : n
        )
      );

      if (selectedNote && selectedNote.id === note.id) {
        setSelectedNote({ ...selectedNote, isBookMarked: newBookmarkStatus });
      }

      toast.success(newBookmarkStatus ? "Note bookmarked" : "Bookmark removed");
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

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
      <div className=" border-r border-gray-300">
        <SidebarProvider defaultOpen={true} position="left">
          <AppSidebar />
          <SidebarTrigger />
        </SidebarProvider>
      </div>
      <div className="flex-1 flex flex-col justify-between p-8">
        <div className="flex justify-between items-center border-b pb-4">
          <span className="font-bold text-lg">
            Welcome, <span className="text-blue-600">{user.displayName}</span>
          </span>
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            onClick={handleCreateNote}
          >
            <Plus size={16} />
            New Note
          </button>
        </div>
        <div className="flex flex-1 gap-8 mt-4">
          <div className="w-1/3 border-r border-gray-300 p-6">
            <h1 className="text-2xl font-bold mb-4 border-b p-2 flex justify-between items-center">
              Your notes
              <span className="text-sm text-gray-500 font-normal">
                {notes.length} notes
              </span>
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No notes found</p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={handleCreateNote}
                >
                  Create your first note
                </button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedNote?.id === note.id
                        ? "bg-blue-100 border-blue-300 border"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                    onClick={() => handleNoteSelect(note)}
                  >
                    <div className="font-medium truncate flex justify-between items-center">
                      <h3 className="flex-1 truncate">
                        {note.title || "Untitled Note"}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleToggleBookmark(note, e)}
                          className="text-gray-500 hover:text-violet-600 transition-colors"
                          title={
                            note.isBookMarked
                              ? "Remove bookmark"
                              : "Bookmark this note"
                          }
                        >
                          <BookmarkIcon
                            size={18}
                            fill={note.isBookMarked ? "violet" : "none"}
                            fillOpacity={note.isBookMarked ? 0.9 : 0}
                          />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {note.content
                        ? note.content.substring(0, 100)
                        : "No content"}
                    </p>
                    <div className="text-xs text-gray-400 mt-2">
                      {note.createdAt?.toDate
                        ? note.createdAt.toDate().toLocaleDateString()
                        : "Unknown date"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-4 border-b p-2">
              {isEditing ? "Edit Note" : "Details"}
            </h1>
            {selectedNote ? (
              isEditing ? (
                <div className="bg-white rounded-lg shadow p-6 h-[calc(100vh-250px)] flex flex-col">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-xl font-bold mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Title"
                  />
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Your note content..."
                  ></textarea>
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                      onClick={handleSaveNote}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-2">
                      {selectedNote.title || "Untitled Note"}
                    </h2>
                    {selectedNote.isBookMarked && (
                      <span className="bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full">
                        Bookmarked
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {selectedNote.createdAt?.toDate
                      ? `Created: ${selectedNote.createdAt
                          .toDate()
                          .toLocaleString()}`
                      : "Unknown date"}
                  </div>
                  <div className="prose max-w-none overflow-y-auto max-h-[calc(100vh-350px)]">
                    {selectedNote.content || "No content"}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                      onClick={handleEditNote}
                    >
                      <Edit size={16} />
                      Edit Note
                    </button>
                    <button
                      className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-md text-sm"
                      onClick={handleDeleteNote}
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-400">Select a note to view details</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center mb-8">
          <VoiceButton />
        </div>
        {/* <div></div> */}
      </div>
    </div>
  );
}
