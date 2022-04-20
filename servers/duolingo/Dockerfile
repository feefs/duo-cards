FROM python:3.10.3

WORKDIR /code

COPY ./requirements.txt /code

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app.py /code

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]
