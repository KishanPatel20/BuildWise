@echo off
cd %~dp0
call ..\venv\Scripts\activate.bat
python manage.py makemigrations candidate
python manage.py migrate
pause 