from fastapi import FastAPI
from app.routes import score
from app.routes import embedding
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

@app.get("/")
def home():
    return {"message":"FastAPI is working"}

app.include_router(score.router)
app.include_router(embedding.router)
