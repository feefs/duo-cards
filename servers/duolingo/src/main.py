from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .duotranslator import DuoTranslator
import logging

LOGGER = logging.getLogger('uvicorn')
DUO_TRANSLATOR = None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/query/')
async def query(
    start_days_ago: int = 0,
    end_days_ago: int = 0,
    low_threshold: float = 0,
    high_threshold: float = 1,
    num_cards: int = 10,
):
  return DUO_TRANSLATOR.query_words(
      start_days_ago,
      end_days_ago,
      low_threshold,
      high_threshold,
      num_cards
  )

@app.on_event('startup')
async def startup():
  LOGGER.info('Initializing DuoTranslator...')
  global DUO_TRANSLATOR
  DUO_TRANSLATOR = DuoTranslator()
