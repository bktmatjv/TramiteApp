# Guía de Ejecución: MentoringApp

Esta es la documentación para levantar el proyecto MentoringApp, que consta de una base de datos MySQL, un backend en Spring Boot y un frontend en React.

---

## Opción 1: Ejecución con Docker (Recomendada)
Esta es la forma más fácil y rápida de ejecutar todo el stack de manera orquestada.

**Requisitos:** Tener instalado Docker y Docker Compose.

**Pasos:**
1. Abre una terminal en la raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`).
2. Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores en segundo plano:
   ```bash
   docker-compose up -d --build
   ```
3. Espera un par de minutos a que se instalen las dependencias y se levanten los servicios.
4. Accede a la aplicación Frontend desde tu navegador: **http://localhost:5173**
5. (Opcional) Accede a la documentación Swagger de la API: **http://localhost:8080/swagger-ui.html**

Para detener todos los contenedores:
```bash
docker-compose down
```

---

## Opción 2: Ejecución Local Manual (Desarrollo)
Si prefieres levantar cada parte por separado para desarrollo.

**Requisitos:** Tener instalado Java 17, Node.js (v18+) y una instancia de MySQL corriendo.

### 1. Base de Datos MySQL
Asegúrate de tener un servidor MySQL corriendo en el puerto `3306` con:
- Usuario: `root`
- Contraseña: `root`
- (O puedes cambiar las variables de entorno en tu sistema para sobreescribir estos valores por defecto definidos en `application.properties`).

### 2. Backend (Spring Boot)
1. Navega a la carpeta del backend:
   ```bash
   cd demo
   ```
2. Ejecuta la aplicación (descargará las dependencias de Maven automáticamente la primera vez):
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Si usas Windows, utiliza `mvnw.cmd spring-boot:run`)*
3. El backend estará corriendo en **http://localhost:8080** y creará la base de datos `mentoring_db` y sus tablas automáticamente.

### 3. Frontend (React)
1. Abre una nueva terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. El frontend estará disponible en **http://localhost:5173**

---

### Notas Finales
- Si los contenedores de Docker de pronto fallan porque el puerto 8080 o 3306 están ocupados, asegúrate de detener tus instancias locales (por ejemplo tu propio servidor MySQL o un Tomcat local) antes de ejecutar `docker-compose up`.
- Se ha incluido validación de los datos y manejo global de errores en el backend, así como componentes estilizados en el frontend para brindar una excelente experiencia de usuario.
