FROM python:3.11-slim

WORKDIR /app

#dependency installations 
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir gunicorn

COPY server/ .

#gunicorn serves flask app object "app" from app.py on port 5500
ENV PORT=5500
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5500", "app:app"]
