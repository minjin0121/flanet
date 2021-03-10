import React, { Component } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
  };

  setEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  setPassword = (event) => {
    this.setState({ password: event.target.value });
  };

  signInWithEmail = (event) => {
    console.log(
      `signInWithEmail : ${this.state.email} / ${this.state.password}`
    );

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((result) => {
        console.log("SUCCESS : Sign In with Email");
        console.log(result.user);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log("FAIL : Sign In with Email");
        console.log(error.code);
      });
  };

  signInWithGoogle = (event) => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((response) => {
        console.log("SUCCESS : Sign In with Google");
        console.log(response.user);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log("FAIL : Sign In with Google");
        console.log(error.code);
      });
  };

  render() {
    const { email, password } = this.state;
    const { setEmail, setPassword, signInWithEmail, signInWithGoogle } = this;

    return (
      <div className="signIn">
        <h1>로그인</h1>
        <form action="" method="post">
          <div>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event);
              }}
            />
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event);
              }}
            />
          </div>
        </form>
        <button
          type="submit"
          className="signInButton"
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
}

export default SignIn;
