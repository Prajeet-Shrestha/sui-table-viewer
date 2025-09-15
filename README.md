# Sui Table Explorer

A powerful web application for exploring Sui blockchain table and object data. Built with React, TypeScript, and Vite, this tool provides an intuitive interface to search, browse, and analyze Sui table objects across different networks.

## Features

- 🔍 **Smart Object Detection**: Automatically detects whether an object ID is a table or regular Sui object
- 🌐 **Multi-Network Support**: Explore data on Mainnet, Testnet, and Devnet
- 📊 **Table Viewer**: Browse table entries with pagination and interactive object exploration
- 🎯 **Object Viewer**: View detailed information about individual Sui objects
- 💾 **Persistent Settings**: Network selection is saved in localStorage
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Dark theme with glassmorphism effects and smooth animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd sui-table-viewer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Searching for Objects

1. Enter a Sui object ID in the search box (must start with `0x` and be 66 characters long)
2. Select your desired network (Mainnet, Testnet, or Devnet)
3. Click "Search" or press Enter

### Table Objects

When you search for a table object, you'll see:

- Table metadata (Object ID, version, digest, type, owner)
- Paginated table entries
- Clickable object IDs for further exploration
- Navigation controls for browsing through pages

### Regular Objects

When you search for a regular Sui object, you'll see:

- Complete object metadata
- Object content with syntax highlighting
- Interactive navigation to related objects

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features (Grid, Flexbox, CSS Variables)
- **Blockchain**: Sui SDK (@mysten/sui)
- **Routing**: React Router DOM
- **JSON Viewer**: react-json-view

## Project Structure

```
src/
├── components/
│   ├── home/           # Home page components
│   ├── TableViewer.tsx # Table object viewer
│   └── ObjectViewer.tsx # Regular object viewer
├── sui/
│   └── client.ts       # Sui blockchain client
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
