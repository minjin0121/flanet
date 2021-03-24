# 표준 라이브러리
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import models
from dependency import get_db
from routers.data import check_user


router = APIRouter()


# 데이터 목록 확인
@router.get(
    "/api/data/userdatapredict/all",
    tags=["userdatapredict"],
    description="모든 사용자 예측 데이터 확인",
)
def show_all_user_data_predict(db: Session = Depends(get_db)):
    return {"user_data_predict": db.query(models.UserDataPredict).all()}


# 선택된 유저의 사용자 예측 데이터 확인
@router.get(
    "/api/data/userdatapredict/select/{user_id}",
    tags=["userdatapredict"],
    description="선택된 유저의 사용자 예측 데이터 확인",
)
def show_select_user_data_predict(user_id: str, db: Session = Depends(get_db)):
    if check_user(user_id):
        raise HTTPException(status_code=400, detail="유저가 유효하지 않습니다.")
    return {
        "user_data_predict": db.query(models.UserDataPredict)
        .filter(models.UserDataPredict.user_id == user_id)
        .all()
    }
