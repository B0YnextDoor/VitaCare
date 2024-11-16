from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.container import Container
from routers.base import handler

app = FastAPI(title="VitaCare")
container = Container()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(handler)


@app.get("/")
async def root():
    return {"message": "service is working"}


# uvicorn main:app --port 1337 --reload
