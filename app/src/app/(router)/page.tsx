"use client";
import dynamic from "next/dynamic";
const HomePage = dynamic(
  () => import("@/b__pages/home/ui").then((mod) => mod.default),
  { ssr: false }
);

export default function Home() {
  return <HomePage></HomePage>;
}

