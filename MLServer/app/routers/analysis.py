# 표준 라이브러리
from sys import path as pth
from os import path, remove
import csv
import codecs
import io

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
import pandas as pd
import requests


# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import crud
from dependency import get_db
import model.prophet as pr
import model.tf as tf

from io import StringIO

router = APIRouter()


@router.post("/ml/prophet/stock/", tags=["prophet"], description=" 데이터 입력")
def analysis_prophet(
    user_data_set_id: int,
    periods: int,
    cps: float,
    db: Session = Depends(get_db),
):
    analysis_value = "Close"
    data = crud.get_user_data_set(user_data_set_id=user_data_set_id, db=db)

    # csv
    if data.user_data_set_start == None:  # 7
        original_df, analysis_value = csv_data_call(data)
        df = pd.read_csv(io.StringIO(original_df.to_csv()), index_col="Date")
        df = df.drop(["Unnamed: 0"], axis=1)
    # 기간별
    else:
        original_df = db_data_call(data, db=db)
        df = pd.read_csv(io.StringIO(original_df.to_csv()), index_col="Date")  # 기본 인덱스는 날짜기준.
        df.sort_values(by=["Date"], axis=0, inplace=True)  # date 기준 내림차순 정렬
        df = df.drop(["Unnamed: 0"], axis=1)

    # 호출
    result = pr.prophet_stock(df, analysis_value, periods, cps, original_df)

    # 1.모델 임시 생성 (1번 prphet_test로 임의 생성)
    # 2.사용자-데이터 분석에 결과 저장
    predict_data = crud.insert_user_data_predict(
        user_data_set_id=data.user_data_set_id,
        training_model_id=1,
        user_id=data.user_id,
        user_data_predict_name="test",
        db=db,
    )

    # 3. 분석 결과 저장
    data = {"user_data_predict_id": predict_data.user_data_predict_id}
    upload = {"file": result.encode("utf-8")}
    try:
        requests.post(
            "https://j4f002.p.ssafy.io/csv/upload/userpredictdata",
            files=upload,
            data=data,
        )
    except:
        raise HTTPException(status_code=400, detail="호출 X")

    return result


@router.post("/ml/tensorflow/input", tags=["tensorflow"], description="데이터 입력")
def data_input(
    user_data_set_id: int = Form(...),
    db: Session = Depends(get_db),
):
    data = crud.get_user_data_set(user_data_set_id=user_data_set_id, db=db)

    # csv
    if data.user_data_set_start == None:
        original_df = csv_data_call(data)
        df = pd.read_csv(io.StringIO(original_df.to_csv()))
        df = df.drop(["Unnamed: 0"], axis=1)
    # 기간별
    else:
        original_df = db_data_call(data, db=db)
        df = pd.read_csv(io.StringIO(original_df.to_csv()))  # 기본 인덱스는 날짜기준.
        df.sort_values(by=["Date"], axis=0, inplace=True)  # date 기준 내림차순 정렬
        df = df.drop(["Unnamed: 0"], axis=1)

    return df.to_csv(index=False)


@router.post("/ml/tensorflow/preprocess", tags=["tensorflow"], description="데이터 전처리")
def data_preprocessing(input_data: str = Form(...)):
    return tf.data_preprocessing(input_data)


@router.post("/ml/tensorflow/cnn/training", tags=["tensorflow"], description="CNN Model Training")
def model_training(
    input_data: str = Form(...),
    training_model_id: int = Form(...),
    user_id: str = Form(...),
    db: Session = Depends(get_db),
):
    return tf.cnn_model_training(input_data, training_model_id, user_id, db)


@router.post("/ml/tensorflow/lstm/training", tags=["tensorflow"], description="LSTM Model Training")
def model_training(
    input_data: str = Form(...),
    training_model_id: int = Form(...),
    user_id: str = Form(...),
    db: Session = Depends(get_db),
):
    return tf.lstm_model_training(input_data, training_model_id, user_id, db)


@router.post("/ml/tensorflow/evaluate", tags=["tensorflow"], description="Model Evaluate")
def model_evaluate(input_data: str = Form(...), training_model_id: int = Form(...)):
    return tf.model_evaluate(input_data, training_model_id)


@router.post("/ml/tensorflow/predict", tags=["tensorflow"], description="Model Predict")
def model_predict(
    input_data: str = Form(...), training_model_id: int = Form(...), period: int = Form(...)
):
    return tf.predict_future(input_data, training_model_id, period)


# 파일 받아오기
def csv_data_call(data):
    try:
        files = requests.get(
            f"https://j4f002.p.ssafy.io/csv/download/userdataset/bytes/{data.user_data_set_id}",
        ).json()

    except:
        raise HTTPException(status_code=400, detail="호출 X")
    data = StringIO(files["file"])
    df = pd.read_csv(data, delimiter=",")

    s = set(["Date", "Close"])
    analysis_value = "Close"

    if s.issubset(set(df.columns)):
        df = df[["Date", "Close"]]
    else:
        analysis_value = "Temp"
        df = df[["Date", "Temp"]]

    return df, analysis_value


# 긱간과 코드 정보 가져오기
def db_data_call(data, db: Session):
    stock_list = crud.get_data_list_by_id_date(
        db=db,
        start_date=data.user_data_set_start,
        end_date=data.user_data_set_end,
        code=data.data_list_id,
    )

    df = pd.DataFrame(columns=["Date", "Close"])  # date -> ds 변경

    for sk in stock_list:
        df = df.append(
            {"Date": sk.data_set_date, "Close": str(sk.data_set_value)},
            ignore_index=True,
        )

    return df