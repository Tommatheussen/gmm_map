interface BaseCategory {
  name: string;
  z_index: number;
  color: string;
}

export interface RawCategory extends BaseCategory {
  id: number;
  fixed_id: number;
  type: string;
  priority: number;
  clickable: boolean;
  min_zoom_level: number;
  max_zoom_level: number;
  show_polygon: boolean;
  border: boolean;
  show_marker: boolean;
  show_in_list: boolean;
  modified_at: Date;
  show_in_filter: boolean;
}

export interface FixedCategory extends BaseCategory {
  ground_layer?: boolean;
}

export interface Category extends FixedCategory {
  id: string;
  fixed_id: string;
}
