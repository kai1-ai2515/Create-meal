window.MEAL_SUPABASE_CONFIG = {
  url: '',
  anonKey: ''
};

window.mealSupabaseClient = window.supabase?.createClient && window.MEAL_SUPABASE_CONFIG.url && window.MEAL_SUPABASE_CONFIG.anonKey
  ? window.supabase.createClient(window.MEAL_SUPABASE_CONFIG.url, window.MEAL_SUPABASE_CONFIG.anonKey)
  : null;