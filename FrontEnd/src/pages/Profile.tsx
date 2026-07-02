import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import type { User } from "@/types";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

export default function Profile() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        date_of_birth: user.date_of_birth || '',
      });
      setImagePreview(user.profile_image || user.avatar || null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('flora_token');
      
      // Update profile text data
      const profileResponse = await fetch(`${API_BASE}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok || !profileResult.success) {
        throw new Error(profileResult.message || 'Failed to update profile');
      }

      // Upload image if selected
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('profile_image', profileImage);

        const imageResponse = await fetch(`${API_BASE}/profile/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: imageFormData,
        });

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok || !imageResult.success) {
          throw new Error(imageResult.message || 'Failed to upload profile image');
        }
      }

      // Update local storage with new user data
      const updatedUser = { ...user, ...profileResult.data };
      localStorage.setItem('flora_user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update profile' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm('Are you sure you want to delete your profile image?')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('flora_token');
      
      const response = await fetch(`${API_BASE}/profile/delete-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete profile image');
      }

      // Update local storage
      const updatedUser = { ...user, ...result.data };
      localStorage.setItem('flora_user', JSON.stringify(updatedUser));
      setImagePreview(null);

      setMessage({ type: 'success', text: 'Profile image deleted successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to delete profile image' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      date_of_birth: user?.date_of_birth || '',
    });
    setProfileImage(null);
    setImagePreview(user?.profile_image || user?.avatar || null);
    setMessage(null);
  };

  const getInitials = () => {
    const first = formData.first_name || user?.name?.split(' ')[0] || '';
    const last = formData.last_name || user?.name?.split(' ')[1] || '';
    return (first[0] + last[0]).toUpperCase() || user?.name?.[0] || 'U';
  };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account details" />

      <div className="panel" style={{ maxWidth: 700 }}>
        {message && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '6px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div style={{ position: 'relative' }}>
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile" 
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '3px solid #e2e8f0'
                }}
              />
            ) : (
              <div className="profile-avatar" style={{ 
                width: 100, 
                height: 100, 
                fontSize: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getInitials()}
              </div>
            )}
            {isEditing && (
              <label htmlFor="profile-image-input" style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem',
                border: '2px solid white'
              }}>
                📷
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="panel__title" style={{ marginBottom: 4 }}>
              {formData.first_name || formData.last_name 
                ? `${formData.first_name} ${formData.last_name}`.trim() 
                : user?.name}
            </h2>
            <p className="data-table__muted">{user?.email}</p>
            <p className="data-table__muted" style={{ marginTop: 4 }}>{user?.role}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-input"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-input"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  className="form-input"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              </div>

              {imagePreview && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="btn btn-danger"
                    disabled={isLoading}
                  >
                    Delete Image
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                {!imagePreview && (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="profile-row">
              <span className="data-table__muted">First Name</span>
              <span>{user?.first_name || 'Not set'}</span>
            </div>
            <div className="profile-row">
              <span className="data-table__muted">Last Name</span>
              <span>{user?.last_name || 'Not set'}</span>
            </div>
            <div className="profile-row">
              <span className="data-table__muted">Date of Birth</span>
              <span>{user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not set'}</span>
            </div>
            <div className="profile-row">
              <span className="data-table__muted">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="profile-row">
              <span className="data-table__muted">Role</span>
              <span>{user?.role}</span>
            </div>
            <div className="profile-row">
              <span className="data-table__muted">User ID</span>
              <span>{user?.id}</span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
              style={{ marginTop: 24, width: '100%' }}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}