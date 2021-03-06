# 서드 파티 라이브러리
from sqlalchemy.orm import Session

# 로컬
from . import schemas, models


# 유저 생성
def create_user(db: Session, user: schemas.UserBase):
    db_user = models.User(email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# 유저 이메일로 이미 같은 유저가 있는지 확인
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# 유저 목록 확인
def get_all_users(db: Session):
    return db.query(models.User).all()


# 스톡 목록 확인
def get_all_stocks(db: Session):
    return db.query(models.Stock).all()