# 🚀 B3 MACBIS ERP - Manufacturing Operating System

A comprehensive Manufacturing ERP system built with modern technologies to manage all aspects of manufacturing operations.

## ✅ Project Status: Ready to Run!

The project has been set up and is ready to run on Windows.

## 🎯 Quick Start

### Option 1: UI Development Only (Fastest) ⚡
Perfect for frontend/UI/UX work - no backend needed:

**Using Command Prompt:**
```cmd
cd b3-erp
ui.bat
```

**Using PowerShell:**
```powershell
cd b3-erp
.\ui.bat
# Or use: .\ui.ps1
```

Then open: **http://localhost:3000**

---

### Option 2: Full Stack Development 🔧
Run the complete system (backend + frontend + database):

**Using Command Prompt:**
```cmd
cd b3-erp
start.bat
```

**Using PowerShell:**
```powershell
cd b3-erp
.\start.bat
# Or use: .\start.ps1
```

Then access:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/v1
- **API Docs:** http://localhost:8000/api/docs

---

## 📋 Prerequisites

Before running the project, ensure you have:

1. ✅ **Node.js 20+** - [Download](https://nodejs.org/)
2. ✅ **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/) (for full stack only)
3. ✅ **Git** - [Download](https://git-scm.com/download/win)

**Note:** Docker Desktop must be running before starting the full stack mode.

---

## 📦 What's Included

- ✅ Environment files configured (`.env` and `.env.local`)
- ✅ Dependencies installed (backend & frontend)
- ✅ Startup scripts for Windows (`.bat` and `.ps1`)
- ✅ Docker Compose configuration
- ✅ Complete project structure

---

## 🏗️ Tech Stack

- **Backend:** Node.js, NestJS, TypeScript
- **Frontend:** Next.js 14, React 18, TypeScript
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **UI:** Tailwind CSS + shadcn/ui
- **Queue:** Bull (Redis-based)

---

## 📚 Documentation

For detailed information, see:

- **[WINDOWS_SETUP.md](./b3-erp/WINDOWS_SETUP.md)** - Complete Windows setup guide
- **[QUICK_START.md](./b3-erp/QUICK_START.md)** - Quick reference guide
- **[DEVELOPMENT_SETUP.md](./b3-erp/DEVELOPMENT_SETUP.md)** - Detailed development guide
- **[UI_DEVELOPMENT.md](./b3-erp/UI_DEVELOPMENT.md)** - UI development guide

---

## 🐛 Troubleshooting

### Docker Not Running
Start Docker Desktop and wait for it to fully initialize before running `start.bat` or `start.ps1`.

### Port Already in Use
If you get "port already in use" errors, see the troubleshooting section in [WINDOWS_SETUP.md](./b3-erp/WINDOWS_SETUP.md).

### Dependencies Issues
```powershell
cd b3-erp\backend
npm install

cd ..\frontend
npm install
```

---

## 🎨 Module Structure

The system includes the following modules:

- **CRM** - Customer Relationship Management
- **Sales** - Sales & Order Management
- **Procurement** - Purchase & Vendor Management
- **Inventory** - Warehouse & Stock Management
- **Production** - Manufacturing & Planning
- **HR** - Human Resources Management
- **Finance** - Financial Accounting
- **After Sales Service** - Service & Support
- **Logistics** - Transportation & Delivery
- **Estimation** - Quotation & Costing
- **Workflow** - Process Automation
- **Reports** - Analytics & Reporting

---

## 🔑 Default Configuration

### Database
- Host: `localhost:5432`
- Database: `b3_erp`
- Username: `b3_user`
- Password: `b3_password`

### Redis
- Host: `localhost:6379`
- No password

**Note:** These are development defaults. Change them for production use.

---

## 🆘 Need Help?

1. Check the documentation in the `b3-erp` folder
2. Verify all prerequisites are installed
3. Make sure Docker Desktop is running (for full stack mode)
4. Check the terminal output for specific error messages

---

## 📧 Project Information

- **Project:** B3 MACBIS ERP System
- **Repository:** ManufacturingOS
- **Environment:** Windows Development Setup

---

## 🎉 Next Steps

1. Start the project using one of the options above
2. Explore the UI at http://localhost:3000
3. Check the API documentation at http://localhost:8000/api/docs
4. Read the module documentation in the `docs` folder
5. Start developing!

---

**Ready to build something amazing! 🚀**
