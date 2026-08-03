export interface FIBCBagConfig {
  bagType: string;
  capacity: string;
  fabricColor: string;
  gsm: string;
  top: string;
  bottom: string;
  loopType: string;
  loopColor: string;
  printing: string;
  printingColor: string;
  printingPosition: string;
  accessories: string[];
  electrostaticType?: string;
  siftProofing?: string;
  baffleType?: string;
  linerType?: string;
  foodGrade?: boolean;
  unCertified?: boolean;
  baffle?: boolean;
  peLiner?: boolean;
  documentPouch?: boolean;
  dustProofStitching?: boolean;
  barcodeLabel?: boolean;
}

export interface GenerationResponse {
  id?: number;
  image_url: string;
  prompt: string;
  exploded_image_url?: string;
  exploded_prompt?: string;
  generation_time_sec: number;
  model_used: string;
  is_cached?: boolean;
  created_at?: string;
}

export interface HistoryItem {
  id: number;
  session_id: string;
  config_json: FIBCBagConfig;
  generated_prompt: string;
  image_url: string;
  model_used: string;
  is_favorite: boolean;
  generation_time_sec: number;
  created_at: string;
}

export interface SavedConfig {
  id: number;
  title: string;
  description?: string;
  config_json: FIBCBagConfig;
  thumbnail_url?: string;
  created_at: string;
}

export interface PresetTemplate {
  id: number;
  title: string;
  category: string;
  badge?: string;
  description: string;
  config_json: FIBCBagConfig;
  preview_image_url: string;
}

export interface PromptLogItem {
  id: number;
  timestamp: string;
  input_specs: FIBCBagConfig;
  compiled_prompt: string;
  status: string;
  latency_ms: number;
}

export interface ApiUsageStats {
  total_generations: number;
  gemini_api_calls: number;
  fallback_generations: number;
  active_key: boolean;
}

export type ActiveTab = 
  | 'configurator' 
  | 'dashboard' 
  | 'references'
  | 'history' 
  | 'templates' 
  | 'favorites' 
  | 'saved' 
  | 'admin' 
  | 'settings' 
  | 'help';
