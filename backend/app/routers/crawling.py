# 표준 라이브러리
import time
import urllib.request as req

# 서드 파티 라이브러리
from bs4 import BeautifulSoup
from fastapi import APIRouter


router = APIRouter()


# 주식 현재가를 국가 및 기업code별 크롤링
@router.get(
    "/api/crawling/{nation}/{code}/",
    tags=["crawling"],
    description="주식 현재가를 국가 및 기업code별 크롤링",
)
def crawling_current_stock(code: str, nation: str):
    # 야후는 robots.txt를 보고 크롤링해도 되는 것 확인.
    if nation == "US":
        url = "https://finance.yahoo.com/quote/" + code + "?p=" + code
    else:
        url = (
            "https://finance.yahoo.com/quote/"
            + code
            + "."
            + nation
            + "?p="
            + code
            + "."
            + nation
        )
    html = req.urlopen(url).read()
    soup = BeautifulSoup(html, "html.parser")
    point = soup.find_all(class_="Mend(20px)")
    data = point[1].find("span")
    list_data = str(data).split(">")[1].split("<")[0].split(".")[0].split(",")
    res_data = 0

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
        "code": code,
        "date": date,
        "current_stock": res_data,
    }