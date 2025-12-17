import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Pagination';

export default function Show() {
  const { props } = usePage();

  // ✅ Safe defaults to avoid runtime errors
  const {
    policy = {},
    certificates = { data: [], links: [] },
    filters = {},
  } = props;

  const safeRouteCall = (name, ...args) => {
    try {
      // `route` may be provided globally by Ziggy's @routes blade directive
      // when present this will work; otherwise we return sensible fallbacks.
      // eslint-disable-next-line no-undef
      return route(name, ...args);
    } catch (e) {
      switch (name) {
        case 'certificates.index':
          return '/certificate-of-insurance';
        case 'certificates.export':
          return '/certificate-of-insurance/export';
        case 'certificates.exportPolicy':
          return `/certificate-of-insurance/${args[0]}/export`;
        case 'certificates.view':
          return `/certificate-of-insurance/${args[0]}/view`;
        case 'certificates.download':
          return `/certificate-of-insurance/${args[0]}/download`;
        default:
          return '#';
      }
    }
  };

  const [localFilters, setLocalFilters] = useState({
    q: filters.q || '',
    status: '',
    is_intracity: '',
    is_intercity: '',
    date_from: '',
    date_to: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLocalFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? '1' : '') : value,
    }));
  };

  const buildQuery = () => {
    const params = new URLSearchParams();

    Object.entries(localFilters).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        params.set(key, val);
      }
    });

    return params.toString() ? `?${params.toString()}` : '';
  };

  const downloadFiltered = () => {
    const qs = buildQuery();

    try {
      window.location.href =
        route('certificates.exportPolicy', policy.id) + qs;
    } catch {
      window.location.href =
        `/certificate-of-insurance/${policy.id}/export` + qs;
    }
  };

  const formatIndia = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-semibold">
          Certificates for: {policy.policy_name} ({policy.number})
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href={route('certificates.index')}
            className="text-sm text-gray-600"
          >
            Back to policies
          </Link>

          <button
            onClick={downloadFiltered}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            Download CSV (filtered)
          </button>

          <Link
            href={
              route('certificates.export') +
              '?master_policy_id=' +
              policy.id
            }
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Download All CSV
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            name="q"
            placeholder="Search (name, item no, email)"
            value={localFilters.q}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm md:col-span-2"
          />

          <input
            type="date"
            name="date_from"
            value={localFilters.date_from}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
          />

          <input
            type="date"
            name="date_to"
            value={localFilters.date_to}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
          />

          <select
            name="status"
            value={localFilters.status}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                name="is_intracity"
                checked={!!localFilters.is_intracity}
                onChange={handleChange}
              />
              Intracity
            </label>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                name="is_intercity"
                checked={!!localFilters.is_intercity}
                onChange={handleChange}
              />
              Intercity
            </label>
          </div>
        </div>
      </div>

      {/* Table: keep horizontal scroll inside this container */}
      <div className="bg-white shadow rounded overflow-x-auto w-full max-w-full" style={{ maxWidth: '100vw' }}>
        <table className="min-w-max divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              {[
                'ID',
                'Item No',
                'GR/LR No',
                'GR/LR Date',
                'Name',
                'Email',
                'Mobile',
                'Address',
                'Cargo Value',
                'Gross',
                'GST',
                'Total',
                'Declaration ID',
                'Policy Type',
                'Source',
                'VB64',
                'Cancelled',
                'Reason',
                'Cover No',
                'Cover Link',
                'Cover Sent',
                'Status',
                'Created',
                'Updated',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {certificates.data.length === 0 && (
              <tr>
                <td colSpan="25" className="px-3 py-4 text-center text-gray-500">
                  No certificates found
                </td>
              </tr>
            )}

            {certificates.data.map((c) => {
              const viewHref = (() => {
                try {
                  return route('certificates.view', c.id);
                } catch {
                  return `/certificate-of-insurance/${c.id}/view`;
                }
              })();

              const downloadHref = (() => {
                try {
                  return route('certificates.download', c.id);
                } catch {
                  return `/certificate-of-insurance/${c.id}/download`;
                }
              })();

              return (
                <tr key={c.id}>
                  <td className="px-3 py-2">{c.id}</td>
                  <td className="px-3 py-2">{c.item_number}</td>
                  <td className="px-3 py-2">{c.gr_lr_number}</td>
                  <td className="px-3 py-2">{c.gr_lr_date}</td>
                  <td className="px-3 py-2">{c.insured_name}</td>
                  <td className="px-3 py-2">{c.insured_email}</td>
                  <td className="px-3 py-2">{c.insured_mobile}</td>
                  <td className="px-3 py-2">{c.insured_address}</td>
                  <td className="px-3 py-2">{c.cargo_value}</td>
                  <td className="px-3 py-2">{c.gross_premium}</td>
                  <td className="px-3 py-2">{c.gst_premium}</td>
                  <td className="px-3 py-2">{c.total_premium}</td>
                  <td className="px-3 py-2">{c.declaration_id}</td>
                  <td className="px-3 py-2">{c.master_policy_type}</td>
                  <td className="px-3 py-2">{c.policy_source}</td>
                  <td className="px-3 py-2">{c.vb_64}</td>
                  <td className="px-3 py-2">
                    {c.is_cancelled ? 'Yes' : 'No'}
                  </td>
                  <td className="px-3 py-2">
                    {c.cancellation_reason || '-'}
                  </td>
                  <td className="px-3 py-2">{c.cover_letter_no}</td>
                  <td className="px-3 py-2">
                    {c.cover_letter_link ? (
                      <a
                        href={c.cover_letter_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600"
                      >
                        Open
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {c.is_cover_letter_sent ? 'Yes' : 'No'}
                  </td>
                  <td className="px-3 py-2">{c.status}</td>
                  <td className="px-3 py-2">
                    {formatIndia(c.created_at)}
                  </td>
                  <td className="px-3 py-2">
                    {formatIndia(c.updated_at)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {c.cover_letter_no && (
                      <div className="flex gap-2">
                        <a
                          href={viewHref}
                          target="_blank"
                          className="text-blue-600"
                        >
                          Open
                        </a>
                        <a
                          href={downloadHref}
                          className="text-green-600"
                        >
                          Download
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-4">
          <Pagination links={certificates.links} />
        </div>
      </div>
    </div>
  );
}

/* Layout */
Show.layout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
