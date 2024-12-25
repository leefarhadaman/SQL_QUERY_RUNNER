import React, { useState } from 'react';

const QueryResults = ({ results, error }) => {
  const [page, setPage] = useState(1);
  const resultsPerPage = 5;
  const paginatedResults = results.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  if (error) {
    return (
      <div className="p-4 text-red-500 flex items-center">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (results.length === 0) {
    return <div className="p-4 text-gray-400">No results found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-gray-800 text-white rounded-lg shadow-lg">
        <thead>
          <tr>
            {Object.keys(results[0]).map((key) => (
              <th key={key} className="border-b px-4 py-2 bg-gray-700 text-blue-300 text-left">
                {key.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedResults.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-700">
              {Object.values(row).map((value, index) => (
                <td key={index} className="border-b px-4 py-2 text-sm text-gray-300">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(Math.min(page + 1, Math.ceil(results.length / resultsPerPage)))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QueryResults;
