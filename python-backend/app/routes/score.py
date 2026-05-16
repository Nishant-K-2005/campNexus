from fastapi import APIRouter,UploadFile,File,Form
from typing import Optional
import magic
from app.services.img_parsing_service import getTextFromImg
from app.services.similarity_service import calculateSimilarity
from app.services.doc_parsing_service import parseFiles

router = APIRouter(
    prefix="/scores",
    tags=['scores']
)

@router.post("/getScore")
async def getScore(
    category: str = Form(...),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
    ):
    print("Request received")
    print(category)
    inputText = ""
    if file:
        content = await file.read()
        mime = magic.from_buffer(content, mime=True)
        x = mime.split('/')
        if x[0]=="image":
            inputText += getTextFromImg(file)
        else:
            inputText += await parseFiles(file, mime)
    if text:
        inputText += text
    data = calculateSimilarity(inputText,category)
    return {
        "score":data["score"],
        "community_embedding":data["categoryEmbedding"],
        "content_embedding": data["contentEmbedding"]
    }
    