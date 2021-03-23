# 표준 라이브러리
import time, json
import urllib.request as req
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from dependency import get_db
from database import models, schemas
from routers.data import create_user_data_set


router = APIRouter()


# 크롤링 코드 반환
@router.get(
    "/api/code/crawling/{data_list_id}",
    tags=["code"],
    description="실시간 크롤링 코드 반환",
)
def crawling_stock_code(data_list_id: int, db: Session = Depends(get_db)):
    url = (
        db.query(models.DataList)
        .filter(models.DataList.data_list_id == data_list_id)
        .first()
    )

    s = []
    s.append("import urllib.request as req")
    s.append("from bs4 import BeautifulSoup")
    s.append(f"html = req.urlopen('{url.data_list_url}').read()")
    s.append("soup = BeautifulSoup(html, 'html.parser')")

    return {"code": s}


# 기간별 주식 크롤링 코드 반환
@router.get(
    "/api/code/crawling/{data_list_id}/stock/period",
    tags=["code"],
    description="기간별 주식 크롤링 코드 반환",
)
def crawling_stock_code(data_list_id: int, db: Session = Depends(get_db)):
    url = (
        db.query(models.DataList)
        .filter(models.DataList.data_list_id == data_list_id)
        .first()
    )
    
    tmp = url.data_list_url.split("?")
    url = tmp[0] + "/history?" + tmp[1]
    s = []
    s.append("import urllib.request as req")
    s.append("from bs4 import BeautifulSoup")
    s.append(f"html = req.urlopen('{url}').read()")
    s.append("soup = BeautifulSoup(html, 'html.parser')")

    return {"code": s}


# 실시간 크롤링 데이터 전처리 코드 반환
@router.get(
    "/api/code/dataprocessing/stock",
    tags=["code"],
    description="실시간 크롤링 데이터 전처리 코드 반환",
)
def crawling_stock_dataprocessing_code():
    s = []
    s.append("point = soup.find_all(class_='Mend(20px)')")
    s.append("data = point[1].find('span')")
    s.append("print(str(data).split('>')[1].split('<')[0])")

    return {"code": s}


# 실시간 크롤링 데이터 전처리 코드 반환
@router.get(
    "/api/code/dataprocessing/stock/period",
    tags=["code"],
    description="기간 크롤링 데이터 전처리 코드 반환",
)
def crawling_period_stock_dataprocessing_code():
    s = []    
    s.append("point = soup.find_all('td')")
    s.append("for i in range(4, len(point), 7):")
    s.append("  print(str(point[i]).split('>')[2].split('<')[0])")

    return {"code": s}