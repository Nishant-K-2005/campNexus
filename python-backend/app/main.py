from fastapi import FastAPI
from app.routes import score
from app.routes import embedding
from dotenv import load_dotenv
import uvicorn
import os

load_dotenv()
app = FastAPI()

@app.get("/")
def home():
    return {"message":"FastAPI is working"}

if  __name__ == "__main__":
    port = int(os.getenv("PORT"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)

app.include_router(score.router)
app.include_router(embedding.router)
