import * as Yup from "yup";

import { countryCodes } from "../constants/countryCodes";

export const userProfileSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens and apostrophes"
    )
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens and apostrophes"
    )
    .required("Last name is required"),
  countryCode: Yup.string()
    .oneOf(
      countryCodes.map((c) => c.code),
      "Please select a valid country code"
    )
    .required("Country code is required"),
  mobile: Yup.string()
    .max(20, "Mobile number cannot exceed 20 characters")
    .matches(
      /^[\d\s+()]+$/,
      "Phone number can only contain digits, spaces, and basic symbols"
    )
    .nullable()
    .transform((value) => value || ""),
  address: Yup.string()
    .max(500, "Address cannot exceed 500 characters")
    .nullable()
    .transform((value) => value || ""),
});
