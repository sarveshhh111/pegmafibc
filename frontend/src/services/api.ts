import axios from 'axios';
import { 
  FIBCBagConfig, 
  GenerationResponse, 
  HistoryItem, 
  PresetTemplate, 
  SavedConfig, 
  PromptLogItem, 
  ApiUsageStats 
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/api'
    : 'https://pegmafibc.onrender.com/api'
);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

export const generateBagImage = async (config: FIBCBagConfig, sessionId = "default"): Promise<GenerationResponse> => {
  try {
    const targetUrl = `${API_BASE_URL}/generate`;
    console.log("[PEGMA API] Sending generation request to:", targetUrl);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        config,
        session_id: sessionId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GenerationResponse = await response.json();
    console.log("[PEGMA API] Generation SUCCESS! Model used:", data.model_used);
    return data;
  } catch (error) {
    console.warn("[PEGMA API] Fetch to Render backend encountered issue, using SVG visualizer:", error);
    const svgUrl = generateClientSvg(config);
    return {
      image_url: svgUrl,
      prompt: `Industrial product photograph of a ${config.capacity} Safe Working Load FIBC bulk bag. ${config.bagType} construction with ${config.fabricColor} fabric (${config.gsm}). ${config.loopType} loops in ${config.loopColor}. ${config.top} top, ${config.bottom} bottom. Printed '${config.printing}' logo on front. Clean studio lighting, white studio background.`,
      generation_time_sec: 0.8,
      model_used: "client-svg-fallback",
      is_cached: false
    };
  }
};

export const fetchHistory = async (search?: string, favoritesOnly = false): Promise<HistoryItem[]> => {
  try {
    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (favoritesOnly) params.favorites_only = true;
    const response = await apiClient.get<HistoryItem[]>('/history', { params });
    return response.data;
  } catch (error) {
    console.warn("Using local storage history fallback", error);
    const local = localStorage.getItem('pegma_history');
    return local ? JSON.parse(local) : [];
  }
};

