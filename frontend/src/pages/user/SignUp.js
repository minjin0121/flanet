import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase";

function SignUp() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpWithEmail = (event) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        history.push("/signin");
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

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
            onChange={(event) => {
              setPassword(event.target.value);
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

export default SignUp;
