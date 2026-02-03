# Sinergia

API Laravel & React Router & Docker

## 📋 Requisitos previos

- Docker
- Docker Compose

## 🚀 Instalación y configuración

### 1. Detener y limpiar contenedores anteriores

```bash
docker-compose down -v
```

### 2. Reconstruir las imágenes

```bash
docker-compose build --no-cache
```

### 3. Levantar los servicios

**Modo normal (con logs visibles):**
```bash
docker-compose up
```

**Modo detached (segundo plano):**
```bash
docker-compose up -d
```

### 4. Configurar la aplicación

**Limpiar caché de configuración:**
```bash
docker exec -it laravel_api php artisan config:clear
```

**Generar clave JWT:**
```bash
docker exec laravel_api php artisan jwt:secret --force
```

**Ejecutar migraciones y seeders:**
```bash
docker exec -it laravel_api php artisan migrate --seed
```

## 📊 Ver logs

**Ver logs de todos los servicios:**
```bash
docker-compose logs -f
```

**Ver logs de un servicio específico:**
```bash
docker-compose logs -f api
```

## 🔐 Credenciales de acceso

### Usuario Administrador
- **Email:** `admin@test.com`
- **Password:** `password`
- **Rol:** Admin

### Usuario Viewer
- **Email:** `viewer@test.com`
- **Password:** `password`
- **Rol:** Viewer

## 🛠️ Comandos útiles

```bash
# Detener los servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart api

# Acceder al contenedor
docker exec -it laravel_api bash
```

---

¡Listo! Tu aplicación debería estar corriendo y accesible.