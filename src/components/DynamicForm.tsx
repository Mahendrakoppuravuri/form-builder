
import React, { useEffect, useState } from "react";
import { getForm } from "@/services/api";
import { UserData, FormResponse, FormData } from "@/types/form";
import FormRenderer from "./FormRenderer";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DynamicFormProps {
  userData: UserData;
  onLogout: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ userData, onLogout }) => {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getForm(userData.rollNumber);
        
        if (response) {
          setFormData(response);
        } else {
          setError("Could not fetch the form. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("An error occurred while fetching the form.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [userData.rollNumber]);

  const handleFormSubmit = (submittedData: FormData) => {
    // Log the collected form data as required
    console.log("Form submission data:", submittedData);
    toast.success("Form submitted successfully!");
    
    // Show logged data in a more readable format in console
    console.log("Submitted Form Data:", JSON.stringify(submittedData, null, 2));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your form...</h2>
          <p className="text-gray-600">Please wait while we fetch the form data.</p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center text-red-500">Error Loading Form</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">{error || "Could not load the form. Please try again."}</p>
            <button
              onClick={onLogout}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Back to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {userData.name}</h2>
            <p className="text-sm text-gray-600">Roll Number: {userData.rollNumber}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Logout
          </button>
        </div>
        
        <FormRenderer 
          formData={formData.form} 
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
};

export default DynamicForm;
