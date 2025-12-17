import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Pagination';

export default function Index() {
  const { props } = usePage();
  const { policies, filters } = props;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.q.value;
    const url = route('certificates.index') + (q ? `?q=${encodeURIComponent(q)}` : '');
    window.location.href = url;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Certificate of Insurance</h1>
        <div className="flex space-x-2">
          <Link href={route('certificates.create')} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            ➕ Create Certificate
          </Link>
          <Link href={route('certificates.bulk-upload')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            📤 Bulk Upload
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex">
          <input name="q" defaultValue={filters?.q || ''} placeholder="Search policies" className="border rounded px-3 py-2 mr-2 flex-1" />
          <button type="submit" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Search</button>
        </form>
      </div>

      <div className="bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {policies.data.map((policy) => (
              <tr key={policy.id}>
                <td className="px-6 py-4 whitespace-nowrap">{policy.policy_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{policy.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={route('certificates.show', policy.id)} className="text-indigo-600 hover:text-indigo-900">
                      View Certificates
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4">
          <Pagination links={policies.links} />
        </div>
      </div>
    </div>
  );
}

Index.layout = page => <DashboardLayout>{page}</DashboardLayout>;
