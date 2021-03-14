import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import BlockCoding from "./pages/blockcoding/BlockCoding";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Test} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/blockcoding" component={BlockCoding} />
      </Switch>
    </BrowserRouter>
  );
}

// 테스트용이라 추후엔 지울 예정 ! 얘네가 이제 하나하나의 Component로 들어가서 import해서 쓸것들 !
function Test() {
  return <div className="App">안녕 ! FlaNET !</div>;
}

export default App;
