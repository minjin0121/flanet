import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { getUserDataSet } from "../../actions/index";

function Profile({ userDataSets }) {
  const dispatch = useDispatch();
  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );

  useEffect(() => {
    dispatch(getUserDataSet(user.uid));
  }, [dispatch, user.uid]);

  return (
    <div className="profile">
      <div className="storage">
        <h1> Storage </h1>
        <h2> 크롤링 데이터 </h2>
        {Object.keys(userDataSets).length > 0 &&
          userDataSets.user_data_set.map((item, idx) => (
            <div key={idx}>
              {(function () {
                if (item.user_data_set_xml)
                  return (
                    <div className="historyBox">
                      <span>{item.user_data_set_date}</span>
                      {(function () {
                        if (item.user_data_set_start)
                          return (
                            <span>
                              {item.user_data_set_start} ~
                              {item.user_data_set_end}
                            </span>
                          );
                        else return <span>csv 데이터</span>;
                      })()}
                      <span>{item.user_data_set_name}</span>
                      <span>{item.data_list_id}</span>
                    </div>
                  );
                else return <span></span>;
              })()}
            </div>
          ))}
        <h2> 데이터 분석 및 예측 </h2>
        <div className="historyBox">
          <span>2021-04-02T03:20:01</span>
          <span>csv 파일</span>
          <span>1</span>
        </div>
        <h2> 저장된 모델 </h2>
        <div className="historyBox">
          <span>2021-04-02T03:20:01</span>
          <span>ho 모델</span>
          <span>1</span>
        </div>
      </div>
      <div className="history">
        <h1> History </h1>
        {Object.keys(userDataSets).length > 0 &&
          userDataSets.user_data_set.map((item, idx) => (
            <div key={idx} className="historyBox">
              <span>{item.user_data_set_date}</span>
              {(function () {
                if (item.user_data_set_start)
                  return (
                    <span>
                      {item.user_data_set_start} ~ {item.user_data_set_end}
                    </span>
                  );
                else return <span>csv 데이터</span>;
              })()}
              <span>{item.user_data_set_name}</span>
              <span>{item.data_list_id}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

Profile.propTypes = {
  userDataSets: PropTypes.object,
};

export default connect((state) => ({ userDataSets: state.userDataSets }))(
  Profile
);
