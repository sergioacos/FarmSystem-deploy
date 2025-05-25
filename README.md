# FarmSystem 💊

Una aplicación web para gestionar un sistema de farmcia en línea con funcionalidades de autenticación, gestión de usuarios, carrito de compras y ventas, y gestión de productos 

---

## 🚀 Funcionalidades

- **Catálogo de Medicamentos**:
  - Visualiza todos los medicamentos disponibles.
  - Filtra por nombres para facilitar la búsqueda.

- **Gestión de Ventas**:
  - Añade, elimina y gestiona medicamentos en el carrito.
  - Actualización en tiempo real de los cambios en el carrito (edición, eliminación).

- **Autenticación y Autorización**:
  - Inicio de sesión mediante **JWT**.
  - Hashing de contraseñas con **bcrypt.js**.
  - Protección de rutas sensibles mediante middlewares de autorización.

- **Administración**:
  - Agrega, edita y elimina medicamentos (para administradores y vendedores).
  - Gestión de usuarios (para administradores).

- **Pruebas y Documentación**:
  - Pruebas unitarias e integración con **Jest** y **Supertest**.
  - Documentación detallada de la API para fácil uso y validación.

---

## 🛠️ Tecnologías Usadas

### **Backend**:
- [Node.js](https://nodejs.org/) - Servidor backend.
- [Express.js](https://expressjs.com/) - Framework web.
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB.

### **Frontend**:
- [React](https://es.react.dev/) - biblioteca para interfaces de usuario web y nativas.

### **Autenticación y Autorización**:
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Hashing de contraseñas.
- [jsonwebtoken (JWT)](https://jwt.io/) - Gestión de tokens.

### **Base de Datos**:
- [MongoDB Atlas](https://www.mongodb.com/) - Base de datos en la nube.

### **Pruebas**:
- [Postman](https://www.postman.com/)- Herramienta para desarrollar, probar y documentar APIs.


---

## 🌟 Instalación y Configuración
### **Clonar el repositorio:**
 - git clone https://github.com/EvanaSabatella1989/Invexa-FarmSystem.git
 - cd Invexa-FarmSystem

### **Instalar las dependencias del Backend:**
Ir hasta la carpeta backend en la terminal
 - npm install

### **Instalar las dependencias del Frontend:**
Ir hasta la carpeta frontend en la terminal
 - npm install

### **Ejecutar la aplicación en modo desarrollo:**
Primero en el backend y luego en el frontend
 - npm run dev
