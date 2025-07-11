# Clarus - AI-Powered Scientific Analysis

Clarus is a web application that helps users analyze scientific content for accuracy using AI-powered fact-checking. It provides reliable scientific research to combat misinformation and bias.

## Features

- **Content Analysis**: Analyze scientific accuracy of posts, articles, and content
- **AI Chat Assistant**: Get insights and answers about scientific content
- **Analysis Library**: Save and organize your analysis history
- **Multiple Input Types**: Support for URLs, text, PDFs, and YouTube videos
- **Research Sources**: Access to peer-reviewed research papers and citations
- **Dark Mode**: Full dark mode support with accessibility features

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Query for server state
- **AI Integration**: Perplexity AI for content analysis
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd clarus
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and data services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # CSS and styling files
└── contexts/           # React context providers
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

The application uses Perplexity AI for content analysis. Make sure to configure your API key in the application settings.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.