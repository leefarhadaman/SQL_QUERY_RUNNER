import React from 'react';

const QueryHistory = ({ queryHistory, onRunQuery }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-blue-300 mb-4">Query History</h2>
      <ul className="space-y-4">
        {queryHistory.slice(0, 5).map((query, index) => (
          <li
            key={index}
            className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-all"
            onClick={() => onRunQuery(query)}
          >
            <pre className="text-sm font-mono text-white">{query}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueryHistory;
