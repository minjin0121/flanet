# 서드파티 라이브러리
from fastapi import FastAPI
import uvicorn

# 로컬
from database import database, models
from routers.analysis import router as analysis_router


models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()
app.include_router(analysis_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8081, reload=True)