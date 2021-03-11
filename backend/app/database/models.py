# 서드 파티 라이브러리
from sqlalchemy import Boolean, Column, Integer, String, ForeignKey

# 로컬
from .database import Base


# 유저 테이블
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(20), unique=True, index=True)
    is_active = Column(Boolean, default=True)


# 스톡 테이블
class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True)


# 삼성 주식 테이블
class Samsung(Base):
    __tablename__ = "samsung"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(15), index=True)
    current_stock = Column(Integer, index=True)
    code = Column(String(10), ForeignKey("stocks.code"))


# 테슬라 주식 테이블
class Tesla(Base):
    __tablename__ = "tesla"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(15), index=True)
    current_stock = Column(Integer, index=True)
    code = Column(String(10), ForeignKey("stocks.code"))