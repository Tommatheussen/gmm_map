export interface Poi {
	id: number;
	name: string;
	category_id: number;
	type: 'polygon';
	coordinates: { lat: number; lng: number }[];
	deleted_at: Date;
}
