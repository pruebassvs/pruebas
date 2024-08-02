# Usa una imagen base oficial de Python
FROM python:3.9-slim

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Instala dependencias del sistema necesarias para mysqlclient
RUN apt-get update && \
    apt-get install -y \
    g  pkg-config \
    libmysqlclient-dev && \
    apt-get clean

# Configura el directorio de trabajo
WORKDIR /Full_Online

# Copia el archivo de requisitos y instala las dependencias


# Copia el resto del código
COPY . .

# Expone el puerto que usará el contenedor
EXPOSE 8000

# Comando para ejecutar el servidor
CMD ["gunicorn", "Full_Online.wsgi:application", "--bind", "0.0.0.0:8000"]
