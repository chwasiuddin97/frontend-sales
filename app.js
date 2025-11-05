import React, { useState, useEffect } from 'react';
import './index.css';
import {
  Upload,
  Play,
  Video,
  Users,
  Car,
  Send,
  Eye,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  Loader,
  X,
} from 'lucide-react';

const GlowCard = ({ children, className = '', variant = 'purple' }) => {
  const gradients = {
    purple: 'from-pink-500 via-purple-500 to-indigo-500',
    blue: 'from-blue-500 via-indigo-500 to-purple-500',
    green: 'from-emerald-400 via-teal-500 to-cyan-500',
  };

  const gradientClass = gradients[variant] || gradients.purple;

  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradientClass} rounded-3xl opacity-0 group-hover:opacity-70 blur-xl transition duration-500`}
      ></div>
      <div
        className={`relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl hover:shadow-[0_35px_60px_-15px_rgba(72,37,117,0.45)] transition-all duration-300 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

// =======================
// MAIN APP COMPONENT
// =======================
const VideoAISystem = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [salespeople, setSalespeople] = useState([]);
  const [cars, setCars] = useState([]);
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

  const handleLogin = async (email, password) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Failed to log in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} loading={loading} />;
    }

    if (!user) return <LoginPage onLogin={handleLogin} loading={loading} />;

    const navItems = [
      { key: 'dashboard', label: 'Dashboard' },
      ...(user.role === 'admin'
        ? [
            { key: 'salespeople', label: 'Salespeople' },
            { key: 'cars', label: 'Cars' },
          ]
        : []),
      { key: 'create-video', label: 'Create Video' },
    ];

    const navButtonClasses = (page) =>
      `px-4 py-2 rounded-xl transition-all duration-300 ${
        currentPage === page
          ? 'bg-white/20 backdrop-blur-lg text-white shadow-lg'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl shadow-lg">
                    <Video className="text-white" size={28} />
                  </div>
                  <span className="text-xl font-bold gradient-text">Video AI System</span>
                </div>

                <div className="flex gap-2 items-center">
                  {navItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setCurrentPage(item.key)}
                      className={`${navButtonClasses(item.key)} ripple`}
                    >
                      {item.label}
                    </button>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ripple"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
            {currentPage === 'dashboard' && (
              <DashboardPage user={user} interactions={interactions} />
            )}
            {currentPage === 'salespeople' && (
              <SalesPeoplePage
                salespeople={salespeople}
                setSalespeople={setSalespeople}
              />
            )}
            {currentPage === 'cars' && (
              <CarsPage cars={cars} setCars={setCars} />
            )}
            {currentPage === 'create-video' && (
              <CreateVideoPage
                salespeople={salespeople}
                cars={cars}
                interactions={interactions}
                setInteractions={setInteractions}
              />
            )}
          </main>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlowCard className="p-10 space-y-8" variant="blue">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Video className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold gradient-text">Video AI System</h1>
            <p className="text-gray-600">
              Automated personalized video generation for your dealership
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dealership.com"
                className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-gray-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-gray-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center ripple disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            <p>Demo credentials: any email/password</p>
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

// =======================
// DASHBOARD PAGE
// =======================
const DashboardPage = ({ user, interactions }) => {
  const StatCard = ({ icon: Icon, label, value, color }) => {
    const iconClasses = {
      blue: 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600',
      green: 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600',
      purple: 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600',
      orange: 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600',
    };

    const progressGradients = {
      blue: 'from-blue-500 to-indigo-500',
      green: 'from-emerald-500 to-teal-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-amber-500 to-orange-500',
    };

    const progressWidths = {
      'Videos Created': '82%',
      'Videos Sent': '74%',
      'Videos Viewed': '68%',
      'Conversion Rate': '45%',
    };

    return (
      <div className="bg-gradient-to-br from-white/95 to-white/70 rounded-2xl shadow-xl p-6 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-white/40">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl shadow-inner ${iconClasses[color]}`}>
            <Icon size={32} />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
            <p className="text-4xl font-bold gradient-text">{value}</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-200/70 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${progressGradients[color]} rounded-full animate-pulse`}
            style={{ width: progressWidths[label] || '70%' }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Welcome, {user.name}!</h1>
        <p className="text-white/70 max-w-2xl">
          Track performance, manage inventory, and deliver cinematic customer experiences with AI-generated videos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={Video} label="Videos Created" value="12" color="blue" />
        <StatCard icon={Send} label="Videos Sent" value="10" color="green" />
        <StatCard icon={Eye} label="Videos Viewed" value="8" color="purple" />
        <StatCard icon={CheckCircle} label="Conversion Rate" value="25%" color="orange" />
      </div>

      <GlowCard className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            Recent Activity
          </h2>
        </div>

        {interactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-100 rounded-3xl flex items-center justify-center">
              <Video size={40} className="text-slate-400" />
            </div>
            <p className="text-slate-600">
              No videos created yet. Start by creating your first personalized video!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-4 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/80"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 opacity-0 transition-opacity duration-500 hover:opacity-100"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Video size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {interaction.customerName}
                    </p>
                    <p className="text-sm text-slate-500">{interaction.carName}</p>
                  </div>
                </div>
                <div className="relative text-right">
                  <p className="text-sm font-medium text-slate-600">
                    {interaction.status}
                  </p>
                  <p className="text-xs text-slate-400">{interaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlowCard>
    </div>
  );
};
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
      phone: '',
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
        const uploadData = new FormData();
        uploadData.append('name', formData.name);
        uploadData.append('email', formData.email);
        uploadData.append('phone', formData.phone);
        uploadData.append('greetingVideo', greetingVideo);
        uploadData.append('voiceSample', voiceSample);

        const response = await fetch('http://localhost:3001/api/salespeople', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: uploadData,
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
        <div className="relative bg-white/95 rounded-3xl p-8 shadow-2xl max-w-lg w-full animate-slideUp">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-semibold gradient-text mb-6">Add Salesperson</h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Alex Johnson"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="alex@dealership.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Greeting Video * (MP4, 15-30 seconds)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="sales-greeting-upload"
                  accept="video/mp4,video/quicktime"
                  onChange={(e) => setGreetingVideo(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="sales-greeting-upload"
                  className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/60 transition-all duration-300 group"
                >
                  <Upload
                    className="mx-auto mb-3 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300"
                    size={48}
                  />
                  <p className="text-slate-600 group-hover:text-blue-600 font-medium">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm text-slate-400 mt-2">MP4, MOV (max 100MB)</p>
                </label>
                {greetingVideo && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-slideUp">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-700 font-medium truncate">{greetingVideo.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Voice Sample * (MP3, 1-2 minutes)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="sales-voice-upload"
                  accept="audio/mpeg,audio/mp3"
                  onChange={(e) => setVoiceSample(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="sales-voice-upload"
                  className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/60 transition-all duration-300 group"
                >
                  <Upload
                    className="mx-auto mb-3 text-slate-400 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300"
                    size={48}
                  />
                  <p className="text-slate-600 group-hover:text-purple-600 font-medium">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm text-slate-400 mt-2">MP3 (max 50MB)</p>
                </label>
                {voiceSample && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-slideUp">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-700 font-medium truncate">{voiceSample.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 text-sm text-blue-900 space-y-1">
              <p className="font-semibold flex items-center gap-2">
                📝 What to upload
              </p>
              <p>
                <strong>Greeting video:</strong> 15-30 sec video of salesperson saying a warm, generic welcome.
              </p>
              <p>
                <strong>Voice sample:</strong> 1-2 min audio of natural conversation to train AI voice.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={uploading}
                className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium transition-all duration-200 ripple disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 btn-primary justify-center ripple disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold gradient-text">Manage Salespeople</h1>
          <p className="text-white/70">
            Upload greeting videos and voice samples to personalize AI outreach.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary group ripple"
        >
          <Plus
            size={20}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          Add Salesperson
        </button>
      </div>

      {salespeople.length === 0 ? (
        <GlowCard className="p-12 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-purple-500">
            <Users size={40} />
          </div>
          <p className="text-slate-600">
            No salespeople added yet. Start by inviting your first team member.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary mx-auto ripple"
          >
            <Plus size={18} />
            Add Your First Salesperson
          </button>
        </GlowCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {salespeople.map((person, idx) => (
            <GlowCard key={idx} className="p-6 space-y-6">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <Users className="text-slate-500 transition-transform duration-500 group-hover:scale-110" size={56} />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" size={40} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800">{person.name}</h3>
                <p className="text-sm text-slate-500">{person.email}</p>
                {person.phone && <p className="text-sm text-slate-500">{person.phone}</p>}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white/80 hover:bg-white text-slate-600 font-medium transition-all duration-200 ripple inline-flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white flex items-center justify-center hover:shadow-xl transition-all duration-200 ripple">
                  <Trash2 size={18} />
                </button>
              </div>
            </GlowCard>
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
      features: '',
    });
    const [carVideo, setCarVideo] = useState(null);

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
            Authorization: `Bearer ${token}`,
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
        <div className="relative bg-white/95 rounded-3xl p-8 shadow-2xl max-w-lg w-full animate-slideUp">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-semibold gradient-text mb-6">Add Car</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Car Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ford Mustang GT"
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="55000"
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Features (comma-separated)
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="V8 Engine, 450HP, Sporty Design"
                rows={3}
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Car Video * (MP4, 10–30 seconds)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="car-video-upload"
                  accept="video/mp4,video/quicktime"
                  onChange={(e) => setCarVideo(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="car-video-upload"
                  className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50/60 transition-all duration-300 group"
                >
                  <Upload
                    className="mx-auto mb-3 text-slate-400 group-hover:text-pink-600 group-hover:scale-110 transition-all duration-300"
                    size={48}
                  />
                  <p className="text-slate-600 group-hover:text-pink-600 font-medium">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm text-slate-400 mt-2">MP4, MOV (max 150MB)</p>
                </label>
                {carVideo && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-slideUp">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-700 font-medium truncate">{carVideo.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium transition-all duration-200 ripple"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-primary justify-center ripple">
                Add Car
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold gradient-text">Manage Cars</h1>
          <p className="text-white/70">
            Keep your inventory vibrant with cinematic showcases and feature highlights.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary group ripple"
        >
          <Plus
            size={20}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          Add Car
        </button>
      </div>

      {cars.length === 0 ? (
        <GlowCard className="p-12 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-500">
            <Car size={40} />
          </div>
          <p className="text-slate-600">
            No cars added yet. Upload your first vehicle to start creating videos.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary mx-auto ripple"
          >
            <Plus size={18} />
            Add Your First Car
          </button>
        </GlowCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car, idx) => (
            <GlowCard key={idx} className="p-6 space-y-6">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <Car className="text-slate-500 transition-transform duration-500 group-hover:scale-110" size={56} />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" size={40} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-slate-800">{car.name}</h3>
                <p className="text-3xl font-bold gradient-text">
                  ${car.price?.toLocaleString()}
                </p>
              </div>

              {car.features && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-600">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(car.features)
                      ? car.features
                      : typeof car.features === 'string'
                      ? car.features.split(',')
                      : []
                    )
                      .slice(0, 4)
                      .map((feature, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium"
                        >
                          {feature.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white/80 hover:bg-white text-slate-600 font-medium transition-all duration-200 ripple inline-flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white flex items-center justify-center hover:shadow-xl transition-all duration-200 ripple">
                  <Trash2 size={18} />
                </button>
              </div>
            </GlowCard>
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
    notes: '',
  });
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateScript = async () => {
    setGenerating(true);
    setShowPreview(false);

    try {
      const token = localStorage.getItem('token');
      const selectedCar = cars.find((c) => c.id === formData.carId);
      const selectedSalesperson = salespeople.find((s) => s.id === formData.salespersonId);

      const response = await fetch('http://localhost:3001/api/videos/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          salespersonName: selectedSalesperson?.name || 'Your Salesperson',
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create video');
      }

      alert('✅ Video generated successfully!');
      console.log('🎥 Video response:', data);

      const newInteraction = {
        customerName: formData.customerName,
        carName: cars.find((c) => c.id === formData.carId)?.name,
        status: 'Video Sent',
        date: new Date().toLocaleDateString(),
      };
      setInteractions([...interactions, newInteraction]);

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

  const isGenerateDisabled =
    !formData.customerName || !formData.carId || !formData.salespersonId || generating;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Create Personalized Video</h1>
        <p className="text-white/70">
          Capture the excitement of every test drive with AI scripts and cinematic video delivery.
        </p>
      </div>

      <GlowCard className="p-8 space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800">Customer Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Wasi Ahmed"
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Email
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="wasi@email.com"
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600">
              Phone
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800">Interaction Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Salesperson
              </label>
              <select
                value={formData.salespersonId}
                onChange={(e) => handleInputChange('salespersonId', e.target.value)}
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="">Select Salesperson</option>
                {salespeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Car
              </label>
              <select
                value={formData.carId}
                onChange={(e) => handleInputChange('carId', e.target.value)}
                className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="">Select Car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600">
              Features Discussed
            </label>
            <input
              type="text"
              value={formData.featuresDiscussed.join(', ')}
              onChange={(e) =>
                handleInputChange(
                  'featuresDiscussed',
                  e.target.value.split(',').map((f) => f.trim())
                )
              }
              placeholder="powerful engine, sporty design, red color"
              className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Customer loved the acceleration test, interested in financing options..."
              rows={4}
              className="w-full rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGenerateScript}
            disabled={isGenerateDisabled}
            className="btn-primary flex-1 justify-center ripple disabled:opacity-60 disabled:cursor-not-allowed"
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
      </GlowCard>

      {showPreview && generatedScript && (
        <GlowCard className="p-8 space-y-5" variant="green">
          <h2 className="text-2xl font-semibold text-slate-800">
            Generated Script Preview
          </h2>

          <div className="bg-slate-900/90 text-slate-100 rounded-2xl p-6 border border-slate-700/60 shadow-inner">
            <p className="whitespace-pre-line leading-relaxed">{generatedScript}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 px-6 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium transition-all duration-200 ripple"
            >
              Edit Script
            </button>
            <button
              onClick={handleCreateVideo}
              className="btn-primary flex-1 justify-center ripple"
            >
              <Video size={20} />
              Create &amp; Send Video
            </button>
          </div>
        </GlowCard>
      )}
    </div>
  );
};

export default VideoAISystem;
