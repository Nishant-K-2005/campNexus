import requests
import os 

def getTextFromImg(imgFile):
    open_ocr_url = "https://api.ocr.space/parse/image"
    imgFile.file.seek(0)
    files = {'file':(imgFile.filename, imgFile.file, imgFile.content_type)}
    res = requests.post(open_ocr_url,headers={
        "apikey": os.getenv('OCR_API_KEY'),
    },files=files)
    res = res.json()
    return res['ParsedResults'][0]['ParsedText']