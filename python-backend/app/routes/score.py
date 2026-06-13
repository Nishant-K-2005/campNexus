from fastapi import APIRouter,UploadFile,File,Form
from fastapi import Body
from typing import List
from app.services.img_parsing_service import getTextFromImg
from app.services.similarity_service import calculateSimilarity
from app.services.doc_parsing_service import parseFiles

router = APIRouter(
    prefix="/api",
    tags=['scores']
)


@router.post("/scores")
async def getScore(
    categoryEmbedding: List[float] = Body(...),
    contentEmbedding: List[float] = Body(...)
    ):
    
    data = calculateSimilarity(categoryEmbedding,contentEmbedding)
    
    return {
        "score":data
    }
    