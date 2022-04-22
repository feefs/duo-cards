FROM python:3.10.3

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1

COPY ./.env /code/.env

COPY ./requirements.txt /code

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
