import { z } from 'zod';
import { UserRole } from '../../constants/enums';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone format'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone format'),
  role: z.nativeEnum(UserRole),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
