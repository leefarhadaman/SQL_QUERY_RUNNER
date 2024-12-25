import React, { useState } from 'react';
import { Database, Sun, Moon, Power, History, Play, AlertCircle } from 'lucide-react';

const App = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [queryHistory, setQueryHistory] = useState([]);
  const [databaseName, setDatabaseName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [query, setQuery] = useState('');

  // Handlers remain the same
  const handleRunQuery = async (queryToRun) => {
    if (!isConnected) {
      setError("Please connect to a database first.");
      return;
    }
    if (!queryToRun.trim()) {
      setError("Please enter a query.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/run-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToRun }),
      });
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setQueryHistory([queryToRun, ...queryHistory]);
        setError(null);
      } else {
        setError(data.error);
        setResults([]);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!databaseName.trim()) {
      setError('Please enter a database name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ database: databaseName }),
      });
      const data = await response.json();

      if (data.success) {
        setIsConnected(true);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to the database.');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setDatabaseName('');
    setResults([]);
    setQueryHistory([]);
    setError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              SQL Query Runner
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                placeholder="Database name"
                className={`w-64 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                }`}
                disabled={isConnected}
              />
              <button
                onClick={isConnected ? handleDisconnect : handleConnect}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 ${
                  isConnected 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className={`col-span-1 rounded-lg shadow-lg p-6 transition-colors duration-200 ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-semibold">Query History</h2>
            </div>
            <div className="space-y-2">
              {queryHistory.map((historyQuery, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-slate-700 hover:bg-slate-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setQuery(historyQuery)}
                >
                  <p className="text-sm font-mono truncate">{historyQuery}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            <div className={`rounded-lg shadow-lg p-6 transition-colors duration-200 ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Query Editor</h2>
              <div className="space-y-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-full h-40 p-4 font-mono text-sm rounded-lg border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-gray-100' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your SQL query here..."
                />
                <button
                  onClick={() => handleRunQuery(query)}
                  className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 ${
                    darkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-700'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  <Play className="w-4 h-4" />
                  {loading ? 'Running...' : 'Run Query'}
                </button>
              </div>
            </div>

            <div className={`rounded-lg shadow-lg p-6 transition-colors duration-200 ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              {error ? (
                <div className={`flex items-center gap-2 p-4 rounded-lg ${
                  darkMode 
                    ? 'bg-rose-900/50 text-rose-200' 
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              ) : results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={darkMode ? 'border-slate-700' : 'border-gray-200'}>
                        {Object.keys(results[0]).map((key) => (
                          <th key={key} className="p-3 text-left font-semibold">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, i) => (
                        <tr key={i} className={`border-b ${
                          darkMode ? 'border-slate-700' : 'border-gray-200'
                        }`}>
                          {Object.values(row).map((value, j) => (
                            <td key={j} className="p-3">{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={`text-center ${
                  darkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>No results to display</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;