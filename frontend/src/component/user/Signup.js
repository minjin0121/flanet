import React, { Component } from "react";
import firebase from "firebase";

class Signup extends Component {
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

  signUpWithEmail = (event) => {
    console.log(
      `signUpwithEmail : ${this.state.email} / ${this.state.password}`
    );

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((result) => {
        console.log("SUCCESS : Sign Up with Email");
        console.log(result.user);
        window.location.href = "/signin";
      })
      .catch((error) => {
        console.log("FAIL : Sign Up with Email");
        console.log(error.code);
      });
  };

  render() {
    const { email, password } = this.state;
    const { setEmail, setPassword, signUpWithEmail } = this;

    return (
      <div className="signUp">
        <h1>회원가입</h1>
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
          onClick={(event) => {
            signUpWithEmail(event);
          }}
        >
          회원가입
        </button>
      </div>
    );
  }
}

export default Signup;
