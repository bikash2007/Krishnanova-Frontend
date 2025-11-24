# 🎵 Meditation & Chanting Music Setup Guide

## Current Audio Paths

The meditation module is configured to use audio files from your `public` folder. Here are the exact paths needed:

### 📁 Required Folder Structure

```
X:\Website\Krishnova\Krishnova Frontend\public\
└── audio/
    └── meditation/
        ├── calm-flute.mp3
        ├── sitar-calm.mp3
        ├── nature-tabla.mp3
        ├── om-chant.mp3
        ├── hare-krishna.mp3
        └── gayatri.mp3
```

### 📁 Required Image Structure

```
X:\Website\Krishnova\Krishnova Frontend\public\
└── images/
    └── meditation/
        ├── krishna-flute.jpg
        ├── krishna-flute-thumb.jpg
        ├── radha-krishna.jpg
        ├── radha-krishna-thumb.jpg
        ├── krishna-meditation.jpg
        ├── krishna-meditation-thumb.jpg
        ├── lotus.jpg
        ├── lotus-thumb.jpg
        ├── om-symbol.jpg
        ├── om-symbol-thumb.jpg
        ├── sri-yantra.jpg
        └── sri-yantra-thumb.jpg
```

---

## 🎼 Music Files Needed

### Background Music (3 files)

1. **calm-flute.mp3** - "Peaceful Flute Melody"
   - Calm instrumental flute music
   - Duration: 10-30 minutes recommended
   - Example: Krishna flute meditation music

2. **sitar-calm.mp3** - "Sitar Serenity"
   - Peaceful sitar instrumental
   - Duration: 10-30 minutes
   - Example: Sitar ragas for meditation

3. **nature-tabla.mp3** - "Nature Sounds with Tabla"
   - Nature sounds mixed with soft tabla
   - Duration: 10-30 minutes
   - Example: Forest sounds + tabla beats

### Chanting Music (3 files)

4. **om-chant.mp3** - "Om Meditation Chant"
   - Continuous Om chanting
   - Duration: 10-30 minutes
   - Example: 108 times Om chanting

5. **hare-krishna.mp3** - "Hare Krishna Mantra"
   - Hare Krishna Maha Mantra chanting
   - Duration: 10-30 minutes
   - Example: Kirtan or slow mantra chanting

6. **gayatri.mp3** - "Gayatri Mantra"
   - Gayatri Mantra chanting
   - Duration: 10-30 minutes
   - Example: Traditional Gayatri chant

---

## 🖼️ Image Files Needed

### Main Images (6 images + 6 thumbnails)

1. **Krishna with Flute**
   - `krishna-flute.jpg` (800x800px or larger)
   - `krishna-flute-thumb.jpg` (200x200px)

2. **Radha Krishna**
   - `radha-krishna.jpg` (800x800px or larger)
   - `radha-krishna-thumb.jpg` (200x200px)

3. **Krishna Meditation**
   - `krishna-meditation.jpg` (800x800px or larger)
   - `krishna-meditation-thumb.jpg` (200x200px)

4. **Sacred Lotus**
   - `lotus.jpg` (800x800px or larger)
   - `lotus-thumb.jpg` (200x200px)

5. **Om Symbol**
   - `om-symbol.jpg` (800x800px or larger)
   - `om-symbol-thumb.jpg` (200x200px)

6. **Sri Yantra**
   - `sri-yantra.jpg` (800x800px or larger)
   - `sri-yantra-thumb.jpg` (200x200px)

---

## 📥 Where to Get Free Music & Images

### Free Music Sources (Royalty-Free)

1. **YouTube Audio Library**
   - https://studio.youtube.com/channel/UC.../music
   - Filter by "Meditation" or "Ambient"

2. **Pixabay Music**
   - https://pixabay.com/music/
   - Search: "meditation", "flute", "sitar", "om chant"

3. **Free Music Archive**
   - https://freemusicarchive.org/
   - Search: "meditation music", "mantra"

4. **Incompetech**
   - https://incompetech.com/music/
   - Filter by "Ambient" or "World"

### Free Image Sources (Royalty-Free)

1. **Unsplash**
   - https://unsplash.com/
   - Search: "krishna", "lotus", "om symbol", "meditation"

2. **Pexels**
   - https://www.pexels.com/
   - Search: "spiritual", "meditation", "hindu deity"

3. **Pixabay**
   - https://pixabay.com/
   - Search: "krishna", "radha", "om", "yantra"

4. **Wikimedia Commons**
   - https://commons.wikimedia.org/
   - Search: "Krishna", "Sri Yantra", "Om"

---

## 🛠️ Quick Setup Steps

### Step 1: Create Folders

```bash
# Navigate to your project
cd "X:\Website\Krishnova\Krishnova Frontend"

# Create audio folder
mkdir -p public/audio/meditation

# Create images folder
mkdir -p public/images/meditation
```

### Step 2: Download Music Files

1. Go to Pixabay Music or YouTube Audio Library
2. Search for meditation music
3. Download 6 tracks (3 instrumental, 3 chanting)
4. Rename them to match the required names
5. Place in `public/audio/meditation/`

### Step 3: Download Images

1. Go to Unsplash or Pexels
2. Search for Krishna, lotus, Om symbol, etc.
3. Download high-quality images
4. Create thumbnails (resize to 200x200px)
5. Place in `public/images/meditation/`

### Step 4: Test

1. Run your dev server: `npm run dev`
2. Go to: `http://localhost:5173/test/wishdomportal`
3. Click "Meditate" tab
4. Go through setup and test music/images

---

## 🎨 Creating Thumbnails

### Using Online Tools (Easy)

1. **Squoosh** - https://squoosh.app/
   - Upload image
   - Resize to 200x200px
   - Download

2. **Canva** - https://www.canva.com/
   - Upload image
   - Resize to 200x200px
   - Download

### Using Command Line (Advanced)

If you have ImageMagick installed:

```bash
# Convert and resize
magick krishna-flute.jpg -resize 200x200^ -gravity center -extent 200x200 krishna-flute-thumb.jpg
```

---

## ⚡ Alternative: Use External URLs

If you don't want to download files, you can use external URLs. Edit `MeditationSetup.jsx`:

```javascript
// Change from:
url: "/audio/meditation/calm-flute.mp3",

// To:
url: "https://example.com/your-audio-file.mp3",
```

**Pros**: No file management
**Cons**: Requires internet, slower loading

---

## 🎯 Recommended Specifications

### Audio Files
- **Format**: MP3 (best compatibility)
- **Bitrate**: 128-192 kbps (good quality, small size)
- **Duration**: 10-30 minutes
- **File Size**: 5-15 MB per file

### Images
- **Format**: JPG (smaller) or PNG (better quality)
- **Main Images**: 800x800px minimum (1200x1200px ideal)
- **Thumbnails**: 200x200px
- **File Size**: 
  - Main: 100-500 KB
  - Thumbnails: 10-50 KB

---

## ✅ Checklist

- [ ] Create `public/audio/meditation/` folder
- [ ] Create `public/images/meditation/` folder
- [ ] Download 3 background music files
- [ ] Download 3 chanting music files
- [ ] Download 6 meditation images
- [ ] Create 6 thumbnail images
- [ ] Rename all files to match required names
- [ ] Test in meditation module

---

## 🆘 Need Help?

If you want me to:
1. **Generate placeholder images** using AI
2. **Find specific free music links**
3. **Create a script to auto-download** from free sources
4. **Modify the code** to use different file names

Just let me know!
