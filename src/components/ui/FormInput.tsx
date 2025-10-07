import React from "react";
import { Input } from "./input";
import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  FieldPath,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  label: string;
  placeholder: string;
  name: FieldPath<T>;
  type?: string;
  disabled?: boolean;
  value?: string;
}

export default function FormInput<T extends FieldValues = FieldValues>({
  register,
  disabled,
  value,
  errors,
  label,
  placeholder,
  name,
  type = "text",
}: FormInputProps<T>) {
  return (
    <div className="flex-1">
      <label
        htmlFor={name as string}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {disabled && <Input value={value} disabled />}
      {!disabled && (
        <Input
          {...register(name, { required: true })}
          placeholder={placeholder}
          type={type}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
