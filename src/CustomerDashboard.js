import React, { useState, useEffect } from 'react';
import './CustomerDashboard.css';

function CustomerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const apiUrl = 'http://localhost:5000/api/vehicles';

  const fetchVehicles = async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const data = await response.json();
        setVehicles(data);
      } else {
        console.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleBuyVehicle = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/buy/${id}`, {
        method: 'POST',
      });
      if (response.status === 200) {
        alert('Vehicle purchased successfully');
        fetchVehicles();
      } else if (response.status === 404) {
        alert('Vehicle not found');
      } else {
        console.error('Failed to purchase vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchRegex = new RegExp(searchQuery, 'i');
    return (
      searchRegex.test(vehicle.name) ||
      searchRegex.test(vehicle.description) ||
      searchRegex.test(vehicle.units.toString()) ||
      (vehicle.image && searchRegex.test(vehicle.image))
    );
  });

return (
  <div className="customer-dashboard">
    <h2>Customer Dashboard</h2>
    <div className="vehicle-list">
      <h3>Vehicle List</h3>
      {/* Add a search input */}
      <input
        type="text"
        placeholder="Search for a vehicle"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Available Units</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td>{vehicle.name}</td>
              <td>{vehicle.description}</td>
              <td>{vehicle.units}</td>
              <td>
                {vehicle.image && (
                  <img
                    src={`http://localhost:5000/api/vehicles/image/${vehicle.image}`}
                    alt={`${vehicle.name}`}
                    style={{ maxWidth: '100px' }}
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleBuyVehicle(vehicle._id)}>Buy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default CustomerDashboard;
