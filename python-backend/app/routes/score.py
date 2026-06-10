from fastapi import APIRouter,UploadFile,File,Form
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
    categoryEmbedding: List[float],
    contentEmbedding: List[float]
    ):
    
    data = calculateSimilarity(categoryEmbedding,contentEmbedding)
    
    return {
        "score":data
    }
    