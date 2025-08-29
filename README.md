# FlowWeaver - Chatbot Flow Builder

A Chats flow builder for designing chatbot conversation flows built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Visual Flow Builder**: Drag-and-drop interface for creating conversation flows
- **Real-time Preview**: See your flow structure as you build it
- **Persistent Storage**: Automatically saves to localStorage and restores on refresh
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Flow Engine**: @xyflow/react
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: React Router DOM

## 📁 Project Structure

```markdown:README.md
<code_block_to_apply_changes_from>
react-flow-project/
├── src/
│   ├── components/
│   │   ├── flow/                 # Flow-specific components
│   │   │   ├── NodesPanel.tsx    # Left sidebar for adding nodes
│   │   │   ├── SettingsPanel.tsx # Right sidebar for node configuration
│   │   │   └── TextMessageNode.tsx # Custom node component
│   │   └── ui/                   # Reusable UI components (shadcn/ui)
│   │       ├── button.tsx        # Button component
│   │       ├── card.tsx          # Card component
│   │       ├── toast.tsx         # Toast notifications
│   │       ├── tooltip.tsx       # Tooltip component
│   │       └── sonner.tsx        # Sonner toast integration
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-mobile.tsx        # Mobile detection hook
│   │   └── use-toast.ts          # Toast management hook
│   ├── libs/                     # Utility libraries
│   │   └── utils.ts              # Common utility functions
│   ├── pages/                    # Application pages
│   │   ├── FlowBuilder.tsx       # Main flow builder interface
│   │   ├── index.tsx             # Home page
│   │   └── NotFound.tsx          # 404 error page
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── tailwind.config.ts            # Tailwind CSS configuration
├── vite.config.ts                # Vite build configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🎯 Core Components

### FlowBuilder.tsx
The main application component that orchestrates the entire flow building experience:
- Manages nodes and edges state
- Handles node connections and validation
- Provides save/load functionality with localStorage
- Integrates all panels and the flow canvas

### TextMessageNode.tsx
A custom node component representing a message in the conversation flow:
- Displays message content with validation indicators
- Includes input/output handles for connections
- Features a delete button for node removal

### NodesPanel.tsx
Left sidebar panel that provides:
- Quick access to add new text message nodes
- Visual representation of available node types
- Collapsible interface for better space utilization

### SettingsPanel.tsx
Right sidebar panel for configuring selected nodes:
- Edit node properties (message content, validation)
- Real-time preview of changes
- Form validation and error handling

##  How It Works

### 1. Flow Creation
- Users can add new text message nodes by clicking the "+" button in the left panel
- Nodes are automatically positioned on the canvas
- Each node represents a step in the chatbot conversation

### 2. Node Connections
- Users connect nodes by dragging from source handles to target handles
- The system validates connections to ensure proper flow structure
- Only one connection per source handle is allowed
- Visual feedback shows connection status and validation

### 3. Node Configuration
- Click on any node to open the settings panel
- Edit message content, validation rules, and other properties
- Changes are applied in real-time
- Validation indicators show node status

### 4. Persistence
- Flow state is automatically saved to localStorage on save
- On page refresh, the flow is restored from localStorage
- Reset functionality clears both the flow and saved state

### 5. Validation
- The system ensures proper flow structure
- Prevents saving flows with disconnected nodes
- Visual indicators show validation status

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd react-flow-project

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

-------------
This README provides:
- **Project Overview**: Clear description of what the application does
- **Tech Stack**: Complete list of technologies used
- **File Structure**: Detailed breakdown of the project organization
- **Component Documentation**: Explanation of each major component
- **How It Works**: Step-by-step explanation of the flow building process
- **Getting Started**: Installation and setup instructions

The README is comprehensive yet concise, making it easy for developers to understand the project structure and get started quickly.
