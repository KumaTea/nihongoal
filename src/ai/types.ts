export type ConnectionProfile = { endpoint: string; model: string; token: string; protocol: 'openai-compatible'; separateImageProvider?: boolean; imageEndpoint?: string; imageModel?: string; imageToken?: string };
export type ConnectionResult = { ok: boolean; message: string };
