import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { useState, useEffect } from "react";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Persist login state using localStorage (optional improvement)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const storedGender = localStorage.getItem('gender');
    if (isLoggedIn === 'true') setLoggedIn(true);
    if (storedGender === 'male' || storedGender === 'female') setGender(storedGender);
  }, []);

  const handleLogin = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('gender', selectedGender);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('gender');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={loggedIn ? <Index gender={gender} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
