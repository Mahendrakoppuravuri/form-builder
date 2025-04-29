
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserData } from "@/types/form";
import { createUser } from "@/services/api";

interface LoginFormProps {
  onLoginSuccess: (userData: UserData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [userData, setUserData] = useState<UserData>({
    rollNumber: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.rollNumber || !userData.name) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Fixed: Properly passing userData to the API
      const result = await createUser(userData);
      
      if (result.success) {
        toast.success(result.message);
        onLoginSuccess(userData);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Student Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                placeholder="Enter your roll number"
                value={userData.rollNumber}
                onChange={handleChange}
                required
                data-testid="login-rollnumber"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={userData.name}
                onChange={handleChange}
                required
                data-testid="login-name"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="login-submit-button"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
