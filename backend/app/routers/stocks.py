# 표준 라이브러리
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
import pandas as pd

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import crud, models, schemas
from dependency import get_db

import model.prophet as pr
import csv
import codecs
import io

router = APIRouter()


# 주식 데이터 입력
@router.post("/stocks/store/", tags=["stocks"], description="주식 데이터 직접 입력")
def get_stock_data(stocks_data: schemas.StockBase, db: Session = Depends(get_db)):
    # 데이터 예외 처리 필요.
    return create_stocks_data(db=db, stocks_data=stocks_data)


# 주식 초기 데이터 입력
@router.get("/stocks/initdata/", tags=["stocks"], description="주식 초기 데이터 입력")
def create_init_stock(db: Session = Depends(get_db)):
    # 초기 데이터 예외 처리 필요.
    data = pd.read_csv("assets/005930.csv", usecols=["날짜", "종가"])
    data_list = data.values
    for i in range(len(data_list)):
        code = "005930"
        split_list = data_list[i][0].split()
        year = int(split_list[0].rstrip("년"))
        month = int(split_list[1].rstrip("월"))
        day = int(split_list[2].rstrip("일"))
        current_stock = 0
        list_data = data_list[i][1].split(",")
        for j in range(len(list_data) - 1, -1, -1):
            current_stock += int(list_data[len(list_data) - 1 - j]) * 1000 ** j
        db_stocks = models.Stock(
            code=code, year=year, month=month, day=day, current_stock=current_stock
        )
        db.add(db_stocks)
        db.commit()
    return len(data_list)


# 주식 데이터 생성
def create_stocks_data(db: Session, stocks_data: schemas.StockBase):
    db_stocks = models.Stock(
        code=stocks_data.code,
        year=stocks_data.year,
        month=stocks_data.month,
        day=stocks_data.day,
        current_stock=stocks_data.current_stock,
    )
    db.add(db_stocks)
    db.commit()
    db.refresh(db_stocks)
    return db_stocks


# 모든 주식 데이터 확인
@router.get("/stocks/all/", tags=["stocks"], description="모든 주식 데이터 확인")
def show_all_users(db: Session = Depends(get_db)):
    return crud.get_all_stocks(db=db)


# csv파일 데이터 예측
@router.post("/stocks/predict/csv", tags=["stocks"], description="csv 주식 파일 예측")
def analysis_stocks_simple_csv(
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
@router.post("/stocks/predict/db", tags=["stocks"], description="주가 코드로 데이터 예측")
def analysis_stocks_simple_DB(
    code: str = Form(...), periods: int = Form(...), db: Session = Depends(get_db)
):
    stock_list = crud.get_stocks_by_code(db=db, code=code)

    df = pd.DataFrame(columns=["Date", "CurrentStock"])
    for sk in stock_list:
        conv_date = str(sk.year) + "-" + str(sk.month) + "-" + str(sk.day)
        df = df.append(
            {"Date": conv_date, "CurrentStock": str(sk.current_stock)},
            ignore_index=True,
        )

    df = pd.read_csv(io.StringIO(df.to_csv()), index_col="Date")  # 기본 인덱스는 날짜기준.
    df.sort_values(by=["Date"], axis=0, inplace=True)  # date 기준 내림차순 정렬

    return pr.prophet_stock(df, "CurrentStock", periods)


# csv -> DataFrame 변환
def to_df(file):
    data = file.file
    data = csv.reader(codecs.iterdecode(data, "utf-8"), delimiter="\t")
    header = data.__next__()
    df = pd.DataFrame(data, columns=header)
    return df