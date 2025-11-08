import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo / Brand */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-slate-800">Task Tracker</span>
            </div>
          </button>

          {/* Right side - User info & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <>
                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {profile?.photoURL ? (
                      <img
                        src={profile.photoURL}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {profile?.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-slate-700 font-medium max-w-[120px] md:max-w-[180px] truncate">
                      {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user.email}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium transition-colors duration-150 text-sm"
                  >
                    Log Out
                  </button>
                </div>

                {/* Mobile Menu */}
                <div className="sm:hidden relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center"
                  >
                    {profile?.photoURL ? (
                      <img
                        src={profile.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {profile?.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>

                  {showMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}