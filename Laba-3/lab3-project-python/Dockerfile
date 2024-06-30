FROM python:3.10-alpine

WORKDIR /project

COPY requirements requirements

RUN python3 -m venv ./.venv

RUN . ./.venv/bin/activate

RUN pip install -r requirements/packages.txt

COPY build build

COPY spaceship spaceship

CMD ["uvicorn", "spaceship.main:app", "--host=0.0.0.0", "--port=8080"]