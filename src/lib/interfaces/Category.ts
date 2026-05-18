import type { CategoryId } from '$lib/data/Categories';

interface CategoryFields {
  name: string;
  z_index: number;
  color: string;
}

export interface RawCategory extends CategoryFields {
  id: number;
  fixed_id?: number;
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

export interface CategoryDefinition extends CategoryFields {
  fixed_id?: number;
  ground_layer?: boolean;
  aliases?: readonly string[];
}

export interface Category extends CategoryDefinition {
  category_id: CategoryId;
}

export interface YearCategory extends Category {
  id: number; // The original category ID from the year's data, preserved for mapping POIs.
}
