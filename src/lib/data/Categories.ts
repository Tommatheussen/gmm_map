import { type Category, type CategoryDefinition, type CategoryGroup, type CategoryGroupId, type RawCategory } from '$lib/interfaces/Category';

export const CATEGORY_REGISTRY: Readonly<Record<string, CategoryDefinition>> = Object.freeze<Record<CategoryId, CategoryDefinition>>({
  food: { color: '#D7B456', fixed_id: 1, name: 'Food', z_index: 43 },
  drinks: { color: '#5A8E00', fixed_id: 2, name: 'Drinks', z_index: 42 },
  activities: { color: '#529CFF', fixed_id: 3, name: 'Activities', z_index: 41 },
  partners: { color: '#8354CF', fixed_id: 4, name: 'Partners', z_index: 40 },
  stages: { color: '#580025', fixed_id: 5, name: 'Stages', z_index: 38 },
  camping_grounds: { color: '#016752', fixed_id: 6, name: 'Camping Grounds', z_index: 7 },
  emergency_exits: { color: '#A32828', fixed_id: 7, name: 'Emergency Exits', z_index: 25 },
  water_fountains: { aliases: ['Free Tap Water'], color: '#57D7E7', fixed_id: 8, name: 'Water Fountains', z_index: 34 },
  first_aid: { color: '#FFFFFF', fixed_id: 9, name: 'First Aid', z_index: 36 },
  toilets: { color: '#1BA5D1', fixed_id: 10, name: 'Toilets', z_index: 35 },
  parking: { color: '#7A91AC', fixed_id: 11, name: 'Parking', z_index: 32 },
  shelter: { color: '#37A85E', fixed_id: 12, name: 'Shelter', z_index: 30 },
  check_in: { color: '#ABA083', fixed_id: 13, name: 'Check-in', z_index: 29 },
  showers: { color: '#5AD8FF', fixed_id: 14, name: 'Showers', z_index: 33 },
  charging_station: { color: '#FDDA27', fixed_id: 15, name: 'Charging Station', z_index: 28 },
  disabled_facilities: { aliases: ['Wheelchair Access'], color: '#5A8E21', fixed_id: 16, name: 'Disabled Facilities', z_index: 39 },
  vip: { color: '#B99946', fixed_id: 17, name: 'VIP', z_index: 27 },
  info: { color: '#4CC0C7', fixed_id: 18, name: 'Info', z_index: 26 },
  entrance: { color: '#8E0900', fixed_id: 19, name: 'Entrance', z_index: 22 },
  event_grounds: { aliases: ['Festival Grounds'], color: '#BBC200', fixed_id: 20, ground_layer: true, name: 'Event Grounds', z_index: 2 },
  walkway: { color: '#D0BE94', fixed_id: 21, name: 'Walkway', z_index: 12 },
  vouchers: { aliases: ['Tokens', 'Skullies'], color: '#6A8F71', fixed_id: 22, name: 'Vouchers', z_index: 24 },
  wristbands: { color: '#FFA44E', fixed_id: 23, name: 'Wristbands', z_index: 23 },
  bike_parking: { color: '#8DAA9D', fixed_id: 24, name: 'Bike Parking', z_index: 31 },
  lost_and_found: { color: '#C58EE2', fixed_id: 25, name: 'Lost & Found', z_index: 21 },
  ticketing: { color: '#D04D4D', fixed_id: 26, name: 'Ticketing', z_index: 20 },
  disability_parking: { color: '#505D6D', fixed_id: 27, name: 'Disability Parking', z_index: 19 },
  atm: { aliases: ['Cashless Helpdesk'], color: '#1F66B8', fixed_id: 28, name: 'ATM', z_index: 18 },
  kiss_and_ride: { color: '#F86274', fixed_id: 29, name: 'Kiss & Ride', z_index: 17 },
  merchandise: { aliases: ['Shops'], color: '#AA5E1B', fixed_id: 30, name: 'Merchandise', z_index: 16 },
  recycle_points: { aliases: ['Recycle Point'], color: '#7AA54F', fixed_id: 31, name: 'Recycle Points', z_index: 15 },
  lockers: { color: '#C94959', fixed_id: 32, name: 'Lockers', z_index: 37 },
  wifi_zone: { color: '#04052E', fixed_id: 33, name: 'WiFi Zone', z_index: 13 },
  general: { color: '#9AACAB', fixed_id: 34, name: 'General', z_index: 8 },
  grounds: { aliases: ['Ground'], color: '#8D8D8D', fixed_id: 35, ground_layer: true, name: 'Grounds', z_index: 1 },
  food_area_underground: { aliases: ['Food Corner Ground'], color: '#919600', fixed_id: 36, name: 'Food Area Underground', z_index: 4 },
  wooden_plates: { color: '#D0BE94', fixed_id: 37, name: 'Wooden Plates', z_index: 6 },
  metal_market: { color: '#6E8126', fixed_id: 38, name: 'Metal Market', z_index: 5 },
  shuttles: { color: '#D24905', fixed_id: 39, name: 'Shuttles', z_index: 14 },
  fences: { color: '#9E9E9E', fixed_id: 40, name: 'Fences', z_index: 30 },
  foodcorner: { color: '#D0D5E5', fixed_id: 41, name: 'Foodcorner', z_index: 10 },
  tribune: { aliases: ['Tent Tribune'], color: '#7D767E', fixed_id: 42, name: 'Tribune', z_index: 9 },
  crosses: { color: '#000000', fixed_id: 43, name: 'Crosses', z_index: 11 },
  light_green_camping_grounds: { aliases: ['Light Green Ground'], color: '#CADC8C', fixed_id: 44, ground_layer: true, name: 'Light Green Camping Grounds', z_index: 0 }
});

