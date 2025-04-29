import React, { useState } from "react";
import { FormSection, FormData } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FormField from "./FormField";
import { toast } from "sonner";

interface FormRendererProps {
  formData: {
    formTitle: string;
    formId: string;
    version: string;
    sections: FormSection[];
  };
  onSubmit: (data: FormData) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ formData, onSubmit }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentSection = formData.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === formData.sections.length - 1;
  const progress = ((currentSectionIndex + 1) / formData.sections.length) * 100;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when user types
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSection): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];

      // Required field validation
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.fieldId] = field.validation?.message || "This field is required";
        isValid = false;
        return;
      }

      // Skip further validation if field is empty and not required
      if (!value && !field.required) return;

      // Min length validation
      if (field.minLength && typeof value === "string" && value.length < field.minLength) {
        newErrors[field.fieldId] = `Minimum ${field.minLength} characters required`;
        isValid = false;
      }

      // Max length validation
      if (field.maxLength && typeof value === "string" && value.length > field.maxLength) {
        newErrors[field.fieldId] = `Maximum ${field.maxLength} characters allowed`;
        isValid = false;
      }

      // Email validation
      if (field.type === "email" && typeof value === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.fieldId] = "Please enter a valid email address";
          isValid = false;
        }
      }

      // Phone validation
      if (field.type === "tel" && typeof value === "string") {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors[field.fieldId] = "Please enter a valid 10-digit phone number";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    // Breaking functionality #2: Always allow navigation regardless of validation
    setCurrentSectionIndex((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setCurrentSectionIndex((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    if (validateSection(currentSection)) {
      // Breaking functionality #3: Send empty form data regardless of collected values
      onSubmit({});
    } else {
      toast.error("Please fix the errors before submitting");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{formData.formTitle}</CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-2">
          Section {currentSectionIndex + 1} of {formData.sections.length}
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-1">{currentSection.title}</h3>
          <CardDescription>{currentSection.description}</CardDescription>
        </div>

        <div className="space-y-6">
          {currentSection.fields.map((field) => (
            <FormField
              key={field.fieldId}
              field={field}
              value={formValues[field.fieldId] || ""}
              error={errors[field.fieldId]}
              onChange={(value) => handleFieldChange(field.fieldId, value)}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstSection}
          data-testid="prev-button"
        >
          Previous
        </Button>

        {isLastSection ? (
          <Button 
            type="button" 
            onClick={handleSubmit}
            data-testid="submit-button"
          >
            Submit
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleNext}
            data-testid="next-button"
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FormRenderer;
