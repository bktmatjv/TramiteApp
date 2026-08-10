# Documentación Técnica: EduGestor (Contacto Total)

Esta documentación describe en detalle la arquitectura, la API REST y la estructura de componentes de React del proyecto de gestión de trámites.

---

## 1. Arquitectura General del Proyecto

El sistema está construido bajo una arquitectura cliente-servidor, con una separación clara entre el Frontend (React) y el Backend (Spring Boot).

- **Backend:** Desarrollado en Java con Spring Boot, expone una API REST para ser consumida por el cliente. Utiliza JWT (JSON Web Tokens) para la autenticación y autorización.
- **Frontend:** Desarrollado en React con Vite, funciona como una Single Page Application (SPA). Utiliza React Router DOM para la navegación y Context/Hooks para el estado global (como la sesión del usuario).
- **Base de Datos:** PostgreSQL, utilizada mediante Spring Data JPA.
- **Contenedores:** Un `docker-compose.yml` gestiona el levantamiento de la base de datos local de manera estandarizada.

---

## 2. Documentación de la API REST (Backend)

Todas las rutas base tienen el prefijo: `/api/v1`

### 2.1. Autenticación (`AuthController`)
Gestiona el inicio de sesión y registro de usuarios públicos.

- **`POST /auth/login`**
  - **Descripción:** Valida las credenciales del usuario y devuelve un token JWT.
  - **Body Requerido:** `{ "email": "admin@edugestor.com", "password": "admin" }`
  - **Respuesta Exitosa (200 OK):** `{ "token": "eyJhbGciOiJIUz..." }`

- **`POST /auth/register`**
  - **Descripción:** Registra un nuevo usuario en la plataforma. Valida que DNI y Email no estén duplicados.
  - **Body Requerido:** 
    ```json
    {
      "dni": "12345678",
      "nombres": "Juan",
      "apellidos": "Pérez",
      "email": "juan@correo.com",
      "password": "secreta",
      "rol": "ROLE_USER"
    }
    ```
  - **Respuesta Exitosa (200 OK):** `"Usuario registrado exitosamente"`

### 2.2. Gestión de Trámites y Catálogo (`TramiteController`)
- **`GET /tramites`**
  - **Descripción:** Obtiene la lista de tipos de trámite activos disponibles para solicitar.
  - **Acceso:** Público / Usuario Autenticado.
  - **Respuesta (200 OK):** Lista de objetos `[{ id, nombre, descripcion, costo, activo }]`.

### 2.3. Solicitudes de Trámites (Usuarios) (`SolicitudController`)
Rutas para que los estudiantes gestionen sus propias solicitudes. Requieren token JWT con rol `ROLE_USER` o `ROLE_ADMIN`.

- **`POST /solicitudes`**
  - **Descripción:** Crea una nueva solicitud para un tipo de trámite.
  - **Body Requerido:** `{ "tipoTramiteId": 1 }`
  - **Respuesta (201 Created):** Retorna el DTO de la solicitud creada con estado `PENDIENTE_PAGO`.

- **`PUT /solicitudes/{id}/pago`**
  - **Descripción:** Permite al usuario reportar el pago de un trámite enviando el código de operación del banco.
  - **Body Requerido:** `{ "codigoOperacionBanco": "123456" }`
  - **Efecto:** Cambia el estado de la solicitud a `EN_PROCESO`.

- **`GET /solicitudes/mis-tramites`**
  - **Descripción:** Retorna el historial de solicitudes creadas por el usuario autenticado.
  - **Respuesta (200 OK):** Lista de `SolicitudDTO`.

### 2.4. Administración de Solicitudes (`AdminSolicitudController`)
Rutas exclusivas para personal administrativo (`ROLE_ADMIN`).

- **`GET /admin/solicitudes`**
  - **Descripción:** Lista todas las solicitudes del sistema. Soporta paginación y filtros opcionales (por `dni` y `estado`).
  - **Query Params:** `?dni=123&estado=EN_PROCESO&page=0&size=10`
  - **Respuesta:** Objeto `Page<SolicitudDTO>`.

- **`PUT /admin/solicitudes/{id}/estado`**
  - **Descripción:** Permite al administrador cambiar el estado de cualquier trámite.
  - **Body Requerido:** `{ "estado": "FINALIZADO", "observaciones": "Certificado listo para recoger" }`
  - **Respuesta (200 OK):** Solicitud actualizada.

### 2.5. Perfil de Usuario (`UsuarioController`)
- **`GET /usuarios/me`**
  - **Descripción:** Retorna los datos del usuario actual autenticado.
- **`PUT /usuarios/me`**
  - **Descripción:** Actualiza los nombres y apellidos del usuario.
  - **Body Requerido:** `{ "nombres": "Juan", "apellidos": "Pérez" }`

