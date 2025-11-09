Axiom Token Discovery Table (Frontend Task)

This is a pixel-perfect, feature-complete replica of the Axiom token discovery table, built as a frontend technical assessment.

The project meets all technical, performance, and visual requirements by leveraging a modern tech stack including Next.js, React Query for data fetching, and Redux Toolkit for complex UI state.

Deliverables Checklist

Live Vercel Deployment:

https://tokentrader-one.vercel.app/

GitHub Repo:

https://github.com/sand33p312/Token_Trader_app.git

Video Demonstration (1-2 mins):

(YouTube video link here)

Responsive Layout Snapshots:

(See "Responsive Layout" section below)

https://github.com/user-attachments/assets/ec456ac0-87e6-407d-88c5-d81985354423,
https://github.com/user-attachments/assets/44829c65-572d-4999-b493-1e8efa82f427,
https://github.com/user-attachments/assets/fc559091-046e-479a-8f77-976e830fab28,
https://github.com/user-attachments/assets/c055fd25-74d5-4461-a773-81abdfb9bc43

Core Features Checklist

This project successfully implements all required core features:

[x] Token Columns: Implements the three categories (New Pairs, Final Stretch, Migrated) as filterable tabs.

[x] Tooltips: Hovering the "i" icon next to each category shows a descriptive tooltip.

[x] Modal: Clicking any token row opens a modal with detailed token information.

[x] Sorting: All columns are sortable by clicking the header (ascending/descending).

[x] Hover Effects: Table rows have a clear hover state, and interactive elements (buttons, headers) respond to the cursor.

[x] Click Actions: Tabs, sort headers, and token rows are all clickable with distinct actions.

[x] Real-time Price Updates: A "WebSocket mock" (setInterval) updates token prices every 2 seconds, triggering a smooth red/green color transition to indicate price changes.

[x] Loading States: A shadcn/ui skeleton loader is displayed while the initial data is being fetched.

[x] Pixel-Perfect Visual Match:

Uses the correct "Inter" font (loaded via next/font).

Matches the 5-column layout (Token, Price, 24h %, TVL, 24h Volume).

Matches header styling (uppercase, letter-spacing, and colors).

Implements the dark mode theme across all components.

Corrects for all visual bugs (button text, modal text, etc.).

Technical Stack & Requirements Checklist

[x] Next.js 14 App Router

[x] TypeScript (Strict)

[x] Tailwind CSS

[x] Redux Toolkit: Manages complex UI state (active category, sort configuration).

[x] React Query (@tanstack/react-query): Handles all data fetching, caching, and real-time state updates.

[x] shadcn/ui: Used for all accessible, core components (Table, Dialog, Tooltip, Skeleton, Button).

[x] Performance:

React.memo is used on TokenRow to prevent re-renders of the entire list on price updates.

useMemo is used for efficient sorting and filtering.

Next.js <Image /> component is used with unoptimized={true} for SVG placeholders.

[x] Atomic Architecture: Code is organized into atoms (icons.tsx), molecules (TokenRow.tsx), and organisms (TokenTable.tsx, TokenDetailModal.tsx).

[x] Responsive Layout: The table is horizontally scrollable on all viewports down to 320px.

Responsive Layout Snapshots

(Please take your screenshots and insert them here)

Desktop (1440px)

Tablet (768px)

Mobile (320px) - Showing horizontal scroll

How to Run Locally

Clone the repository:

git clone <YOUR_REPO_LINK_HERE>
cd token-trader-app


Install dependencies:

npm install


Run the development server:

npm run dev


Open http://localhost:3000 to view the application.