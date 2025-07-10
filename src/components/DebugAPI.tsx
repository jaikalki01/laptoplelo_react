import { useState, useEffect } from 'react';
import { productsAPI } from '@/utilis/api';
import { Button } from '@/components/ui/button';

const DebugAPI = () => {
  const [status, setStatus] = useState<string>('Ready');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testAPI = async () => {
    setStatus('Testing...');
    setError('');
    setData(null);

    try {
      const result = await productsAPI.getAll();
      setData(result);
      setStatus('Success');
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setStatus('Failed');
      console.error('API Test Error:', err);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">API Debug</h3>
      <Button onClick={testAPI} disabled={status === 'Testing...'}>
        Test Products API
      </Button>
      <div className="mt-4">
        <p><strong>Status:</strong> {status}</p>
        {error && <p className="text-red-500"><strong>Error:</strong> {error}</p>}
        {data && (
          <div>
            <p><strong>Data Type:</strong> {typeof data}</p>
            <p><strong>Is Array:</strong> {Array.isArray(data) ? 'Yes' : 'No'}</p>
            <p><strong>Length:</strong> {Array.isArray(data) ? data.length : 'N/A'}</p>
            <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugAPI; 