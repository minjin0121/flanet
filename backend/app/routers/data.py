# 표준 라이브러리
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import models, schemas
from dependency import get_db


router = APIRouter()


# 데이터 목록 확인
@router.get("/api/data/datalist/all", tags=["data"], description="모든 데이터 목록 확인")
def show_all_data_list(db: Session = Depends(get_db)):
    return db.query(models.DataList).all()


# 데이터 셋 유효성 검사
def check_data_set(date, id, db):
    if (
        db.query(models.DataSet)
        .filter(models.DataSet.data_list_id == id)
        .filter(models.DataSet.data_set_date == date)
        .first()
    ):
        return False
    if db.query(models.DataList).filter(models.DataList.data_list_id == id).first():
        if id and date:
            return True


# 데이터 셋 생성
def create_data_set(db: Session, data: schemas.DataSet):
    db_stocks = models.DataSet(
        data_set_date=data.data_set_date,
        data_list_id=data.data_list_id,
        data_set_value=data.data_set_value,
    )
    db.add(db_stocks)
    db.commit()
    db.refresh(db_stocks)

    return db_stocks


# 데이터 셋 확인
@router.get("/api/data/dataset/all", tags=["data"], description="모든 데이터 셋 확인")
def show_all_data_set(db: Session = Depends(get_db)):
    return db.query(models.DataSet).all()


# 데이터 목록 id별 데이터 셋 확인
@router.get("/api/data/dataset/select/{data_list_id}", tags=["data"], description="선택된 id의 데이터 셋 확인")
def show_select_data_set(data_list_id: int, db: Session = Depends(get_db)):
    return db.query(models.DataSet).filter(models.DataSet.data_list_id == data_list_id).all()


# 모든 유저 데이터 셋 확인
@router.get("/api/data/userdataset/all", tags=["data"], description="모든 유저 데이터 셋 확인")
def show_all_user_data_set(db: Session = Depends(get_db)):
    return db.query(models.UserDataSet).all()


# 선택된 유저의 데이터 확인
@router.get("/api/data/userdataset/select/{user_id}", tags=["data"], description="선택된 유저의 데이터 확인")
def show_select_data_set(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.UserDataSet).filter(models.UserDataSet.user_id == user_id).all()


# 유저 데이터 셋 생성
def create_user_data_set(db: Session, data: schemas.UserDataSetBase):
    db_stocks = models.UserDataSet(
        data_list_id=data.data_list_id,
        user_id=data.user_id,
        user_data_set_start=data.user_data_set_start,
        user_data_set_end=data.user_data_set_end,
        user_data_set_path=data.user_data_set_path
    )
    db.add(db_stocks)
    db.commit()
    db.refresh(db_stocks)

    return db_stocks