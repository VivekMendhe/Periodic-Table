# Periodic-Table 🧪

An interactive, responsive, and modern **Periodic Table of Elements** web application built with **TypeScript**, **CSS Grid**, and **Vite**.

## ✨ Features

- **Complete Element Dataset**: All 118 elements verified according to IUPAC & NIST scientific standards.
- **Interactive Periodic Table Grid**: Standard 18-column grid with Lanthanides and Actinides separated below.
- **Smart Search & Filter**: Search elements dynamically by name, chemical symbol, or atomic number.
- **Live Temperature Simulator**: Interactive thermal slider from 0 K to 6000 K showing real-time states of matter.
- **Multiple Color Modes**: Visualize by Category, Orbital Block (s, p, d, f), Phase, or Electronegativity heatmap.
- **Side-by-Side Element Comparator**: Compare any two chemical elements side-by-side.
- **Detailed Element Modal**: Click on any element to view in-depth chemical and physical properties:
  - Atomic weight, electron configuration, Bohr orbital model
  - Melting & boiling points, density, oxidation states
  - Period, group, block, discovery year, and real-world applications
- **Dark / Light Mode**: Seamless theme switching with persistent user preference stored in `localStorage`.
- **Responsive Layout**: Designed for seamless viewing across desktops, tablets, and mobile screens.

## 🛠️ Tech Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: Modern CSS with CSS Grid & Custom Properties (Variables)
- **Linting**: ESLint with TypeScript ESLint configuration

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or later recommended) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VivekMendhe/Periodic-Table.git
   cd Periodic-Table
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the project for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
