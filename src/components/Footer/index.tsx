import "./footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>&copy; {currentYear} Social App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
