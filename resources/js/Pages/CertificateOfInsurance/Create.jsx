import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
  const { props } = usePage();
  const { policies } = props;
  const { data, setData, post, processing, errors } = useForm({
    master_policy_id: '',
    status: 'Active',
    item_number: '',
    gr_lr_number: '',
    gr_lr_date: '',
    insured_commodity: '',
    cargo_value: '',
    insured_name: '',
    cc_mail: '',
    insured_address: '',
    insured_mobile: '',
    insured_email: '',
    voyage_from: '',
    voyage_to: '',
    invoice_number: '',
    invoice_date: '',
    declaration_id: '',
    description: '',
    master_policy_type: '',
    policy_source: '',
    vb_64: '',
    is_intracity: false,
    is_intercity: false,
    is_cancelled: false,
    cancellation_reason: '',
    is_active: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('certificates.store'));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Create Certificate of Insurance</h1>
        <Link href={route('certificates.index')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Master Policy *</label>
            <select
              value={data.master_policy_id}
              onChange={(e) => setData('master_policy_id', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Policy</option>
              {policies.map((policy) => (
                <option key={policy.id} value={policy.id}>
                  {policy.policy_name} ({policy.number})
                </option>
              ))}
            </select>
            {errors.master_policy_id && <div className="text-red-600 text-sm mt-1">{errors.master_policy_id}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <input
              type="text"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Item Number</label>
            <input
              type="text"
              value={data.item_number}
              onChange={(e) => setData('item_number', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GR/LR Number</label>
            <input
              type="text"
              value={data.gr_lr_number}
              onChange={(e) => setData('gr_lr_number', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GR/LR Date</label>
            <input
              type="date"
              value={data.gr_lr_date}
              onChange={(e) => setData('gr_lr_date', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Insured Commodity</label>
            <input
              type="text"
              value={data.insured_commodity}
              onChange={(e) => setData('insured_commodity', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cargo Value</label>
            <input
              type="number"
              step="0.01"
              value={data.cargo_value}
              onChange={(e) => setData('cargo_value', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Insured Name *</label>
            <input
              type="text"
              value={data.insured_name}
              onChange={(e) => setData('insured_name', e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            {errors.insured_name && <div className="text-red-600 text-sm mt-1">{errors.insured_name}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CC Mail</label>
            <input
              type="email"
              value={data.cc_mail}
              onChange={(e) => setData('cc_mail', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Insured Mobile</label>
            <input
              type="text"
              value={data.insured_mobile}
              onChange={(e) => setData('insured_mobile', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Insured Email</label>
            <input
              type="email"
              value={data.insured_email}
              onChange={(e) => setData('insured_email', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Voyage From</label>
            <input
              type="text"
              value={data.voyage_from}
              onChange={(e) => setData('voyage_from', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Voyage To</label>
            <input
              type="text"
              value={data.voyage_to}
              onChange={(e) => setData('voyage_to', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Invoice Number</label>
            <input
              type="text"
              value={data.invoice_number}
              onChange={(e) => setData('invoice_number', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Invoice Date</label>
            <input
              type="date"
              value={data.invoice_date}
              onChange={(e) => setData('invoice_date', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Declaration ID</label>
            <input
              type="text"
              value={data.declaration_id}
              onChange={(e) => setData('declaration_id', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Insured Address</label>
            <textarea
              value={data.insured_address}
              onChange={(e) => setData('insured_address', e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows="2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.is_intracity}
              onChange={(e) => setData('is_intracity', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm">Intracity</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.is_intercity}
              onChange={(e) => setData('is_intercity', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm">Intercity</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.is_cancelled}
              onChange={(e) => setData('is_cancelled', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm">Is Cancelled</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.is_active}
              onChange={(e) => setData('is_active', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm">Is Active</label>
          </div>
        </div>

        {data.is_cancelled && (
          <div>
            <label className="block text-sm font-medium mb-1">Cancellation Reason</label>
            <textarea
              value={data.cancellation_reason}
              onChange={(e) => setData('cancellation_reason', e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Link href={route('certificates.index')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </Link>
          <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
            {processing ? 'Creating...' : 'Create Certificate'}
          </button>
        </div>
      </form>
    </div>
  );
}

Create.layout = page => <DashboardLayout>{page}</DashboardLayout>;
