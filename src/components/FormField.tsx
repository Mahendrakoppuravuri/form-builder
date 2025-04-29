
import React from "react";
import { FormField as FormFieldType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, error, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(checked);
  };

  const handleSelectChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const handleRadioChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const handleMultiCheckboxChange = (optionValue: string, isChecked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    if (isChecked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter(val => val !== optionValue));
    }
  };

  const renderField = () => {
    // Breaking functionality #3: Always render text inputs regardless of field type
    // This will cause dropdown, radio, checkbox, and other special inputs to render as text inputs
    return (
      <Input
        type="text"
        id={field.fieldId}
        placeholder={field.placeholder || "Enter value"}
        value={value}
        onChange={handleChange}
        data-testid={dataTestId}
        className={error ? "border-red-500" : ""}
      />
    );
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label 
          htmlFor={field.fieldId}
          className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
        >
          {field.label}
        </Label>
      )}
      
      {renderField()}
      
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
