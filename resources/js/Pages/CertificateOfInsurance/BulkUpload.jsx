import React, { useState } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function BulkUpload() {
  const { props } = usePage();
  const { recentUploads, flash } = props;
  const [csvFile, setCsvFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const { data, setData, post, processing, errors, reset } = useForm({
    csv_file: null,
  });

  const validateCsv = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const errors = [];

      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        
        if (lines.length < 2) {
          errors.push('CSV file must contain at least a header row and one data row');
          setValidationErrors(errors);
          resolve(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['master_policy_id', 'insured_name'];
        
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        // Validate data rows
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          if (values.length !== headers.length) {
            errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
          }

          // Check required fields
          const masterPolicyIdx = headers.indexOf('master_policy_id');
          const insuredNameIdx = headers.indexOf('insured_name');
          
          if (masterPolicyIdx >= 0 && !values[masterPolicyIdx]?.trim()) {
            errors.push(`Row ${i + 1}: master_policy_id is required`);
          }
          if (insuredNameIdx >= 0 && !values[insuredNameIdx]?.trim()) {
            errors.push(`Row ${i + 1}: insured_name is required`);
          }

          // Validate email format if present
          const emailIdx = headers.indexOf('insured_email');
          if (emailIdx >= 0 && values[emailIdx]?.trim()) {
            const email = values[emailIdx].trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              errors.push(`Row ${i + 1}: invalid email format`);
            }
          }

          // Validate numeric fields
          const numericFields = ['cargo_value', 'gross_premium', 'gst_premium', 'total_premium'];
          numericFields.forEach(field => {
            const idx = headers.indexOf(field);
            if (idx >= 0 && values[idx]?.trim()) {
              if (isNaN(values[idx].trim())) {
                errors.push(`Row ${i + 1}: ${field} must be a number`);
              }
            }
          });
        }

        setValidationErrors(errors);
        resolve(errors.length === 0);
      };

      reader.onerror = () => {
        errors.push('Failed to read CSV file');
        setValidationErrors(errors);
        resolve(false);
      };

      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFile(file);
    setValidationErrors([]);
    
    const isValid = await validateCsv(file);
    if (isValid) {
      setData('csv_file', file);
    } else {
      setData('csv_file', null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validationErrors.length > 0) {
      alert('Please fix validation errors before uploading');
      return;
    }
    post(route('certificates.upload-csv'), {
      onSuccess: () => {
        reset();
        setCsvFile(null);
        setValidationErrors([]);
      }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bulk Upload Certificates</h1>
        <div className="flex space-x-2">
          <a
            href={route('certificates.sample-csv')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📥 Download Sample CSV
          </a>
          <Link href={route('certificates.index')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Back
          </Link>
        </div>
      </div>

      {flash?.success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {flash.success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload CSV File</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select CSV File (Max 10MB)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.csv_file && (
              <div className="text-red-600 text-sm mt-1">{errors.csv_file}</div>
            )}
          </div>

          {csvFile && (
            <div className="mb-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                Selected: <strong>{csvFile.name}</strong> ({(csvFile.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="text-red-800 font-semibold mb-2">Validation Errors:</h3>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={processing || !data.csv_file || validationErrors.length > 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Uploading...' : 'Upload & Process'}
          </button>
        </form>

        <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Download the sample CSV template using the button above</li>
            <li>Fill in your data following the template format</li>
            <li>Required fields: master_policy_id, insured_name</li>
            <li>Upload the CSV file - it will be validated before processing</li>
            <li>Processing happens in the background via queue</li>
            <li>Download error/success files below after processing completes</li>
          </ol>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>
        
        {recentUploads && recentUploads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Errors</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUploads.map((upload) => (
                  <tr key={upload.id}>
                    <td className="px-4 py-3 text-sm">{upload.original_file_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(upload.status)}`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{upload.total_rows}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{upload.success_count}</td>
                    <td className="px-4 py-3 text-sm text-red-600">{upload.error_count}</td>
                    <td className="px-4 py-3 text-sm">{new Date(upload.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      {upload.error_file_path && (
                        <a
                          href={route('bulk-upload.error-file', upload.id)}
                          className="text-red-600 hover:underline"
                        >
                          Error File
                        </a>
                      )}
                      {upload.success_file_path && (
                        <a
                          href={route('bulk-upload.success-file', upload.id)}
                          className="text-green-600 hover:underline"
                        >
                          Success File
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent uploads</p>
        )}
      </div>
    </div>
  );
}

BulkUpload.layout = page => <DashboardLayout>{page}</DashboardLayout>;
