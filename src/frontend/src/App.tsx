import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import HomePage from "@/pages/HomePage";
import ApplyPage from "@/pages/ApplyPage";
import CalculatorPage from "@/pages/CalculatorPage";
import InfoPage from "@/pages/InfoPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/basvuru" element={<ApplyPage />} />
          <Route path="/hesaplayici" element={<CalculatorPage />} />
          <Route path="/bilgi" element={<InfoPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
