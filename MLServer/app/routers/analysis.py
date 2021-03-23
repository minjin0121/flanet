# 표준 라이브러리
from sys import path as pth
from os import path
import csv
import codecs
import io

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import crud
from dependency import get_db
import model.prophet as pr


router = APIRouter()


# 주식 데이터 입력
@router.post("/prophet/csv/", tags=["stock"], description="주식코드 데이터 csv 입력")
def analysis_stocks_csv(
    my_file: UploadFile = File(...),
    item: str = Form(...),
    date_column: str = Form(...),
    periods: int = Form(...),
):
    df = to_df(my_file)
    df = pd.DataFrame(df)
    df = pd.read_csv(io.StringIO(df.to_csv()), index_col=date_column)
    return pr.prophet_stock(df, item, periods)


# 주가 코드로 데이터 예측
@router.post("/prophet/db/", tags=["stock"], description="DB 데이터 예측")
def analysis_stocks_DB(
    code: str = Form(...), periods: int = Form(...), db: Session = Depends(get_db)
):
    stock_list = crud.get_stocks_by_code(db=db, code=code)

    df = pd.DataFrame(columns=["Date", "CurrentStock"])

    for sk in stock_list:
        df = df.append(
            {"Date": sk.date, "CurrentStock": str(sk.current_stock)},
            ignore_index=True,
        )
    
    df = pd.read_csv(io.StringIO(df.to_csv()), index_col="Date")  # 기본 인덱스는 날짜기준.
    df.sort_values(by=["Date"], axis=0, inplace=True)  # date 기준 내림차순 정렬
    df = df.drop(["Unnamed: 0"], axis=1)
    print(df)
    return pr.prophet_stock(df, "CurrentStock", periods)


# csv -> DataFrame 변환
def to_df(file):
    data = file.file
    data = csv.reader(codecs.iterdecode(data, "utf-8"), delimiter="\t")
    header = data.__next__()
    df = pd.DataFrame(data, columns=header)
    return df