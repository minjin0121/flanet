# 표준 라이브러리
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import crud, models, schemas
from dependency import get_db


router = APIRouter()


# 주식 데이터 입력
@router.post("/api/stocks/store/", tags=["stocks"], description="주식 데이터 직접 입력")
def get_stock_data(stocks_data: schemas.StockBase, db: Session = Depends(get_db)):
    if stocks_data.current_stock > 0:
        if (
            len(stocks_data.date) == 10
            and stocks_data.date[4] == "-"
            and stocks_data.date[7] == "-"
        ):
            return create_stocks_data(db=db, stocks_data=stocks_data)
        raise HTTPException(status_code=400, detail="날짜형식이 맞지 않습니다.")
    raise HTTPException(status_code=400, detail="주식 가격은 0원 or 0달러 이상이어야 합니다.")


# 주식 초기 데이터 입력
@router.get("/api/stocks/initdata/{code}/", tags=["stocks"], description="주식 초기 데이터 입력")
def create_init_stock(code: str, db: Session = Depends(get_db)):
    # 초기 데이터 예외 처리 필요.
    if code == "005930":
        data = pd.read_csv("assets/005930.KS.csv", usecols=["Date", "Close"])
    elif code == "TSLA":
        data = pd.read_csv("assets/TSLA.csv", usecols=["Date", "Close"])
    else:
        raise HTTPException(status_code=400, detail="해당 초기 데이터는 존재하지 않습니다.")

    if crud.get_stocks_by_code(db, code):
        raise HTTPException(status_code=400, detail="이미 입력된 데이터입니다.")

    db_stocks = models.Stock(code=code)
    db.add(db_stocks)
    db.commit()
    data_list = data.values
    cnt = 0

    for i in range(len(data_list)):
        date = data_list[i][0]

        if str(data_list[i][1]) == "nan":
            continue

        current_stock = int(data_list[i][1])
        db_stocks = models.Stock(code=code, date=date, current_stock=current_stock)
        db.add(db_stocks)
        db.commit()
        cnt += 1

    return cnt


# 주식 데이터 생성
def create_stocks_data(db: Session, stocks_data: schemas.StockBase):
    if (
        db.query(models.Stock)
        .filter(models.Stock.date == stocks_data.date)
        .filter(models.Stock.code == stocks_data.code)
        .all()
    ):
        raise HTTPException(status_code=400, detail="이미 입력된 데이터입니다.")

    db_stocks = models.Stock(
        code=stocks_data.code,
        date=stocks_data.date,
        current_stock=stocks_data.current_stock,
    )
    db.add(db_stocks)
    db.commit()
    db.refresh(db_stocks)

    return db_stocks


# 모든 주식 확인
@router.get("/api/stocks/all/", tags=["stocks"], description="모든 주식 확인")
def show_all_stocks(db: Session = Depends(get_db)):
    return crud.get_all_stocks(db=db)


# 주식 데이터 예측
@router.get(
    "/api/stocks/predict/{method}/", tags=["stocks"], description="입력 방법으로 주식 예측"
)
def predict_stocks(method: str):
    return method + "에 대한 ML서버 연결"