# 서드파티 라이브러리
from fastapi import FastAPI
import uvicorn

# 로컬
from database import database, models
from routers.crawling import router as crawling_router
from routers.users import router as users_router
from routers.stocks import router as stocks_router


models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()
app.include_router(crawling_router)
app.include_router(users_router)
app.include_router(stocks_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)