import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Navigation/Topbar';
import './ProfilePage.css';
import user from '../../assets/user.png';

const ProfilePage = () => {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications] = useState([]); 
  const notificationRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user"));

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-page">
      {/* Replaced custom nav with Topbar component */}
      <Topbar />

      <div className="profile-header">
        {coverPhoto ? (
          <img src={coverPhoto} alt="Cover" className="cover-photo" />
        ) : (
          <div className="add-cover-photo">
            <label htmlFor="coverPhotoInput" className="upload-button">
              Add cover photo
            </label>
            <input
              type="file"
              id="coverPhotoInput"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleCoverPhotoChange}
            />
          </div>
        )}
        <div className="profile-info">
          <label htmlFor="profilePhotoInput" className="profile-picture-label">
            <img
              src={profilePhoto || user}
              alt="Profile"
              className="profile-picture"
            />
            {!profilePhoto && (
              <div className="add-profile-photo-text">Add profile photo</div>
            )}
          </label>
          <input
            type="file"
            id="profilePhotoInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
        </div>
      </div>

      {/* ✅ This div was missing */}
      <div className="profile-content">
        <h2 className="profile-name">
          {userData?.username || "user"}
        </h2>

        <div className="skills-section">
          <h3 className="section-title">Skills</h3>
          <div className="skills-list">
            <span className="skill-tag">Logo design</span>
            <span className="skill-tag">Blog Writer</span>
            <span className="skill-tag">Copy Editor</span>
            <span className="skill-tag">Content Creator</span>
          </div>
        </div>

        <div className="experience-section">
          <h3 className="section-title">Experience</h3>
          <div className="experience-list">
            <div className="experience-item">
              <div className="experience-role">Content Creator</div>
              <div className="experience-year">2022-2023</div>
              <div className="experience-company">Multi Covenant</div>
            </div>
          </div>
          <button className="add-experience">+ Add experience</button>
        </div>
      </div> {/* ✅ Correctly closes profile-content */}
    </div>
  );
}; 

export default ProfilePage;
