import React, { useState, useEffect } from 'react';
import { Upload, Play, Video, Users, Car, Send, Eye, Trash2, Edit, Plus, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// =======================
// MAIN APP COMPONENT
// =======================
const VideoAISystem = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulated data (replace with real API calls)
  const [salespeople, setSalespeople] = useState([]);
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [interactions, setInteractions] = useState([]);

  // 🔄 Fetch real data after login
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token || !user) return;

  const fetchData = async () => {
    try {
      const [salesRes, carsRes] = await Promise.all([
        fetch('http://localhost:3001/api/salespeople', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:3001/api/cars', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const salesData = await salesRes.json();
      const carsData = await carsRes.json();

      if (salesRes.ok) {
        setSalespeople(salesData);
        console.log('✅ Salespeople fetched:', salesData);
      } else {
        console.error('❌ Salespeople fetch error:', salesData);
      }

      if (carsRes.ok) {
        setCars(carsData);
        console.log('✅ Cars fetched:', carsData);
      } else {
        console.error('❌ Cars fetch error:', carsData);
      }
    } catch (err) {
      console.error('❌ Failed to fetch dealership data:', err);
    }
  };

  fetchData();
}, [user]);

// 🧩 Keep user logged in if token + user saved
useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    setUser(JSON.parse(savedUser));
    setCurrentPage('dashboard');
  }
}, []);


  // Authentication
  /*const handleLogin = async (email, password) => {
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setUser({
        id: '1',
        email: email,
        role: 'admin',
        name: 'Demo User'
      });
      setCurrentPage('dashboard');
      setLoading(false);
    }, 1000);
  };*/

  // Authentication
const handleLogin = async (email, password) => {
  setLoading(true);

  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Save JWT token locally for authenticated requests
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setCurrentPage("dashboard");
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Failed to log in. Please check credentials.");
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  // Render different pages based on state
  const renderPage = () => {
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} loading={loading} />;
    }

    if (!user) return <LoginPage onLogin={handleLogin} loading={loading} />;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-gray-900">
        <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Video className="text-blue-600" size={32} />
                <span className="text-xl font-bold">Video AI System</span>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => setCurrentPage('salespeople')}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === 'salespeople' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      Salespeople
                    </button>
                    <button
                      onClick={() => setCurrentPage('cars')}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === 'cars' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      Cars
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setCurrentPage('create-video')}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === 'create-video' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Create Video
                </button>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {currentPage === 'dashboard' && <DashboardPage user={user} interactions={interactions} />}
          {currentPage === 'salespeople' && <SalesPeoplePage salespeople={salespeople} setSalespeople={setSalespeople} />}
          {currentPage === 'cars' && <CarsPage cars={cars} setCars={setCars} />}
          {currentPage === 'create-video' && (
            <CreateVideoPage 
              salespeople={salespeople} 
              cars={cars} 
              customers={customers}
              setCustomers={setCustomers}
              interactions={interactions}
              setInteractions={setInteractions}
            />
          )}
        </div>
      </div>
    );
  };

  return renderPage();
};




// =======================
// LOGIN PAGE
// =======================
const LoginPage = ({ onLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Video className="mx-auto text-blue-600 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Video AI System</h1>
          <p className="text-gray-600">Automated personalized video generation</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dealership.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo credentials: any email/password</p>
        </div>
      </div>
    </div>
  );
};

