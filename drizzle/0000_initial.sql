CREATE TABLE IF NOT EXISTS "settings" (
  "id" serial PRIMARY KEY,
  "key" text NOT NULL UNIQUE,
  "value" text NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "username" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "role" text NOT NULL DEFAULT 'staff',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "members" (
  "id" serial PRIMARY KEY,
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text NOT NULL,
  "address" text,
  "date_of_birth" date,
  "gender" text,
  "emergency_contact" text,
  "emergency_phone" text,
  "notes" text,
  "active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "membership_plans" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "description" text,
  "duration" integer NOT NULL,
  "price" text NOT NULL,
  "active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" serial PRIMARY KEY,
  "member_id" integer NOT NULL,
  "plan_id" integer NOT NULL,
  "start_date" text NOT NULL,
  "end_date" text NOT NULL,
  "status" text NOT NULL DEFAULT 'active',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "payments" (
  "id" serial PRIMARY KEY,
  "member_id" integer NOT NULL,
  "subscription_id" integer NOT NULL,
  "amount" text NOT NULL,
  "payment_date" text NOT NULL,
  "payment_method" text NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "attendance" (
  "id" serial PRIMARY KEY,
  "member_id" integer NOT NULL,
  "check_in_time" timestamp NOT NULL,
  "check_out_time" timestamp,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "equipment" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "category" text NOT NULL,
  "status" text NOT NULL DEFAULT 'operational',
  "notes" text,
  "purchase_date" text,
  "purchase_price" text,
  "maintenance_date" text,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "activity_logs" (
  "id" serial PRIMARY KEY,
  "action" text NOT NULL,
  "description" text NOT NULL,
  "entity_id" text,
  "entity_type" text,
  "timestamp" timestamp DEFAULT now()
);
