# AI Study Assistant — Frontend

> Modern, beautiful, and highly interactive React frontend for the AI Study Assistant Platform.
> Built with stunning glassmorphism design, smooth animations, and a focus on user experience.

---

## 🚀 Built With

- **Framework:** React 18 + Vite
- **Routing:** React Router DOM 6
- **Styling:** Tailwind CSS + custom Glassmorphism utilities
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Markdown:** React Markdown + Tailwind Typography
- **Data Fetching:** Axios (with Axios Interceptors for JWT auth)

---

## 🌟 Key Features

- **Glassmorphism UI:** Stunning, premium design utilizing background blurs, gradients, and animated ambient orbs.
- **Authentication:** Full JWT support (access and refresh tokens). Auto-refreshes tokens seamlessly in the background.
- **AI Integration:** Communicate with the backend LLM with a typing cursor effect. Allows users to save AI-generated responses directly to their Study Notes library.
- **Markdown Rendering:** Beautifully renders the rich markdown returned from the AI, including tables, headings, and heavily styled code blocks.
- **Rich Interactive Elements:** Animated hover cards, loading skeletons, and Framer Motion layout transitions.
- **Admin Panel:** Sleek animated data grids for managing users and monitoring AI usage metrics.
- **Dark/Light Mode:** Full theming support via context providers.

---

## 🛠️ Project Structure

```text
frontend/
├── index.html           # Main HTML entry
├── postcss.config.js    # PostCSS configs
├── tailwind.config.js   # Custom colors, plugins, and glass-gradient animations
├── vite.config.js       # Vite build config with proxy setup
└── src/
    ├── api/             # Axios instance configurations and interceptors
    ├── components/      # Reusable UI components (Navbar, Sidebar, AnimatedBackground, etc.)
    ├── pages/           # Route views (Home, Login, Dashboard, AI, NoteList, Admin, etc.)
    ├── store/           # Context Providers (AuthContext, ThemeContext)
    ├── App.jsx          # Router configuration
    ├── index.css        # Base Tailwind styles and complex custom utility classes
    └── main.jsx         # React DOM mount point
```

---

## 🖥️ Getting Started

If you are running the project using Docker Compose from the root directory, you do **not** need to run these commands manually.

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`. 
*Note: Ensure the Django backend is running on `http://localhost:8000` to prevent proxy errors.*

---

## 🎨 Styling Architecture

This project strictly avoids inline styles and monolithic CSS files. It utilizes:
- **Tailwind `index.css` Components:** Reusable component classes (`.btn-primary`, `.card`, `.input-field`) are defined using `@apply` in `index.css` to keep JSX clean.
- **Design Tokens:** Extensive customization of Tailwind `theme.colors` in `tailwind.config.js`, including custom `spark`, `accent`, and `ink` palettes.
- **Animation Keyframes:** Custom keyframes defined in Tailwind configuration for floating backgrounds, slow pulsing, and shimmer effects.