// =======================
// DASHBOARD PAGE
// =======================
const DashboardPage = ({ user, interactions }) => {
  const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={32} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">{label}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Video} label="Videos Created" value="12" color="blue" />
        <StatCard icon={Send} label="Videos Sent" value="10" color="green" />
        <StatCard icon={Eye} label="Videos Viewed" value="8" color="purple" />
        <StatCard icon={CheckCircle} label="Conversion Rate" value="25%" color="orange" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        
        {interactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Video size={64} className="mx-auto mb-4 opacity-50" />
            <p>No videos created yet. Start by creating your first video!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {interactions.map((interaction, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Video className="text-blue-600" size={24} />
                  <div>
                    <p className="font-semibold">{interaction.customerName}</p>
                    <p className="text-sm text-gray-600">{interaction.carName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{interaction.status}</p>
                  <p className="text-xs text-gray-500">{interaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =======================
// SALESPEOPLE PAGE
// =======================
const SalesPeoplePage = ({ salespeople, setSalespeople }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const AddSalespersonModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: ''
    });
    const [greetingVideo, setGreetingVideo] = useState(null);
    const [voiceSample, setVoiceSample] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!greetingVideo || !voiceSample) {
        alert('Please upload both greeting video and voice sample!');
        return;
      }

      setUploading(true);

      try {
        // Create FormData for file upload
        const uploadData = new FormData();
        uploadData.append('name', formData.name);
        uploadData.append('email', formData.email);
        uploadData.append('phone', formData.phone);
        uploadData.append('greetingVideo', greetingVideo);
        uploadData.append('voiceSample', voiceSample);

        // TODO: Replace with your backend URL
        const response = await fetch('http://localhost:3001/api/salespeople', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: uploadData
        });

        const data = await response.json();

        if (response.ok) {
          onAdd(data);
          alert('Salesperson added successfully!');
        } else {
          alert('Upload failed: ' + data.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload. Make sure backend is running!');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full my-8">
          <h2 className="text-2xl font-bold mb-6">Add Salesperson</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Alex Johnson"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="alex@dealership.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Greeting Video * (MP4, 15-30 seconds)
              </label>
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={(e) => setGreetingVideo(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {greetingVideo && (
                <p className="text-sm text-green-600 mt-2">✓ {greetingVideo.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Sample * (MP3, 1-2 minutes)
              </label>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3"
                onChange={(e) => setVoiceSample(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {voiceSample && (
                <p className="text-sm text-green-600 mt-2">✓ {voiceSample.name}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">📝 What to upload:</p>
              <p><strong>Greeting video:</strong> 15-30 sec video of salesperson saying generic greeting</p>
              <p><strong>Voice sample:</strong> 1-2 min audio of salesperson talking naturally</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Uploading...
                  </>
                ) : (
                  'Add Salesperson'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Salespeople</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Add Salesperson
        </button>
      </div>

      {salespeople.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Users size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">No salespeople added yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Your First Salesperson
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salespeople.map((person, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="text-blue-600" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{person.name}</h3>
                  <p className="text-sm text-gray-600">{person.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  <Edit size={16} className="inline mr-2" />
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddSalespersonModal 
          onClose={() => setShowAddModal(false)}
          onAdd={(newPerson) => {
            setSalespeople([...salespeople, newPerson]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// =======================
// CARS PAGE
// =======================
const CarsPage = ({ cars, setCars }) => {
  const [showAddModal, setShowAddModal] = useState(false);


  const AddCarModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      price: '',
      features: ''
    });

    const [carVideo, setCarVideo] = useState(null);


    /*const handleSubmit = (e) => {
      e.preventDefault();
      onAdd({
        id: Date.now().toString(),
        ...formData,
        price: parseInt(formData.price)
      });
    };*/


    /*const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        price: parseInt(formData.price),
        features: formData.features,
      }),
    });

    

    const data = await response.json();
    if (response.ok) {
      onAdd(data); // this will now have a real UUID
      alert('Car added successfully!');
    } else {
      alert(`Error adding car: ${data.error}`);
    }
  } catch (err) {
    console.error('Car upload failed:', err);
    alert('Failed to add car. Check console for details.');
  }
};*/

/*const handleSubmit = async (e) => {
  e.preventDefault();

  if (!carVideo) {
    alert('Please upload a car video!');
    return;
  }

  try {
    const token = localStorage.getItem('token');

    // Prepare FormData
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('price', formData.price);
    fd.append('features', formData.features);
    fd.append('carVideo', carVideo); // 👈 matches backend field

    const response = await fetch('http://localhost:3001/api/cars', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd, // 👈 FormData, not JSON
    });

    const data = await response.json();

    if (response.ok) {
      onAdd(data);
      alert('✅ Car added successfully with video!');
      setFormData({ name: '', price: '', features: '' });
      setCarVideo(null);
      onClose();
    } else {
      alert(`❌ Error adding car: ${data.error}`);
    }
  } catch (err) {
    console.error('Car upload failed:', err);
    alert('Failed to add car. Check console for details.');
  }
};*/
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();

    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('features', formData.features);
    if (carVideo) formDataToSend.append('video', carVideo);

    const response = await fetch('http://localhost:3001/api/cars', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const data = await response.json();
    if (response.ok) {
      onAdd(data);
      alert('✅ Car added successfully!');
      onClose();
    } else {
      alert(`❌ Error adding car: ${data.error}`);
    }
  } catch (err) {
    console.error('Car upload failed:', err);
    alert('Failed to add car. Check console for details.');
  }
};




    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">Add Car</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ford Mustang GT"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="55000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="V8 Engine, 450HP, Sporty Design"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Car Video * (MP4, 10–30 seconds)
  </label>
  <input
    type="file"
    accept="video/mp4,video/quicktime"
    onChange={(e) => setCarVideo(e.target.files[0])}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  />
  {carVideo && (
    <p className="text-sm text-green-600 mt-2">✓ {carVideo.name}</p>
  )}
</div>


            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Cars</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Add Car
        </button>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Car size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">No cars added yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Your First Car
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <Car className="text-gray-400" size={48} />
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{car.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-3">${car.price?.toLocaleString()}</p>
                
                {car.features && (
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
    <div className="flex flex-wrap gap-2">
      {(
        Array.isArray(car.features)
          ? car.features
          : typeof car.features === 'string'
          ? car.features.split(',')
          : []
      )
        .slice(0, 3)
        .map((feature, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
          >
            {feature.trim()}
          </span>
        ))}
    </div>
  </div>
)}


                
                
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    <Edit size={16} className="inline mr-2" />
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCarModal 
          onClose={() => setShowAddModal(false)}
          onAdd={(newCar) => {
            setCars([...cars, newCar]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// =======================
// CREATE VIDEO PAGE
// =======================
const CreateVideoPage = ({ salespeople, cars, interactions, setInteractions }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    salespersonId: '',
    carId: '',
    featuresDiscussed: [],
    notes: ''
  });
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /*const handleGenerateScript = async () => {
    setGenerating(true);
    
    setTimeout(() => {
      const selectedCar = cars.find(c => c.id === formData.carId);
      const selectedSalesperson = salespeople.find(s => s.id === formData.salespersonId);
      
      const script = `Hey ${formData.customerName}! It's ${selectedSalesperson?.name || 'AJ'} from Premium Auto Sales. 

It was great showing you the ${selectedCar?.name || 'Mustang GT'} today. I could tell you really connected with ${formData.featuresDiscussed.join(', ')}. 

${formData.notes}

I wanted to send you this quick video so you could see it again and imagine yourself behind the wheel. We have some great financing options available, and I'd love to help you make this beauty yours.

Give me a call whenever you're ready to talk numbers, or if you just want to take it for another spin. Looking forward to hearing from you soon!`;
      
      setGeneratedScript(script);
      setGenerating(false);
      setShowPreview(true);
    }, 2000);
  };*/











  

  const handleGenerateScript = async () => {
  setGenerating(true);
  setShowPreview(false);

  try {
    const token = localStorage.getItem('token'); // assuming you store JWT after login
    const selectedCar = cars.find(c => c.id === formData.carId);
    const selectedSalesperson = salespeople.find(s => s.id === formData.salespersonId);

    const response = await fetch('http://localhost:3001/api/videos/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        customerName: formData.customerName,
        salespersonName: selectedSalesperson?.name || 'AJ',
        carName: selectedCar?.name || 'Car',
        featuresDiscussed: formData.featuresDiscussed || [],
        customerNotes: formData.notes || '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate script');
    }

    setGeneratedScript(data.script);
    setShowPreview(true);
  } catch (error) {
    console.error('Script generation error:', error);
    alert('Error generating script: ' + error.message);
  } finally {
    setGenerating(false);
  }
};


  /*const handleCreateVideo = async () => {
    const newInteraction = {
      customerName: formData.customerName,
      carName: cars.find(c => c.id === formData.carId)?.name,
      status: 'Video Sent',
      date: new Date().toLocaleDateString()
    };
    
    setInteractions([...interactions, newInteraction]);
    alert('Video created and sent successfully!');
    
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      salespersonId: '',
      carId: '',
      featuresDiscussed: [],
      notes: ''
    });
    setGeneratedScript('');
    setShowPreview(false);
  };*/
  const handleCreateVideo = async () => {
  try {
    setGenerating(true);

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      salespersonId: formData.salespersonId,
      carId: formData.carId,
      script: generatedScript,
    };

    const response = await fetch('http://localhost:3001/api/videos/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create video');
    }

    alert('✅ Video generated successfully!');
    console.log('🎥 Video response:', data);

    // Add to dashboard
    const newInteraction = {
      customerName: formData.customerName,
      carName: cars.find(c => c.id === formData.carId)?.name,
      status: 'Video Sent',
      date: new Date().toLocaleDateString(),
    };
    setInteractions([...interactions, newInteraction]);

    // Reset form
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      salespersonId: '',
      carId: '',
      featuresDiscussed: [],
      notes: '',
    });
    setGeneratedScript('');
    setShowPreview(false);
  } catch (err) {
    console.error('❌ Video creation failed:', err);
    alert(`Failed to create video: ${err.message}`);
  } finally {
    setGenerating(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create Personalized Video</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Customer Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Wasi Ahmed"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="wasi@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Interaction Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salesperson</label>
              <select
                value={formData.salespersonId}
                onChange={(e) => handleInputChange('salespersonId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Salesperson</option>
                {salespeople.map((person) => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car</label>
              <select
                value={formData.carId}
                onChange={(e) => handleInputChange('carId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>{car.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features Discussed</label>
            <input
              type="text"
              value={formData.featuresDiscussed.join(', ')}
              onChange={(e) => handleInputChange('featuresDiscussed', e.target.value.split(',').map(f => f.trim()))}
              placeholder="powerful engine, sporty design, red color"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Customer loved the acceleration test, interested in financing options..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGenerateScript}
            disabled={!formData.customerName || !formData.carId || !formData.salespersonId || generating}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader className="animate-spin" size={20} />
                Generating Script...
              </>
            ) : (
              <>
                <Edit size={20} />
                Generate Script
              </>
            )}
          </button>
        </div>
      </div>

      {showPreview && generatedScript && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Generated Script Preview</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="whitespace-pre-line text-gray-800">{generatedScript}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Edit Script
            </button>
            <button
              onClick={handleCreateVideo}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              <Video size={20} />
              Create & Send Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAISystem;
