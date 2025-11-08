Axiom Frontend Task - Token Discovery Table

This project is a high-fidelity, production-grade replica of the Axiom Trade token discovery table. It is built with a focus on performance, clean architecture, and real-time data handling.

🚀 Deliverables

Live Vercel Deployment: https://tokentrader-one.vercel.app/

YouTube Demo: https://YOUR_YOUTUBE_LINK_HERE

✨ Features Implemented

Pixel-Perfect UI: A close replica of the Axiom "Pulse" page, built with Tailwind CSS and shadcn/ui.

Three Token Categories: "New pairs," "Final Stretch," and "Migrated" tabs.

Real-time Price Updates: A mock WebSocket updates token prices every 2 seconds, triggering a green/red "flash" animation on the price cell.

Advanced State Management:

React Query (@tanstack/react-query): Handles all asynchronous data fetching, caching, and real-time cache updates from the mock socket.

Redux Toolkit (@reduxjs/toolkit): Manages all complex UI state, such as the active category and sorting configuration.

Interactive Table:

Sorting: Click any table header (Token, Price, TVL, etc.) to sort the list.

Tooltips: Informational tooltips on category tabs.

Modal: Click any token row to open a detailed modal for that token.

Loading States: A shadcn/ui skeleton loader is displayed while the initial data is being fetched.

Atomic Architecture: The project is structured using atomic design principles for maximum reusability and maintainability.

Fully Responsive: The layout is fully responsive down to 320px, with the table becoming horizontally scrollable on small screens.

🛠 Technical Stack

This project fulfills all technical requirements from the task prompt:

Framework: Next.js 14 (App Router)

Language: TypeScript (Strict)

Styling: Tailwind CSS

UI Components: shadcn/ui (Button, Table, Dialog, Tooltip, Skeleton)

Data Fetching: React Query

State Management: Redux Toolkit

Optimization: React.memo for rows, useMemo for sorting, next/image for optimized images.

📂 Project Structure

The codebase follows an Atomic Design methodology:

/src
├── @types          # (from shadcn)
├── app             # Next.js App Router
│   ├── layout.tsx  # Root layout with providers
│   └── page.tsx    # Main page component (assembles organisms)
├── components
│   ├── ui          # Atoms (shadcn components)
│   ├── icons.tsx   # Atoms (custom icons)
│   ├── molecules
│   │   └── TokenRow.tsx
│   └── organisms
│       ├── TokenTable.tsx
│       ├── TokenDetailModal.tsx
│       └── TableSkeleton.tsx
└── lib
    ├── QueryProvider.tsx
    ├── types.ts
    └── store
        ├── ReduxProvider.tsx
        ├── store.ts
        └── uiSlice.ts


⚙️ Running Locally

Clone the repository:

git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME


Install dependencies:

npm install


Run the development server:

npm run dev


Open http://localhost:3000 to view the application.

📱 Responsive Design Snapshots

As required, the application is fully responsive.

Desktop (1920px)

Tablet (768px)

Mobile (320px)

(Your desktop screenshot here)

(Your tablet screenshot here)

(Your mobile screenshot here)

[Desktop Screenshot]

[Tablet Screenshot]

[Mobile Screenshot]

(Note: Please take your own screenshots and replace the placeholders above.)