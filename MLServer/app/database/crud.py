# 서드 파티 라이브러리
from sqlalchemy.orm import Session

# 로컬
from . import models


# 스톡 목록 확인
def get_all_stocks(db: Session):
    return db.query(models.Stock).all()


# 주식 코드와 일치한 목록 확인
def get_stocks_by_code(db: Session, code: str):
    return db.query(models.Stock).filter(models.Stock.code == code).all()