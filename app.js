import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Bell,
  Search,
  Sparkles,
  User,
  MoonStar,
} from 'lucide-react';

const GlowCard = ({ children, className = '', variant = 'purple' }) => {
  const gradients = {
    purple: 'from-fuchsia-500 via-violet-500 to-blue-500',
    blue: 'from-cyan-500 via-blue-500 to-indigo-500',
    green: 'from-emerald-400 via-teal-500 to-cyan-500',
    silver: 'from-slate-300 via-slate-100 to-white',
  };

  const gradientClass = gradients[variant] || gradients.purple;
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1200px)' });

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -12;
    const rotateY = ((x - rect.width / 2) / rect.width) * 12;

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)' });
  };

  return (
    <div className="group relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div
        className={`absolute -inset-[3px] bg-gradient-to-r ${gradientClass} rounded-[1.75rem] opacity-0 group-hover:opacity-80 blur-xl transition duration-500`}
      ></div>
      <div
        ref={cardRef}
        style={tiltStyle}
        className={`relative rounded-[1.65rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-800/60 text-slate-100 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.85)] transition-all duration-300 ${className}`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

const AmbientBackdrop = ({ children }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        size: 160 + Math.random() * 140,
        top: Math.random() * 80,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 10 + Math.random() * 12,
        opacity: 0.08 + Math.random() * 0.12,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        {particles.map((particle) => (
          <span
            key={particle.id}
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              opacity: particle.opacity,
            }}
            className="floating-particle"
          ></span>
        ))}
      </div>
      <div className="relative z-10">{children}</div>
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);
  const fadeTimers = useRef({ out: null, in: null });

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
    if (fadeTimers.current.out) {
      clearTimeout(fadeTimers.current.out);
      fadeTimers.current.out = null;
    }
    if (fadeTimers.current.in) {
      clearTimeout(fadeTimers.current.in);
      fadeTimers.current.in = null;
    }
    setIsTransitioning(false);
    setPendingPage(null);
    setUser(null);
    setCurrentPage('login');
  };

  useEffect(() => {
    return () => {
      if (fadeTimers.current.out) clearTimeout(fadeTimers.current.out);
      if (fadeTimers.current.in) clearTimeout(fadeTimers.current.in);
    };
  }, []);

  const handlePageChange = (page) => {
    if (page === currentPage || isTransitioning) return;

    if (fadeTimers.current.out) clearTimeout(fadeTimers.current.out);
    if (fadeTimers.current.in) clearTimeout(fadeTimers.current.in);

    setPendingPage(page);
    setIsTransitioning(true);

    fadeTimers.current.out = setTimeout(() => {
      setCurrentPage(page);
      setPendingPage(null);
      fadeTimers.current.out = null;
      fadeTimers.current.in = setTimeout(() => {
        setIsTransitioning(false);
        fadeTimers.current.in = null;
      }, 200);
    }, 180);
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
      `px-4 py-2 rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
        currentPage === page || pendingPage === page
          ? 'bg-white/20 backdrop-blur-lg text-white shadow-lg'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`;

    return (
      <AmbientBackdrop>
        <nav className="bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.85)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2.5 rounded-2xl shadow-lg">
                    <Video className="text-white" size={26} />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 text-blue-300 animate-softPulse" size={18} />
                </div>
                <div>
                  <span className="text-2xl font-bold gradient-text tracking-tight block">Video AI Command Center</span>
                  <p className="text-sm text-white/50">Craft cinematic, data-driven experiences for every lead.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 backdrop-blur-xl">
                  <Search size={18} className="text-white/40" />
                  <input
                    type="text"
                    placeholder="Search people, cars, videos..."
                    className="bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="relative w-11 h-11 rounded-2xl border border-white/10 bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors ripple"
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400"></span>
                </button>
                <button
                  type="button"
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors ripple"
                >
                  <MoonStar size={18} />
                </button>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 backdrop-blur-xl">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-white/80">
                      <User size={18} />
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-white/50">{user.role?.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => handlePageChange(item.key)}
                    className={`${navButtonClasses(item.key)} ripple`}
                    disabled={isTransitioning}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ripple"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main
          className={`max-w-7xl mx-auto px-4 py-12 space-y-10 transition-opacity duration-300 ease-in-out ${
            isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {currentPage === 'dashboard' && (
            <DashboardPage user={user} interactions={interactions} />
          )}
          {currentPage === 'salespeople' && (
            <SalesPeoplePage
              salespeople={salespeople}
              setSalespeople={setSalespeople}
            />
          )}
          {currentPage === 'cars' && <CarsPage cars={cars} setCars={setCars} />}
          {currentPage === 'create-video' && (
            <CreateVideoPage
              salespeople={salespeople}
              cars={cars}
              interactions={interactions}
              setInteractions={setInteractions}
            />
          )}
        </main>
      </AmbientBackdrop>
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
            <p className="text-white/70">
              Automated personalized video generation for your dealership
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-white/70">
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
              <label className="block text-sm font-medium text-white/70">
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

          <div className="text-center text-sm text-white/50">
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
      blue: 'bg-gradient-to-br from-blue-400/20 to-indigo-400/10 text-blue-300',
      green: 'bg-gradient-to-br from-emerald-400/20 to-teal-400/10 text-emerald-300',
      purple: 'bg-gradient-to-br from-purple-400/20 to-pink-400/10 text-purple-300',
      orange: 'bg-gradient-to-br from-amber-400/20 to-orange-400/10 text-amber-300',
    };

    const sparklineData = {
      blue: [32, 46, 38, 54, 63, 58, 72],
      green: [22, 28, 35, 44, 51, 49, 60],
      purple: [18, 26, 34, 40, 37, 45, 53],
      orange: [12, 18, 16, 20, 24, 23, 28],
    };

    const accentGradients = {
      blue: 'from-sky-400 via-blue-500 to-indigo-500',
      green: 'from-emerald-400 via-teal-400 to-cyan-400',
      purple: 'from-fuchsia-400 via-purple-500 to-indigo-500',
      orange: 'from-amber-400 via-orange-500 to-rose-500',
    };

    const data = sparklineData[color] || sparklineData.blue;
    const width = 140;
    const height = 50;
    const step = width / (data.length - 1);
    const points = data
      .map((value, index) => {
        const x = index * step;
        const y = height - (value / 80) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' L ');

    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-800/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.95)] hover:shadow-[0_25px_70px_-40px_rgba(56,189,248,0.35)] transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl shadow-inner ${iconClasses[color]}`}>
              <Icon size={30} />
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium tracking-widest uppercase">{label}</p>
              <p className="text-4xl font-bold gradient-text">{value}</p>
            </div>
          </div>
          <div className="w-24 h-24 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${accentGradients[color]} flex items-center justify-center text-white font-semibold text-lg`}>↗</div>
          </div>
        </div>
        <div className="mt-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-14" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`spark-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(125, 211, 252, 0.6)" />
                <stop offset="100%" stopColor="rgba(147, 51, 234, 0.4)" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,${height} L ${points} L ${width},${height}`}
              fill={`url(#spark-${color})`}
              opacity="0.35"
            />
            <path
              d={`M ${points}`}
              fill="none"
              stroke={`url(#spark-${color})`}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Welcome, {user.name}!</h1>
        <p className="text-white/60 max-w-2xl">
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
          <h2 className="text-2xl font-semibold text-white">
            Recent Activity
          </h2>
        </div>

        {interactions.length === 0 ? (
          <div className="text-center py-12 text-white/40 space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-800/70 to-slate-700/60 rounded-3xl flex items-center justify-center">
              <Video size={40} className="text-white/50" />
            </div>
            <p className="text-white/60">
              No videos created yet. Start by creating your first personalized video!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 hover:opacity-100"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-300 flex items-center justify-center">
                    <Video size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {interaction.customerName}
                    </p>
                    <p className="text-sm text-white/60">{interaction.carName}</p>
                  </div>
                </div>
                <div className="relative text-right">
                  <p className="text-sm font-medium text-white/70">
                    {interaction.status}
                  </p>
                  <p className="text-xs text-white/50">{interaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlowCard>
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
      phone: '',
    });
    const [greetingVideo, setGreetingVideo] = useState(null);
    const [voiceSample, setVoiceSample] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(1);

    const steps = [
      {
        id: 1,
        title: 'Profile Details',
        description: 'Tell us who is starring in the video experience.',
      },
      {
        id: 2,
        title: 'Signature Media',
        description: 'Upload the assets that make their presence shine.',
      },
      {
        id: 3,
        title: 'Review & Launch',
        description: 'Confirm their profile before we craft their digital twin.',
      },
    ];

    const isProfileComplete = formData.name.trim() && formData.email.trim();
    const isMediaComplete = Boolean(greetingVideo && voiceSample);

    const goToNextStep = () => {
      if (step === 1 && !isProfileComplete) return;
      if (step === 2 && !isMediaComplete) return;
      setStep((prev) => Math.min(prev + 1, steps.length));
    };

    const goToPrevStep = () => {
      setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
      if (!isProfileComplete || !isMediaComplete) {
        alert('Please complete all steps before submitting.');
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

    const renderStepContent = () => {
      switch (step) {
        case 1:
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Alex Johnson"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="alex@dealership.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Greeting Video *</label>
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
                    className="block border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400/60 hover:bg-blue-500/10 transition-all duration-300 group"
                  >
                    <Upload
                      className="mx-auto mb-3 text-white/40 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300"
                      size={48}
                    />
                    <p className="text-white/70 group-hover:text-blue-200 font-medium">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-white/40 mt-2">MP4, MOV (max 100MB)</p>
                  </label>
                  {greetingVideo && (
                    <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl flex items-center gap-2 animate-slideUp">
                      <CheckCircle className="text-emerald-300" size={20} />
                      <span className="text-emerald-200 font-medium truncate">{greetingVideo.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Voice Sample *</label>
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
                    className="block border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400/60 hover:bg-purple-500/10 transition-all duration-300 group"
                  >
                    <Upload
                      className="mx-auto mb-3 text-white/40 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300"
                      size={48}
                    />
                    <p className="text-white/70 group-hover:text-purple-200 font-medium">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-white/40 mt-2">MP3 (max 50MB)</p>
                  </label>
                  {voiceSample && (
                    <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl flex items-center gap-2 animate-slideUp">
                      <CheckCircle className="text-emerald-300" size={20} />
                      <span className="text-emerald-200 font-medium truncate">{voiceSample.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/70 space-y-1">
                <p className="font-semibold flex items-center gap-2 text-white">
                  📝 What to upload
                </p>
                <p>
                  <strong>Greeting video:</strong> 15-30 sec video of a warm introduction.
                </p>
                <p>
                  <strong>Voice sample:</strong> 1-2 min audio capturing natural conversation.
                </p>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div>
                  <p className="text-sm text-white/50">Name</p>
                  <p className="text-lg font-semibold text-white">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <p className="text-lg font-semibold text-white">{formData.email}</p>
                </div>
                {formData.phone && (
                  <div>
                    <p className="text-sm text-white/50">Phone</p>
                    <p className="text-lg font-semibold text-white">{formData.phone}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-4 text-white/70">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Greeting Video</p>
                    <p className="mt-2 font-semibold text-white truncate">
                      {greetingVideo?.name || 'Pending upload'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-purple-400/30 bg-purple-500/10 p-4 text-white/70">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Voice Sample</p>
                    <p className="mt-2 font-semibold text-white truncate">
                      {voiceSample?.name || 'Pending upload'}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-sm">
                We’ll craft a digital persona using these assets. You can edit the salesperson later for additional fine-tuning.
              </p>
            </div>
          );
        default:
          return null;
      }
    };

    const isPrimaryDisabled =
      (step === 1 && !isProfileComplete) ||
      (step === 2 && !isMediaComplete) ||
      (step === 3 && uploading);

    const primaryLabel =
      step === steps.length ? (uploading ? 'Uploading…' : 'Launch Persona') : 'Continue';

    const handlePrimaryAction = () => {
      if (step === steps.length) {
        if (!uploading) {
          handleSubmit();
        }
      } else {
        goToNextStep();
      }
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto animate-fadeIn">
        <div className="relative bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-900/90 text-slate-100 rounded-3xl p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] max-w-lg w-full animate-slideUp max-h-[85vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-all duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold gradient-text">Add Salesperson</h2>
              <p className="text-sm text-white/50">Orchestrate a new on-brand persona in three polished steps.</p>
            </div>

            <div className="flex items-center gap-3">
              {steps.map((item) => (
                <div key={item.id} className={`flex-1 h-2 rounded-full ${step >= item.id ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/10'}`}></div>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-white/70">{steps[step - 1].title}</p>
              <p className="text-xs text-white/50">{steps[step - 1].description}</p>
            </div>

            <div className="space-y-6">{renderStepContent()}</div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={step === 1 ? onClose : goToPrevStep}
                disabled={uploading}
                className="flex-1 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition-all duration-200 ripple disabled:opacity-60"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handlePrimaryAction}
                disabled={isPrimaryDisabled}
                className="flex-1 btn-primary justify-center ripple disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader className="animate-spin" size={18} /> : primaryLabel}
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
          <p className="text-white/60">
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
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-purple-200">
            <Users size={40} />
          </div>
          <p className="text-white/60">
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
                <div className="h-48 bg-gradient-to-br from-slate-800/60 to-slate-700/50 flex items-center justify-center">
                  <Users className="text-white/60 transition-transform duration-500 group-hover:scale-110" size={56} />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" size={40} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{person.name}</h3>
                <p className="text-sm text-white/60">{person.email}</p>
                {person.phone && <p className="text-sm text-white/60">{person.phone}</p>}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 ripple inline-flex items-center justify-center gap-2">
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
    const [step, setStep] = useState(1);
    const [uploading, setUploading] = useState(false);

    const steps = [
      {
        id: 1,
        title: 'Vehicle Identity',
        description: 'Give the system the essentials about this model.',
      },
      {
        id: 2,
        title: 'Experience Touchpoints',
        description: 'Highlight the storytelling beats that will wow customers.',
      },
      {
        id: 3,
        title: 'Showcase Preview',
        description: 'Confirm the cinematic package before publishing.',
      },
    ];

    const isBasicsComplete = formData.name.trim() && formData.price;
    const isExperienceComplete = Boolean(formData.features.trim() && carVideo);

    const goToNextStep = () => {
      if (step === 1 && !isBasicsComplete) return;
      if (step === 2 && !isExperienceComplete) return;
      setStep((prev) => Math.min(prev + 1, steps.length));
    };

    const goToPrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
      if (!isBasicsComplete || !isExperienceComplete) {
        alert('Please complete all steps before publishing the showcase.');
        return;
      }

      setUploading(true);
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
      } finally {
        setUploading(false);
      }
    };
    const renderStep = () => {
      switch (step) {
        case 1:
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Car Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Luxe GT 580"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="98000"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Signature Highlights *</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Hand-stitched leather, 4D adaptive suspension, panoramic starlight roof"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">Cinematic Reel *</label>
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
                    className="block border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400/60 hover:bg-pink-500/10 transition-all duration-300 group"
                  >
                    <Upload
                      className="mx-auto mb-3 text-white/40 group-hover:text-pink-300 group-hover:scale-110 transition-all duration-300"
                      size={48}
                    />
                    <p className="text-white/70 group-hover:text-pink-200 font-medium">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-white/40 mt-2">MP4, MOV (max 150MB)</p>
                  </label>
                  {carVideo && (
                    <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl flex items-center gap-2 animate-slideUp">
                      <CheckCircle className="text-emerald-300" size={20} />
                      <span className="text-emerald-200 font-medium truncate">{carVideo.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70 text-sm">
                <p className="font-semibold text-white">Tip for impact</p>
                <p className="mt-1">Use dynamic shots—drive-bys, interior close-ups, infotainment demos—to help the AI craft compelling narratives.</p>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Model</p>
                  <p className="mt-2 text-xl font-semibold">{formData.name || '—'}</p>
                </div>
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">MSRP</p>
                  <p className="mt-2 text-xl font-semibold">
                    {formData.price ? `$${Number(formData.price).toLocaleString()}` : '—'}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Highlights</p>
                <p className="mt-2 whitespace-pre-line text-white">
                  {formData.features || 'No highlights provided yet.'}
                </p>
              </div>
              <div className="rounded-2xl border border-pink-400/30 bg-pink-500/10 p-4 text-white/70 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Cinematic Reel</p>
                  <p className="mt-2 text-white font-semibold truncate">
                    {carVideo?.name || 'Pending upload'}
                  </p>
                </div>
                <Play size={28} className="text-white/70" />
              </div>
              <p className="text-sm text-white/60">
                This showcase will appear in sales workflows and AI video prompts immediately after publishing.
              </p>
            </div>
          );
        default:
          return null;
      }
    };

    const isPrimaryDisabled =
      (step === 1 && !isBasicsComplete) ||
      (step === 2 && !isExperienceComplete) ||
      (step === 3 && uploading);

    const primaryLabel =
      step === steps.length ? (uploading ? 'Publishing…' : 'Publish Showcase') : 'Continue';

    const handlePrimaryAction = () => {
      if (step === steps.length) {
        if (!uploading) {
          handleSubmit();
        }
      } else {
        goToNextStep();
      }
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto animate-fadeIn">
        <div className="relative bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-900/90 text-slate-100 rounded-3xl p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] max-w-lg w-full animate-slideUp max-h-[85vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-all duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold gradient-text">Add Car</h2>
              <p className="text-sm text-white/50">Craft a silver-screen worthy profile that matches your showroom energy.</p>
            </div>

            <div className="flex items-center gap-3">
              {steps.map((item) => (
                <div key={item.id} className={`flex-1 h-2 rounded-full ${step >= item.id ? 'bg-gradient-to-r from-pink-500 to-blue-500' : 'bg-white/10'}`}></div>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-white/70">{steps[step - 1].title}</p>
              <p className="text-xs text-white/50">{steps[step - 1].description}</p>
            </div>

            <div className="space-y-6">{renderStep()}</div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={step === 1 ? onClose : goToPrevStep}
                disabled={uploading}
                className="flex-1 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition-all duration-200 ripple disabled:opacity-60"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handlePrimaryAction}
                disabled={isPrimaryDisabled}
                className="flex-1 btn-primary justify-center ripple disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader className="animate-spin" size={18} /> : primaryLabel}
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
          <h1 className="text-4xl font-bold gradient-text">Manage Cars</h1>
          <p className="text-white/60">
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
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-pink-200">
            <Car size={40} />
          </div>
          <p className="text-white/60">
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
                <div className="h-48 bg-gradient-to-br from-slate-800/60 to-slate-700/50 flex items-center justify-center">
                  <Car className="text-white/60 transition-transform duration-500 group-hover:scale-110" size={56} />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" size={40} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white">{car.name}</h3>
                <p className="text-3xl font-bold gradient-text">
                  ${car.price?.toLocaleString()}
                </p>
              </div>

              {car.features && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white/70">Features</p>
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
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-100 text-xs font-medium"
                        >
                          {feature.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 ripple inline-flex items-center justify-center gap-2">
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
        <p className="text-white/60">
          Capture the excitement of every test drive with AI scripts and cinematic video delivery.
        </p>
      </div>

      <GlowCard className="p-8 space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Customer Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/60">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Wasi Ahmed"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/60">
                Email
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="wasi@email.com"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/60">
              Phone
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Interaction Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/60">
                Salesperson
              </label>
              <select
                value={formData.salespersonId}
                onChange={(e) => handleInputChange('salespersonId', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
              <label className="block text-sm font-medium text-white/60">
                Car
              </label>
              <select
                value={formData.carId}
                onChange={(e) => handleInputChange('carId', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
            <label className="block text-sm font-medium text-white/60">
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
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/60">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Customer loved the acceleration test, interested in financing options..."
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
        <GlowCard className="p-8 space-y-5" variant="silver">
          <h2 className="text-2xl font-semibold text-white">
            Generated Script Preview
          </h2>

          <div className="bg-white/5 text-white rounded-2xl p-6 border border-white/10 shadow-inner">
            <p className="whitespace-pre-line leading-relaxed text-white/80">{generatedScript}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200 ripple"
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
