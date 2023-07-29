import boto3
import psycopg2

import uvicorn
from fastapi import FASTAPI, UploadFile

app = FASTAPI(debug=True)

@app.get("/status")
async def status():
    return "Hello World!" 

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)

