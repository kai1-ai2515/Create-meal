window.MEAL_SUPABASE_CONFIG = {
  url: 'https://yrgatpjebzjfnwynxowy.supabase.co',
  anonKey: 'sb_publishable_O1DL0Lmbdnl0ByUIbmIm0A_G362yQ5h'
};

window.mealSupabaseClient = window.supabase?.createClient && window.MEAL_SUPABASE_CONFIG.url && window.MEAL_SUPABASE_CONFIG.anonKey
  ? window.supabase.createClient(window.MEAL_SUPABASE_CONFIG.url, window.MEAL_SUPABASE_CONFIG.anonKey)
  : null;
