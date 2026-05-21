export interface Poi {
  id: number;
  name: string;
  category_id: number;
  published: boolean;
  type: 'polygon';
  coordinates: { lat: number; lng: number }[];
  deleted_at?: string | null;
  tags: PoiTag[];
}

export type PoiOverride = Partial<Pick<Poi, 'name' | 'category_id' | 'deleted_at' | 'tags'>>;

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
