import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/index/Header";
import Footer from "./components/index/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import BlockCoding from "./pages/blockcoding/BlockCoding";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/blockcoding" component={BlockCoding} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
