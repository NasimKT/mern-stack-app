import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [editVehicleId, setEditVehicleId] = useState(null);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles');
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddVehicle = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 200) {
        alert('Vehicle added successfully');
        fetchVehicles();
        setFormData({
          name: '',
          description: '',
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
      const response = await fetch(`http://localhost:5000/api/vehicles/edit/${editVehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 200) {
        alert('Vehicle edited successfully');
        fetchVehicles();
        setFormData({
          name: '',
          description: '',
        });
        setEditVehicleId(null); // Clear the edit mode
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
    setEditVehicleId(_id); // Use _id as the identifier
    const vehicleToEdit = vehicles.find((vehicle) => vehicle._id === _id);
    if (vehicleToEdit) {
      setFormData({
        name: vehicleToEdit.name,
        description: vehicleToEdit.description,
      });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditVehicleId(null);
  };

  const handleDeleteVehicle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/delete-vehicle/${id}`, {
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
        <ul>
          {vehicles.map((vehicle) => (
            <li key={vehicle._id}>
              {vehicle.name} - {vehicle.description}
              <button onClick={() => handleStartEdit(vehicle._id)}>Edit</button>
              <button onClick={() => handleDeleteVehicle(vehicle._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
