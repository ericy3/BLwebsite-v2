import boto3
import psycopg2

from typing import List
from pydantic import BaseModel

import uvicorn
from fastapi import FastAPI, UploadFile

S3_BUCKET_NAME = "berkeleylegendsphotos"

app = FastAPI(debug=True)

class PhotoModel(BaseModel):
    id: int
    photo_name: str
    photo_url: str
    is_deleted: bool

@app.get("/status")
async def status():
    return "Hello World!" 

@app.get("/photos", response_model=List(PhotoModel))
async def get_all_photos():
    # connect to database
    connection = psycopg2.connect(
        database="blphotosdb", user="docker", password="docker", host="0.0.0.0"
    )
    curr = connection.cursor()
    curr.execute("SELECT * FROM photos ORDER BY id DESC")
    rows = curr.fetchall() 

    formatted_photos = []
    for row in rows:
        formatted_photos.append(
            PhotoModel(
                id=row[0],
                photo_name=row[1],
                photo_url=row[2],
                is_deleted=row[3]
            )
        )
        
    curr.close()
    connection.close()
    return formatted_photos

@app.post("/photos", status_code=201)
async def add_photo(file: UploadFile):
    print("Create endpoint hit")
    print(file.filename)
    print(file.content_type)

    # upload file to AWS S3
    s3 = boto3.resource("s3")
    bucket = s3.BUCKET(S3_BUCKET_NAME)
    #public read means everyone can see the photo not always best in production but most stuff on website will be public regardless
    bucket.upload_fileobj(file.file, file.filename, ExtraArgs={'ACL': 'public-read'})
    
    uploaded_file_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file.filename}"

    # store URL in database
    connection = psycopg2.connect(
         database="blphotosdb", user="docker", password="docker", host="0.0.0.0"
    )
    current = connection.cursor()
    current.execute(
        f"INSERT INTO photos (photo_name, photo_url) VALUES ('{file.filename}', '{uploaded_file_url}')"
    )
    current.commit()
    current.close()
    connection.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)

