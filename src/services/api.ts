
import { FormResponse, UserData } from "../types/form";

const API_BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const createUser = async (userData: UserData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create user");
    }

    return { success: true, message: data.message || "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
};

export const getForm = async (rollNumber: string): Promise<FormResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch form");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching form:", error);
    return null;
  }
};
