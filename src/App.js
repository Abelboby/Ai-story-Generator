import React from 'react';
import StoryGenerator from './StoryGenerator'; // Import the StoryGenerator component
import './index.css'; // Ensure Tailwind CSS is applied

function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
        Story Generator
      </h1>
      <StoryGenerator />
    </div>
  );
}

export default App;
