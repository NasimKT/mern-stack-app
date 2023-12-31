import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    units: 0,
  });
  const [editVehicleId, setEditVehicleId] = useState(null);

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

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddVehicle = async () => {
    try {
      const formDataForApi = new FormData();
      formDataForApi.append('name', formData.name);
      formDataForApi.append('description', formData.description);
      formDataForApi.append('image', formData.image);
      formDataForApi.append('units', formData.units);

      const response = await fetch(`${apiUrl}/add`, {
        method: 'POST',
        body: formDataForApi,
      });

      if (response.status === 200) {
        alert('Vehicle added successfully');
        fetchVehicles();
        setFormData({
          name: '',
          description: '',
          image: null,
          units: 0,
        });
      } else {
        console.error('Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditVehicle = async () => {
    if (!editVehicleId) {
      alert('Please select a vehicle to edit.');
      return;
    }

    try {
      const formDataForApi = new FormData();
      formDataForApi.append('name', formData.name);
      formDataForApi.append('description', formData.description);
      formDataForApi.append('image', formData.image);
      formDataForApi.append('units', formData.units);

      const response = await fetch(`${apiUrl}/edit/${editVehicleId}`, {
        method: 'PUT',
        body: formDataForApi,
      });

      if (response.status === 200) {
        alert('Vehicle edited successfully');
        fetchVehicles();
        setFormData({
          name: '',
          description: '',
          image: null,
          units: 0,
        });
        setEditVehicleId(null);
      } else if (response.status === 404) {
        console.error('Vehicle not found. Server returned 404.');
      } else {
        console.error('Failed to edit vehicle. Server returned:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStartEdit = (_id) => {
    setEditVehicleId(_id);
    const vehicleToEdit = vehicles.find((vehicle) => vehicle._id === _id);
    if (vehicleToEdit) {
      setFormData({
        name: vehicleToEdit.name,
        description: vehicleToEdit.description,
        units: vehicleToEdit.units,
      });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
      units: 0,
    });
    setEditVehicleId(null);
  };

  const handleDeleteVehicle = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/delete-vehicle/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        alert('Vehicle deleted successfully');
        fetchVehicles();
      } else if (response.status === 404) {
        alert('Vehicle not found');
      } else {
        console.error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="vehicle-form">
        <h3>{editVehicleId ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
        <input
          type="text"
          name="name"
          placeholder="Vehicle Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Vehicle Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <input
          type="number"
          name="units"
          placeholder="Available Units"
          value={formData.units}
          onChange={handleChange}
        />
        {editVehicleId ? (
          <>
            <button onClick={handleEditVehicle}>Save Edit</button>
            <button onClick={handleCancelEdit}>Cancel Edit</button>
          </>
        ) : (
          <button onClick={handleAddVehicle}>Add Vehicle</button>
        )}
      </div>
      <div className="vehicle-list">
        <h3>Vehicle List</h3>
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
            {vehicles.map((vehicle) => (
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
                  <button onClick={() => handleStartEdit(vehicle._id)}>Edit</button>
                  <button onClick={() => handleDeleteVehicle(vehicle._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;