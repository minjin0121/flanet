import React from "react";
import { Link } from "react-router-dom";

const signOut = (event) => {
  sessionStorage.removeItem(
    `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
  );
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
        <Link className="nava1" to="/">
          튜토리얼
        </Link>
        {(function () {
          if (window.location.pathname === "/profile")
            return (
              <Link className="nava2" to="/blockcoding">
                블록 코딩
              </Link>
            );
          else
            return (
              <Link className="nava2" to="/profile">
                마이페이지
              </Link>
            );
        })()}

        <Link className="nava3" to="/" onClick={signOut}>
          로그아웃
        </Link>
      </nav>
      <div className="defaultBackgroundNavHeight"></div>
    </header>
  );
}

export default Header;
