"use client";
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const StoryGenerator = () => {
  const [storyPrompt, setStoryPrompt] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedStories, setSavedStories] = useState([]);
  const [storyTitle, setStoryTitle] = useState('');

  useEffect(() => {
    const stories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
    setSavedStories(stories);
  }, []);

  const generateStory = async () => {
    if (!storyPrompt) return;
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyDaYFh_n9WVsA62klkxIcS9aBLnn2NOAWc'); 
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

      const result = await model.generateContent(storyPrompt);
      setGeneratedStory(result.response.text());
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStory = () => {
    if (!storyTitle || !generatedStory) return;
    
    const newStory = {
      id: Date.now(),
      title: storyTitle,
      content: generatedStory,
      date: new Date().toLocaleDateString()
    };

    const updatedStories = [...savedStories, newStory];
    setSavedStories(updatedStories);
    localStorage.setItem('bedtimeStories', JSON.stringify(updatedStories));
    setStoryTitle('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-gray-400 p-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-3xl">
        <div className="p-6">
          {/* Prompt Input Section */}
          <div className="space-y-6">
            <textarea 
              className="w-full p-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter a prompt for your story..."
              rows={4}
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
            />
            <button 
              className={`w-full py-3 text-lg font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-gray-600 text-white 
                          ${isLoading ? 'cursor-not-allowed opacity-75' : 'hover:opacity-90'}`}
              onClick={generateStory}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Generate Story'}
            </button>
          </div>

          {/* Generated Story Section */}
          {generatedStory && (
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-gray-100 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Your Story</h3>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{generatedStory}</p>
              </div>

              {/* Save Story Section */}
              <input 
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter story title to save..."
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
              />
              <button 
                className="w-full py-3 text-lg font-semibold rounded-lg shadow-md bg-gradient-to-r from-green-500 to-gray-600 text-white hover:opacity-90"
                onClick={saveStory}
              >
                Save Story
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Saved Stories Section */}
      {savedStories.length > 0 && (
        <div className="mt-12 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedStories.map(story => (
              <div key={story.id} className="bg-white rounded-lg shadow-lg p-6 space-y-3">
                <h3 className="text-xl font-semibold text-blue-700">{story.title}</h3>
                <p className="text-sm text-gray-500">{story.date}</p>
                <p className="text-gray-700 line-clamp-3">{story.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;
