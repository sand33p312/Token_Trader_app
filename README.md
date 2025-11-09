# 🚀 Axiom Token Discovery Table (Frontend Task)

> A pixel-perfect, feature-complete replica of the **Axiom Token Discovery Table**, built as part of a frontend technical assessment.  
> Implemented using **Next.js, React Query, Redux Toolkit, and shadcn/ui**, ensuring top-notch performance and responsive design.

---

## 🌐 Live Demo & Resources

| Type | Link |
|------|------|
| **Live Deployment** | 🔗 [tokentrader-one.vercel.app](https://tokentrader-one.vercel.app/) |
| **GitHub Repo** | 💻 [github.com/sand33p312/Token_Trader_app](https://github.com/sand33p312/Token_Trader_app.git) |
| **Video Demo** | 🎥 (YouTube link here) |
| **Responsive Snapshots** | 🖼️ [View on GitHub](https://github.com/user-attachments/assets/ec456ac0-87e6-407d-88c5-d81985354423)<br>[1](https://github.com/user-attachments/assets/44829c65-572d-4999-b493-1e8efa82f427) · [2](https://github.com/user-attachments/assets/fc559091-046e-479a-8f77-976e830fab28) · [3](https://github.com/user-attachments/assets/c055fd25-74d5-4461-a773-81abdfb9bc43) |

---

## ✅ Core Features

- **💡 Token Tabs:** New Pairs, Final Stretch, and Migrated — fully filterable.
- **🧠 Tooltips:** Hover over “i” icons to view descriptive tooltips.
- **📈 Sorting:** Click any header to sort ascending/descending.
- **📊 Real-time Updates:** Simulated WebSocket updates every 2 seconds with smooth color transitions.
- **🪟 Modal View:** Click any row to open detailed token info.
- **🎨 Pixel-Perfect UI:** Matches original design exactly (font, spacing, colors, hover states).
- **🌙 Dark Mode:** Fully supported theme consistency.
- **⚡ Performance:** Optimized with `React.memo`, `useMemo`, and efficient rendering.
- **💾 Loading State:** Skeleton loaders using `shadcn/ui`.

---

## 🧱 Tech Stack

| Category | Tools |
|-----------|-------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS |
| **State Management** | Redux Toolkit |
| **Data Fetching** | React Query (`@tanstack/react-query`) |
| **UI Library** | shadcn/ui |
| **Architecture** | Atomic (atoms → molecules → organisms) |

---

## 🧩 Code Architecture Overview

src/
├─ app/ # Next.js App Router structure
├─ components/
│ ├─ atoms/ # Icons, buttons
│ ├─ molecules/ # TokenRow, Modals
│ └─ organisms/ # TokenTable, DetailModal
├─ store/ # Redux Toolkit slices
├─ hooks/ # Custom hooks for query & UI state
├─ utils/ # Helper functions
└─ types/ # TypeScript definitions

---

## 📱 Responsive Design

| Device | Preview |
|---------|----------|
| 💻 **Desktop (1440px)** | Full table layout |
| 📱 **Tablet (768px)** | Condensed layout with scroll |
| 📱 **Mobile (320px)** | Horizontal scroll maintained |

---

## 🧠 Performance Highlights

- 🔁 **WebSocket Mock:** Real-time price updates every 2s  
- 🧩 **React.memo:** Prevents unnecessary re-renders  
- 🧮 **useMemo:** Efficient sorting & filtering  
- ⚙️ **Unoptimized SVGs:** Using Next.js `Image` with `unoptimized={true}`  

---

## ⚙️ How to Run Locally

```bash
# 1️⃣ Clone the repo
git clone https://github.com/sand33p312/Token_Trader_app.git
cd Token_Trader_app

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the dev server
npm run dev
