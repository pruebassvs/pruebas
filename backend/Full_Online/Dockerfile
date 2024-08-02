# Usa una imagen base de Python
FROM python:3.9-slim

# Establece el directorio de trabajo
WORKDIR /backend

# Copia los archivos del proyecto
COPY requirements.txt /backend/
COPY . /Full_Online/

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto que usarás
EXPOSE 8000

# Define el comando para iniciar el servidor
CMD ["gunicorn", "Full_Online.wsgi:application", "--bind", "0.0.0.0:8000"]
