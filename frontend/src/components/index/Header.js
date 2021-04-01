import React from "react";
import { Link } from "react-router-dom";

const signOut = (event) => {
  sessionStorage.removeItem(
    `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
  );
  history.push("*");
};

function Header() {
  return (
    <header className="header">
      <img
        src={`${process.env.PUBLIC_URL}/img/flanet_header.png`}
        className="defaultBackgroundNavColor"
      />
      <a href="/" className="logo">
        <img
          src={`${process.env.PUBLIC_URL}/img/flanet_logo.png`}
          className="logo"
          alt="logo"
        />
      </a>
      <nav className="nav">
        <a className="nava1" href="/">
          튜토리얼
        </a>
        {(function () {
          if (window.location.pathname === "/profile")
            return (
              <Link className="nava2" to="/blockcoding">
                블록코딩
              </Link>
            );
          else
            return (
              <Link className="nava2" to="/profile">
                나의페이지
              </Link>
            );
        })()}

        <a className="nava3" href="/login" onClick={signOut}>
          Logout
        </a>
      </nav>
    </header>
  );
}

export default Header;
