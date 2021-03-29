import React from "react";

function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">
        <img
          src={`${process.env.PUBLIC_URL}/img/flanet_logo.png`}
          className="logo"
          alt="logo"
        />
      </a>
      <nav className="nav">
        <a href="/">듀토리얼 보기</a>
        <a href="/">마이페이지</a>
        <a href="/">로그아웃</a>
      </nav>
    </header>
  );
}

export default Header;
