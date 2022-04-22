#!/bin/bash -e

PYTHONDONTWRITEBYTECODE=1 uvicorn src.main:app --reload
