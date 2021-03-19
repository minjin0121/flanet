import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";

function SignIn() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmail = (event) => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((result) => {
            history.push("/");
          })
          .catch((error) => {
            console.log(error.code);
          });
      })
      .catch(() => {});
  };

  const signInWithGoogle = (event) => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((response) => {
            history.push("/");
          })
          .catch((error) => {
            console.log(error.code);
          });
      })
      .catch(() => {});
  };

  return (
    <div className="signIn userContainer">
      <h1>로그인</h1>
      <form action="" method="post">
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="이메일을 입력해주세요."
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="비밀번호를 입력해주세요."
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
      </form>
      <button
        className="signInButton"
        type="submit"
        onClick={(event) => {
          signInWithEmail(event);
        }}
      >
        로그인
      </button>
      <p className="signUpText">
        계정이 없나요?
        <Link to="/signup" className="toSignUpButton">
          회원가입
        </Link>
      </p>
      <img
        src={`${process.env.PUBLIC_URL}/img/btn_google_signin_light_normal_web.png`}
        alt="googleSignInButton"
        className="googleSignInButton"
        onClick={(event) => {
          signInWithGoogle(event);
        }}
      />
    </div>
  );
}

export default SignIn;
