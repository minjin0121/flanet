import React from "react";
import { useHistory } from "react-router-dom";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

function Home() {
  const history = useHistory();

  const signOut = (event) => {
    sessionStorage.removeItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    );
    history.push("/");
  };

  const startFlanetButton = (event) => {
    if (
      sessionStorage.getItem(
        `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
      )
    ) {
      history.push("/blockcoding");
    } else {
      history.push("/signin");
    }
  };

  return (
    <div className="App">
      안녕 ! FlaNET !
      <div>
        <ExitToAppRoundedIcon
          onClick={(event) => {
            signOut(event);
          }}
        />
      </div>
      <button
        className="startFlanetButton"
        type="submit"
        onClick={(event) => {
          startFlanetButton(event);
        }}
      >
        FlaNET 시작하기
      </button>
    </div>
  );
}

export default Home;
