# 서드 파티 라이브러리
from pydantic import BaseModel


# 유저 베이스
class UserBase(BaseModel):
    email: str


# 상속된 유저 데이터와 유저의 디폴트 값 생성
class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True


# 스톡 베이스
class StockBase(BaseModel):
    code: str
    year: int
    month: int
    day: int
    current_stock: int


# 상속된 스톡 데이터와 스톡의 디폴트 값 생성
class Stock(StockBase):
    id: int

    class Config:
        orm_mode = True
