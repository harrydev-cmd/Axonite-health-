import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { registerPatient, getAllPatients } from "./lib/patients";
import { seedPatients } from "./lib/patientData";
import { initProtonSession, getSyncStatus } from "./lib/cloudStorage";

// Seed demo patients into localStorage on first load
seedPatients();

const staffUsers = [
  {
    email: "doctor@example.com",
    password: "doctor123",
    name: "Dr. Sarah Wilson",
  },
  {
    email: "shoko@example.com",
    password: "shoko123",
    name: "Dr. Shoko Ieiri",
    specialty: "Medical Specialist",
    affiliation: "Tokyo Jujutsu High",
  },
];

function App() {
  const [page, setPage] = useState("login");
  const [loginType, setLoginType] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // Initialize cloud sync on app load
  useEffect(() => {
    const initCloud = async () => {
      // Try to connect to Proton (optional - will fallback to localStorage)
      const session = await initProtonSession(email || 'demo@proton.me', 'demo');
      setSyncStatus(getSyncStatus());
    };
    initCloud();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (loginType === "staff") {
        const staffMatch = staffUsers.find(
          (s) => s.email === email && s.password === password
        );
        if (staffMatch) {
          setCurrentUser(staffMatch);
          setLoggedIn(true);
        } else {
          setError("Invalid staff credentials.");
        }
      } else {
        // Patient login — check against all stored patients
        const patients = await getAllPatients();
        const match = patients.find(
          (p) =>
            p.email.toLowerCase() === email.toLowerCase() &&
            p.password === password
        );

        if (match) {
          setCurrentUser(match);
          setLoggedIn(true);
        } else {
          setError("Invalid patient email or password.");
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    setEmail("");
    setPassword("");
  };

  if (loggedIn) {
    return loginType === "patient" ? (
      <PatientDashboard user={currentUser} logout={logout} />
    ) : (
      <StaffDashboard user={currentUser} logout={logout} />
    );
  }

  if (page === "register") {
    return <RegisterPage onBack={() => setPage("login")} />;
  }

  return (
    <div className="app">
      <div className="login-page">

        {/* LEFT SIDE */}
        <div className="login-visual">
          <div className="brand">
            <div className="brand-icon">+</div>
            <span>Axonite Health</span>
          </div>

          <div className="visual-content">
            <div className="medical-symbol">✚</div>

            <h1>
              Healthcare,
              <br />
              <span>simplified.</span>
            </h1>

            <p>
              A secure and intelligent platform for managing
              healthcare records, appointments, prescriptions
              and medical history.
            </p>

            <div className="feature-list">
              <div>
                <span>✓</span>
                Secure medical records
              </div>

              <div>
                <span>✓</span>
                Easy appointment management
              </div>

              <div>
                <span>✓</span>
                Connected healthcare
              </div>
            </div>
          </div>

          <div className="visual-footer">
            <span>●</span> Healthcare Management System
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-container">
          <div className="login-card">

            <div className="mobile-brand">
              <div className="brand-icon">+</div>
              <span>Axonite Health</span>
            </div>

            <div className="welcome">
              <span className="small-label">WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>
                Access your healthcare information securely.
              </p>
            </div>

            {/* LOGIN TYPE */}
            <div className="login-tabs">

              <button
                className={loginType === "patient" ? "active" : ""}
                onClick={() => {
                  setLoginType("patient");
                  setError("");
                }}
                type="button"
              >
                <span className="tab-icon">♙</span>
                <div>
                  <strong>Patient</strong>
                  <small>My health records</small>
                </div>
              </button>

              <button
                className={loginType === "staff" ? "active" : ""}
                onClick={() => {
                  setLoginType("staff");
                  setError("");
                }}
                type="button"
              >
                <span className="tab-icon">⚕</span>
                <div>
                  <strong>Doctor / Staff</strong>
                  <small>Clinical management</small>
                </div>
              </button>

            </div>

            <form onSubmit={handleLogin}>

              <div className="form-group">
                <label>
                  {loginType === "patient"
                    ? "Patient Email"
                    : "Staff Email"}
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    type="email"
                    placeholder={
                      loginType === "patient"
                        ? "patient@example.com"
                        : "doctor@example.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="password-label">
                  <label>Password</label>

                  <button type="button" className="forgot">
                    Forgot password?
                  </button>
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">◆</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  ⚠ {error}
                </div>
              )}

              <button className="login-button" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
                <span>→</span>
              </button>

            </form>

            <div className="security-note">
              <span>🔒</span>
              <div>
                <strong>Your information is protected</strong>
                <p>
                  This demo uses secure authentication architecture.
                </p>
              </div>
            </div>

            <div className="register-link">
              New patient?{" "}
              <button type="button" onClick={() => setPage("register")}>
                Create an account →
              </button>
            </div>

            <div className="demo-info">
              <strong>Demo credentials</strong>

              {loginType === "patient" ? (
                <p>
                  Email: patient@example.com
                  <br />
                  Password: patient123
                </p>
              ) : (
                <p>
                  Email: doctor@example.com
                  <br />
                  Password: doctor123
                </p>
              )}
            </div>

            <div className="login-footer">
              © 2026 Axonite Health · Privacy · Terms
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================
   PATIENT DASHBOARD
========================= */

function PatientDashboard({ user, logout }) {
  // Derive initials from name
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Format dob nicely if present
  const formattedDob = user.dob
    ? new Date(user.dob).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  // Last visit = most recent medical history entry
  const lastVisit =
    user.medicalHistory && user.medicalHistory.length > 0
      ? new Date(
          [...user.medicalHistory].sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
        ).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "—";

  const firstName = user.name.split(" ")[0];

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-icon">+</div>
          <span>Axonite Health</span>
        </div>

        <div className="header-user">
          <div className="avatar">{initials}</div>

          <div>
            <strong>{user.name}</strong>
            <small>Patient</small>
          </div>

          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">

        <div className="dashboard-heading">
          <div>
            <span className="small-label">PATIENT PORTAL</span>
            <h1>Good morning, {firstName} 👋</h1>
            <p>Here's an overview of your health information.</p>
          </div>

          <div className="health-status">
            <span>●</span> Health status: {user.healthStatus ?? "Stable"}
          </div>
        </div>

        <div className="patient-grid">

          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>

            <h2>{user.name}</h2>
            <p>Patient ID: {user.id ?? "—"}</p>

            <div className="profile-details">
              <div>
                <span>Date of Birth</span>
                <strong>{formattedDob}</strong>
              </div>

              <div>
                <span>Blood Group</span>
                <strong>{user.bloodGroup ?? "—"}</strong>
              </div>

              {user.allergies && (
                <div>
                  <span>Allergies</span>
                  <strong>{user.allergies}</strong>
                </div>
              )}

              {user.emergencyContact && (
                <div>
                  <span>Emergency Contact</span>
                  <strong>{user.emergencyContact}</strong>
                </div>
              )}

              <div>
                <span>Last Visit</span>
                <strong>{lastVisit}</strong>
              </div>
            </div>
          </div>

          <div className="medical-card">
            <div className="card-heading">
              <div>
                <span className="card-icon">♥</span>
                <h3>Medical History</h3>
              </div>
              <button>View all</button>
            </div>

            {user.medicalHistory && user.medicalHistory.length > 0 ? (
              [...user.medicalHistory]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((entry, i) => (
                  <div className="medical-entry" key={i}>
                    <div className="timeline-dot"></div>
                    <div>
                      <strong>{entry.title}</strong>
                      <span>
                        {new Date(entry.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <p>{entry.details}</p>
                    </div>
                  </div>
                ))
            ) : (
              <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 20 }}>
                No medical history recorded.
              </p>
            )}
          </div>

        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <span>Next Appointment</span>
            <strong>18 Sep</strong>
            <small>Dr. Sarah Wilson</small>
          </div>

          <div className="stat-card">
            <span>Prescriptions</span>
            <strong>{user.medications ? user.medications.length : 0}</strong>
            <small>Active medications</small>
          </div>

          <div className="stat-card">
            <span>Medical Records</span>
            <strong>{user.medicalHistory ? user.medicalHistory.length : 0}</strong>
            <small>Total entries</small>
          </div>

        </div>

      </main>
    </div>
  );
}


/* =========================
   STAFF DASHBOARD
========================= */

function StaffDashboard({ user, logout }) {
  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load patients from cloud on mount
  React.useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      try {
        const patients = await getAllPatients();
        setAllPatients(patients);
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const filtered = allPatients.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.idType.toLowerCase().includes(q)
    );
  });

  const idTypeLabel = {
    aadhaar: "Aadhaar Card",
    passport: "Passport",
    driving: "Driving Licence",
    voter: "Voter ID",
    pan: "PAN Card",
  };

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-icon">+</div>
          <span>Axonite Health</span>
        </div>

        <div className="header-user">
          <div className="avatar">SW</div>

          <div>
            <strong>{user.name}</strong>
            <small>Administrator</small>
          </div>

          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">

        <div className="dashboard-heading">
          <div>
            <span className="small-label">CLINICAL PORTAL</span>
            <h1>Good morning, Dr. Wilson 👋</h1>
            <p>Here's what's happening with your clinic today.</p>
          </div>
        </div>

        <div className="stats-grid staff-stats">
          <div className="stat-card">
            <span>Registered Patients</span>
            <strong>{allPatients.length}</strong>
            <small>Via registration portal</small>
          </div>

          <div className="stat-card">
            <span>Today's Appointments</span>
            <strong>32</strong>
            <small>+8.2% from last month</small>
          </div>

          <div className="stat-card">
            <span>Pending Lab Results</span>
            <strong>14</strong>
            <small>Requires attention</small>
          </div>

          <div className="stat-card">
            <span>Active Prescriptions</span>
            <strong>387</strong>
            <small>+6.7% from last month</small>
          </div>
        </div>

        {/* PATIENT RECORDS TABLE */}
        <div className="patient-records-card">
          <div className="records-header">
            <div>
              <span className="card-icon">⌕</span>
              <h2>Registered Patient Records</h2>
              <p>All patients who have registered through the portal.</p>
            </div>
            <div className="search-patient">
              <input
                placeholder="Search by name, email or ID type…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button onClick={() => setQuery("")}>Clear</button>
              )}
            </div>
          </div>

          {allPatients.length === 0 ? (
            <div className="records-empty">
              <span>📋</span>
              <p>No patients have registered yet.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="records-empty">
              <span>🔍</span>
              <p>No patients match "<strong>{query}</strong>".</p>
            </div>
          ) : (
            <div className="records-table-wrapper">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>ID Type</th>
                    <th>ID File</th>
                    <th>Registered</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id}>
                      <td className="row-num">{i + 1}</td>
                      <td>
                        <div className="table-patient-name">
                          <div className="table-avatar">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          {p.name}
                        </div>
                      </td>
                      <td>{p.email}</td>
                      <td>
                        <span className="id-badge">
                          {idTypeLabel[p.idType] ?? p.idType}
                        </span>
                      </td>
                      <td className="id-file-cell">
                        <span title={p.idFileName}>
                          📄 {p.idFileName.length > 22
                            ? p.idFileName.slice(0, 20) + "…"
                            : p.idFileName}
                        </span>
                      </td>
                      <td className="date-cell">
                        {new Date(p.registeredAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => setSelectedPatient(p)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* PATIENT DETAIL MODAL */}
      {selectedPatient && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedPatient(null)}
            >
              ✕
            </button>

            <div className="modal-avatar">
              {selectedPatient.name.charAt(0).toUpperCase()}
            </div>

            <h2>{selectedPatient.name}</h2>
            <p className="modal-id">ID: {selectedPatient.id.slice(0, 8).toUpperCase()}</p>

            <div className="modal-fields">
              <div>
                <span>Email</span>
                <strong>{selectedPatient.email}</strong>
              </div>
              <div>
                <span>Password</span>
                <strong className="password-dots">••••••••</strong>
              </div>
              <div>
                <span>ID Type</span>
                <strong>{idTypeLabel[selectedPatient.idType] ?? selectedPatient.idType}</strong>
              </div>
              <div>
                <span>ID File</span>
                <strong>{selectedPatient.idFileName}</strong>
              </div>
              <div>
                <span>Registered On</span>
                <strong>
                  {new Date(selectedPatient.registeredAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* =========================
   REGISTER PAGE
========================= */

function RegisterPage({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    idType: "aadhaar",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, or PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }
    setError("");
    setIdFile(file);
    if (file.type.startsWith("image/")) {
      setIdPreview(URL.createObjectURL(file));
    } else {
      setIdPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idFile) {
      setError("Please upload a valid ID proof.");
      return;
    }
    setError("");

    try {
      // Save the patient record to cloud/localStorage
      await registerPatient({
        name: form.name,
        email: form.email,
        password: form.password,
        idType: form.idType,
        idFileName: idFile.name,
      });

      setSubmitted(true);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="app">
        <div className="login-page">
          <div className="login-visual">
            <div className="brand">
              <div className="brand-icon">+</div>
              <span>Axonite Health</span>
            </div>
            <div className="visual-content">
              <div className="medical-symbol">✚</div>
              <h1>You're all<br /><span>set.</span></h1>
              <p>Your registration request has been submitted. Our team will verify your ID proof and activate your account within 24 hours.</p>
            </div>
            <div className="visual-footer"><span>●</span> Healthcare Management System</div>
          </div>
          <div className="login-container">
            <div className="login-card">
              <div className="register-success">
                <div className="success-icon">✓</div>
                <h2>Registration submitted</h2>
                <p>
                  We've received your details and ID proof for{" "}
                  <strong>{form.name}</strong>. You'll get a
                  confirmation once your account is verified.
                </p>
                <button className="login-button" onClick={onBack}>
                  Back to Sign in <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="login-page">

        {/* LEFT */}
        <div className="login-visual">
          <div className="brand">
            <div className="brand-icon">+</div>
            <span>Axonite Health</span>
          </div>
          <div className="visual-content">
            <div className="medical-symbol">✚</div>
            <h1>Join us<br /><span>today.</span></h1>
            <p>Create your patient account to access appointments, prescriptions, and your full medical history in one place.</p>
            <div className="feature-list">
              <div><span>✓</span> Verified patient identity</div>
              <div><span>✓</span> Secure ID document upload</div>
              <div><span>✓</span> Instant access after approval</div>
            </div>
          </div>
          <div className="visual-footer"><span>●</span> Healthcare Management System</div>
        </div>

        {/* RIGHT */}
        <div className="login-container">
          <div className="login-card">

            <div className="mobile-brand">
              <div className="brand-icon">+</div>
              <span>Axonite Health</span>
            </div>

            <div className="welcome">
              <span className="small-label">NEW PATIENT</span>
              <h2>Create your account</h2>
              <p>Fill in your details and upload a valid ID proof.</p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">◆</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* ID PROOF */}
              <div className="form-group">
                <label>ID Type</label>
                <div className="id-select-wrapper">
                  <select
                    name="idType"
                    value={form.idType}
                    onChange={handleChange}
                    className="id-select"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving">Driving Licence</option>
                    <option value="voter">Voter ID</option>
                    <option value="pan">PAN Card</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Upload ID Proof</label>
                <div
                  className={`id-upload-zone ${idFile ? "has-file" : ""}`}
                  onClick={() => fileRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dt = e.dataTransfer;
                    if (dt.files.length) {
                      handleFile({ target: { files: dt.files } });
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/jpeg,image/png,application/pdf"
                    style={{ display: "none" }}
                    onChange={handleFile}
                  />
                  {idFile ? (
                    <div className="id-upload-preview">
                      {idPreview ? (
                        <img src={idPreview} alt="ID preview" />
                      ) : (
                        <div className="pdf-icon">📄</div>
                      )}
                      <div className="id-upload-info">
                        <strong>{idFile.name}</strong>
                        <span>{(idFile.size / 1024).toFixed(0)} KB · {form.idType.charAt(0).toUpperCase() + form.idType.slice(1)}</span>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIdFile(null);
                            setIdPreview(null);
                            fileRef.current.value = "";
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="id-upload-placeholder">
                      <div className="upload-icon">⬆</div>
                      <strong>Click or drag to upload</strong>
                      <span>JPG, PNG or PDF · max 5 MB</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="error-message">⚠ {error}</div>
              )}

              <button className="login-button" type="submit">
                Register
                <span>→</span>
              </button>

            </form>

            <div className="register-link" style={{ marginTop: 20 }}>
              Already have an account?{" "}
              <button type="button" onClick={onBack}>
                Sign in →
              </button>
            </div>

            <div className="login-footer">
              © 2026 Axonite Health · Privacy · Terms
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


export default App;