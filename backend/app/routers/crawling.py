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
from database import models


router = APIRouter()


# 주식 현재가를 국가 및 기업code별 크롤링
@router.get(
    "/api/crawling/stocks/{data_list_id}/",
    tags=["crawling"],
    description="data_list_id별 크롤링",
)
def crawling_current_stock(data_list_id: int, db: Session = Depends(get_db)):
    url = db.query(models.DataList).filter(models.DataList.data_list_id == data_list_id).first().data_list_url
    if url:
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
        return HTTPException(status_code=400, detail="data_list 미등록 데이터입니다.")