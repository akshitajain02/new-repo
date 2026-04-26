import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Detector from "./pages/Detector";
import Login from "./pages/Login";
import Forum from "./pages/Forum";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Navbar />

          <div className="pt-20">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/detector" element={<Detector />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forum" element={<Forum />} />

              <Route
                path="/prevention"
                element={<div className="p-8 text-xl">Prevention Tips Page</div>}
              />

              <Route
                path="/examples"
                element={<div className="p-8 text-xl">Phishing Examples Page</div>}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;