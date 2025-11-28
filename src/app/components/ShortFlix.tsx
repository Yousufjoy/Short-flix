'use client';

import React, { useState, useEffect } from 'react';
import { Play, X, Search, Plus } from 'lucide-react';

interface Short {
  id: number;
  videoUrl: string;
  title: string;
  tags: string[];
  duration?: string;
}

export default function ShortFlix() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShort, setSelectedShort] = useState<Short | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShort, setNewShort] = useState({
    videoUrl: '',
    title: '',
    tags: '',
    duration: ''
  });

  useEffect(() => {
    loadShorts();
  }, []);

  const loadShorts = async (search?: string) => {
    setLoading(true);
    try {
      const url = search 
        ? `/api/shorts?search=${encodeURIComponent(search)}`
        : '/api/shorts';
      
      const response = await fetch(url);
      const data = await response.json();
      setShorts(data);
    } catch (error) {
      console.error('Failed to load shorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadShorts(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchActive(false);
    loadShorts();
  };

  const handleAddShort = async () => {
    try {
      const response = await fetch('/api/shorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newShort,
          tags: newShort.tags.split(',').map(t => t.trim())
        })
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewShort({ videoUrl: '', title: '', tags: '', duration: '' });
        loadShorts();
      }
    } catch (error) {
      console.error('Failed to add short:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Short-flix
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Short
            </button>
            
            {searchActive ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search shorts..."
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                >
                  Search
                </button>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchActive(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Search className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : shorts.length === 0 ? (
          <div className="text-center text-white py-20">
            <p className="text-xl">No shorts found matching your search.</p>
            <button
              onClick={clearSearch}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-white mb-6">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Shorts'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shorts.map((short) => (
                <div
                  key={short.id}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => setSelectedShort(short)}
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative overflow-hidden">
                    <video
                      src={short.videoUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition">
                        <Play className="w-8 h-8 text-purple-600 ml-1" />
                      </div>
                    </div>
                    
                    {short.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                        {short.duration}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                      {short.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {short.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Video Modal */}
      {selectedShort && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedShort(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedShort(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-purple-400 transition"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-black rounded-xl overflow-hidden">
              <video
                src={selectedShort.videoUrl}
                controls
                autoPlay
                className="w-full"
              />
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {selectedShort.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedShort.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-600/40 text-purple-200 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Short Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-purple-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Add New Short</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Video URL</label>
                <input
                  type="text"
                  value={newShort.videoUrl}
                  onChange={(e) => setNewShort({...newShort, videoUrl: e.target.value})}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Title</label>
                <input
                  type="text"
                  value={newShort.title}
                  onChange={(e) => setNewShort({...newShort, title: e.target.value})}
                  placeholder="Video title"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newShort.tags}
                  onChange={(e) => setNewShort({...newShort, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Duration (optional)</label>
                <input
                  type="text"
                  value={newShort.duration}
                  onChange={(e) => setNewShort({...newShort, duration: e.target.value})}
                  placeholder="0:15"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddShort}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Add Short
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}