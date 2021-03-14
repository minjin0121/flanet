# 서드 파티 라이브러리
from sqlalchemy import Column, Integer, String, ForeignKey

# 로컬
from .database import Base


# 스톡 테이블
class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), index=True)
    date = Column(String(15), index=True)
    current_stock = Column(Integer, index=True)