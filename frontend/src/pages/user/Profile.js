import ScheduleIcon from "@material-ui/icons/Schedule";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDataSet,
  getDataList,
  getUserModelSet,
  getUserPredictDataSet,
  getModelList,
} from "../../actions/index";

function Profile() {
  const dispatch = useDispatch();
  const user = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${process.env.REACT_APP_FIREBASE_APIKEY}:[DEFAULT]`
    )
  );
  const noDataContext = "이름없음";
  const dataList = useSelector((state) => state.dataLists.data_list);
  const modelLists = useSelector((state) => state.modelLists.training_model);

  // History 크롤링
  const [userSetSelectIndex, setUserSetSelectIndex] = useState(1);
  const userDataSets = useSelector((state) => {
    const userDataList = [];

    if (state.userDataSets.user_data_set) {
      for (
        let index = 0;
        index < state.userDataSets.user_data_set.length;
        index++
      ) {
        userDataList.push(state.userDataSets.user_data_set[index]);
      }
    }
    const setMaxIndex = parseInt(
      Math.max((userDataList.length - 1) / 4 + 1, 1),
      10
    );
    const setIndexList = () => {
      const e = [];

      for (let idx = 0; idx < setMaxIndex; idx++) {
        e.push(idx + 1);
      }
      return e;
    };

    return { userDataList, setIndexList: setIndexList() };
  });

  // History 예측 및 분석
  const [predictSelectIndex, setPredictSelectIndex] = useState(1);
  const predictDataSets = useSelector((state) => {
    const predictDataList = [];

    if (state.userPredictData.user_data_predict) {
      for (
        let index = 0;
        index < state.userPredictData.user_data_predict.length;
        index++
      ) {
        predictDataList.push(state.userPredictData.user_data_predict[index]);
      }
    }
    const setMaxIndex = parseInt(
      Math.max((predictDataList.length - 1) / 4 + 1, 1),
      10
    );
    const setIndexList = () => {
      const e = [];

      for (let idx = 0; idx < setMaxIndex; idx++) {
        e.push(idx + 1);
      }
      return e;
    };

    return { predictDataList, setIndexList: setIndexList() };
  });

  // History 모델
  const [modelSelectIndex, setModelSelectIndex] = useState(1);
  const modelSets = useSelector((state) => {
    const modelList = [];

    if (state.userModelSets.training_model) {
      for (
        let index = 0;
        index < state.userModelSets.training_model.length;
        index++
      ) {
        modelList.push(state.userModelSets.training_model[index]);
      }
    }
    const setMaxIndex = parseInt(
      Math.max((modelList.length - 1) / 4 + 1, 1),
      10
    );
    const setIndexList = () => {
      const e = [];

      for (let idx = 0; idx < setMaxIndex; idx++) {
        e.push(idx + 1);
      }
      return e;
    };

    return { modelList, setIndexList: setIndexList() };
  });

  // Storage 크롤링 데이터
  const [xmlSetSelectIndex, setXmlSetSelectIndex] = useState(1);
  const userDataXmlSets = useSelector((state) => {
    const userDataXmlList = [];

    if (state.userDataSets.user_data_set) {
      for (
        let index = 0;
        index < state.userDataSets.user_data_set.length;
        index++
      ) {
        const element =
          state.userDataSets.user_data_set[index].user_data_set_xml;

        if (element) {
          userDataXmlList.push(state.userDataSets.user_data_set[index]);
        }
      }
    }
    const xmlSetMaxIndex = parseInt(
      Math.max((userDataXmlList.length - 1) / 4 + 1, 1),
      10
    );
    const xmlSetIndexList = () => {
      const e = [];

      for (let idx = 0; idx < xmlSetMaxIndex; idx++) {
        e.push(idx + 1);
      }
      return e;
    };

    return { userDataXmlList, xmlSetIndexList: xmlSetIndexList() };
  });

  // Storage 분석 예측 데이터
  const [xmlPredictSelectIndex, setXmlPredictSelectIndex] = useState(1);
  const predictXmlSets = useSelector((state) => {
    const predictXmlList = [];

    if (state.userPredictData.user_data_predict) {
      for (
        let index = 0;
        index < state.userPredictData.user_data_predict.length;
        index++
      ) {
        const element =
          state.userPredictData.user_data_predict[index].user_data_predict_xml;

        if (element) {
          predictXmlList.push(state.userPredictData.user_data_predict[index]);
        }
      }
    }
    const xmlSetMaxIndex = parseInt(
      Math.max((predictXmlList.length - 1) / 4 + 1, 1),
      10
    );
    const xmlSetIndexList = () => {
      const e = [];

      for (let idx = 0; idx < xmlSetMaxIndex; idx++) {
        e.push(idx + 1);
      }
      return e;
    };

    return { predictXmlList, xmlSetIndexList: xmlSetIndexList() };
  });

  // Storage 모델 데이터
  const [xmlModelSelectIndex, setXmlModelSelectIndex] = useState(1);
  const modelXmlSets = useSelector((state) => {
    const modelXmlList = [];

    if (state.userModelSets.training_model) {
      for (
        let index = 0;
        index < state.userModelSets.training_model.length;
        index++
      ) {
        const element =
          state.userModelSets.training_model[index].training_model_xml;

        if (element) {
          modelXmlList.push(state.userModelSets.training_model[index]);
        }
      }
    }
    const xmlSetMaxIndex = parseInt(
      Math.max((modelXmlList.length - 1) / 4 + 1, 1),
      10
    );
    const xmlSetIndexList = () => {
      const e = [];

      for (let idx = 0; idx < xmlSetMaxIndex; idx++) {
        e.push(idx + 1);
      }
      return e;
    };

    return { modelXmlList, xmlSetIndexList: xmlSetIndexList() };
  });

  useEffect(() => {
    dispatch(getUserDataSet(user.uid));
    dispatch(getUserPredictDataSet(user.uid));
    dispatch(getUserModelSet(user.uid));
    dispatch(getDataList());
    dispatch(getModelList());
  }, [dispatch]);

  return (
    <div className="profile">
      <div className="profileBox">
        <h1> Profile </h1>
        <img src={user.photoURL} />
        <span className="userEmail">{user.email}</span>
        <span className="userDisplayName">{user.displayName}</span>
      </div>
      <div className="storage">
        <h1> Storage </h1>
        <h2> 크롤링 데이터 </h2>
        {userDataXmlSets.userDataXmlList.length > 0 &&
          userDataXmlSets.userDataXmlList.map((item, idx) => (
            <div key={idx}>
              {(function () {
                if (
                  (xmlSetSelectIndex - 1) * 4 - 1 < idx &&
                  idx < xmlSetSelectIndex * 4
                )
                  return (
                    <div className="storageBox">
                      <span className="time">
                        <ScheduleIcon className="iconStyle" />
                        {item.user_data_set_date
                          .split("T")[0]
                          .concat(" ", item.user_data_set_date.split("T")[1])}
                      </span>
                      {(function () {
                        if (item.user_data_set_start)
                          return (
                            <span className="period">
                              <HourglassEmptyIcon className="iconStyle" />
                              {item.user_data_set_start.concat(
                                " ~ ",
                                item.user_data_set_end
                              )}
                            </span>
                          );
                        else
                          return (
                            <span className="period">csv 데이터 입력</span>
                          );
                      })()}
                      <span className="xmlName">
                        {(function () {
                          if (item.user_data_set_name)
                            return item.user_data_set_name;
                          else return noDataContext;
                        })()}
                      </span>
                      <span className="typeName">
                        {(function () {
                          if (dataList)
                            return dataList[item.data_list_id - 1]
                              .data_list_name;
                          else return <span></span>;
                        })()}
                      </span>
                    </div>
                  );
                else return <span></span>;
              })()}
            </div>
          ))}
        <div className="indexList">
          {userDataXmlSets.xmlSetIndexList.length > 0 &&
            userDataXmlSets.xmlSetIndexList.map((item, idx) => (
              <span
                key={idx}
                className="indexBox"
                onClick={() => setXmlSetSelectIndex(item)}
              >
                {(function () {
                  if (xmlSetSelectIndex === item)
                    return <span className="selectIndex">{item}</span>;
                  else return <span>{item}</span>;
                })()}
              </span>
            ))}
        </div>
        <h2> 분석 및 예측 데이터 </h2>
        {predictXmlSets.predictXmlList.length > 0 &&
          predictXmlSets.predictXmlList.map((item, idx) => (
            <div key={idx}>
              {(function () {
                if (
                  (xmlPredictSelectIndex - 1) * 4 - 1 < idx &&
                  idx < xmlPredictSelectIndex * 4
                )
                  return (
                    <div className="storageBox">
                      <span className="time">
                        <ScheduleIcon className="iconStyle" />
                        {item.user_data_predict_date}
                        {/* {item.user_data_predict_date
                          .split("T")[0]
                          .concat(
                            " ",
                            item.user_data_predict_date.split("T")[1]
                          )} */}
                      </span>
                      <span className="modelName">
                        {(function () {
                          if (item.user_data_predict_name)
                            return item.user_data_predict_name;
                          else return noDataContext;
                        })()}
                      </span>
                      <span className="learningModelName">
                        {(function () {
                          if (modelLists)
                            return modelLists[item.training_model_id - 1]
                              .training_model_name;
                          else return <span></span>;
                        })()}
                      </span>
                    </div>
                  );
                else return <span></span>;
              })()}
            </div>
          ))}
        <div className="indexList">
          {predictXmlSets.xmlSetIndexList.length > 0 &&
            predictXmlSets.xmlSetIndexList.map((item, idx) => (
              <span
                key={idx}
                className="indexBox"
                onClick={() => setXmlPredictSelectIndex(item)}
              >
                {(function () {
                  if (xmlPredictSelectIndex === item)
                    return <span className="selectIndex">{item}</span>;
                  else return <span>{item}</span>;
                })()}
              </span>
            ))}
        </div>
        <h2> 딥러닝 모델 데이터 </h2>
        {modelXmlSets.modelXmlList.length > 0 &&
          modelXmlSets.modelXmlList.map((item, idx) => (
            <div key={idx}>
              {(function () {
                if (
                  (xmlModelSelectIndex - 1) * 4 - 1 < idx &&
                  idx < xmlModelSelectIndex * 4
                )
                  return (
                    <div className="storageBox">
                      <span className="time">
                        <ScheduleIcon className="iconStyle" />
                        {item.training_model_date}
                        {/* {item.training_model_date
                          .split("T")[0]
                          .concat(" ", item.training_model_date.split("T")[1])} */}
                      </span>
                      <span className="modelName">
                        {(function () {
                          if (item.training_model_name)
                            return item.training_model_name;
                          else return noDataContext;
                        })()}
                      </span>
                      <span className="typeName">{item.training_model_id}</span>
                    </div>
                  );
                else return <span></span>;
              })()}
            </div>
          ))}
        <div className="indexList">
          {modelXmlSets.xmlSetIndexList.length > 0 &&
            modelXmlSets.xmlSetIndexList.map((item, idx) => (
              <span
                key={idx}
                className="indexBox"
                onClick={() => setXmlModelSelectIndex(item)}
              >
                {(function () {
                  if (xmlModelSelectIndex === item)
                    return <span className="selectIndex">{item}</span>;
                  else return <span>{item}</span>;
                })()}
              </span>
            ))}
        </div>
      </div>
      <div className="history">
        <h1> History </h1>
        <h2> 크롤링 </h2>
        {userDataSets.userDataList.length > 0 &&
          userDataSets.userDataList.map((item, idx) => (
            <div key={idx}>
              {(function () {
                if (
                  (userSetSelectIndex - 1) * 4 - 1 < idx &&
                  idx < userSetSelectIndex * 4
                )
                  return (
                    <div className="historyBox">
                      <span className="time">
                        <ScheduleIcon className="iconStyle" />
                        {item.user_data_set_date
                          .split("T")[0]
                          .concat(" ", item.user_data_set_date.split("T")[1])}
                      </span>
                      {(function () {
                        if (item.user_data_set_start)
                          return (
                            <span className="period">
                              <HourglassEmptyIcon className="iconStyle" />
                              {item.user_data_set_start.concat(
                                " ~ ",
                                item.user_data_set_end
                              )}
                            </span>
                          );
                        else
                          return (
                            <span className="period">csv 데이터 입력</span>
                          );
                      })()}
                      <span className="typeName">
                        {(function () {
                          if (dataList)
                            return dataList[item.data_list_id - 1]
                              .data_list_name;
                          else return <span></span>;
                        })()}
                      </span>
                    </div>
                  );
                else return <span></span>;
              })()}
            </div>
          ))}
        <div className="indexList">
          {userDataSets.setIndexList.length > 0 &&
            userDataSets.setIndexList.map((item, idx) => (
              <span
                key={idx}
                className="indexBox"
                onClick={() => setUserSetSelectIndex(item)}
              >
                {(function () {
                  if (userSetSelectIndex === item)
                    return <span className="selectIndex">{item}</span>;
                  else return <span>{item}</span>;
                })()}
              </span>
            ))}
        </div>
        <h2> 분석 및 예측 </h2>
        {predictDataSets.predictDataList.length > 0 &&
          predictDataSets.predictDataList.map((item, idx) => (
            <div key={idx}>
              {(function () {
                if (
                  (predictSelectIndex - 1) * 4 - 1 < idx &&
                  idx < predictSelectIndex * 4
                )
                  return (
                    <div className="historyBox">
                      <span className="time">
                        <ScheduleIcon className="iconStyle" />
                        {item.user_data_predict_date}
                        {/* {item.user_data_predict_date
                          .split("T")[0]
                          .concat(
                            " ",
                            item.user_data_predict_date.split("T")[1]
                          )} */}
                      </span>
                      <span className="period">
                        {(function () {
                          if (item.user_data_predict_name)
                            return item.user_data_predict_name;
                          else return noDataContext;
                        })()}
                      </span>
                      <span className="modelName">
                        {(function () {
                          if (modelLists)
                            return modelLists[item.training_model_id - 1]
                              .training_model_name;
                          else return <span></span>;
                        })()}
                      </span>
                    </div>
                  );
                else return <span></span>;
              })()}
            </div>
          ))}
        <div className="indexList">
          {predictDataSets.setIndexList.length > 0 &&
            predictDataSets.setIndexList.map((item, idx) => (
              <span
                key={idx}
                className="indexBox"
                onClick={() => setPredictSelectIndex(item)}
              >
                {(function () {
                  if (predictSelectIndex === item)
                    return <span className="selectIndex">{item}</span>;
                  else return <span>{item}</span>;
                })()}
              </span>
            ))}
        </div>
        <h2> 딥러닝 모델 </h2>
        {modelSets.modelList.length > 0 &&
          modelSets.modelList.map((item, idx) => (
            <div key={idx}>
              {(function () {
                if (
                  (modelSelectIndex - 1) * 4 - 1 < idx &&
                  idx < modelSelectIndex * 4
                )
                  return (
                    <div className="historyBox">
                      <span className="time">
                        <ScheduleIcon className="iconStyle" />
                        {item.training_model_date}
                        {/* {item.training_model_date
                          .split("T")[0]
                          .concat(" ", item.training_model_date.split("T")[1])} */}
                      </span>
                      <span className="period">
                        {(function () {
                          if (item.training_model_name)
                            return item.training_model_name;
                          else return noDataContext;
                        })()}
                      </span>
                      <span className="typeName">{item.training_model_id}</span>
                    </div>
                  );
                else return <span></span>;
              })()}
            </div>
          ))}
        <div className="indexList">
          {modelSets.setIndexList.length > 0 &&
            modelSets.setIndexList.map((item, idx) => (
              <span
                key={idx}
                className="indexBox"
                onClick={() => setModelSelectIndex(item)}
              >
                {(function () {
                  if (modelSelectIndex === item)
                    return <span className="selectIndex">{item}</span>;
                  else return <span>{item}</span>;
                })()}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
