
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserData } from "./types/form";
import LoginForm from "./components/LoginForm";
import DynamicForm from "./components/DynamicForm";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLoginSuccess = (data: UserData) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gray-100">
          {isLoggedIn && userData ? (
            <DynamicForm userData={userData} onLogout={handleLogout} />
          ) : (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