---

## 3. Documentación del Frontend (React)

El frontend está estructurado en base a componentes funcionales, protegiendo rutas mediante validación del Token.

### 3.1. Estructura de Componentes Principales

- **`App.jsx`**: Punto de entrada de rutas. Utiliza `BrowserRouter` y envuelve las rutas seguras con `ProtectedRoute`.
- **`Layout.jsx`**: Molde visual de la aplicación una vez logueado. Incluye el `Sidebar` a la izquierda y renderiza el contenido (`Outlet`) a la derecha.
- **`Sidebar.jsx`**: Menú de navegación lateral. Se renderiza condicionalmente; muestra opciones distintas dependiendo de si el usuario es `ROLE_ADMIN` o `ROLE_USER`. Muestra el nombre de usuario leyendo el payload decodificado del JWT.

### 3.2. Componentes de Autenticación
- **`Login.jsx`**: Formulario de acceso. Consume `POST /auth/login`, guarda el Token en el `localStorage` (`token`) y redirige al Dashboard o Mis Trámites según el rol.
- **`Register.jsx`**: Formulario de creación de cuenta pública (por defecto, asigna `ROLE_USER`).

### 3.3. Vistas del Estudiante (`ROLE_USER`)
- **`CatalogoTramites.jsx`**: Muestra tarjetas con los trámites disponibles. Al hacer clic en "Solicitar", llama a la API para crear la solicitud y redirige a la pestaña de seguimiento.
- **`MisTramites.jsx`**: Tabla con el historial del estudiante. Identifica el estado (Pendiente, En Proceso, Finalizado) con *badges* de colores.
- **`ModalPago.jsx`**: Componente flotante que aparece cuando un trámite está en `PENDIENTE_PAGO` y el usuario presiona "Reportar Pago". Pide el código de comprobante para enviarlo por `PUT`.
- **`Perfil.jsx`**: Formulario para visualizar los datos de la cuenta y actualizar Nombres y Apellidos.

### 3.4. Vistas del Administrador (`ROLE_ADMIN`)
- **`GestionSolicitudes.jsx`**: Tabla administrativa con todas las solicitudes de la institución. Incluye:
  - **Filtros**: Permite buscar por DNI o filtrar por Estado.
  - **Acciones**: Botón de "Actualizar Estado" que abre un modal interno para cambiar a `EN_PROCESO`, `FINALIZADO` o `RECHAZADO` y enviar observaciones.

### 3.5. Servicios y Seguridad (`services/api.js`)
- Utiliza **Axios** para las peticiones HTTP.
- **Interceptor de Peticiones:** Captura todas las llamadas salientes y les adjunta el header `Authorization: Bearer <TOKEN>` leyendo del `localStorage`.
- **Manejo de Errores (401/403):** Si el token expira y el servidor devuelve 401 Unauthorized, se limpia el almacenamiento local y se fuerza el redireccionamiento a la pantalla de login.

---

## 4. Detalles Técnicos de la Base de Datos

El sistema usa Hibernate (`spring.jpa.hibernate.ddl-auto=update`) para sincronizar automáticamente el modelo de objetos (Entities) con PostgreSQL.

### Tablas Principales:
1. **`usuarios`**: `id`, `dni` (Unique), `email` (Unique), `password` (BCrypt), `rol`, `nombres`, `apellidos`.
2. **`tipos_tramite`**: Catálogo que contiene el `id`, `nombre`, `descripcion` y `costo`.
3. **`solicitudes`**: Tabla transaccional. Guarda referencias al usuario (`usuario_id`) y al trámite (`tipo_tramite_id`). Posee columnas de estado, fecha de solicitud, código de pago y observaciones del administrador.

*Nota:* El archivo `data.sql` se ejecuta al iniciar la aplicación en un entorno de desarrollo para insertar trámites base y el usuario administrador por defecto (`admin@edugestor.com`).

---

## 5. Decisiones de Diseño y Posibles Mejoras Futuras

- **Estado Compartido (Frontend):** Actualmente el estado global básico de sesión es el token en `localStorage`. Si la aplicación escala, se recomienda implementar Redux o `useContext` para manejar la información del perfil sin decodificar el token repetidamente o hacer fetches extras.
- **Paginación:** La API de administración de solicitudes soporta `Pageable`. El frontend implementa esta paginación pasando los parámetros `page` y `size`.
- **Contraseñas:** Se encriptan utilizando el algoritmo BCrypt, estándar en Spring Security.
- **Seguridad en Rutas API:** Se usa `@PreAuthorize("hasRole('ADMIN')")` o la lectura directa del `CustomUserDetails` en los controladores para garantizar que los usuarios regulares no modifiquen datos que no les corresponden.
