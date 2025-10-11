# Product Catalog - React Frontend

A simple React.js interface for browsing and filtering products from the Authentication API.

## 🚀 Quick Start

1. **Make sure the API is running:**
   ```bash
   # From the root directory
   npm run docker:dev  # Start databases
   npm run dev         # Start API
   ```

2. **Generate sample products (if not done already):**
   ```bash
   curl -X POST http://localhost:3000/products/generate
   ```

3. **Open the interface:**
   ```bash
   # Simply open the HTML file in your browser
   open client/index.html
   
   # Or use a local server (recommended)
   cd client
   python3 -m http.server 8080
   # Then visit: http://localhost:8080
   ```

## ✨ Features

- **📊 Product Grid** - Displays all 100 products in a beautiful card layout
- **🔍 Advanced Filtering** - Filter by name, category, brand, price range, stock quantity
- **📈 Real-time Stats** - Shows total products, filtered results, categories, and brands
- **🎨 Modern UI** - Clean, responsive design with smooth animations
- **⚡ Fast Filtering** - Client-side filtering for instant results
- **📱 Responsive** - Works on desktop, tablet, and mobile devices

## 🎯 Filter Options

- **Product Name** - Search by product name (partial match)
- **Category** - Select from dropdown (Electronics, Clothing, etc.)
- **Brand** - Select from dropdown (TechPro, StyleMax, etc.)
- **Price Range** - Filter by minimum and maximum price
- **Stock Range** - Filter by minimum and maximum stock quantity

## 🛠️ Technology

- **React 18** - UI library
- **Vanilla JavaScript** - No build tools required
- **Pure CSS** - Modern, responsive styling
- **Babel Standalone** - In-browser JSX transformation

## 📝 Notes

- This is a simple single-file React app for demonstration
- All filtering is done client-side for instant results
- For production, consider using Create React App or Next.js
- API must be running at `http://localhost:3000`
