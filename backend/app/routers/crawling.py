# 표준 라이브러리
import time
import urllib.request as req
from sys import path as pth
from os import path

# 서드 파티 라이브러리
from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# 로컬
pth.append(path.dirname(path.abspath(path.dirname(__file__))))
from dependency import get_db
from database import models, schemas
from routers.data import create_user_data_set


router = APIRouter()


# 주식 현재가를 국가 및 기업code별 크롤링
@router.get(
    "/api/crawling/stocks/{data_list_id}/",
    tags=["crawling"],
    description="자동 크롤링을 위한 data_list_id별 크롤링",
)
def crawling_current_stock(data_list_id: int, db: Session = Depends(get_db)):
    url = (
        db.query(models.DataList)
        .filter(models.DataList.data_list_id == data_list_id)
        .first()
    )
    if url:
        url = url.data_list_url
        html = req.urlopen(url).read()
        soup = BeautifulSoup(html, "html.parser")
        point = soup.find_all(class_="Mend(20px)")
        data = point[1].find("span")
        list_data = str(data).split(">")[1].split("<")[0].split(".")[0].split(",")
        res_data = str(data).split(">")[1].split("<")[0].split(".")[1]
        res_data = int(res_data) / (len(res_data) ** 10)

        for i in range(len(list_data) - 1, -1, -1):
            res_data += int(list_data[len(list_data) - 1 - i]) * 1000 ** i

        now = time.localtime()
        date = (
            str(now[0])
            + "-"
            + (str(now[1]) if len(str(now[1])) == 2 else ("0" + str(now[1])))
            + "-"
            + (str(now[2]) if len(str(now[2])) == 2 else ("0" + str(now[2])))
        )

        return {
            "data_set_date": date,
            "data_list_id": data_list_id,
            "data_set_value": res_data,
        }
    else:
        raise HTTPException(status_code=400, detail="data_list 미등록 데이터입니다.")


# 주식 현재가를 국가 및 기업code별 크롤링
@router.post(
    "/api/crawling/stocks",
    tags=["crawling"],
    description="사용자를 위한 data_list_id별 크롤링, History 저장",
)
def crawling_current_stock_for_user(
    data: schemas.UserCrawling, db: Session = Depends(get_db)
):
    url = (
        db.query(models.DataList)
        .filter(models.DataList.data_list_id == data.data_list_id)
        .first()
    )
    if url:
        url = url.data_list_url
        html = req.urlopen(url).read()
        soup = BeautifulSoup(html, "html.parser")
        point = soup.find_all(class_="Mend(20px)")
        get_data = point[1].find("span")
        list_data = str(get_data).split(">")[1].split("<")[0].split(".")[0].split(",")
        res_data = str(get_data).split(">")[1].split("<")[0].split(".")[1]
        res_data = int(res_data) / (len(res_data) ** 10)

        for i in range(len(list_data) - 1, -1, -1):
            res_data += int(list_data[len(list_data) - 1 - i]) * 1000 ** i

        now = time.localtime()
        date = (
            str(now[0])
            + "-"
            + (str(now[1]) if len(str(now[1])) == 2 else ("0" + str(now[1])))
            + "-"
            + (str(now[2]) if len(str(now[2])) == 2 else ("0" + str(now[2])))
        )
        db_data = schemas.UserDataSetBase(
            data_list_id=data.data_list_id,
            user_id=data.user_id,
            user_data_set_start=date,
            user_data_set_end=date,
        )
        create_user_data_set(db, db_data)
        return {
            "data_set_date": date,
            "data_list_id": data.data_list_id,
            "data_set_value": res_data,
        }
    else:
        raise HTTPException(status_code=400, detail="data_list 미등록 데이터입니다.")


# 주식 가격을 일정 기간 데이터로 저장 및 반환
@router.post(
    "/api/crawling/stocks/period",
    tags=["crawling"],
    description="사용자에게 주식 가격을 일정 기간 데이터로 반환, History 저장",
)
def crawling_stock_period_data(
    data: schemas.UserDataSetInputBase, db: Session = Depends(get_db)
):
    url = (
        db.query(models.DataList)
        .filter(models.DataList.data_list_id == data.data_list_id)
        .first()
    )
    if url:
        db_data = schemas.UserDataSetBase(
            data_list_id=data.data_list_id,
            user_id=data.user_id,
            user_data_set_start=data.user_data_set_start,
            user_data_set_end=data.user_data_set_end,
        )
        create_user_data_set(db, db_data)

        s_date = transform_date(data.user_data_set_start)
        e_date = transform_date(data.user_data_set_end)

        if s_date == -1 or e_date == -1:
            raise HTTPException(status_code=400, detail="유효한 날짜 데이터가 아닙니다.")

        if s_date > e_date:
            raise HTTPException(status_code=400, detail="시작 날짜가 종료 날짜보다 큽니다.")

        value_data = (
            db.query(models.DataSet)
            .filter(models.DataSet.data_list_id == data.data_list_id)
            .filter(models.DataSet.data_set_date >= data.user_data_set_start)
            .filter(models.DataSet.data_set_date <= data.user_data_set_end)
            .all()
        )
        return value_data
    else:
        raise HTTPException(status_code=400, detail="data_list 미등록 데이터입니다.")


# 날짜 데이터 변환
def transform_date(date):
    try:
        res = int(date[:4]) * 365
        res += int(date[5:7]) * 30
        res += int(date[8:10])
        return res
    except:
        return -1