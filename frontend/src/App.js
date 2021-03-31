import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/index/Header";
import Footer from "./components/index/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import Profile from "./pages/user/Profile";
import BlockCoding from "./pages/blockcoding/BlockCoding";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/signin">
          <Header />
          <SignIn />
          <Footer />
        </Route>
        <Route path="/signup">
          <Header />
          <SignUp />
          <Footer />
        </Route>
        <Route path="/profile">
          <Header />
          <Profile />
        </Route>
        <Route path="/blockcoding">
          <Header />
          <BlockCoding />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
