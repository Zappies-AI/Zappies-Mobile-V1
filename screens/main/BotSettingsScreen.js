import React, { useState } from 'react';
import { ClipboardCopyIcon, EyeIcon } from 'lucide-react';

const BotSettingsScreen = () => {
  const [botName, setBotName] = useState('My Awesome Bot');
  const [welcomeMessage, setWelcomeMessage] = useState('Hello! How can I help you today?');
  const [instructions, setInstructions] = useState('You are a friendly and helpful assistant. Provide concise and accurate answers.');
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    // Logic to save the bot settings
    console.log('Bot settings saved:', { botName, welcomeMessage, instructions, isActive });
    alert('Settings saved successfully!');
  };
  
  const handleCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Code copied to clipboard!');
  };

  const getEmbedCode = () => {
    return `<script src="https://your-bot-platform.com/embed.js?botId=your-unique-id"></script>`;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bot Settings</h1>

      {/* General Settings Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows="3"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bot Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows="5"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-700">Bot is Active</label>
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Website Integration</h2>
        <p className="text-sm text-gray-600 mb-4">
          Copy and paste this code snippet into the `&lt;head&gt;` section of your website to embed the bot.
        </p>
        <div className="relative bg-gray-50 p-4 rounded-md font-mono text-sm text-gray-800 overflow-x-auto">
          <pre>{getEmbedCode()}</pre>
          <button
            onClick={() => handleCopy(getEmbedCode())}
            className="absolute top-2 right-2 p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
          >
            <ClipboardCopyIcon size={16} />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default BotSettingsScreen;
