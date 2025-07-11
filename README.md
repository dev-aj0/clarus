# ✨ Clarus — AI-Powered Scientific Fact-Checking 🧠🔬

Welcome to **Clarus**! Your go-to app for analyzing and fact-checking scientific content with the power of AI. Get instant, research-backed insights on articles, posts, PDFs, and more — all in a beautiful, modern interface.

---

## 🚀 Features

- 🌐 **Analyze Anything**: Fact-check URLs, text, and PDFs for scientific accuracy
- 🤖 **AI Chat Assistant**: Ask questions and get smart, science-based answers
- 📚 **Personal Library**: Save and revisit your analyses privately
- 🕵️‍♂️ **Peer-Reviewed Sources**: See real research and direct quotes
- 🌗 **Dark Mode**: Eye-friendly, accessible design
- 🔒 **Private by Design**: Your data is yours — always

---

## 🛠️ Tech Stack

- ⚛️ React + TypeScript
- 🎨 Tailwind CSS + shadcn/ui
- ⚡ Vite (super fast dev/build)
- 🔑 Supabase Auth (Google sign-in only)
- 🤝 Perplexity AI (for analysis)

---

## 🏁 Getting Started

### 1️⃣ Clone & Install
```sh
git clone <YOUR_GIT_URL>
cd clarus-ai-main
npm install
```

### 2️⃣ Set Up Your `.env`  🗝️
- Copy `.env.example` to `.env` (create one if missing)
- Add your API keys (Perplexity, Supabase, etc.)
- **Never share your `.env`!** (It’s gitignored for safety)

### 3️⃣ Run the App
```sh
npm run dev
```
Visit [http://localhost:8080](http://localhost:8080) and start analyzing!

---

## 🔑 Authentication
- **Google Sign-In only** (no email/password)
- Each user’s data is private and separate

---

## 📁 Project Structure

```
src/
  components/   # UI building blocks
  pages/        # Main app pages
  hooks/        # Custom React hooks
  services/     # Data & API logic
  types/        # TypeScript types
  utils/        # Helpers & utilities
  styles/       # CSS & themes
  contexts/     # App-wide state
```

---

## 🧑‍💻 Contributing
1. Fork & branch off `main`
2. Make your magic ✨
3. PRs welcome!

---

## ⚠️ License & Security
- **Private project** — not for commercial use
- Keep your API keys secret! (`.env` is always gitignored)

---

Made with ❤️ by the Clarus team