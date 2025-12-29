import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import type { AuthResponse } from "../../interfaces/auth";

import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/authSlice";

import { loginSchema } from "../../validations/auth.validations";

import { login as loginAPI } from "../../api/auth";

import "./auth.scss";

const ShowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" />
  </svg>
);

const HideIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1z" />
  </svg>
);

const Login = () => {
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    mutateAsync,
    isError,
    error,
  } = useMutation<AuthResponse, Error, { email: string; password: string }>({
    mutationKey: ["login"],
    mutationFn: loginAPI,
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await mutateAsync({
        email: values.email,
        password: values.password,
      });
    },
  });

  useEffect(() => {
    if (!isLoading && isSuccess && responseData?.data?.accessToken) {
      dispatch(login(responseData.data.user));
      toast.success(responseData.message);
      navigate("/posts");
    } else if (isError && error) {
      toast.error(error.message);
    }
  }, [isSuccess, isLoading, responseData, navigate, dispatch, isError, error]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Social App</h1>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              className="form-input"
            />
            {formik.errors.email && formik.touched.email && (
              <span className="error-message">{formik.errors.email}</span>
            )}
          </div>

          <div className="form-group position-relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
              className="form-input"
              style={{ paddingRight: "40px" }}
            />
            {formik.errors.password && formik.touched.password && (
              <span className="error-message">{formik.errors.password}</span>
            )}
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--primary-color, #007bff)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--sparkling-silver, #999)")
              }
            >
              {showPassword ? <HideIcon /> : <ShowIcon />}
            </button>
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || !formik.isValid}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="signup-signin-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
