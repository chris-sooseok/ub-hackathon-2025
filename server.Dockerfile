FROM python:3.11-slim

WORKDIR /app

# install dependencies
COPY server/requirements.txt .
# WSGI = a standard/interface for how Python web apps talk to web servers
# Gunicorn = the production server that runs Flask app through WSGI standard
# and listen for incoming requests.
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir gunicorn

COPY server/ .

#gunicorn serves flask app object "app" from app.py on port 5500
ENV PORT=5500

# gunicorn : start gunicorn 
# -w 2 : run 2 worker processes
# -b 0.0.0.0:5500 : listen on port 5500 on all network interfaces
# app:app : find the Flask app object named `app` in app.py 
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5500", "app:app"]
