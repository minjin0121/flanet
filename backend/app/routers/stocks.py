# 표준 라이브러리
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import pandas as pd

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import crud, models, schemas
from dependency import get_db


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