# Campus Connect 🎓

Campus Connect is a private social network for students of MITS Gwalior. Connect with fellow students, share voice notes, and stay updated with your campus feed.

## 🚀 Key Features
- **Google OAuth 2.0**: Secure login restricted to `@mitsgwl.ac.in` email domain.
- **Real-time Presence**: See who is online instantly using Socket.io.
- **Campus Feed**: Share text posts and **Voice Notes**.
- **Connection System**: Connect with classmates to interact.
- **Modern UI**: Dark mode Discord/Slack-inspired design with premium aesthetics.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Lucide React, Zustand.
- **Backend**: Node.js, Express, Socket.io, Mongoose.
- **Database**: MongoDB.
- **Storage**: AWS S3 (for voice notes).
- **Auth**: Google OAuth & JWT.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for OAuth)
- AWS S3 Bucket (for voice storage)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_S3_BUCKET_NAME=your_bucket_name
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure
See the root directory for a comprehensive structure layout matching the project specifications.

## 🔒 Security Measures
- Server-side domain validation for email.
- JWT-based session management.
- Multer file size limits for voice notes.
- Sockets authenticated via JWT.
