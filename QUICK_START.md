# LinguaJourney - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

### 2. Create Backend .env File
Create `backend/.env`:
```env
GEMINI_API_KEY=your_key_here
PLACES_API_KEY=your_key_here
```

### 3. Find Your IP Address
- **Windows:** `ipconfig` → Look for "IPv4 Address"
- **Mac/Linux:** `ifconfig` → Look for IP starting with 192.168.

### 4. Start Backend
```bash
cd backend
python server.py
```
✅ Keep this running!

### 5. Frontend Setup
```bash
# In project root
npm install
```

### 6. Configure Backend URL
Create `.env` in project root:
```env
EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP:5000
```
Replace `YOUR_IP` with the IP from step 3.

### 7. Start Frontend
```bash
npm start
```

### 8. Run on Phone
1. Install **Expo Go** app
2. Scan QR code
3. Make sure phone and computer are on **same WiFi**

---

## ✅ Checklist

- [ ] Backend server running (`python server.py`)
- [ ] Backend `.env` file created
- [ ] Frontend `.env` file created with correct IP
- [ ] Both devices on same network
- [ ] Expo Go app installed

---

## 🔧 Common Issues

**Can't connect?**
- Check IP address matches your network
- Ensure backend is running
- Verify same WiFi network

**API errors?**
- Check `.env` file in backend folder
- Verify API keys are correct

---

For detailed instructions, see [README.md](README.md)



