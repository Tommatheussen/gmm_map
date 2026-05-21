import { type Category, type CategoryGroup, type CategoryGroupId, type CorrectedRawCategory } from '$lib/interfaces/Category';

// App-owned fixed IDs start at 10000 to avoid collisions with official GMM fixed_id values.
export const CATEGORY_LIST: readonly Category[] = Object.freeze(
  [
    { color: '#D7B456', fixed_id: 1, group_id: 'food_drink', name: 'Food', z_index: 43 },
    { color: '#5A8E00', fixed_id: 2, group_id: 'food_drink', name: 'Drinks', z_index: 42 },
    { color: '#529CFF', fixed_id: 3, group_id: 'festival', name: 'Activities', z_index: 41 },
    { color: '#8354CF', fixed_id: 4, group_id: 'festival', name: 'Partners', z_index: 40 },
    { color: '#580025', fixed_id: 5, group_id: 'festival', name: 'Stages', z_index: 38 },
    { color: '#016752', fixed_id: 6, group_id: 'camping', name: 'Camping Grounds', z_index: 7 },
    { color: '#A32828', fixed_id: 7, group_id: 'travel_access', name: 'Emergency Exits', z_index: 25 },
    { aliases: ['Free Tap Water'], color: '#57D7E7', fixed_id: 8, group_id: 'food_drink', name: 'Water Fountains', z_index: 34 },
    { color: '#FFFFFF', fixed_id: 9, group_id: 'festival', name: 'First Aid', z_index: 36 },
    { color: '#1BA5D1', fixed_id: 10, group_id: 'festival', name: 'Toilets', z_index: 35 },
    { color: '#7A91AC', fixed_id: 11, group_id: 'travel_access', name: 'Parking', z_index: 32 },
    { color: '#37A85E', fixed_id: 12, group_id: 'festival', name: 'Shelter', z_index: 30 },
    { color: '#ABA083', fixed_id: 13, group_id: 'travel_access', name: 'Check-in', z_index: 29 },
    { color: '#5AD8FF', fixed_id: 14, group_id: 'festival', name: 'Showers', z_index: 33 },
    { color: '#FDDA27', fixed_id: 15, group_id: 'festival', name: 'Charging Station', z_index: 28 },
    { aliases: ['Wheelchair Access'], color: '#5A8E21', fixed_id: 16, group_id: 'festival', name: 'Disabled Facilities', z_index: 39 },
    { color: '#B99946', fixed_id: 17, group_id: 'festival', name: 'VIP', z_index: 27 },
    { color: '#4CC0C7', fixed_id: 18, group_id: 'festival', name: 'Info', z_index: 26 },
    { color: '#8E0900', fixed_id: 19, group_id: 'travel_access', name: 'Entrance', z_index: 22 },
    { aliases: ['Festival Grounds'], color: '#BBC200', fixed_id: 20, group_id: 'map_areas', name: 'Event Grounds', z_index: 2 },
    { color: '#D0BE94', fixed_id: 21, group_id: 'travel_access', name: 'Walkway', z_index: 12 },
    { aliases: ['Tokens', 'Skullies'], color: '#6A8F71', fixed_id: 22, group_id: 'festival', name: 'Vouchers', z_index: 24 },
    { color: '#FFA44E', fixed_id: 23, group_id: 'festival', name: 'Wristbands', z_index: 23 },
    { color: '#8DAA9D', fixed_id: 24, group_id: 'travel_access', name: 'Bike Parking', z_index: 31 },
    { color: '#C58EE2', fixed_id: 25, group_id: 'festival', name: 'Lost & Found', z_index: 21 },
    { color: '#D04D4D', fixed_id: 26, group_id: 'festival', name: 'Ticketing', z_index: 20 },
    { color: '#505D6D', fixed_id: 27, group_id: 'travel_access', name: 'Disability Parking', z_index: 19 },
    { aliases: ['Cashless Helpdesk'], color: '#1F66B8', fixed_id: 28, group_id: 'festival', name: 'ATM', z_index: 18 },
    { color: '#F86274', fixed_id: 29, group_id: 'travel_access', name: 'Kiss & Ride', z_index: 17 },
    { aliases: ['Shops'], color: '#AA5E1B', fixed_id: 30, group_id: 'festival', name: 'Merchandise', z_index: 16 },
    { aliases: ['Recycle Point'], color: '#7AA54F', fixed_id: 31, group_id: 'festival', name: 'Recycle Points', z_index: 15 },
    { color: '#C94959', fixed_id: 32, group_id: 'festival', name: 'Lockers', z_index: 37 },
    { color: '#04052E', fixed_id: 33, group_id: 'festival', name: 'WiFi Zone', z_index: 13 },
    { color: '#9AACAB', fixed_id: 34, group_id: 'other', name: 'General', z_index: 8 },
    { aliases: ['Ground'], color: '#8D8D8D', fixed_id: 35, group_id: 'map_areas', name: 'Grounds', z_index: 1 },
    { aliases: ['Food Corner Ground'], color: '#919600', fixed_id: 36, group_id: 'map_areas', name: 'Food Area Underground', z_index: 4 },
    { color: '#D0BE94', fixed_id: 37, group_id: 'other', name: 'Wooden Plates', z_index: 6 },
    { color: '#6E8126', fixed_id: 38, group_id: 'festival', name: 'Metal Market', z_index: 5 },
    { color: '#D24905', fixed_id: 39, group_id: 'travel_access', name: 'Shuttles', z_index: 14 },
    { color: '#9E9E9E', fixed_id: 40, group_id: 'other', name: 'Fences', z_index: 30 },
    { color: '#D0D5E5', fixed_id: 41, group_id: 'festival', name: 'Foodcorner', z_index: 10 },
    { aliases: ['Tent Tribune'], color: '#7D767E', fixed_id: 42, group_id: 'other', name: 'Tribune', z_index: 9 },
    { color: '#000000', fixed_id: 43, group_id: 'other', name: 'Crosses', z_index: 11 },
    { aliases: ['Light Green Ground'], color: '#CADC8C', fixed_id: 44, group_id: 'map_areas', name: 'Light Green Camping Grounds', z_index: 0 },
    { aliases: ['Camping Ground Friends Zones'], color: '#ffcc00', fixed_id: 10000, group_id: 'camping', name: 'Friends Zone', z_index: 0 },
    { aliases: ['Camping Ground CBY Festitent'], color: '#6b6342', fixed_id: 10001, group_id: 'camping', name: 'Festitent', z_index: 0 },
    { color: '#6b6342', fixed_id: 10002, group_id: 'camping', name: 'Festihut', z_index: 0 },
    { aliases: ['Camping ground Boutique'], color: '#ffcc00', fixed_id: 10003, group_id: 'camping', name: 'Boutique Tents', z_index: 0 },
    { color: '#ffcc00', fixed_id: 10004, group_id: 'camping', name: 'Metal Town', z_index: 0 },
    { aliases: ['The Crypt Camping Ground'], color: '#ffcc00', fixed_id: 10005, group_id: 'camping', name: 'The Crypt', z_index: 0 }
  ].sort((a, b) => b.z_index - a.z_index)
);

const CATEGORY_GROUP_REGISTRY: Readonly<Record<CategoryGroupId, string>> = Object.freeze({
  food_drink: 'Food & Drink',
  festival: 'Festival',
  camping: 'Camping',
  travel_access: 'Travel & Access',
  other: 'Other',
  map_areas: 'Map Areas'
});

export const CATEGORY_GROUP_LIST = Object.freeze(Object.entries(CATEGORY_GROUP_REGISTRY).map<CategoryGroup>(([categoryGroupId, name]) => ({ category_group_id: categoryGroupId, name })));

export const FIXED_ID_CATEGORY_REGISTRY = Object.freeze(
  CATEGORY_LIST.reduce<Record<number, Category>>((mapping, category) => {
    mapping[category.fixed_id] = category;

    return mapping;
  }, {})
);

export function resolveCategory(rawCategory: CorrectedRawCategory): Category | undefined {
  return FIXED_ID_CATEGORY_REGISTRY[rawCategory.fixed_id];
}
