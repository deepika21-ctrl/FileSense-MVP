# FileSense MVP 🗂️✨  
**Can I delete this?** — a calm way to understand your files.

FileSense is a lightweight, beginner-friendly MVP that helps users understand what a file or folder might be and whether it’s safe to delete.  
It uses a small mock dataset and **does not access real system files**, making it safe for learning, demos, and academic submissions.

---

## ✨ Key Features
- 🔍 Search files, folders, or app names using keywords  
- 🧘 Calm, human-friendly explanations instead of technical warnings  
- 📄 Result cards with clear, structured information  
- 📦 Uses a mock dataset (no real file scanning)  
- ⚡ Lightweight, fast, and framework-free  

---

## 🧠 Why This Project
Many users delete files to free up storage without understanding their purpose, which can lead to system errors or broken applications.  
FileSense aims to make file-deletion decisions **simple, calm, and informative**, especially for non-technical users and beginners.

---

## 🛠️ Tech Stack
- **HTML** – page structure  
- **CSS** – clean, minimal, and calming UI  
- **JavaScript (Vanilla)** – search logic and dynamic UI rendering  
- **Mock Dataset (`data.js`)** – sample file and folder information for the MVP  

---

## 🧩 How It Works
1. The user enters a file, folder, or app name in the search bar  
2. JavaScript searches the mock dataset using keyword matching  
3. If a match is found, a result card is displayed showing:
   - Friendly file name  
   - Original file or folder name  
   - Confidence level (High / Medium / Low)  
   - Explanation of why the file exists  
   - Estimated last opened time  
4. If no match is found, the result area remains clear to avoid confusion  

---

## ⚠️ Limitations
- Does not scan or access real system files  
- Uses a small, manually created mock dataset  
- No backend, database, or AI in the MVP version  
- Recommendations are informational, not guaranteed  

---

## 🌱 Future Enhancements
- Real file system scanning with user permissions  
- AI-based explanations for smarter file insights  
- File size, risk level, and dependency analysis  
- OS-specific recommendations (Windows / macOS / Linux)  
- Backend support with user history  

---

## 🔗 Live Demo
👉 https://deepika21-ctrl.github.io/FileSense-MVP/
