-- Enable RLS
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS public.profiles CASCADE;

ALTER TABLE IF EXISTS public.civic_reports DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS public.civic_reports CASCADE;

ALTER TABLE IF EXISTS public.report_updates DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS public.report_updates CASCADE;

-- Create enum types
CREATE TYPE public.report_status AS ENUM ('open', 'acknowledged', 'in-progress', 'resolved', 'closed');
CREATE TYPE public.report_category AS ENUM ('pothole', 'streetlight', 'water', 'garbage', 'drainage', 'traffic', 'park', 'other');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.user_role AS ENUM ('citizen', 'admin', 'department_head', 'field_officer');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone_number TEXT,
    address TEXT,
    role user_role NOT NULL DEFAULT 'citizen',
    department TEXT, -- For admin users
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create civic reports table
CREATE TABLE public.civic_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category report_category NOT NULL,
    priority priority_level NOT NULL DEFAULT 'medium',
    status report_status NOT NULL DEFAULT 'open',
    location_text TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    image_urls TEXT[] DEFAULT '{}',
    assigned_department TEXT,
    assigned_officer_id UUID REFERENCES auth.users(id),
    estimated_resolution_date DATE,
    actual_resolution_date DATE,
    citizen_rating INTEGER CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
    citizen_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report updates table for tracking progress
CREATE TABLE public.report_updates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID NOT NULL REFERENCES public.civic_reports(id) ON DELETE CASCADE,
    status report_status NOT NULL,
    message TEXT NOT NULL,
    updated_by UUID NOT NULL REFERENCES auth.users(id),
    internal_notes TEXT, -- Only visible to admin/officers
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_updates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'department_head')
    )
);

-- Civic reports policies
CREATE POLICY "Users can view their own reports" 
ON public.civic_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" 
ON public.civic_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports if open" 
ON public.civic_reports 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'open');

CREATE POLICY "Admins can view all reports" 
ON public.civic_reports 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'department_head', 'field_officer')
    )
);

CREATE POLICY "Admins can update all reports" 
ON public.civic_reports 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'department_head', 'field_officer')
    )
);

-- Report updates policies  
CREATE POLICY "Users can view updates for their reports" 
ON public.report_updates 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.civic_reports 
        WHERE id = report_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all updates" 
ON public.report_updates 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'department_head', 'field_officer')
    )
);

CREATE POLICY "Admins can create updates" 
ON public.report_updates 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'department_head', 'field_officer')
    )
);

-- Function to generate report numbers
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    sequence_num INTEGER;
    report_num TEXT;
BEGIN
    -- Get current year's last 2 digits
    year_suffix := TO_CHAR(NOW(), 'YY');
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(
        CAST(
            SUBSTRING(report_number FROM 'CF' || year_suffix || '(\d+)$') AS INTEGER
        )
    ), 0) + 1
    INTO sequence_num
    FROM public.civic_reports
    WHERE report_number LIKE 'CF' || year_suffix || '%';
    
    -- Format as CF + YY + 4-digit number
    report_num := 'CF' || year_suffix || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN report_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate report numbers
CREATE OR REPLACE FUNCTION set_report_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.report_number IS NULL OR NEW.report_number = '' THEN
        NEW.report_number := generate_report_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_report_number
    BEFORE INSERT ON public.civic_reports
    FOR EACH ROW
    EXECUTE FUNCTION set_report_number();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_civic_reports_updated_at
    BEFORE UPDATE ON public.civic_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user profile (this will need to be done after a user signs up)
-- The user must first sign up through the auth system, then we can update their profile

-- Create indexes for better performance
CREATE INDEX idx_civic_reports_user_id ON public.civic_reports(user_id);
CREATE INDEX idx_civic_reports_status ON public.civic_reports(status);
CREATE INDEX idx_civic_reports_category ON public.civic_reports(category);
CREATE INDEX idx_civic_reports_created_at ON public.civic_reports(created_at);
CREATE INDEX idx_report_updates_report_id ON public.report_updates(report_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);