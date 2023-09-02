// validation for inputs
import { z } from "zod";

// Define validation schemas
export const nameSchema = z.string().max(21);

export function validateNameLength(name: string) {
  try {
    nameSchema.parse(name);
    return null; // Validation succeeded, return null (no error message)
  } catch (error) {
    return "Name must be at most 21 characters long"; // Validation failed, return an error message
  }
}


export const emailSchema = z.string().max(80).refine((value) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value), {
  message: "Invalid email format",
});

export function validateEmail(email: string) {
  try {
    emailSchema.parse(email);
    return null; // Validation succeeded, return null (no error message)
  } catch (error) {
    return "Invalid email format or exceeds 80 characters"; // Validation failed, return an error message
  }
}


// Define password validation schema
export const passwordSchema = z.string().min(8).refine((value) => /^(?=.*[A-Z])(?=.*\d).+$/.test(value), {
  message: "Password must be at least 8 characters long, include at least one uppercase letter, and one number",
});

export function validatePassword(password: string) {
  try {
    passwordSchema.parse(password);
    return null; // Validation succeeded, return null (no error message)
  } catch (error) {
    return "Password must be at least 8 characters long, include at least one uppercase letter, and one number"; // Validation failed, return an error message
  }
}





