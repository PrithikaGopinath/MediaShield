# **MediaShield — AI‑Generated & Deepfake Image Detection Platform**

MediaShield is a dual‑model image forensics platform designed to detect **AI‑generated images** (Bing Image Creator, DALL·E, Stable Diffusion, Midjourney) and **deepfake images** using modern machine‑learning models. Built for reliability, clarity, and demo‑readiness, MediaShield provides a clean UI and a robust backend powered by Replicate.

---

## 🚀 Features

- **AI‑Generated Image Detection**  
  Uses a diffusion‑capable Replicate model to identify images created by modern AI systems.

- **Deepfake Detection**  
  Uses the FaceForensics++ model to detect manipulated or swapped faces.

- **Dual‑Model Pipeline**  
  Both detectors run independently, and MediaShield combines their outputs into a final verdict.

- **Clear Verdict System**  
  - AI‑generated  
  - Deepfake  
  - Real  
  - Uncertain

- **Clean, Professional UI**  
  Displays scores and verdicts with color‑coded clarity.

---

## 🧠 How MediaShield Works

### 1. Image Upload
Users upload an image through the frontend.

### 2. Backend Processing
The backend sends the image to two Replicate models:

#### Deepfake Detection  
Model: **FaceForensics++**  
Detects:
- Face swaps  
- Manipulated facial regions  
- Neural deepfake artifacts  

Returns:  
`deepfake_score` (0–1)

#### AI‑Generated Detection  
Model: **tstramer/ai-image-detector**  
Detects:
- Bing Image Creator  
- DALL·E  
- Stable Diffusion  
- Midjourney  

Returns:  
`ai_generated_score` (0–1)

### 3. Verdict Logic
MediaShield combines both scores:

- **AI-generated** → AI score > 0.7  
- **Deepfake** → Deepfake score > 0.7  
- **Uncertain** → borderline scores  
- **Real** → both scores low  

### 4. Frontend Display
The ResultCard component shows:

- AI‑generated score  
- Deepfake score  
- Final verdict  
- Color-coded output  

---

## 🛠️ Tech Stack

- Next.js 14  
- TypeScript  
- TailwindCSS  
- Replicate API  
- Node.js Runtime  

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/PrithikaGopinath/MediaShield.git
cd MediaShield
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add environment variables
Create `.env.local`:

```
REPLICATE_API_TOKEN=your_replicate_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

Your app will be live at:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### POST /api/detect
Uploads an image and returns:

```json
{
  "ai_generated_score": 0.92,
  "deepfake_score": 0.03,
  "final_label": "AI-generated"
}
```

---

## 🧪 Testing the System

### AI Images
Try images from:
- Bing Image Creator  
- DALL·E  
- Midjourney  
- Stable Diffusion  

Expected:  
**AI-generated Score: high**

### Deepfakes
Try:
- Face swaps  
- Deepfake datasets  

Expected:  
**Deepfake Score: high**

### Real Images
Expected:  
**Both scores low → Verdict: Real**

---

## 📁 Project Structure

```
/components
  ResultCard.tsx

/src/app/api/detect
  route.ts

/public
  (static assets)

/app
  (frontend pages)
```

---

## 🏆 Why MediaShield Stands Out

- Detects **modern diffusion AI images** (most detectors fail here)  
- Uses **two independent forensic models**  
- Clean, judge‑friendly UI  
- Fully reproducible setup  
- Fast, reliable, and hackathon‑ready  

---

## 🔮 Future Enhancements

- Video deepfake detection  
- Metadata + EXIF analysis  
- Multi‑model ensemble scoring  
- Browser extension version  
- Proper settign up of the model to analyse the data.
