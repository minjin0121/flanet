# 서드 파티 라이브러리
from pydantic import BaseModel
from sqlalchemy import Date


# 데이터 목록 베이스
class DataListBase(BaseModel):
    data_list_type: str
    data_list_name: str
    data_list_url: str
    stock_code: str


# 상속된 데이터 목록과 데이터 목록의 디폴트 값 생성
class DataList(DataListBase):
    data_list_id: int

    class Config:
        orm_mode = True


# 데이터 셋 베이스
class DataSet(BaseModel):
    data_set_date: str
    data_list_id: int
    data_set_value: float