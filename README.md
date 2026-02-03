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

**Si tienes conflictos con contenedores existentes, ejecuta:**

```bash
# Remover contenedores específicos si existen
docker rm -f mysql_db laravel_api react_front

# O limpiar todo Docker (⚠️ cuidado, esto elimina todos los contenedores detenidos)
docker system prune -a
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

**Generar claves y JWT:**

```bash
docker exec -it laravel_api cp .env.example .env
```

```bash
docker exec -it laravel_api php artisan key:generate
```

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

# Ver contenedores activos
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a
```

## 🔧 Solución de problemas

### Error: "The container name is already in use"

Si obtienes este error al hacer `docker-compose up`:

```bash
# Opción 1: Remover contenedores específicos
docker rm -f mysql_db laravel_api react_front

# Opción 2: Detener y remover todo de docker-compose
docker-compose down -v

# Luego vuelve a levantar los servicios
docker-compose up -d
```

### Base de datos no se conecta

```bash
# Verificar que la base de datos esté lista
docker-compose logs db

# Esperar a que el healthcheck pase
docker-compose ps
```

### Permisos en Laravel

```bash
docker exec -it laravel_api chown -R www-data:www-data /var/www/html/storage
docker exec -it laravel_api chmod -R 775 /var/www/html/storage
```

## 🌐 URLs de acceso

- **Frontend React:** http://localhost:5173
- **API Laravel:** http://localhost:8000/api
- **Base de datos MariaDB:** localhost:3307

---

¡Listo! Tu aplicación debería estar corriendo y accesible.