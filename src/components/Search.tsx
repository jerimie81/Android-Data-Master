import React, { useState } from 'react';
import { Search as SearchIcon, Globe, Loader2, ExternalLink } from 'lucide-react';
import { performSearch } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function Search() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{text: string, chunks: any[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const res = await performSearch(query);
      setResult(res);
    } catch (error) {
      console.error('Search error:', error);
      setResult({
        text: 'An error occurred while searching. Please try again.',
        chunks: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Web Search Grounding</h2>
            <p className="text-sm text-zinc-400">Search the web for the latest device info, firmware, or guides.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Latest firmware for Samsung SM-A165M"
            className="w-full bg-black border border-zinc-700 text-white rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-lg"
          />
          <SearchIcon className="absolute left-4 top-4.5 w-6 h-6 text-zinc-500" />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-3 top-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p>Searching the web and generating response...</p>
            </div>
          ) : result ? (
            <div className="space-y-8">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{result.text}</ReactMarkdown>
              </div>
              
              {result.chunks && result.chunks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.chunks.map((chunk, idx) => {
                      if (chunk.web?.uri) {
                        return (
                          <a 
                            key={idx} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start space-x-3 p-3 rounded-lg bg-black border border-zinc-800 hover:border-zinc-600 transition-colors group"
                          >
                            <ExternalLink className="w-4 h-4 text-zinc-500 mt-0.5 group-hover:text-blue-400" />
                            <div className="overflow-hidden">
                              <p className="text-sm text-zinc-200 font-medium truncate">{chunk.web.title || new URL(chunk.web.uri).hostname}</p>
                              <p className="text-xs text-zinc-500 truncate">{chunk.web.uri}</p>
                            </div>
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
