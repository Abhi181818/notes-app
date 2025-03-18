"use client";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DynamicTitle() {
  const [title, setTitle] = useState("Notes-App");
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const foundTitle =
      "Notes-App" +
      " : " +
      (pathname === "/" && user ? "Home" : pathname.replace("/", " "));
    if (foundTitle) {
      setTitle(foundTitle);
    } else {
      setTitle("default title");
    }
  }, [pathname]);

  return <title>{title}</title>;
}
