export interface RawCategory {
  id: number;
  fixed_id: number;
  name: string;
  type: string;
  priority: number;
  clickable: boolean;
  z_index: number;
  min_zoom_level: number;
  max_zoom_level: number;
  color: string;
  show_polygon: boolean;
  border: boolean;
  show_marker: boolean;
  show_in_list: boolean;
  modified_at: Date;
  show_in_filter: boolean;
}

export interface FixedCategory {
  name: string;
  z_index: number;
  color: string;
  ground: boolean;
}

export interface Category {
  id: number;
  static_id: number;
  label: string;
  z_index: number;
  color: string;
  ground_layer: boolean;
}
