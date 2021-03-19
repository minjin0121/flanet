import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import BlockCoding from "./pages/blockcoding/BlockCoding";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/blockcoding" component={BlockCoding} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
