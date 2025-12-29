import { Link } from "react-router-dom";

import { useAppSelector } from "../store/hooks";

import Footer from "../components/Footer";
import Header from "../components/Header";

import "./home.scss";

const Home = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="home-container">
          <div className="home-card">
            <div className="home-header">
              <h1>Social App</h1>
              <p>Welcome to a virtual world built by real people.</p>
            </div>

            {!isLoggedIn && (
              <>
                <div className="signup-signin-link">
                  Don't have an account? <Link to="/register">Sign up</Link>
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                <div className="signup-signin-link">
                  Already have an account? <Link to="/login">Sign in</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