export const toggleFavoriteItem = async (id: number): Promise<HistoryItem | null> => {
  try {
    const response = await apiClient.post<HistoryItem>(`/history/${id}/favorite`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteHistoryItem = async (id: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/history/${id}`);
    return true;
  } catch (error) {
    return false;
  }
};

export const clearHistory = async (): Promise<boolean> => {
  try {
    await apiClient.delete('/history');
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchTemplates = async (): Promise<PresetTemplate[]> => {
  try {
    const response = await apiClient.get<PresetTemplate[]>('/templates');
    return response.data;
  } catch (error) {
    return [
      {
        id: 1,
        title: "Pharma & Food Grade Bag",
        category: "Pharma / Food",
        badge: "Food Grade",
        description: "Ultra-clean room manufactured FIBC with food grade certification, PE inner liner, and dust-proof seals.",
        config_json: {
          bagType: "U-Panel",
          capacity: "1000 kg",
          fabricColor: "White",
          gsm: "180 GSM",
          top: "Duffle Top",
          bottom: "Discharge Spout",
          loopType: "Cross Corner",
          loopColor: "Blue",
          printing: "PEGMA Pharma",
          printingColor: "Blue",
          printingPosition: "Center Front",
          accessories: ["Food Grade", "PE Liner", "Document Pouch", "Dust Proof Stitching"]
        },
        preview_image_url: ""
      },
      {
        id: 2,
        title: "Chemical UN Certified Q-Bag",
        category: "Hazardous Chemicals",
        badge: "UN Hazardous",
        description: "Square-form Baffle Bag with internal baffles to prevent bulging. UN certified for hazardous powder transport.",
        config_json: {
          bagType: "Baffle Bag (Q-Bag)",
          capacity: "1250 kg",
          fabricColor: "White",
          gsm: "200 GSM",
          top: "Filling Spout",
          bottom: "Discharge Spout with Petal Closure",
          loopType: "Corner Loops",
          loopColor: "Black",
          printing: "PEGMA Chemical Spec",
          printingColor: "Red",
          printingPosition: "Center Front",
          accessories: ["UN Certified", "Baffle", "PE Liner", "Dust Proof Stitching", "Barcode"]
        },
        preview_image_url: ""
      }
    ];
  }
};

export const saveConfiguration = async (title: string, description: string, config: FIBCBagConfig): Promise<boolean> => {
  try {
    await apiClient.post('/saved-config', { title, description, config_json: config });
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchSavedConfigs = async (): Promise<SavedConfig[]> => {
  try {
    const response = await apiClient.get<SavedConfig[]>('/saved-config');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const fetchAdminLogs = async (): Promise<PromptLogItem[]> => {
  try {
    const response = await apiClient.get<PromptLogItem[]>('/admin/logs');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const fetchApiStats = async (): Promise<ApiUsageStats> => {
  try {
    const response = await apiClient.get<ApiUsageStats>('/admin/stats');
    return response.data;
  } catch (error) {
    return {
      total_generations: 12,
      gemini_api_calls: 8,
      fallback_generations: 4,
      active_key: false
    };
  }
};

export const setApiKey = async (key: string): Promise<boolean> => {
  try {
    await apiClient.post('/admin/set-key', null, { params: { api_key: key } });
    return true;
  } catch (error) {
    return false;
  }
};

// Client-side SVG fallback helper
function generateClientSvg(config: FIBCBagConfig): string {
  const loopColor = {
    "Blue": "#2563EB",
    "White": "#E5E7EB",
    "Black": "#1E293B",
    "Red": "#E53935",
    "Green": "#16A34A"
  }[config.loopColor] || "#2563EB";

  const printColor = {
    "Red": "#E53935",
    "Black": "#1A1A1A",
    "Blue": "#2563EB",
    "Green": "#16A34A"
  }[config.printingColor] || "#E53935";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <rect width="800" height="800" fill="#F8FAFC"/>
    <ellipse cx="400" cy="690" rx="220" ry="25" fill="#0F172A" opacity="0.1"/>
    
    <!-- Loops -->
    <path d="M 260 250 C 240 100, 320 90, 300 250" fill="none" stroke="${loopColor}" stroke-width="18" stroke-linecap="round"/>
    <path d="M 500 250 C 480 90, 560 100, 540 250" fill="none" stroke="${loopColor}" stroke-width="18" stroke-linecap="round"/>

    <!-- Bag Body -->
    <rect x="250" y="240" width="300" height="380" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3" rx="8"/>
    <path d="M 250 240 L 550 240 L 530 620 L 270 620 Z" fill="#F1F5F9" opacity="0.4"/>

    <!-- Seams -->
    <line x1="280" y1="240" x2="280" y2="620" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="4,4"/>
    <line x1="520" y1="240" x2="520" y2="620" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="4,4"/>

    <!-- Spout top -->
    ${config.top.includes("Duffle") ? '<path d="M 300 240 Q 400 200 500 240 Z" fill="#E2E8F0" stroke="#CBD5E1"/>' : ''}
    ${config.bottom.includes("Spout") ? '<rect x="360" y="620" width="80" height="50" fill="#E2E8F0" stroke="#CBD5E1"/>' : ''}

    <!-- Logo -->
    <g transform="translate(400, 420)">
      <ellipse cx="0" cy="-30" rx="50" ry="28" fill="${printColor}"/>
      <text x="0" y="-24" font-family="Inter, sans-serif" font-weight="bold" font-size="18" fill="#FFFFFF" text-anchor="middle">pegma</text>
      <text x="0" y="20" font-family="Inter, sans-serif" font-weight="bold" font-size="20" fill="#1E293B" text-anchor="middle">${config.printing || 'PEGMA'}</text>
      <text x="0" y="42" font-family="Inter, sans-serif" font-weight="bold" font-size="12" fill="#E53935" text-anchor="middle">SWL: ${config.capacity}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
