import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, type AuthResponse } from "../../store/authSlice";

import "./header.scss";
import { signout as signoutAPI } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";

const Header = () => {
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    mutateAsync,
    // isError,
    // error,
  } = useMutation<AuthResponse, Error>({
    mutationKey: ["signout"],
    mutationFn: signoutAPI,
  });
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleLogout = async () => {
    await mutateAsync();
    dispatch(logout());
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() ?? "";
    const last = lastName?.charAt(0).toUpperCase() ?? "";
    return `${first}${last}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading && isSuccess && responseData.success) {
      navigate("/");
    }
  }, [isSuccess, isLoading, responseData, navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span>Social App</span>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link
            to="/posts"
            className={`nav-link ${
              window.location.pathname === "/posts" ? "active" : ""
            }`}
          >
            Feed
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="auth-section">
          {isLoggedIn ? (
            <div className="profile-dropdown" ref={dropdownRef}>
              <button
                className="profile-trigger"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                {/* <img
                  src={"https://via.placeholder.com/150"}
                  alt={user?.firstName}
                  className="profile-avatar"
                /> */}
                <span className="profile-name">
                  {getInitials(user?.firstName, user?.lastName)}
                </span>
                <svg
                  className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <span className="profile-name">
                      {getInitials(user?.firstName, user?.lastName)}
                    </span>
                    {/* <img
                      src={"https://via.placeholder.com/150"}
                      alt={user?.firstName}
                      className="dropdown-avatar"
                    /> */}
                    <div className="dropdown-user-info">
                      <span className="dropdown-name">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="dropdown-email">{user?.email}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/me/profile" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        fill="currentColor"
                      />
                    </svg>
                    Profile
                  </Link>
                  <Link to="/me/posts" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                        fill="currentColor"
                      />
                    </svg>
                    My Posts
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                        fill="currentColor"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn btn-outline" onClick={handleLogin}>
                Sign In
              </button>
              <button className="btn btn-primary" onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
