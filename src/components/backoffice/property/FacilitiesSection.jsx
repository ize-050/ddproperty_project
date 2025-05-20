'use client';

import React from 'react';
import { 
  FaBasketballBall, 
  FaDumbbell, 
  FaGolfBall, 
  FaRunning,
  FaTableTennis, 
  FaLeaf, 
  FaBook, 
  FaBuilding,
  FaHome, 
  FaLaptop, 
  FaChild, 
  FaHotTub, 
  FaSpa, 
  FaSwimmingPool,
  FaGlassMartini, 
  FaUsers, 
  FaGamepad, 
  FaMicrophone, 
  FaFilm,
  FaChess, 
  FaUtensils, 
  FaGlassWhiskey, 
  FaShieldAlt, 
  FaVideo,
  FaBolt, 
  FaArrowUp
} from 'react-icons/fa';
import usePropertyFormStore from '@/store/propertyFormStore';

const FacilitiesSection = () => {
  const { formData, setFacility } = usePropertyFormStore();

  const handleFacilityClick = (category, facility) => {
    setFacility(category, facility, !formData.facilities?.[category]?.[facility]);
  };

  const facilities = {
    fitnessAndSports: [
      { id: 'basketballCourt', label: 'Basket ball Court', icon: <FaBasketballBall /> },
      { id: 'fitness', label: 'Fitness', icon: <FaDumbbell /> },
      { id: 'golfSimulator', label: 'Golf simulator', icon: <FaGolfBall /> },
      { id: 'joggingTrack', label: 'Jogging Track', icon: <FaRunning /> },
      { id: 'squashCourt', label: 'Squash Court', icon: <FaTableTennis /> },
      { id: 'tennisCourt', label: 'Tennis Court', icon: <FaTableTennis /> },
      { id: 'yogaRoom', label: 'Yoga room', icon: <FaTableTennis /> },
    ],
    commonAreas: [
      { id: 'greenArea', label: 'Green Area', icon: <FaLeaf /> },
      { id: 'library', label: 'Library', icon: <FaBook /> },
      { id: 'lobby', label: 'Lobby', icon: <FaBuilding /> },
      { id: 'meetingRoom', label: 'Meeting Room', icon: <FaUsers /> },
      { id: 'skyGarden', label: 'Sky Garden', icon: <FaLeaf /> },
      { id: 'workingSpace', label: 'Working-Space', icon: <FaLaptop /> },
    ],
    poolsAndRelaxation: [
      { id: 'kidsPool', label: 'Kids pool', icon: <FaChild /> },
      { id: 'onsen', label: 'Onsen', icon: <FaHotTub /> },
      { id: 'sauna', label: 'Sauna', icon: <FaHotTub /> },
      { id: 'skyPool', label: 'Sky pool', icon: <FaSwimmingPool /> },
      { id: 'spa', label: 'Spa', icon: <FaSpa /> },
      { id: 'salon', label: 'Salon', icon: <FaSpa /> },
      { id: 'swimmingPool', label: 'Swimming Pool', icon: <FaSwimmingPool /> },
    ],
    diningAndEntertainment: [
      { id: 'bar', label: 'Bar', icon: <FaGlassMartini /> },
      { id: 'clubhouse', label: 'Clubhouse', icon: <FaUsers /> },
      { id: 'gameroom', label: 'Gameroom', icon: <FaGamepad /> },
      { id: 'karaokeRoom', label: 'Karaoke Room', icon: <FaMicrophone /> },
      { id: 'miniTheater', label: 'Mini Theater', icon: <FaFilm /> },
      { id: 'poolTable', label: 'Pool Table', icon: <FaChess /> },
      { id: 'restaurant', label: 'Restaurant', icon: <FaUtensils /> },
      { id: 'skyBar', label: 'Sky Bar', icon: <FaGlassWhiskey /> },
    ],
    other: [
      { id: 'security24hr', label: '24 hr Security', icon: <FaShieldAlt /> },
      { id: 'cctv', label: 'CCTV', icon: <FaVideo /> },
      { id: 'conciergeServices', label: 'Concierge Services', icon: <FaUsers /> },
      { id: 'evCharger', label: 'EV-Charger', icon: <FaBolt /> },
      { id: 'highSpeedLift', label: 'High Speed Lift', icon: <FaArrowUp /> },
      { id: 'kidsClub', label: 'Kids Club', icon: <FaChild /> },
    ],
  };

  return (
    <section className="form-section">
      <h2>Facilities</h2>
      
      <div className="facility-category">
        <h3>Fitness & Sports</h3>
        <div className="selection-grid">
          {facilities.fitnessAndSports.map((item) => (
            <div 
              key={item.id}
              className={`selection-item with-icon ${formData.facilities?.fitnessAndSports?.[item.id] ? 'active' : ''}`}
              onClick={() => handleFacilityClick('fitnessAndSports', item.id)}
            >
              <span className="selection-icon">{item.icon}</span>
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="facility-category">
        <h3>Common Areas</h3>
        <div className="selection-grid">
          {facilities.commonAreas.map((item) => (
            <div 
              key={item.id}
              className={`selection-item with-icon ${formData.facilities?.commonAreas?.[item.id] ? 'active' : ''}`}
              onClick={() => handleFacilityClick('commonAreas', item.id)}
            >
              <span className="selection-icon">{item.icon}</span>
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="facility-category">
        <h3>Pools, Spa & Relaxation</h3>
        <div className="selection-grid">
          {facilities.poolsAndRelaxation.map((item) => (
            <div 
              key={item.id}
              className={`selection-item with-icon ${formData.facilities?.poolsAndRelaxation?.[item.id] ? 'active' : ''}`}
              onClick={() => handleFacilityClick('poolsAndRelaxation', item.id)}
            >
              <span className="selection-icon">{item.icon}</span>
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="facility-category">
        <h3>Dining, Entertainment & Leisure</h3>
        <div className="selection-grid">
          {facilities.diningAndEntertainment.map((item) => (
            <div 
              key={item.id}
              className={`selection-item with-icon ${formData.facilities?.diningAndEntertainment?.[item.id] ? 'active' : ''}`}
              onClick={() => handleFacilityClick('diningAndEntertainment', item.id)}
            >
              <span className="selection-icon">{item.icon}</span>
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="facility-category">
        <h3>Other</h3>
        <div className="selection-grid">
          {facilities.other.map((item) => (
            <div 
              key={item.id}
              className={`selection-item with-icon ${formData.facilities?.other?.[item.id] ? 'active' : ''}`}
              onClick={() => handleFacilityClick('other', item.id)}
            >
              <span className="selection-icon">{item.icon}</span>
              <span className="selection-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
