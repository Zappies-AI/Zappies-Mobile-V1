// ./supabase/client.js
// This file centralizes your Supabase client setup.
//supabase/client.js

import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase credentials.
// You can find these in your Supabase project dashboard under Settings -> API.
const supabaseUrl = 'https://kyaaknsamvocksxzbasz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5YWFrbnNhbXZvY2tzeHpiYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDA3ODUsImV4cCI6MjA3MDQxNjc4NX0.Iv8rOwIvtvkkmgazE5z0caGHSf1WLo_VVx74PonyObk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
