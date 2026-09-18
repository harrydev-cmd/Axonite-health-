/**
 * patientData.js
 *
 * Static seed data for pre-existing patients.
 * Call seedPatients() once at app startup to populate localStorage.
 */

export const seedPatientData = [
  {
    id: "P001",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    password: "patient123",
    healthStatus: "Stable",
    bloodGroup: "O+",
    emergencyContact: "Jamie Johnson",
    allergies: "None",
    idType: "passport",
    idFileName: "alex_passport.jpg",
    dob: "1998-05-14",
    phone: "+91 98765 43210",
    address: "12, MG Road, Bengaluru, Karnataka",
    registeredAt: "2026-01-10T09:30:00.000Z",
    medicalHistory: [
      {
        title: "General Checkup",
        date: "2026-09-08",
        details: "Routine health examination. No major abnormalities detected.",
      },
      {
        title: "Blood Test",
        date: "2026-08-02",
        details: "Complete blood count and metabolic panel. Results normal.",
      },
      {
        title: "Dental Checkup",
        date: "2026-06-15",
        details: "Routine dental examination. No cavities found.",
      },
    ],
    medications: [
      { name: "Vitamin D3", status: "Daily" },
      { name: "Omega-3", status: "Daily" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P002",
    name: "Kyoko Hori",
    email: "kyoko@example.com",
    password: "kyoko123",
    healthStatus: "Stable",
    bloodGroup: "A+",
    emergencyContact: "Kyosuke Hori",
    allergies: "Pollen",
    idType: "passport",
    idFileName: "kyoko_passport.jpg",
    dob: "2000-06-06",
    phone: "+81 90-1234-5678",
    address: "3-5 Sakura Street, Shibuya, Tokyo",
    registeredAt: "2026-03-12T10:00:00.000Z",
    medicalHistory: [
      {
        title: "Seasonal Allergies",
        date: "2025-04-18",
        details: "Mild seasonal allergies. No major complications reported.",
      },
      {
        title: "Minor Ankle Sprain",
        date: "2025-09-07",
        details: "Minor right ankle sprain. Fully recovered after rest and physiotherapy.",
      },
    ],
    medications: [
      { name: "Cetirizine", status: "As needed" },
      { name: "Paracetamol 500mg", status: "As needed" },
      { name: "Aspirin 75mg", status: "As needed" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P003",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    password: "priya2026",
    healthStatus: "Under Observation",
    bloodGroup: "A+",
    emergencyContact: "Rahul Sharma",
    allergies: "Penicillin",
    idType: "passport",
    idFileName: "priya_passport.pdf",
    dob: "1995-11-22",
    phone: "+91 91234 56789",
    address: "45, Linking Road, Mumbai, Maharashtra",
    registeredAt: "2026-02-03T11:15:00.000Z",
    medicalHistory: [
      {
        title: "Hypertension Diagnosis",
        date: "2026-01-15",
        details: "Mild hypertension detected. Started on low-dose medication.",
      },
      {
        title: "Follow-up Checkup",
        date: "2026-04-20",
        details: "Blood pressure improving. Continue current medication.",
      },
    ],
    medications: [
      { name: "Amlodipine 5mg", status: "Daily" },
      { name: "Aspirin 75mg", status: "Daily" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P004",
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    password: "ravi@secure1",
    healthStatus: "Stable",
    bloodGroup: "B+",
    emergencyContact: "Sunita Kumar",
    allergies: "Dust",
    idType: "passport",
    idFileName: "ravi_passport.png",
    dob: "1990-07-08",
    phone: "+91 87654 32109",
    address: "78, Anna Nagar, Chennai, Tamil Nadu",
    registeredAt: "2026-02-18T08:45:00.000Z",
    medicalHistory: [
      {
        title: "Asthma Review",
        date: "2026-03-10",
        details: "Mild persistent asthma. Inhaler usage reviewed and adjusted.",
      },
    ],
    medications: [
      { name: "Salbutamol Inhaler", status: "As needed" },
      { name: "Fluticasone Inhaler", status: "Twice daily" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P005",
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    password: "sneha#456",
    healthStatus: "Stable",
    bloodGroup: "AB-",
    emergencyContact: "Nikhil Patel",
    allergies: "None",
    idType: "passport",
    idFileName: "sneha_passport.jpg",
    dob: "2001-03-30",
    phone: "+91 99887 76655",
    address: "9, Satellite Road, Ahmedabad, Gujarat",
    registeredAt: "2026-03-05T14:00:00.000Z",
    medicalHistory: [
      {
        title: "Annual Physical",
        date: "2026-05-22",
        details: "All vitals normal. No concerns.",
      },
    ],
    medications: [],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P006",
    name: "Mohammed Irfan",
    email: "irfan.m@example.com",
    password: "irfan2026!",
    healthStatus: "Requires Attention",
    bloodGroup: "O-",
    emergencyContact: "Fatima Irfan",
    allergies: "Sulfa drugs",
    idType: "passport",
    idFileName: "irfan_passport.pdf",
    dob: "1987-09-15",
    phone: "+91 93456 78901",
    address: "33, Banjara Hills, Hyderabad, Telangana",
    registeredAt: "2026-03-22T10:20:00.000Z",
    medicalHistory: [
      {
        title: "Type 2 Diabetes Diagnosis",
        date: "2025-11-10",
        details: "Fasting blood sugar elevated. Started on Metformin.",
      },
      {
        title: "HbA1c Review",
        date: "2026-05-14",
        details: "HbA1c at 7.8%. Diet counselling provided.",
      },
    ],
    medications: [
      { name: "Metformin 500mg", status: "Twice daily" },
      { name: "Glimepiride 1mg", status: "Daily" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P007",
    name: "Ananya Nair",
    email: "ananya.nair@example.com",
    password: "ananya789",
    healthStatus: "Stable",
    bloodGroup: "A-",
    emergencyContact: "Suresh Nair",
    allergies: "Latex",
    idType: "passport",
    idFileName: "ananya_passport.jpg",
    dob: "2000-12-01",
    phone: "+91 82345 67890",
    address: "22, Palarivattom, Kochi, Kerala",
    registeredAt: "2026-04-11T16:30:00.000Z",
    medicalHistory: [
      {
        title: "Thyroid Panel",
        date: "2026-02-28",
        details: "TSH slightly elevated. Monitoring every 6 months.",
      },
    ],
    medications: [
      { name: "Levothyroxine 25mcg", status: "Daily" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P008",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    password: "arjun@pass",
    healthStatus: "Stable",
    bloodGroup: "B-",
    emergencyContact: "Pooja Mehta",
    allergies: "None",
    idType: "passport",
    idFileName: "arjun_passport.png",
    dob: "1993-06-25",
    phone: "+91 70123 45678",
    address: "5, Connaught Place, New Delhi",
    registeredAt: "2026-05-07T09:00:00.000Z",
    medicalHistory: [
      {
        title: "Sports Injury - Knee",
        date: "2026-04-03",
        details: "Ligament strain in left knee during football. Physiotherapy recommended.",
      },
      {
        title: "Physiotherapy Review",
        date: "2026-06-18",
        details: "Good recovery progress. Cleared for light activity.",
      },
    ],
    medications: [
      { name: "Ibuprofen 400mg", status: "As needed" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P009",
    name: "Divya Reddy",
    email: "divya.reddy@example.com",
    password: "divya#321",
    healthStatus: "Stable",
    bloodGroup: "AB+",
    emergencyContact: "Vikram Reddy",
    allergies: "None",
    idType: "passport",
    idFileName: "divya_passport.jpg",
    dob: "1997-02-14",
    phone: "+91 96543 21098",
    address: "17, Jubilee Hills, Hyderabad, Telangana",
    registeredAt: "2026-06-01T13:45:00.000Z",
    medicalHistory: [
      {
        title: "Migraine Consultation",
        date: "2026-05-30",
        details: "Recurrent migraines. Trigger tracking and preventive therapy started.",
      },
    ],
    medications: [
      { name: "Sumatriptan 50mg", status: "As needed" },
      { name: "Propranolol 40mg", status: "Daily" },
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P010",
    name: "Izumi Miyamura",
    email: "izumi@example.com",
    password: "izumi123",
    healthStatus: "Good",
    bloodGroup: "O+",
    emergencyContact: "Kyoko Hori",
    allergies: "None reported",
    idType: "passport",
    idFileName: "izumi_passport.jpg",
    dob: "2000-10-17",
    phone: "+81 90-9876-5432",
    address: "7-2 Hanakomachi, Shinjuku, Tokyo",
    registeredAt: "2026-04-05T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Routine Health Checkup",
        date: "2026-01-22",
        details: "Routine examination completed. No significant health concerns found.",
      },
      {
        title: "Minor Hand Injury",
        date: "2025-11-14",
        details: "Minor hand injury treated with basic wound care. Fully recovered.",
      },
    ],
    medications: [
      { name: "Ibuprofen 400mg", status: "As needed" }
    ],
    implants: { type: "None", count: 0 },
  },

  {
    id: "P011",
    name: "Yuki Yoshikawa",
    email: "yuki.yoshikawa@example.com",
    password: "yuki123",
    healthStatus: "Stable",
    bloodGroup: "B+",
    emergencyContact: "MIKI Yoshikawa",
    allergies: "None reported",
    idType: "passport",
    idFileName: "yuki_passport.jpg",
    dob: "2008-07-15",
    phone: "+81 90-1111-1111",
    address: "Yoshikawa Residence, Tokyo",
    registeredAt: "2026-04-12T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Routine School Health Check",
        date: "2026-04-12",
        details: "Routine health examination with no significant findings."
      },
      {
        title: "Back Injury",
        date: "2026-09-05",
        details: "Minor back injury sustained during physical activity. Prescribed rest and pain management."
      }
    ],
    medications: [
      { name: "Ibuprofen 400mg", status: "As needed" }
    ],
    implants: {
      type: "None",
      count: 0
    }
  },

  {
    id: "P012",
    name: "Tooru Ishikawa",
    email: "tooru.ishikawa@example.com",
    password: "tooru123",
    healthStatus: "Stable",
    bloodGroup: "A-",
    emergencyContact: "Ayane Ishikawa",
    allergies: "None reported",
    idType: "passport",
    idFileName: "tooru_passport.jpg",
    registeredAt: "2026-04-15T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Sports Health Check",
        date: "2026-04-15",
        details: "Routine examination following school sports activities."
      }
    ],
    medications: [],
    implants: {
      type: "None",
      count: 0
    }
  },

  {
    id: "P013",
    name: "Kakeru Sengoku",
    email: "kakeru.sengoku@example.com",
    password: "sengoku123",
    healthStatus: "Stable",
    bloodGroup: "AB+",
    emergencyContact: "Kozue Sengoku",
    allergies: "None reported",
    idType: "passport",
    idFileName: "kakeru_passport.jpg",
    registeredAt: "2026-04-18T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Annual Health Examination",
        date: "2026-04-18",
        details: "Routine school medical examination."
      }
    ],
    medications: [],
    implants: {
      type: "None",
      count: 0
    }
  },

  {
    id: "P014",
    name: "Remi Ayasaki",
    email: "remi.ayasaki@example.com",
    password: "remi123",
    healthStatus: "Stable",
    bloodGroup: "B+",
    emergencyContact: "Ken Ayasaki",
    allergies: "None reported",
    idType: "passport",
    idFileName: "remi_passport.jpg",
    registeredAt: "2026-04-20T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Routine Health Check",
        date: "2026-04-20",
        details: "Routine school health assessment."
      }
    ],
    medications: [
      { name: "Ibuprofen 400mg", status: "As needed" }
    ],
    implants: {
      type: "None",
      count: 0
    }
  },

  {
    id: "P015",
    name: "Sakura Kono",
    email: "sakura.kono@example.com",
    password: "sakura123",
    healthStatus: "Stable",
    bloodGroup: "A+",
    emergencyContact: "Shintaro Kono",
    allergies: "None reported",
    idType: "passport",
    idFileName: "sakura_passport.jpg",
    registeredAt: "2026-04-22T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Routine Health Check",
        date: "2026-04-22",
        details: "Routine school medical examination."
      }
    ],
    medications: [
      { name: "Ibuprofen 400mg", status: "As needed" }
    ],
    implants: {
      type: "None",
      count: 0
    }
  },

  {
    id: "P016",
    name: "Shu Iura",
    email: "shu.iura@example.com",
    password: "shu123",
    healthStatus: "Stable",
    bloodGroup: "O+",
    emergencyContact: "Modoko Iura",
    allergies: "None reported",
    idType: "passport",
    idFileName: "shu_passport.jpg",
    registeredAt: "2026-04-25T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Routine Health Check",
        date: "2026-04-25",
        details: "Routine school health assessment."
      }
    ],
    medications: [],
    implants: {
      type: "None",
      count: 0
    }
  },

  {
    id: "P017",
    name: "Akane Yanagi",
    email: "akane.yanagi@example.com",
    password: "akane123",
    healthStatus: "Stable",
    bloodGroup: "AB-",
    emergencyContact: "Modoru Yannagi",
    allergies: "None reported",
    idType: "passport",
    idFileName: "akane_passport.jpg",
    registeredAt: "2026-04-28T08:00:00.000Z",
    medicalHistory: [
      {
        title: "Routine Health Check",
        date: "2026-04-28",
        details: "Routine school medical examination."
      }
    ],
    medications: [],
    implants: {
      type: "None",
      count: 0
    }
  },
];

const STORAGE_KEY = "axonite_patients";
const SEEDED_KEY = "axonite_seeded";

/**
 * Seeds localStorage with the static patient data on first run.
 * Always merges new patients from seedPatientData that aren't already stored,
 * so adding new patients to this file takes effect without manual cache clearing.
 */
export function seedPatients() {
  const existing = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  })();

  const existingIds = new Set(existing.map((p) => p.id));
  const newPatients = seedPatientData.filter((p) => !existingIds.has(p.id));

  if (newPatients.length > 0) {
    const merged = [...existing, ...newPatients];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  // Keep the seeded flag so we don't re-run unnecessarily on future loads
  // when there are no new patients to add
  localStorage.setItem(SEEDED_KEY, "true");
}
