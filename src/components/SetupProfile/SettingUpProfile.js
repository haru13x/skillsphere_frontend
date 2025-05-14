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
import digitalMarketing from "../../assets/social-media-marketing.png";

const categories = [
  {
    name: "Graphic Design",
    icon: graphicDesign,
    submenu: ["Logo design", "T-shirt design", "Infographic design"],
  },
  {
    name: "Writing",
    icon: writing,
    submenu: ["Blog Writer", "Scriptwriter", "Copywriter"],
  },
  {
    name: "Translation & Editing",
    icon: translation,
    submenu: ["Document Translator", "Literary Translator", "Copy Editor"],
  },
  {
    name: "Digital Marketing",
    icon: digitalMarketing,
    submenu: [
      "Social Media Manager",
      "Content Creator",
      "Social Media Strategist",
    ],
  },
];

const SettingUpProfile = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState("");
  const [selected, setSelected] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const submenuRef = useRef(null);
  //   const [firstName, setFirstName] = useState("");
  //   const [lastName, setLastName] = useState("");

  const [experiences, setExperiences] = useState([
    { title: "", company: "", startDate: "", endDate: "" },
  ]);

  const handleBackClick = () => {
    if (step === "experience") setStep("skills");
    else if (step === "skills") setStep("birthdate");
    else if (step === "birthdate") setStep("about");
    else if (step === "about") setStep("profile");
    // else if (step === "profile") setStep("joinAs");
    else navigate("/");
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
          {/* <div className="back-arrow-joinas">
            <img
              src={backArrow}
              alt="Back"
              className="back-arrow"
              onClick={handleBackClick}
            />
          </div> */}
          <h2 className="joinas-title">Join as</h2>

          <div className="joinas-card-group">
            <div className="joinas-card" onClick={() => setStep(2)}>
              <div className="joinas-card-content">
                <img src={working} alt="Find Work" className="joinas-icon" />
                <span className="joinas-text">Find Work</span>
              </div>
              <ArrowRight className="joinas-arrow" />
            </div>

            <div className="joinas-card" onClick={() => setStep(3)}>
              <div className="joinas-card-content">
                <img src={talent} alt="Find Talent" className="joinas-icon" />
                <span className="joinas-text">Find Talent</span>
              </div>
              <ArrowRight className="joinas-arrow" />
            </div>
          </div>
        </div>
      )}

      {/* PROFILE STEP */}
      {/* {step === "profile" && (
        <div className="form-container">
          <div className="back-arrow-container">
            <img
              src={backArrow}
              alt="Back"
              className="back-arrow"
              onClick={handleBackClick}
            />
          </div>

          <div className="profile-image">
            <img src={profileIcon} alt="Profile Icon" />
          </div>

          <input
            type="text"
            placeholder="First name"
            className="frm-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last name"
            className="frm-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <button className="nxt-button" onClick={() => setStep("about")}>
            Next
          </button>
        </div>
      )} */}

      {/* ABOUT STEP */}
      {step === 2 && (
        <div className="about-container">
          <h2 className="form-title">Tell us about yourself</h2>

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

          <div className="buttons">
            <button className="bck-button" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="nxt-button" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* BIRTHDATE STEP */}
      {step === 3 && (
        <div className="birth-container">
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

          <div className="button-rows">
            <button className="bck-button" onClick={() => setStep(3)}>
              Back
            </button>
            <button className="nxt-button" onClick={() => setStep(4)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* SKILLS STEP */}
      {step === 4 && (
        <div className="skills-container">
          <h2>Tell us your skills</h2>
          <p className="subtitle">This helps us recommend jobs for you.</p>

          <div className="category-box-container">
            <div className="category-box">
              <h3 className="category-title">Category</h3>
              <div className="category-items-wrapper">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    className={`category-item ${
                      selected.includes(cat.name) ? "selected" : ""
                    }`}
                    onClick={() => handleCategoryClick(cat.name)}
                    style={{ position: "relative" }}
                  >
                    {activeSubmenu === cat.name && (
                      <div className="submenu submenu-above" ref={submenuRef}>
                        {cat.submenu.map((item) => (
                          <div
                            key={item}
                            className={`submenu-item ${
                              selected.includes(item) ? "selected-item" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubmenuItemClick(item);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="icon">
                      <img src={cat.icon} alt={cat.name} />
                    </div>
                    <div className="label">{cat.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="selected-skills-box">
            <div className="skills-selected-count">
              {selected.length} skills selected
            </div>
            {selected.length > 0 ? (
              <div className="selected-skills-list">
                {selected.map((skill) => (
                  <div key={skill} className="selected-skill-pill">
                    {skill}
                    <span
                      className="remove-skill"
                      onClick={() => toggleSkill(skill)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="add-skill-icon">+</div>
            )}
          </div>

          <div className="button-row">
            <button className="bck-button" onClick={() => setStep(3)}>
              Back
            </button>
            <button className="nxt-button" onClick={() => setStep(5)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* EXPERIENCE STEP */}
      {step === 5 && (
        <div className="experience-container">
          <div className="experience-header-block">
            <h2 className="experience-header">Add Experience</h2>
            <p className="experience-subtitle">Add Work Experience</p>
          </div>

          <div className="experience-scrollable">
            {experiences.map((exp, index) => (
              <div key={index}>
                <div className="experience-row">
                  <input
                    type="text"
                    placeholder="Enter position title"
                    value={exp.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={exp.company}
                    onChange={(e) =>
                      handleChange(index, "company", e.target.value)
                    }
                  />
                  <div className="date-wrapper">
                    <label
                      htmlFor={`startDate-${index}`}
                      className="date-label"
                    >
                      Start Date
                    </label>
                    <input
                      id={`startDate-${index}`}
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleChange(index, "startDate", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange(index, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>
                {experiences.length > 1 && (
                  <p
                    className="remove-button"
                    onClick={() => removeExperience(index)}
                  >
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
            <button className="bck-button" onClick={() => setStep(4)}>
              Back
            </button>
            <button className="nxt-button" onClick={() => setStep(6)}>
              Next
            </button>
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
