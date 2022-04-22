from fastapi import FastAPI
from .duotranslator import DuoTranslator
import logging

LOGGER = logging.getLogger('uvicorn')
DUO_TRANSLATOR = None

app = FastAPI()

@app.get('/')
async def root():
  return {'message': 'Hello World'}

@app.on_event('startup')
async def startup():
  LOGGER.info('Initializing DuoTranslator...')
  global DUO_TRANSLATOR
  DUO_TRANSLATOR = DuoTranslator()
