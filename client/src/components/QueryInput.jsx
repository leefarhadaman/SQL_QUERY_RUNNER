import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';  // Corrected import for CodeMirror
import { sql } from '@codemirror/lang-sql';  // Import SQL language mode

const QueryInput = ({ onRunQuery }) => {
  const [query, setQuery] = useState('');

  const handleChange = (value) => {
    setQuery(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onRunQuery(query); // Run the query when the form is submitted
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="sql-query" className="text-lg font-medium text-white">Enter your SQL Query:</label>
      </div>
      <CodeMirror
        value={query}
        height="200px"
        extensions={[sql()]}  // Enable SQL syntax highlighting
        onChange={(value) => handleChange(value)}  // Update state on input change
        theme="dark"  // Optional: Set the theme (use 'light' for light mode)
      />
      <div className="flex justify-end mt-4">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          Run Query
        </button>
      </div>
    </form>
  );
};

export default QueryInput;
