FROM python:3.10-slim-bullseye

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python3", "-m", "app"]

EXPOSE 4000
