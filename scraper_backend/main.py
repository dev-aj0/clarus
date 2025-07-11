from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
import httpx
from bs4 import BeautifulSoup
from typing import Optional

app = FastAPI()

# Add CORS middleware for frontend integration
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def health_check():
    return {"status": "ok"}

class ScrapeRequest(BaseModel):
    url: HttpUrl

class ScrapeResponse(BaseModel):
    text: str
    title: Optional[str]
    url: str

@app.post("/scrape", response_model=ScrapeResponse)
async def scrape_url(req: ScrapeRequest):
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(str(req.url), follow_redirects=True)
        if resp.status_code != 200:
            raise HTTPException(
                status_code=404,
                detail=f"Failed to fetch URL. This site may block automated scrapers or require login. If this is a social media post (e.g., X/Twitter), please copy and paste the content manually."
            )
        soup = BeautifulSoup(resp.text, "html.parser")
        # Try to extract main content
        main = soup.find('main') or soup.find('article') or soup.body
        text = main.get_text(separator=' ', strip=True) if main else soup.get_text(separator=' ', strip=True)
        title = soup.title.string.strip() if soup.title else None
        if not text or len(text) < 100:
            raise HTTPException(
                status_code=422,
                detail="Content too short or not found. This site may block automated scrapers or require login. If this is a social media post (e.g., X/Twitter), please copy and paste the content manually."
            )
        return ScrapeResponse(text=text, title=title, url=str(req.url))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scraping failed: {str(e)}. If this is a social media post (e.g., X/Twitter), please copy and paste the content manually."
        ) 