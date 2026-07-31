# Memory del Proyecto - Family Bank & Finance Tracker

## Visión General
Plataforma web premium para la gestión y seguimiento del patrimonio familiar y personal, incluyendo cuentas corrientes, de ahorros, tarjetas de crédito, deudas (autos, hipotecas) e integración directa con Plaid para sincronización bancaria en tiempo real.

## Estado del Despliegue en Coolify & GitHub
- **Repositorio**: `https://github.com/guaricool/Bank-app.git` (Rama `main`)
- **Servidor VPS**: IP `13.140.181.29`
- **Coolify URL**: `http://cruaownacjx753dlh2i3dpev.13.140.181.29.sslip.io`
- **Base de Datos**: PostgreSQL en Coolify (`postgres:5432`)
- **Auto-Migración**: El contenedor ejecuta `docker-entrypoint.sh` al iniciar (`npx prisma db push`), garantizando que las tablas estén sincronizadas automáticamente tras cada despliegue.

## Características Implementadas

### 1. Sistema de Usuarios y Multi-Tenancy (Aislamiento Total de Datos)
- Autenticación JWT mediante cookies HTTP-Only seguras (`family_auth_session`).
- Endpoints de autenticación: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`.
- Páginas de interfaz: `/register` y `/login`.
- Todo usuario nuevo inicia con el **dashboard 100% limpio** ($0.00 Net Worth).
- Todas las consultas a la base de datos están estrictamente filtradas por `userId`.

### 2. Vistas Financieras y Navegación por Tablas
- 📊 **Resumen General (`/`)**: Ticker de patrimonio neto, tarjetas de activos líquidos vs. deudas, actividad reciente.
- 💰 **Ahorros y Débito (`/accounts`)**: Vista dedicada para cuentas de cheques (Checking), ahorro (Savings) y certificados (CD).
- 💳 **Deudas y Créditos (`/debt-payoff`)**: Vista dedicada para Tarjetas de Crédito, Créditos de Auto e Hipotecas con indicadores de utilización, rastreador de pagos mínimos y simulador de amortización (Avalancha vs. Bola de Nieve).
- 🧾 **Transacciones (`/transactions`)**: Feed completo con buscador y filtros de ingresos/gastos.

### 3. Conexión Bancaria con Plaid
- Componente `PlaidLinkButton` (`src/components/plaid/PlaidLinkButton.tsx`).
- Endpoints de integración: `/api/plaid/create-link-token` y `/api/plaid/exchange-public-token`.
- Asociación estricta de `PlaidItem`, `Account` y `Debt` al `userId` activo.

### 4. Modo Demostración Opcional
- Endpoint `/api/seed-demo` para usuarios que deseen probar el sistema con datos de muestra en su propia cuenta aislada.

## Tecnologías Principales
- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind CSS.
- **ORM & BD**: Prisma 7 + PostgreSQL (`@prisma/adapter-pg`).
- **Integraciones**: Plaid SDK (`plaid`, `react-plaid-link`).
