import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, UploadCloud, ChefHat, Activity, ClipboardList, ShoppingBag, Lightbulb } from 'lucide-react';
import './index.css';

const API_URL = "http://127.0.0.1:8000/generate";

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState({
    health_conditions: ["None"],
    allergies: "",
    diet: "Vegetarian",
    cuisine: "Any",
    mode: "Flexible"
  });

  const [isHealthDropdownOpen, setIsHealthDropdownOpen] = useState(false);
  const healthOptions = ["None", "Diabetes", "PCOS", "Hypertension", "Celiac", "Heart Disease"];

  const toggleHealthCondition = (condition) => {
    setProfile(prev => {
      const current = prev.health_conditions;
      if (condition === "None") {
        return { ...prev, health_conditions: ["None"] };
      }
      let newConditions = current.filter(c => c !== "None");
      if (newConditions.includes(condition)) {
        newConditions = newConditions.filter(c => c !== condition);
      } else {
        newConditions.push(condition);
      }
      if (newConditions.length === 0) newConditions = ["None"];
      return { ...prev, health_conditions: newConditions };
    });
  };

  const fileInputRef = useRef(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const resetApp = () => {
    setStep(1);
    setImageFile(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const options = Array.from(e.target.selectedOptions, option => option.value);
      setProfile(prev => ({ ...prev, [name]: options }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateMealPlan = async () => {
    setLoading(true);
    setError(null);
    nextStep(); // Go to step 4 (loading/results)

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("health_conditions", profile.health_conditions.length > 0 ? profile.health_conditions.join(", ") : "None");
    formData.append("allergies", profile.allergies || "None");
    formData.append("diet", profile.diet);
    formData.append("cuisine", profile.cuisine);
    formData.append("mode", profile.mode);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "error") {
        throw new Error(data.message);
      }
      
      setResults(data.data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div style={{ textAlign: 'center', paddingTop: '40px' }}>
      <div className="hero-title">🥗 SmartBite</div>
      <div className="hero-subtitle">Your personalized AI food companion. We turn your fridge into a gourmet restaurant.</div>
      
      <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: 'var(--shadow-md)' }}>
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          alt="Delicious healthy food" 
          style={{ width: '100%', maxHeight: '40vh', objectFit: 'cover', display: 'block' }}
        />
      </div>
      
      <button className="btn-primary" onClick={nextStep}>
        Get Started
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="hero-title" style={{ fontSize: '2rem' }}>What's cooking?</div>
      <div className="hero-subtitle">Upload a photo of your fridge or ingredients.</div>

      <input 
        type="file" 
        accept="image/jpeg, image/png, image/jpg" 
        style={{ display: 'none' }} 
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      <div 
        className={`upload-zone ${imageFile ? 'has-file' : ''}`}
        onClick={() => fileInputRef.current.click()}
      >
        <UploadCloud className="upload-icon" size={48} />
        {imageFile ? (
          <div>
            <h3 style={{ marginBottom: '8px', color: 'var(--success)' }}>Image Selected!</h3>
            <p style={{ color: 'var(--text-muted)' }}>{imageFile.name}</p>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '8px' }}>Tap to upload</h3>
            <p style={{ color: 'var(--text-muted)' }}>Supports JPG, PNG</p>
          </div>
        )}
      </div>

      {imagePreview && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
           <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      <button className="btn-primary" onClick={nextStep} disabled={!imageFile}>
        Next Step
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div className="hero-title" style={{ fontSize: '2rem' }}>Your Profile</div>
      <div className="hero-subtitle">Help us curate the perfect menu for you.</div>

      <div className="form-group" style={{ position: 'relative' }}>
        <label className="form-label">Health Conditions (Select multiple)</label>
        <div 
          className="form-select" 
          style={{ minHeight: '50px', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}
          onClick={() => setIsHealthDropdownOpen(!isHealthDropdownOpen)}
        >
          {profile.health_conditions.length === 0 ? <span style={{ color: 'var(--text-muted)' }}>Select conditions...</span> : null}
          {profile.health_conditions.map(cond => (
            <span key={cond} style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
              {cond} 
              <span 
                onClick={(e) => { e.stopPropagation(); toggleHealthCondition(cond); }} 
                style={{marginLeft: '6px', cursor: 'pointer', fontWeight: 'bold'}}
              >
                ×
              </span>
            </span>
          ))}
        </div>
        
        {isHealthDropdownOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', marginTop: '8px', zIndex: 10, boxShadow: 'var(--shadow-md)', maxHeight: '250px', overflowY: 'auto' }}>
            {healthOptions.map(option => (
              <div 
                key={option}
                onClick={() => toggleHealthCondition(option)}
                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', background: profile.health_conditions.includes(option) ? 'rgba(252, 128, 25, 0.1)' : 'transparent', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{option}</span>
                {profile.health_conditions.includes(option) && <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Allergies</label>
        <input 
          type="text" 
          className="form-input" 
          name="allergies"
          value={profile.allergies}
          onChange={handleProfileChange}
          placeholder="e.g. Peanuts, Shellfish (comma separated)"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Diet</label>
          <select className="form-select" name="diet" value={profile.diet} onChange={handleProfileChange}>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Cuisine</label>
          <select className="form-select" name="cuisine" value={profile.cuisine} onChange={handleProfileChange}>
            <option value="Any">Any</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Flexibility</label>
        <div className="radio-group">
          <label className="radio-label">
            <input 
              type="radio" 
              name="mode" 
              value="Strict" 
              checked={profile.mode === 'Strict'} 
              onChange={handleProfileChange} 
            />
            <span className="radio-button">Strict</span>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="mode" 
              value="Flexible" 
              checked={profile.mode === 'Flexible'} 
              onChange={handleProfileChange} 
            />
            <span className="radio-button">Flexible</span>
          </label>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <button className="btn-primary" onClick={generateMealPlan}>
          Generate Meal Plan
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Chefs at work...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Our AI is analyzing your ingredients and crafting a personalized menu.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="loading-container" style={{ height: 'auto', padding: '40px 0' }}>
          <div style={{ color: '#E23744', marginBottom: '16px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>Oops! Something went wrong.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
          <button className="btn-primary" onClick={resetApp} style={{ width: 'auto', padding: '12px 32px' }}>Try Again</button>
        </div>
      );
    }

    if (!results) return null;

    const ResultCard = ({ title, icon: Icon, content }) => (
      <div className="result-card">
        <div className="result-card-header">
          <Icon className="result-card-icon" size={24} />
          <h3 className="result-card-title">{title}</h3>
        </div>
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    );

    return (
      <div>
        <div className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '24px' }}>Your Menu is Ready</div>
        
        {results.tip && (
          <div className="tip-card">
            <div className="tip-card-icon">
              <Lightbulb size={24} color="white" />
            </div>
            <div className="tip-card-content">
              <p>{results.tip}</p>
            </div>
          </div>
        )}

        <ResultCard title="Detected Ingredients" icon={ShoppingBag} content={results.ingredients || "No ingredients detected."} />
        <ResultCard title="Health Analysis" icon={Activity} content={results.health} />
        <ResultCard title="Recipes" icon={ChefHat} content={results.recipes} />
        <ResultCard title="Nutritional Info" icon={Activity} content={results.nutrition} />
        <ResultCard title="7-Day Meal Plan" icon={ClipboardList} content={results.meal_plan} />
        <ResultCard title="Shopping List" icon={ShoppingBag} content={results.shopping} />
      </div>
    );
  };

  return (
    <div className="app-container">
      {step > 1 && step < 4 && (
        <header className="app-header">
          <button className="back-button" onClick={prevStep}>
            <ChevronLeft size={24} />
          </button>
          <div className="header-title">Step {step - 1} of 2</div>
        </header>
      )}
      
      {step === 4 && !loading && !error && (
        <header className="app-header">
          <button className="back-button" onClick={resetApp}>
            <ChevronLeft size={24} />
          </button>
          <div className="header-title">Start Over</div>
        </header>
      )}

      <main className="app-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </main>
    </div>
  );
}

export default App;
