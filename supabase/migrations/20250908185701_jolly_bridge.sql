/*
  # QuickBoost SMM Panel Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `balance` (decimal, default 0)
      - `total_orders` (integer, default 0)
      - `total_spent` (decimal, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `services`
      - `id` (integer, primary key)
      - `name` (text)
      - `platform` (text)
      - `category` (text)
      - `price` (decimal)
      - `min_order` (integer)
      - `max_order` (integer)
      - `description` (text)
      - `delivery_time` (text)
      - `rating` (decimal)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `service_id` (integer, references services)
      - `quantity` (integer)
      - `link` (text)
      - `amount` (decimal)
      - `status` (text, default 'pending')
      - `progress` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `deposits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `amount` (decimal)
      - `payment_method` (text)
      - `utr_number` (text, nullable)
      - `txid` (text, nullable)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for reading services (public)

  3. Functions
    - Function to create user profile on signup
    - Function to update user stats after order/deposit
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  balance decimal(10,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id serial PRIMARY KEY,
  name text NOT NULL,
  platform text NOT NULL,
  category text NOT NULL,
  price decimal(10,2) NOT NULL,
  min_order integer NOT NULL,
  max_order integer NOT NULL,
  description text NOT NULL,
  delivery_time text NOT NULL,
  rating decimal(2,1) DEFAULT 4.5,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  service_id integer REFERENCES services(id) NOT NULL,
  quantity integer NOT NULL,
  link text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('upi', 'crypto')),
  utr_number text,
  txid text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for services (public read)
CREATE POLICY "Anyone can read services"
  ON services
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create policies for orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for deposits
CREATE POLICY "Users can read own deposits"
  ON deposits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deposits"
  ON deposits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user stats after order
CREATE OR REPLACE FUNCTION update_user_stats_after_order()
RETURNS trigger AS $$
BEGIN
  -- Update user balance and stats
  UPDATE user_profiles 
  SET 
    balance = balance - NEW.amount,
    total_orders = total_orders + 1,
    total_spent = total_spent + NEW.amount,
    updated_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update stats after order
DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_after_order();

-- Function to update balance after deposit verification
CREATE OR REPLACE FUNCTION update_balance_after_deposit()
RETURNS trigger AS $$
BEGIN
  -- Only update if status changed to verified
  IF OLD.status != 'verified' AND NEW.status = 'verified' THEN
    UPDATE user_profiles 
    SET 
      balance = balance + NEW.amount,
      updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update balance after deposit verification
DROP TRIGGER IF EXISTS on_deposit_verified ON deposits;
CREATE TRIGGER on_deposit_verified
  AFTER UPDATE ON deposits
  FOR EACH ROW EXECUTE FUNCTION update_balance_after_deposit();

-- Insert sample services
INSERT INTO services (name, platform, category, price, min_order, max_order, description, delivery_time, rating) VALUES
-- Instagram Services
('Instagram Followers - High Quality', 'Instagram', 'Followers', 25.00, 100, 100000, 'Get high-quality Instagram followers from real accounts with profile pictures', '0-1 hours', 4.8),
('Instagram Likes - Instant', 'Instagram', 'Likes', 10.00, 50, 50000, 'Instant Instagram likes for your posts from active users', '0-30 minutes', 4.9),
('Instagram Views - Real', 'Instagram', 'Views', 5.00, 1000, 1000000, 'Real Instagram story/reel views from active users', '0-1 hours', 4.8),
('Instagram Comments - Custom', 'Instagram', 'Comments', 80.00, 10, 1000, 'Custom Instagram comments from real users', '1-6 hours', 4.6),

-- YouTube Services
('YouTube Views - Real', 'YouTube', 'Views', 5.00, 1000, 1000000, 'Real YouTube views from active users worldwide', '1-6 hours', 4.7),
('YouTube Subscribers', 'YouTube', 'Subscribers', 50.00, 50, 10000, 'High-quality YouTube subscribers with profile pictures', '0-2 hours', 4.6),
('YouTube Likes', 'YouTube', 'Likes', 15.00, 100, 50000, 'YouTube video likes from real users', '0-2 hours', 4.5),
('YouTube Comments', 'YouTube', 'Comments', 100.00, 5, 500, 'Custom YouTube comments from real users', '2-12 hours', 4.4),

-- Facebook Services
('Facebook Page Likes', 'Facebook', 'Likes', 10.00, 100, 50000, 'Facebook page likes from real users with active profiles', '1-3 hours', 4.5),
('Facebook Followers', 'Facebook', 'Followers', 30.00, 100, 25000, 'Facebook profile/page followers from real accounts', '1-4 hours', 4.3),

-- Twitter Services
('Twitter Followers', 'Twitter', 'Followers', 40.00, 100, 25000, 'High-quality Twitter followers from real accounts', '0-2 hours', 4.4),
('Twitter Likes', 'Twitter', 'Likes', 20.00, 50, 10000, 'Twitter post likes from active users', '0-1 hours', 4.5),
('Twitter Retweets', 'Twitter', 'Retweets', 35.00, 25, 5000, 'Twitter retweets from real active accounts', '0-2 hours', 4.3),

-- Telegram Services
('Telegram Members', 'Telegram', 'Members', 60.00, 100, 50000, 'Real Telegram channel/group members', '1-6 hours', 4.6),
('Telegram Views', 'Telegram', 'Views', 8.00, 500, 100000, 'Telegram post views from real users', '0-2 hours', 4.7),
('Telegram Reactions', 'Telegram', 'Reactions', 25.00, 50, 10000, 'Telegram post reactions from active users', '0-1 hours', 4.5),

-- LinkedIn Services
('LinkedIn Followers', 'LinkedIn', 'Followers', 80.00, 50, 10000, 'Professional LinkedIn followers from real accounts', '2-6 hours', 4.4),
('LinkedIn Likes', 'LinkedIn', 'Likes', 40.00, 25, 5000, 'LinkedIn post likes from professional users', '1-3 hours', 4.3),
('LinkedIn Connections', 'LinkedIn', 'Connections', 100.00, 10, 2000, 'LinkedIn connection requests from real professionals', '6-24 hours', 4.2),
('LinkedIn Views', 'LinkedIn', 'Views', 15.00, 100, 25000, 'LinkedIn profile/post views from active users', '0-2 hours', 4.5);