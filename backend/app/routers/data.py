# 표준 라이브러리
from sys import path as pth
from os import path
import time

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import models, schemas
from dependency import get_db


router = APIRouter()


# 데이터 목록 확인
@router.get("/api/data/datalist/all", tags=["datalist"], description="모든 데이터 목록 확인")
def show_all_data_list(db: Session = Depends(get_db)):
    return {"data_list": db.query(models.DataList).all()}


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
@router.get("/api/data/dataset/all", tags=["dataset"], description="모든 데이터 셋 확인")
def show_all_data_set(db: Session = Depends(get_db)):
    return {"data_set": db.query(models.DataSet).all()}


# 데이터 목록 id별 데이터 셋 확인
@router.get(
    "/api/data/dataset/select/{data_list_id}",
    tags=["dataset"],
    description="선택된 id의 데이터 셋 확인",
)
def show_select_data_set(data_list_id: int, db: Session = Depends(get_db)):
    return {
        "data_set": db.query(models.DataSet)
        .filter(models.DataSet.data_list_id == data_list_id)
        .all()
    }


# 모든 유저 데이터 셋 확인
@router.get(
    "/api/data/userdataset/all", tags=["userdataset"], description="모든 유저 데이터 셋 확인"
)
def show_all_user_data_set(db: Session = Depends(get_db)):
    return {"user_data_set": db.query(models.UserDataSet).all()}


# 선택된 유저의 데이터 확인
@router.get(
    "/api/data/userdataset/select/{user_id}",
    tags=["userdataset"],
    description="선택된 유저의 데이터 확인",
)
def show_select_user_data_set(user_id: str, db: Session = Depends(get_db)):
    if check_user(user_id):
        raise HTTPException(status_code=400, detail="유저가 유효하지 않습니다.")
    return {
        "user_data_set": db.query(models.UserDataSet)
        .filter(models.UserDataSet.user_id == user_id)
        .all()
    }


# 해당 데이터의 현재 상태 xml 저장
@router.put(
    "/api/data/userdataset/xml/update/{user_data_set_id}",
    tags=["userdataset"],
    description="해당 데이터의 현재 상태 xml 저장",
)
def show_update_user_data_set(
    user_data_set_id: int, user_data_set_xml: str, user_data_set_name: str = None, db: Session = Depends(get_db)
):
    db_data = (
        db.query(models.UserDataSet)
        .filter(models.UserDataSet.user_data_set_id == user_data_set_id)
        .first()
    )
    db_data.user_data_set_xml = user_data_set_xml
    if user_data_set_name:
        db_data.user_data_set_name = user_data_set_name
    db.commit()
    db.refresh(db_data)

    return {"user_data_set": db_data}


# 선택된 유저의 저장된 데이터 가져오기
@router.get(
    "/api/data/userdataset/xml/get/{user_id}",
    tags=["userdataset"],
    description="선택된 유저의 저장된 데이터 가져오기",
)
def get_xml_user_data_set(user_id: str, db: Session = Depends(get_db)):
    if check_user(user_id):
        raise HTTPException(status_code=400, detail="유저가 유효하지 않습니다.")
    return {
        "user_data_set": db.query(models.UserDataSet)
        .filter(models.UserDataSet.user_id == user_id)
        .filter(models.UserDataSet.user_data_set_xml != None)
        .all()
    }


# 선택된 유저 데이터 셋의 기간 데이터 반환
@router.get(
    "/api/data/userdataset/{user_data_set_id}",
    tags=["userdataset"],
    description="선택된 유저 데이터 셋의 기간 데이터 반환",
)
def show_period_user_data_set(user_data_set_id: int, db: Session = Depends(get_db)):
    data = (
        db.query(models.UserDataSet)
        .filter(models.UserDataSet.user_data_set_id == user_data_set_id)
        .all()
    )
    if data:
        data = data[0]
        if data.user_data_set_start and data.user_data_set_end:
            return {
                "data_set": db.query(models.DataSet)
                .filter(models.DataSet.data_list_id == data.data_list_id)
                .filter(models.DataSet.data_set_date >= data.user_data_set_start)
                .filter(models.DataSet.data_set_date <= data.user_data_set_end)
                .all()
            }
        raise HTTPException(status_code=400, detail="해당 데이터는 기간 데이터가 아닌 csv 입력 데이터입니다.")
    else:
        raise HTTPException(status_code=400, detail="유저 데이터 목록에 없는 데이터입니다.")


# 유저 데이터 셋 생성
def create_user_data_set(db: Session, data: schemas.UserDataSetBase):
    db_stocks = models.UserDataSet(
        data_list_id=data.data_list_id,
        user_id=data.user_id,
        user_data_set_start=data.user_data_set_start,
        user_data_set_end=data.user_data_set_end,
        user_data_set_date=time.localtime(),
    )
    db.add(db_stocks)
    db.commit()
    db.refresh(db_stocks)

    return db_stocks


# 트레이닝 모델 데이터 확인
@router.get(
    "/api/data/trainingmodel/all", tags=["trainingmodel"], description="트레이닝 모델 데이터 확인"
)
def show_all_training_model(db: Session = Depends(get_db)):
    return {"training_model": db.query(models.TrainingModel).all()}


# 선택된 유저의 트레이닝 모델 데이터 확인
@router.get(
    "/api/data/trainingmodel/select/{user_id}",
    tags=["trainingmodel"],
    description="선택된 유저의 트레이닝 모델 데이터 확인",
)
def show_select_training_model(user_id: str, db: Session = Depends(get_db)):
    if check_user(user_id):
        raise HTTPException(status_code=400, detail="유저가 유효하지 않습니다.")
    return {
        "training_model": db.query(models.TrainingModel)
        .filter(models.TrainingModel.user_id == user_id)
        .all()
    }


# 유저 확인
def check_user(user_id: str):
    if len(user_id) == 28:
        return False
    else:
        return True