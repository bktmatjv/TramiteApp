# Sistema de Gestión de Trámites

Aplicación web Full-Stack para la gestión de solicitudes y trámites (EduGestor). Permite a los usuarios registrarse, solicitar trámites, reportar pagos y hacer seguimiento al estado de sus solicitudes. Los administradores pueden gestionar las solicitudes recibidas y actualizar sus estados.

## Arquitectura y Tecnologías

El proyecto está dividido en dos partes principales:

### Backend (Carpeta `demo/`)
- **Lenguaje:** Java 17+
- **Framework:** Spring Boot
- **Seguridad:** Spring Security con JWT (JSON Web Tokens)
- **Persistencia:** Spring Data JPA / Hibernate
- **Base de Datos:** PostgreSQL
- **Documentación:** Swagger (Springdoc)

### Frontend (Carpeta `frontend/`)
- **Lenguaje:** JavaScript
- **Librería UI:** React 18+
- **Herramienta de Construcción:** Vite
- **Estilos:** CSS puro / Componentes
- **Rutas:** React Router DOM

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
- Docker y Docker Compose (para levantar la base de datos).
- Java Development Kit (JDK) 17 o superior.
- Node.js (versión 16+ recomendada) y npm.

## Instrucciones de Ejecución

Sigue estos pasos para desplegar el entorno completo en tu máquina local.

### 1. Levantar la Base de Datos
El proyecto incluye un archivo `docker-compose.yml` en la raíz para inicializar PostgreSQL rápidamente.
Abre tu terminal en la raíz del proyecto y ejecuta:

```bash
docker-compose up -d
```
Esto iniciará una instancia de PostgreSQL en el puerto `5432` con la base de datos `edugestor_db`.

### 2. Ejecutar el Backend (Spring Boot)
La configuración de conexión a base de datos viene por defecto en `application.properties`. 
Abre una terminal en la carpeta `demo/` y ejecuta:

```bash
# En Windows
mvnw.cmd spring-boot:run

# En Linux/Mac
./mvnw spring-boot:run
```
El servidor backend se iniciará en `http://localhost:8080`.

Nota: Al ejecutarse por primera vez, Spring Boot creará las tablas necesarias automáticamente e insertará datos iniciales usando el archivo `data.sql`.

### 3. Ejecutar el Frontend (React)
Abre otra terminal en la carpeta `frontend/` e instala las dependencias:

```bash
npm install
```

Luego, inicia el servidor de desarrollo:

```bash
npm run dev
```
La aplicación web estará disponible, por lo general, en `http://localhost:5173`.

## Datos de Prueba Iniciales

El sistema carga automáticamente algunos datos iniciales para que puedas probar la aplicación de inmediato.

**Usuario Administrador por Defecto:**
- **Correo:** admin@edugestor.com
- **Contraseña:** admin
- **Rol:** Administrador

El administrador tiene acceso a secciones exclusivas para gestionar las solicitudes de los demás usuarios y cambiar los estados de los trámites.

## Estructura del Proyecto

- `demo/`: Contiene el código fuente del backend.
  - `src/main/java/com/example/demo/`: Controladores, Entidades, Repositorios, Servicios y Configuración de Seguridad.
  - `src/main/resources/`: Propiedades de la aplicación y script de carga de base de datos (`data.sql`).
- `frontend/`: Contiene el código fuente del cliente web.
  - `src/components/`: Componentes de interfaz (Login, Registro, Gestión, Perfil).
  - `src/services/`: Configuración de Axios e interceptores para conectar con la API y gestionar el token JWT.
- `docker-compose.yml`: Archivo de configuración para el contenedor de la base de datos.
- `.gitignore`: Configurado para ignorar dependencias y compilados (node_modules, target, etc).
