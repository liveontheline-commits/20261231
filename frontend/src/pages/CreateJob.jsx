import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin_city: '',
    origin_country: 'Turkey',
    destination_city: '',
    destination_country: 'Germany',
    pickup_date: '',
    weight_kg: '',
    goods_type: '',
    vehicle_type_required: '',
    description: '',
    estimated_price: '',
    payment_term: '30 Days Net' // Default
  });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // Retrieve address book to populate dropdown
      const res = await api.get('/features/address-book');
      setAddresses(res.data);
    } catch (err) {
      console.log('No addresses or fail');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (e, type) => {
    const addrId = e.target.value;
    if (!addrId) return;
    const addr = addresses.find(a => a.id == addrId);
    if (addr) {
      if (type === 'origin') {
        setFormData({ ...formData, origin_city: addr.city, origin_country: addr.country });
      } else {
        setFormData({ ...formData, destination_city: addr.city, destination_country: addr.country });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/loads', formData);
      alert('Load posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post load');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Post a New Load</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="col-span-2">
            <h3 className="font-semibold text-gray-600 mb-2 border-b pb-1">Route</h3>
          </div>

          {/* Address Book Selection - Origin */}
          {addresses.length > 0 && (
            <div className="col-span-2 md:col-span-1">
              <select onChange={(e) => handleAddressSelect(e, 'origin')} className="w-full border p-2 rounded bg-yellow-50 mb-2 text-sm">
                <option value="">Select from Address Book...</option>
                {addresses.map(a => <option key={a.id} value={a.id}>{a.title} ({a.city})</option>)}
              </select>
            </div>
          )}
          <div className="hidden md:block md:col-span-1"></div> {/* Spacer */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Origin City</label>
            <input name="origin_city" value={formData.origin_city} required onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="e.g. Istanbul" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Origin Country</label>
            <input name="origin_country" value={formData.origin_country} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </div>

          {/* Address Book Selection - Destination */}
          {addresses.length > 0 && (
            <div className="col-span-2 md:col-span-1 border-t pt-2 mt-2">
              <select onChange={(e) => handleAddressSelect(e, 'destination')} className="w-full border p-2 rounded bg-yellow-50 mb-2 text-sm">
                <option value="">Select from Address Book...</option>
                {addresses.map(a => <option key={a.id} value={a.id}>{a.title} ({a.city})</option>)}
              </select>
            </div>
          )}
          <div className="hidden md:block md:col-span-1 border-t pt-2 mt-2"></div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Destination City</label>
            <input name="destination_city" value={formData.destination_city} required onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="e.g. Hamburg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination Country</label>
            <input name="destination_country" value={formData.destination_country} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
            <input type="date" name="pickup_date" required onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold text-gray-600 mb-2 border-b pb-1 mt-4">Cargo & Payment</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input type="number" name="weight_kg" required onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goods Type</label>
            <input name="goods_type" onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="e.g. Textiles" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
            <select name="vehicle_type_required" onChange={handleChange} className="w-full border p-2 rounded mt-1">
              <option value="">Any</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Trailer">Trailer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Term</label>
            <input name="payment_term" value={formData.payment_term} onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="e.g. 45 Days" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" onChange={handleChange} className="w-full border p-2 rounded mt-1" rows="3"></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Estimated Price (EUR)</label>
            <input type="number" name="estimated_price" onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="e.g. 1500" />
          </div>

          <div className="col-span-2 mt-4">
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 transition">
              {loading ? 'Publishing...' : 'Publish Load'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateJob;