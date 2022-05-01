from fastapi import FastAPI
from .duotranslator import DuoTranslator
import logging

LOGGER = logging.getLogger('uvicorn')
DUO_TRANSLATOR = None

app = FastAPI()

@app.get('/')
async def root():
  return {'message': 'Hello World'}

@app.get('/query/')
async def query(
    start_days_ago: int = 0,
    end_days_ago: int = 0,
    low_threshold: float = 0,
    high_threshold: float = 1
):
  return DUO_TRANSLATOR.query_words(start_days_ago, end_days_ago, low_threshold, high_threshold)

@app.on_event('startup')
async def startup():
  LOGGER.info('Initializing DuoTranslator...')
  global DUO_TRANSLATOR
  DUO_TRANSLATOR = DuoTranslator()