export type CategoryId = keyof typeof CATEGORY_REGISTRY;

export const CATEGORY_GROUP_REGISTRY: Readonly<Record<CategoryGroupId, string>> = Object.freeze({ camping: 'Camping test grounds' });

export const CATEGORY_GROUP_LIST = Object.freeze(
  Object.entries(CATEGORY_GROUP_REGISTRY).map<CategoryGroup>(([categoryGroupId, name]) => ({ category_group_id: categoryGroupId, name, category_ids: getCategoryGroupCategoryIds(categoryGroupId) }))
);

export function getCategoryGroupForCategory(categoryId: CategoryId): CategoryGroup | undefined {
  const groupId = CATEGORY_REGISTRY[categoryId]?.group_id;

  if (!groupId) return;

  return CATEGORY_GROUP_LIST.find((group) => group.category_group_id === groupId);
}

export function getCategoryGroupCategoryIds(groupId: CategoryGroupId): readonly CategoryId[] {
  return Object.entries(CATEGORY_REGISTRY)
    .filter(([, category]) => category.group_id === groupId)
    .map(([categoryId]) => categoryId as CategoryId);
}

export const OFFICIAL_FIXED_ID_MAPPINGS = Object.freeze(
  Object.entries(CATEGORY_REGISTRY).reduce<Record<number, CategoryId>>((mapping, [categoryId, category]) => {
    if (category.fixed_id !== undefined) {
      mapping[category.fixed_id] = categoryId as CategoryId;
    }

    return mapping;
  }, {})
);

export const CATEGORY_LAYER_MAPPINGS: Readonly<Record<string, Record<number, CategoryId>>> = Object.freeze<Record<number, Record<string, CategoryId>>>({
  // Sparse historical overrides for fixed IDs that were reused with a different meaning.
  2022: { 2503: 'first_aid' },
  2023: { 6169: 'first_aid' },
  2024: { 10560: 'camping_grounds' },
  2025: { 15487: 'camping_grounds', 15492: 'camping_grounds' },
  // Temporary raw layer ID mapping until 2026 fixed_id values are available.
  2026: {
    252: 'food',
    253: 'drinks',
    254: 'activities',
    255: 'partners',
    256: 'stages',
    257: 'camping_grounds',
    258: 'emergency_exits',
    259: 'water_fountains',
    260: 'first_aid',
    261: 'toilets',
    262: 'parking',
    263: 'shelter',
    264: 'check_in',
    265: 'showers',
    266: 'charging_station',
    267: 'disabled_facilities',
    268: 'vip',
    269: 'info',
    270: 'entrance',
    271: 'event_grounds',
    272: 'walkway',
    273: 'vouchers',
    274: 'wristbands',
    275: 'bike_parking',
    276: 'lost_and_found',
    277: 'ticketing',
    278: 'disability_parking',
    279: 'atm',
    280: 'kiss_and_ride',
    281: 'merchandise',
    282: 'recycle_points',
    283: 'lockers',
    284: 'wifi_zone',
    285: 'general',
    414: 'camping_grounds',
    415: 'camping_grounds',
    416: 'lockers',
    417: 'camping_grounds',
    418: 'camping_grounds',
    487: 'lockers',
    488: 'camping_grounds'
  }
});

export const CATEGORY_LIST = Object.freeze(
  Object.entries(CATEGORY_REGISTRY)
    .filter(([, data]) => !data.ground_layer)
    .map<Category>(([categoryId, data]) => ({ category_id: categoryId, ...data }))
    .sort((a, b) => b.z_index - a.z_index)
);

export const CATEGORY_GROUND_LAYER_LIST = Object.freeze(
  Object.entries(CATEGORY_REGISTRY)
    .filter(([, data]) => data.ground_layer)
    .map<Category>(([categoryId, data]) => ({ category_id: categoryId, ...data }))
    .sort((a, b) => b.z_index - a.z_index)
);

export function resolveCategoryId(rawCategory: RawCategory, year: string): CategoryId | undefined {
  const mappedCategory = CATEGORY_LAYER_MAPPINGS[year]?.[rawCategory.id];
  if (mappedCategory) {
    return mappedCategory;
  }

  if (rawCategory.fixed_id && OFFICIAL_FIXED_ID_MAPPINGS[rawCategory.fixed_id]) {
    return OFFICIAL_FIXED_ID_MAPPINGS[rawCategory.fixed_id];
  }

  return;
}
