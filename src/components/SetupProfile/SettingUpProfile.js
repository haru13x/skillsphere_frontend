import React, { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import "./default.css";

import Hands from "../../assets/Hands.jpg";
import backArrow from "../../assets/left-arrow.png";
import working from "../../assets/working.png";
import talent from "../../assets/talent.png";
import profileIcon from "../../assets/user-avatar.png";
import GraphicandDesign from "../../assets/Graphic and Design.jpg";
import graphicDesign from "../../assets/graphic-design.png";
import writing from "../../assets/writing.png";
import translation from "../../assets/translation.png";
import logodesign from "../../assets/logodesign.png";
import tshirtdesign from "../../assets/tshirt.png";
import infographicdesign from "../../assets/infographics.png";
import blog from "../../assets/blog.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import digitalMarketing from "../../assets/social-media-marketing.png";

const categories = [
  {
    name: 'Graphic Design',
    icon: graphicDesign,
    submenu: ['Logo design', 'T-shirt design', 'Infographic design'],
  },
  {
    name: 'Writing',
    icon: writing,
    submenu: ['Blog Writer', 'Scriptwriter', 'Copywriter'],
  },
  { name: 'Logo Design', icon: logodesign },
  { name: 'T-shirt Design', icon: tshirtdesign },
  { name: 'Infographic Design', icon: infographicdesign },
  { name: 'Blog Writer', icon: blog },
  { name: 'Script Writer', icon: translation },
  { name: 'Copywriter', icon: translation },
  { name: 'Translation & Editing', icon: translation }
]

const SettingUpProfile = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState("");
  const [selected, setSelected] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const submenuRef = useRef(null);
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;
  const itemWidth = 120;
  const maxPage = Math.floor(categories.length / itemsPerPage);

  const visibleCategories = categories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const [experiences, setExperiences] = useState([
    { title: "", company: "", startDate: "", endDate: "" },
  ]);

  const handleBackClick = () => {
    if (step === "experience") setStep("skills");
    else if (step === "skills") setStep("birthdate");
    else if (step === "birthdate") setStep("about");
    else if (step === "about") setStep("profile");
    else navigate("/");
  };

  const scrollToPage = (page) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: page * itemsPerPage * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollLeft = () => {
    const newPage = Math.max(currentPage - 1, 0);
    setCurrentPage(newPage);
    scrollToPage(newPage);
  };

  const scrollRight = () => {
    const newPage = Math.min(currentPage + 1, maxPage);
    setCurrentPage(newPage);
    scrollToPage(newPage);
  };

  const handleChange = (index, field, value) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { title: "", company: "", startDate: "", endDate: "" },
    ]);
  };

  const removeExperience = (indexToRemove) => {
    const updated = experiences.filter((_, index) => index !== indexToRemove);
    setExperiences(updated);
  };

  const toggleSkill = (skill) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleCategoryClick = (categoryName) => {
    setActiveSubmenu(activeSubmenu === categoryName ? null : categoryName);
  };

  const handleSubmenuItemClick = (item) => {
    toggleSkill(item);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="account-container">
      {/* JOIN AS STEP */}
      {step === 1 && (
        <div className="joinas-content">

          <h2 className="joinas-title">Join as</h2>

          <div className="joinas-card-group">
            <div className="joinas-card" onClick={() => setStep(2)}>
              <div className="joinas-card-content">
                <img src={working} alt="Find Work" className="joinas-icon" />
                <span className="joinas-text">Find Work</span>
              </div>
              <ArrowRight className="joinas-arrow" />
            </div>

            <div className="joinas-card" onClick={() => setStep(6)}>
              <div className="joinas-card-content">
                <img src={talent} alt="Find Talent" className="joinas-icon" />
                <span className="joinas-text">Find Talent</span>
              </div>
              <ArrowRight className="joinas-arrow" />
            </div>
          </div>
        </div>
      )}


      {step === 2 && (
        <div className="about-container" style={{ height: "auto" }}>
          <h2 className="form-title">Tell us about yourself</h2>

          {/* Basic Info */}
          <label className="form-label">What do you do?</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. Data Scientist"
            rows={2}
          />

          <label className="form-label">Describe yourself</label>
          <textarea
            className="form-textarea1"
            placeholder="Describe your top skills, strengths, and experiences"
            rows={4}
          />

          {/* Birthdate */}
          <h2 className="birth-header">When were you born?</h2>
          <p className="birth-description">
            To use Freelancer, you must be 16 years of age or older...
          </p>
          <div className="input-wrapper">
            <input
              type="date"
              className="birth-input"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {/* Skills */}
          <h2>Tell us your skills</h2>
          <p className="subtitle">This helps us recommend jobs for you.</p>
          <div className="category-box-container">
            <div className="category-box">
              <h3 className="category-title">Category</h3>
              <div className="category-scroll-wrapper">
                <div className="category-items-wrapper">
                  {visibleCategories.map((cat) => (
                    <div
                      key={cat.name}
                      className={`category-item ${selected.includes(cat.name) ? 'selected' : ''}`}
                      onClick={() => toggleSkill(cat.name)}
                    >
                      <div className="icon">
                        <img src={cat.icon} alt={cat.name} />
                      </div>
                      <div className="label">{cat.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="selected-skills-box">
            <div className="skills-selected-count">{selected.length} skills selected</div>
            {selected.length > 0 ? (
              <div className="selected-skills-list">
                {selected.map((skill) => (
                  <div key={skill} className="selected-skill-pill">
                    {skill}
                    <span className="remove-skill" onClick={() => toggleSkill(skill)}>×</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="add-skill-icon">+</div>
            )}
          </div>
          {/* Experience */}
          <h2 className="experience-header">Add Experience</h2>
          <p className="experience-subtitle">Add Work Experience</p>
          <div className="experience-list">
            {experiences.map((exp, index) => (
              <div key={index}>
                <div className="experience-row">
                  <input
                    type="text"
                    placeholder="Enter position title"
                    value={exp.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={exp.company}
                    onChange={(e) => handleChange(index, "company", e.target.value)}
                  />
                  <div className="date-wrapper">
                    <label htmlFor={`startDate-${index}`} className="date-label">
                      Start Date
                    </label>
                    <input
                      id={`startDate-${index}`}
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="date-wrapper">
                    <label htmlFor={`endDate-${index}`} className="date-label">
                      End Date
                    </label>
                    <input
                      id={`endDate-${index}`}
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleChange(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>
                {experiences.length > 1 && (
                  <p className="remove-button" onClick={() => removeExperience(index)}>
                    <span className="minus-icon">−</span> Remove experience
                  </p>
                )}
              </div>
            ))}
            <p className="add-more" onClick={addExperience}>
              <span className="plus-icon">＋</span> Add another experience
            </p>
          </div>

          <div className="buttons">
            <button className="bck-button" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="nxt-button" onClick={() => navigate("/dashboard")}>Next</button>
          </div>
        </div>
      )}


      {/* SKILLSPHERE STEP */}
      {step === 6 && (
        <div className="skill-sphere-container">
          <div className="left-picture">
            <img src={GraphicandDesign} alt="SkillSphere Showcase" />
          </div>
          <div className="right-content">
            <h1>SkillSphere</h1>
            <p>
              Welcome to the world's largest freelancing marketplace.
              <br />
              Turning dreams into reality.
            </p>
            <button className="nxt-bttn" onClick={() => navigate("/dashboard")}>
              Save and Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingUpProfile;
