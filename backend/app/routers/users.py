# 표준 라이브러리
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from database import crud, schemas
from dependency import get_db


router = APIRouter()


# 유저 생성
@router.post(
    "/users/create/", response_model=schemas.User, tags=["users"], description="유저 생성"
)
def create_user(user: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


# 모든 유저 확인
@router.get("/users/all/", tags=["users"], description="모든 유저 확인")
def show_all_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db=db)