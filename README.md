# CivicGuardAI - Modern Civic Safety Platform

CivicGuardAI is a next-generation SaaS application designed for citizens to safely report incidents, and for law enforcement to seamlessly track, assign, and manage cases with the power of Artificial Intelligence and cryptographic evidence security.

## Features Built
- **Next.js 16 App Router** - High-fidelity React components using Tailwind CSS and `lucide-react`.
- **Role-Based Access Control** - Secure NextAuth integration separating "Citizen", "Police Officer", and "Admin" flows.
- **Smart Incident Detection** - Auto-identifies repeating crime hotspots.
- **Voice Dictation Complaints** - Web Speech API conversion allows citizens to record descriptions hands-free.
- **Tamper-Proof Digital Evidence** - Secure Cloudinary integration (or local fallback) logging SHA-256 hashes of all uploads.
- **Interactive Crime Heatmap** - Full-screen Leaflet mappings.
- **AI Microservice Integration** - Python FastAPI container prepared for NLP classification.

## Local Development
1. `npm install`
2. Create `.env.local` containing:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/civic
   NEXTAUTH_SECRET=your_jwt_secret_32_chars
   NEXTAUTH_URL=http://localhost:3000
   ```
3. Run the Next.js frontend: `npm run dev`

### AI Microservice
The Python API is located in `/python_service`.
1. `cd python_service`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

## Deployment Strategy

### 1. Frontend & Core Backend (Vercel)
The Next.js framework is perfectly optimized for Vercel.
1. Push this repository to GitHub.
2. Visit **Vercel.com** and securely import the repository.
3. In the Vercel dashboard **Environment Variables** section, inject:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set this to your expected Vercel assigned domain, e.g., `https://civicguardai.vercel.app`)
4. Click Deploy. Vercel will build the frontend, NextAuth routes, and MongoDB APIs globally.

### 2. Database (MongoDB Atlas)
1. Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Cluster (M0).
3. Under **Network Access**, whitelist `0.0.0.0/0` (or Vercel's specific IP sets).
4. Get your connection string under **Database > Connect > Drivers** and set that as your `MONGODB_URI`.

### 3. AI Service (Docker / Render / Railway)
The Python microservice requires containerized hosting as standard Serverless functions (like Vercel) have tight timeouts unsuitable for heavy AI/NLP loading.
1. The project includes `python_service/Dockerfile`.
2. Connect the repository to **Render** or **Railway.app**.
3. Choose "Deploy from Dockerfile" and target the `/python_service` nested directory.
4. Set the host port to `8000`. 
5. The containerized deployment minimizes vendor lock-in and scales dynamically.
