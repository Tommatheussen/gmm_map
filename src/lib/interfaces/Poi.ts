export interface Poi {
  id: number;
  name: string;
  category_id: number;
  type: 'polygon';
  coordinates: { lat: number; lng: number }[];
  deleted_at: Date;
  tags: PoiTag[];
}

export interface PoiTag {
  slug: string;
  name: string;
  category: string;
  priority: number;
  visible: boolean;
  filter: boolean;
  modified_at: string;
  color: string;
  text_color: string;
}
