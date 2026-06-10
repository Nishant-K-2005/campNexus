from fastapi import APIRouter,UploadFile,File,Form, HTTPException
from typing import Optional
import magic
from app.services.img_parsing_service import getTextFromImg
from app.services.doc_parsing_service import parseFiles
from app.services.embedding_service import generateEmbedding

router = APIRouter(
    prefix="/api",
    tags=['embedding']
)

@router.post("/embeddings")
async def getEmbedding(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
    ):
    if text is None and file is None:
        raise HTTPException(
            status_code=400,
            detail="Either text or file should be provided"
        )
    
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
    embedding = generateEmbedding(inputText)
    embedding = embedding.tolist()
    return {
        "embedding":embedding
    }
    