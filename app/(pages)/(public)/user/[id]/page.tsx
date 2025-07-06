'use client'

import axios from 'axios';
import { NotebookPen, User, X, Mail, Calendar, Settings, LogOut, Shield, Bell, Book, Check, Lock, LockKeyhole } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
  const router = useRouter();
  const [curUser, setCurUser] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateUser = () => {
      setIsLoading(true);
      const mockUser = {
        user: "User",
        email: "user@example.com",
        joinDate: "January 2024",
        avatar: null,
        contact: "+91 12312 12312"
      };

      const storedUser = JSON.parse(localStorage.getItem("curUser") || "null"); 
      
      setTimeout(() => {
        setCurUser(storedUser ? storedUser : mockUser);
        setIsLoading(false);
      }, 500);
    };

    updateUser();
  }, []);

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValues({ ...tempValues, [field]: curUser[field] });
  };

  const handleSave = (field: string) => {
    if (field === 'contact' && !isValidContact(tempValues.contact)) {
      alert('Please enter a valid contact number (10 digits, with or without country code)');
      return;
    }
    const updatedUser = { ...curUser, [field]: tempValues[field] }
    setCurUser(updatedUser);
    localStorage.setItem('curUser', JSON.stringify(curUser));
    axios.post("http://localhost:3000/api/users", {...updatedUser, type: "update"})
    setEditingField(null);
    setTempValues({});
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleInputChange = (field: string, value: string) => {
    setTempValues({ ...tempValues, [field]: value });
  };

  const handleLogOut = () => {
    localStorage.removeItem("curUser");
    setCurUser("");
    window.dispatchEvent(new Event("curUserChanged"));
    router.push('/user/login');
  }

  const isValidContact = (value: string = '') => {
    const cleaned = value.replace(/\D/g, '');
    return (
      /^(\+?\d{1,3})?\d{10}$/.test(value) && 
      cleaned.length >= 10 && cleaned.slice(-10).length === 10
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedUser = { ...curUser, avatar: base64 };
        setCurUser(updatedUser);
        localStorage.setItem("curUser", JSON.stringify(updatedUser));
        axios.post("http://localhost:3000/api/users", {...updatedUser, type: "update"})
        window.dispatchEvent(new Event("curUserChanged"));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 p-8'>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
          <button onClick={handleLogOut} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <label htmlFor="avatarUpload" className="cursor-pointer relative">
                    {curUser?.avatar ? (
                      <img
                        src={curUser.avatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <User size={48} className="text-white" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="avatarUpload"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center">
                      <NotebookPen size={14} className="text-white" />
                    </div>
                  </label>
                </div>

                
                <h2 className="text-2xl font-bold text-white mb-1">
                  {curUser?.user || "User"}
                </h2>
                <p className="text-slate-400 mb-4">{curUser?.email || "user@example.com"}</p>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={16} />
                  <span>Joined {curUser?.joinDate || "Recently"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Account Information</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-slate-400" />
                    <div>
                      <p className="text-slate-300 font-medium">Display Name</p>
                      {editingField === 'user' ? (
                        <input
                          type="text"
                          value={tempValues.user || ''}
                          onChange={(e) => handleInputChange('user', e.target.value)}
                          className="mt-1 bg-slate-600 text-white px-3 py-1 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <p className="text-white text-lg">{curUser?.user || "Not set"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingField === 'user' ? (
                      <>
                        <button
                          onClick={() => handleSave('user')}
                          className="p-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-lg transition-colors"
                        >
                          <Check  size={16}/>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 bg-slate-600 hover:bg-slate-700 cursor-pointer text-white rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit('user')}
                        className="p-2 bg-slate-600 hover:bg-slate-700 cursor-pointer text-white rounded-lg transition-colors"
                      >
                        <NotebookPen size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-slate-300 font-medium">Email Address</p>
                      {editingField === 'email' ? (
                        <input
                          type="email"
                          value={tempValues.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1 bg-slate-600 text-white px-3 py-1 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <p className="text-white text-lg">{curUser?.email || "Not set"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingField === 'email' ? (
                      <>
                        <button
                          onClick={() => handleSave('email')}
                          className="p-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-lg transition-colors"
                        >
                          <Check  size={16}/>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 bg-slate-600 hover:bg-slate-700 cursor-pointer text-white rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit('email')}
                        className="p-2 bg-slate-600 hover:bg-slate-700 cursor-pointer text-white rounded-lg transition-colors"
                      >
                        <NotebookPen size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <User size={18} className="text-slate-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-slate-300 font-medium">Contact Information</p>
                      {editingField === 'contact' ? (
                        <div>
                          <input
                          value={tempValues.contact || ''}
                          onChange={(e) => handleInputChange('contact', e.target.value)}
                          className="mt-1 w-full bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                          autoFocus
                          placeholder="+91XXXXXXXXXX"
                        />
                        {!isValidContact(tempValues.contact) &&
                          <p className="text-red-400 text-sm mt-1">Enter valid 10-digit contact number with optional country code</p>
                        }
                        </div>
                      ) : (
                        <p className="text-white text-lg">{curUser?.contact || "No contact info set"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {editingField === 'contact' ? (
                      <>
                        <button
                          onClick={() => handleSave('contact')}
                          className="p-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-lg transition-colors"
                        >
                          <Check size={16}/>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 bg-slate-600 hover:bg-slate-700 cursor-pointer text-white rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit('contact')}
                        className="p-2 bg-slate-600 hover:bg-slate-700 cursor-pointer text-white rounded-lg transition-colors"
                      >
                        <NotebookPen size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                  <LockKeyhole size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Security Actions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => router.push('/user/update-password')} className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer rounded-lg transition-colors text-left">
                  <Lock size={20} className="text-amber-400" />
                  <div>
                    <p className="text-white font-medium">Change Password</p>
                    <p className="text-slate-400 text-sm">Update your password</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Settings size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Quick Actions</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer rounded-lg transition-colors text-left">
                  <Book size={20} className="text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Previous Bookings</p>
                    <p className="text-slate-400 text-sm">Manage your bookings</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer rounded-lg transition-colors text-left">
                  <Bell size={20} className="text-green-400" />
                  <div>
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-slate-400 text-sm">Configure alert preferences</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;