import * as Yup from "yup";

export const emailValidator = Yup.string()
  .trim()
  .email("Please enter a valid email address")
  .required("Email is required");

export const passwordValidator = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  )
  .matches(/^\S*$/, "Password must not contain spaces")
  .required("Password is required");

export const loginSchema = Yup.object({
  email: emailValidator,
  password: passwordValidator,
});

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),

  email: emailValidator,

  password: passwordValidator,

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
