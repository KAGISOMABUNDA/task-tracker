import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Load user profile
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return setDeleteError("Please enter your password");

    setDeleteError("");
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete user document
      await deleteDoc(doc(db, "users", user.uid));

      // Delete user account
      await deleteUser(auth.currentUser);
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/wrong-password") setDeleteError("Incorrect password");
      else setDeleteError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading profile...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* Personal Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Personal Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-150 text-sm"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors duration-150 text-sm"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({ firstName: profile.firstName, lastName: profile.lastName });
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-150 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="text-base font-medium text-slate-800">{profile?.firstName} {profile?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-base font-medium text-slate-800">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone Section (Delete Account) */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-150 text-sm"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">⚠️ This action cannot be undone!</p>
                <p className="text-sm text-red-700">
                  All your tasks, profile information, and data will be permanently deleted.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Enter your password to confirm</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900"
                  placeholder="Enter your password"
                />
                {deleteError && <p className="text-sm text-red-600 mt-2">{deleteError}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium transition-colors duration-150 text-sm"
                >
                  {loading ? "Deleting..." : "Permanently Delete Account"}
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); setDeleteError(""); }}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-150 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
