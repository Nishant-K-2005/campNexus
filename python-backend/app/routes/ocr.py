"""
OCR Route — POST /api/ocr

Accepts a file upload, detects MIME type, extracts text via:
  - OCR.space API (for images)
  - PyMuPDF / python-docx / python-pptx (for documents)

Returns: { extracted_text: str }
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
import magic
from app.services.img_parsing_service import getTextFromImg
from app.services.doc_parsing_service import parseFiles

router = APIRouter(
    prefix="/api",
    tags=['ocr']
)

@router.post("/ocr")
async def extractText(file: UploadFile = File(...)):
    """
    Extract text from an uploaded file (image or document).
    
    - Images: OCR via ocr.space
    - PDF / DOCX / PPTX / CSV / XLSX: direct text extraction
    
    Returns:
        { extracted_text: str }
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    mime = magic.from_buffer(content, mime=True)
    mime_type = mime.split('/')[0]

    extracted_text = ""
    try:
        if mime_type == "image":
            extracted_text = getTextFromImg(file, content)
        else:
            extracted_text = await parseFiles(file, mime, content)
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to extract text from file: {str(e)}"
        )

    return {
        "extracted_text": extracted_text or "",
        "mime_type": mime,
        "filename": file.filename
    }
