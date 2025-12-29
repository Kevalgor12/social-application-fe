import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import type { ProfileResponse, UserProfile } from "../../interfaces/user";

import { countryCodes } from "../../constants/countryCodes";

import { userProfileSchema } from "../../validations/user.validations";

import { updateUser as updateUserAPI } from "../../api/users";

import "./userProfile.scss";
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

const UserProfileForm: React.FC<UserProfileProps> = ({ userProfile }) => {
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    mutateAsync,
    error,
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
    validationSchema: userProfileSchema,
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
        toast.error(error instanceof Error ? error.message : String(error));
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
      toast.success(responseData.message);
    } else if (!isLoading && !isSuccess && error) {
      toast.error(error?.message);
    }
  }, [isSuccess, isLoading, responseData, error]);

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
