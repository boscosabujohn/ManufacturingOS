# 🚀 Quick Reference - How to Start the Project

## ✅ Working Solution (PowerShell)

### UI Development Only (Frontend)
```powershell
cd d:\KreupAI\ManufacturingOS-1\b3-erp
.\ui.ps1
```
✅ **Currently Running!** Open: **http://localhost:3000**

### Full Stack (Backend + Frontend + Database)
```powershell
cd d:\KreupAI\ManufacturingOS-1\b3-erp
.\start.ps1
```

---

## 💡 Important PowerShell Notes

In PowerShell, you **must** use one of these methods to run scripts:

### Method 1: Call operator `&` (Recommended)
```powershell
& .\ui.ps1
& .\start.ps1
```

### Method 2: Dot-slash notation
```powershell
.\ui.ps1
.\start.ps1
```

### Method 3: Full path
```powershell
& "d:\KreupAI\ManufacturingOS-1\b3-erp\ui.ps1"
```

---

## 📝 Alternative: Use Command Prompt (cmd)

If PowerShell gives you issues, use Command Prompt instead:

1. Open **Command Prompt** (not PowerShell)
2. Run:
```cmd
cd d:\KreupAI\ManufacturingOS-1\b3-erp
ui.bat
```

Or for full stack:
```cmd
cd d:\KreupAI\ManufacturingOS-1\b3-erp
start.bat
```

---

## 🎯 Currently Active

✅ **Frontend Development Server is RUNNING**
- URL: http://localhost:3000
- Status: Ready in 3.2s
- Environment: .env.local loaded

To stop: Press `Ctrl+C` in the terminal

---

## 🔧 Manual Start (if scripts fail)

### Frontend Only:
```powershell
cd d:\KreupAI\ManufacturingOS-1\b3-erp\frontend
npm run dev
```

### Backend (requires Docker running):
```powershell
# First, start database
docker-compose up -d db redis

# Then start backend
cd d:\KreupAI\ManufacturingOS-1\b3-erp\backend
npm run start:dev
```

---

## 🌐 Access URLs

- **Frontend:** http://localhost:3000 ✅ RUNNING
- **Backend API:** http://localhost:8000/api/v1
- **API Docs:** http://localhost:8000/api/docs

---

## ⚡ Quick Tips

1. **PowerShell users:** Always use `.\script.ps1` or `& .\script.ps1`
2. **cmd users:** Just type `script.bat`
3. **Frontend only:** No Docker needed, fastest startup
4. **Full stack:** Requires Docker Desktop running first

---

**Your frontend is ready at: http://localhost:3000** 🎉
