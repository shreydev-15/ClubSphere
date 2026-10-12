# ClubSphere - Frontend

ClubSphere is a college club and campus community engagement platform built with React, Vite, and modern CSS design tokens.

## 🔗 Deployed Backend

The backend is deployed and accessible at:
- **Production API & Socket Server**: `https://clubsphere-9w89.onrender.com`

---

## 🛠️ Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
# Backend API & Socket URL
VITE_API_BASE_URL=https://clubsphere-9w89.onrender.com
VITE_SOCKET_URL=https://clubsphere-9w89.onrender.com
```

- When using `npm run dev`, Vite's development proxy will also automatically forward requests to `https://clubsphere-9w89.onrender.com`.
- When building for production (`npm run build`), Vite embeds the values from `.env` / `.env.production`.

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
