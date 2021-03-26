# 표준 라이브러리
from sys import path as pth
from os import path
import csv
import codecs
import io

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import requests

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import crud
from dependency import get_db
import model.prophet as pr

from io import StringIO

router = APIRouter()


@router.post("/ml/prophet/stock/", tags=["prophet"], description=" 데이터 입력")
def analysis_prophet(
    user_data_set_id: int,
    periods: int,
    cps: float,
    db: Session = Depends(get_db),
):
    data = crud.get_user_data_set(user_data_set_id=user_data_set_id, db=db)

    # csv
    if data.user_data_set_start == None:
        original_df = csv_data_call(data)
        df = pd.read_csv(io.StringIO(original_df.to_csv()), index_col="Date")
        df = df.drop(["Unnamed: 0"], axis=1)
    # 기간별
    else:
        original_df = db_data_call(data, db=db)
        df = pd.read_csv(io.StringIO(original_df.to_csv()), index_col="Date")  # 기본 인덱스는 날짜기준.
        df.sort_values(by=["Date"], axis=0, inplace=True)  # date 기준 내림차순 정렬
        df = df.drop(["Unnamed: 0"], axis=1)

    # 호출
    result = pr.prophet_stock(df, "Close", periods, cps, original_df)

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


# 파일 받아오기
def csv_data_call(data):
    try:
        files = requests.get(
            f"https://j4f002.p.ssafy.io/csv/download/userdataset/bytes/{data.user_data_set_id}",
        ).json()

    except:
        raise HTTPException(status_code=400, detail="호출 X")
    data = StringIO(files["file"])
    df = pd.read_csv(data, delimiter="\t")
    df = df[["Date", "Close"]]
    return df


# 긱간과 코드 정보 가져오기
def db_data_call(data, db: Session):
    # 디비에서 호출
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