# Database Schema Documentation

## 📊 ภาพรวมโครงสร้างฐานข้อมูล

### 🎯 หลักการออกแบบ
- **Security First**: ใช้ Row Level Security (RLS) ทุก table
- **Audit Trail**: บันทึกการเปลี่ยนแปลงทุกอย่าง
- **Scalability**: ออกแบบรองรับการขยายตัว
- **Performance**: Index และ optimization ที่เหมาะสม

---

## 🗄️ Tables ที่มีอยู่ (Production)

### 1. `profiles` - ข้อมูลผู้ใช้งาน

\`\`\`sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  pdpa_consent BOOLEAN DEFAULT FALSE,
  pdpa_consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Indexes:**
- `profiles_pkey` (PRIMARY KEY)
- `profiles_email_key` (UNIQUE)

**RLS Policies:**
- Users can view/update their own profile only
- Admins can view all profiles

---

### 2. `assessments` - ผลการประเมินสุขภาพ

\`\`\`sql
CREATE TABLE assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id TEXT NOT NULL,
  category_title TEXT NOT NULL,
  answers JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
  risk_factors TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Indexes:**
- `assessments_pkey` (PRIMARY KEY)
- `idx_assessments_user_id` (user_id)
- `idx_assessments_category_id` (category_id)
- `idx_assessments_completed_at` (completed_at)

**RLS Policies:**
- Users can view/insert their own assessments only
- Doctors can view patient assessments (future)

---

### 3. `audit_logs` - บันทึกการใช้งาน

\`\`\`sql
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Indexes:**
- `audit_logs_pkey` (PRIMARY KEY)
- `idx_audit_logs_user_id` (user_id)
- `idx_audit_logs_created_at` (created_at)
- `idx_audit_logs_action` (action)

**RLS Policies:**
- Only admins can view audit logs
- System can insert logs

---

## 🔮 Tables ที่วางแผนไว้ (Future)

### 4. `doctor_profiles` - ข้อมูลแพทย์

\`\`\`sql
CREATE TABLE doctor_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  specialization TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  hospital_affiliation TEXT,
  consultation_fee DECIMAL(10,2),
  available_hours JSONB DEFAULT '{}',
  bio TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Planned Indexes:**
- `doctor_profiles_pkey` (PRIMARY KEY)
- `doctor_profiles_user_id_key` (UNIQUE)
- `doctor_profiles_license_number_key` (UNIQUE)
- `idx_doctor_profiles_specialization` (GIN index for array)
- `idx_doctor_profiles_verified` (verified)

---

### 5. `consultations` - การปรึกษาแพทย์

\`\`\`sql
CREATE TABLE consultations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  consultation_type TEXT DEFAULT 'video' CHECK (consultation_type IN ('video', 'chat', 'phone')),
  meeting_url TEXT,
  notes TEXT,
  prescription JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Planned Indexes:**
- `consultations_pkey` (PRIMARY KEY)
- `idx_consultations_patient_id` (patient_id)
- `idx_consultations_doctor_id` (doctor_id)
- `idx_consultations_scheduled_at` (scheduled_at)
- `idx_consultations_status` (status)

---

### 6. `health_records` - บันทึกสุขภาพ

\`\`\`sql
CREATE TABLE health_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL, -- 'vital_signs', 'lab_results', 'medication', 'symptoms'
  data JSONB NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT, -- 'manual', 'device', 'lab', 'doctor'
  verified_by UUID REFERENCES doctor_profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

---

### 7. `notifications` - การแจ้งเตือน

\`\`\`sql
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'assessment_reminder', 'consultation_reminder', 'health_alert'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

---

## 🔐 Security Implementation

### Row Level Security (RLS) Policies

#### Profiles Table
\`\`\`sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
\`\`\`

#### Assessments Table
\`\`\`sql
-- Users can view their own assessments
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own assessments
CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
\`\`\`

---

## 📈 Performance Optimization

### Current Indexes
\`\`\`sql
-- Assessments performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_category_id ON assessments(category_id);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at DESC);

-- Audit logs performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
\`\`\`

### Planned Optimizations
\`\`\`sql
-- Composite indexes for common queries
CREATE INDEX idx_assessments_user_category ON assessments(user_id, category_id, completed_at DESC);

-- Partial indexes for active records
CREATE INDEX idx_consultations_active ON consultations(scheduled_at) 
  WHERE status IN ('pending', 'confirmed');

-- GIN indexes for JSONB columns
CREATE INDEX idx_assessments_answers ON assessments USING GIN(answers);
CREATE INDEX idx_health_records_data ON health_records USING GIN(data);
\`\`\`

---

## 🔄 Data Migration Strategy

### Version Control
- All schema changes tracked in `/scripts/` folder
- Sequential numbering for migration files
- Rollback scripts for each migration

### Migration Files Structure
\`\`\`
scripts/
├── v1.0/
│   ├── 001-create-profiles.sql
│   ├── 002-create-assessments.sql
│   └── 003-setup-rls.sql
├── v1.1/
│   ├── 004-add-doctor-profiles.sql
│   └── 005-create-consultations.sql
└── rollback/
    ├── rollback-004.sql
    └── rollback-005.sql
\`\`\`

---

## 📊 Data Retention Policy

### Assessment Data
- **Retention**: 7 years (medical record standard)
- **Archival**: Move to cold storage after 2 years
- **Deletion**: Soft delete with audit trail

### Audit Logs
- **Retention**: 3 years (compliance requirement)
- **Compression**: Monthly aggregation after 1 year
- **Deletion**: Hard delete after retention period

### User Data
- **Active Users**: No deletion
- **Inactive Users**: Archive after 2 years of inactivity
- **Deleted Accounts**: 30-day grace period, then permanent deletion

---

## 🚨 Backup & Recovery

### Backup Strategy
- **Full Backup**: Daily at 2 AM UTC
- **Incremental**: Every 6 hours
- **Point-in-time Recovery**: 30 days
- **Geographic Replication**: Multi-region setup

### Recovery Procedures
1. **Data Corruption**: Point-in-time recovery
2. **Accidental Deletion**: Restore from backup
3. **System Failure**: Failover to replica
4. **Disaster Recovery**: Cross-region restore

---

*เอกสารนี้อัปเดตล่าสุด: ธันวาคม 2024*
