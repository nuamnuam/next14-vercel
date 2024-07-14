export interface SettingItem {
  category_id: number;
  created_at: string;
  encrypted: boolean;
  extra_data: [];
  id: number;
  key: string;
  position: number;
  section: 'global' | 'site';
  title: string;
  type: string;
  updated_at: string;
  value: string;
}
