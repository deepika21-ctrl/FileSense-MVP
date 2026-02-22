# 📁 FileSense – Intelligent File Deletion Advisor

A smart, browser-based file safety assistant that helps users understand whether a file or folder is safe to delete.

FileSense simulates intelligent decision-making using structured metadata, risk scoring, typo-tolerant search, and contextual guidance — all without accessing real system files.

---

## 🚀 Live Demo
(Add your deployment link here)

---

## 🧠 Problem Statement

Many users hesitate before deleting unfamiliar files like:

- `System32`
- `node_modules`
- Random PDFs or folders

Accidentally deleting system-critical files can cause system failure, while unused files waste storage.

FileSense provides a safe, guided way to understand file impact before deletion.

---

## ✨ Key Features

### 🔍 Smart Search
- Top 3 result matching
- Typo-tolerant fuzzy search (Levenshtein distance with threshold)
- “Did you mean?” suggestions
- Search across file name, nickname, and app

### ⚠️ Risk & Confidence Analysis
- Separate **Risk badge** (Low / Medium / High / Extreme)
- Confidence indicator
- Recommended action guidance

### 📋 Structured Explanation
- “Why this exists” contextual explanation
- Bullet-point breakdown of safety impact
- Human-friendly “Last opened” messaging

### 🎨 UX Enhancements
- Empty state handling
- Suggestion chips
- Responsive layout for wide screens
- Accessibility focus states
- Subtle elevation & hover animations
- Mock-data disclaimer for safety transparency

---

## 🏗️ Tech Stack

- **HTML5**
- **CSS3 (Responsive + Accessibility-focused)**
- **Vanilla JavaScript**
- Custom fuzzy search logic (Levenshtein distance with threshold)

No external libraries used.

---

## 🧩 How It Works

1. User searches for a file or folder name.
2. System checks structured dataset.
3. If no exact match:
   - Runs typo-tolerant fuzzy matching.
   - Shows intelligent suggestions.
4. Displays:
   - Risk level
   - Confidence score
   - Recommended action
   - Context breakdown
   - Last opened insight

---

## 📂 Project Structure
/index.html
/style.css
/script.js
/data.js

---

## 🔐 Safety Notice

This project uses a **mock dataset** and does not access or analyze real system files. It is designed as a safe simulation for learning and demonstration purposes.

---

## 📈 Future Improvements

- Dark mode toggle
- Real filesystem integration (with user permission)
- AI-powered contextual reasoning
- Storage impact estimation
- Deployment as a browser extension

---

## 👩‍💻 Author

**Deepika Yadav**  
B.Tech CSE Student  
Passionate about UX-focused product development and intelligent systems.

---
