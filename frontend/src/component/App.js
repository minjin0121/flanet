import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="" component={Test} />
      </Switch>
    </BrowserRouter>
  );
}

// 테스트용이라 추후엔 지울 예정 ! 얘네가 이제 하나하나의 Component로 들어가서 import해서 쓸것들 !
function Test() {
  return <div className="App">안녕 ! FlaNET !</div>;
}

export default App;
