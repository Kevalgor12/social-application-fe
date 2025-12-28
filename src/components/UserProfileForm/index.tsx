import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./userProfile.scss";
import {
  updateUser as updateUserAPI,
  type ProfileResponse,
  type UserProfile,
} from "../../api/users";
import { useMutation } from "@tanstack/react-query";

interface UserProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
  address: string;
}

interface UserProfileProps {
  userProfile?: UserProfile | undefined;
}

// Country codes data
const countryCodes: { code: string; name: string }[] = [
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+91", name: "India" },
  { code: "+86", name: "China" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+61", name: "Australia" },
  { code: "+7", name: "Russia" },
  { code: "+82", name: "South Korea" },
  { code: "+34", name: "Spain" },
  { code: "+39", name: "Italy" },
  { code: "+55", name: "Brazil" },
  { code: "+51", name: "Peru" },
  { code: "+92", name: "Pakistan" },
  { code: "+880", name: "Bangladesh" },
  { code: "+62", name: "Indonesia" },
  { code: "+63", name: "Philippines" },
  { code: "+66", name: "Thailand" },
  { code: "+84", name: "Vietnam" },
];

const validationSchema = Yup.object<UserProfileFormValues>({
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

  email: Yup.string()
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters")
    .required("Email is required"),

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

const UserProfileForm: React.FC<UserProfileProps> = ({ userProfile }) => {
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    mutateAsync,
    // isError,
    // error,
  } = useMutation<
    ProfileResponse,
    Error,
    {
      firstName: string;
      lastName: string;
      countryCode: string;
      mobile: string;
      address: string;
    }
  >({
    mutationKey: ["updateUserProfile"],
    mutationFn: updateUserAPI,
  });

  const formik = useFormik<UserProfileFormValues>({
    initialValues: {
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      email: userProfile?.email || "",
      countryCode: userProfile?.countryCode || "+1",
      mobile: userProfile?.mobile || "",
      address: userProfile?.address || "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await mutateAsync({
          firstName: values.firstName,
          lastName: values.lastName,
          countryCode: values.countryCode,
          mobile: values.mobile,
          address: values.address,
        });
        resetForm({ values });
      } catch (error) {
        console.error("Failed to save profile:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldProps = (name: keyof UserProfileFormValues) => {
    return {
      ...formik.getFieldProps(name),
      error: formik.errors[name],
      touched: formik.touched[name] as boolean | undefined,
    };
  };

  useEffect(() => {
    if (!isLoading && isSuccess && responseData.success) {
      console.log("User profile updated successfully.");
    }
  }, [isSuccess, isLoading, responseData]);

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="profile-header">
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">Update your personal information</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                {...getFieldProps("firstName")}
                className={`form-input ${
                  getFieldProps("firstName").error &&
                  getFieldProps("firstName").touched
                    ? "error"
                    : ""
                }`}
                placeholder="Enter your first name"
                disabled={formik.isSubmitting}
              />
              {getFieldProps("firstName").error &&
                getFieldProps("firstName").touched && (
                  <span className="error-message">
                    {getFieldProps("firstName").error}
                  </span>
                )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                {...getFieldProps("lastName")}
                className={`form-input ${
                  getFieldProps("lastName").error &&
                  getFieldProps("lastName").touched
                    ? "error"
                    : ""
                }`}
                placeholder="Enter your last name"
                disabled={formik.isSubmitting}
              />
              {getFieldProps("lastName").error &&
                getFieldProps("lastName").touched && (
                  <span className="error-message">
                    {getFieldProps("lastName").error}
                  </span>
                )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...getFieldProps("email")}
              className={`form-input ${
                getFieldProps("email").error && getFieldProps("email").touched
                  ? "error"
                  : ""
              }`}
              placeholder="Enter your email address"
              disabled={true}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="countryCode" className="form-label">
                Country Code
              </label>
              <select
                id="countryCode"
                {...getFieldProps("countryCode")}
                className={`form-select ${
                  getFieldProps("countryCode").error &&
                  getFieldProps("countryCode").touched
                    ? "error"
                    : ""
                }`}
                disabled={formik.isSubmitting}
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} - {country.name}
                  </option>
                ))}
              </select>
              {getFieldProps("countryCode").error &&
                getFieldProps("countryCode").touched && (
                  <span className="error-message">
                    {getFieldProps("countryCode").error}
                  </span>
                )}
            </div>

            <div className="form-group">
              <label htmlFor="mobile" className="form-label">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                {...getFieldProps("mobile")}
                className={`form-input ${
                  getFieldProps("mobile").error &&
                  getFieldProps("mobile").touched
                    ? "error"
                    : ""
                }`}
                placeholder="Enter your mobile number"
                disabled={formik.isSubmitting}
              />
              {getFieldProps("mobile").error &&
                getFieldProps("mobile").touched && (
                  <span className="error-message">
                    {getFieldProps("mobile").error}
                  </span>
                )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              {...getFieldProps("address")}
              className={`form-textarea ${
                getFieldProps("address").error &&
                getFieldProps("address").touched
                  ? "error"
                  : ""
              }`}
              placeholder="Enter your address"
              rows={4}
              disabled={formik.isSubmitting}
            />
            {getFieldProps("address").error &&
              getFieldProps("address").touched && (
                <span className="error-message">
                  {getFieldProps("address").error}
                </span>
              )}
            <span className="character-count">
              {formik.values.address.length}/500
            </span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="btn btn-secondary"
              disabled={formik.isSubmitting || !formik.dirty}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            >
              {formik.isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
