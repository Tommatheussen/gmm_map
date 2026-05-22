import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import {
  CATEGORY_GROUP_LIST,
  CATEGORY_LIST,
  FIXED_ID_CATEGORY_REGISTRY,
  resolveCategory
} from '../src/lib/data/Categories.ts';
import { applyLayerOverrides, applyPoiOverrides } from '../src/lib/data/Overrides.ts';
import {
  Category,
  CorrectedRawCategory,
  DataOverrides,
  LayerOverride,
  RawCategory
} from '../src/lib/interfaces/Category.ts';
import type { Poi, PoiOverride, PoiTag } from '../src/lib/interfaces/Poi.ts';

const dataRoot = resolve('static');
const yearsFile = join(dataRoot, 'years.json');

if (!existsSync(yearsFile)) {
  console.error('❌ Missing years.json file in static/');
  process.exit(1);
}

const years = Object.keys(JSON.parse(readFileSync(yearsFile, 'utf-8'))).sort();
const latestYear = years.at(-1)!;

let hasError = false;

const IGNORED_CATEGORY_LAYERS: Readonly<Record<string, readonly number[]>> = Object.freeze({
  2023: [6959]
});

console.log(`🔍 Validating categories for years: ${years.join(', ')}`);
console.log(`🔎 Latest year strict checks: ${latestYear}`);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLayerOverride(value: unknown): value is LayerOverride {
  if (!isRecord(value)) return false;

  const keys = Object.keys(value);
  return keys.length === 1 && keys[0] === 'fixed_id' && typeof value.fixed_id === 'number';
}

function isPoiTag(value: unknown): value is PoiTag {
  return (
    isRecord(value) &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.priority === 'number' &&
    typeof value.visible === 'boolean' &&
    typeof value.filter === 'boolean' &&
    typeof value.modified_at === 'string' &&
    typeof value.color === 'string' &&
    typeof value.text_color === 'string'
  );
}

function isPoiOverride(value: unknown): value is PoiOverride {
  if (!isRecord(value)) return false;

  const allowedKeys = ['name', 'category_id', 'category_fixed_id', 'deleted_at', 'tags'];
  for (const [key, field] of Object.entries(value)) {
    if (!allowedKeys.includes(key)) return false;

    if (key === 'name' && typeof field !== 'string') return false;
    if (key === 'category_id' && typeof field !== 'number') return false;
    if (key === 'category_fixed_id' && typeof field !== 'number') return false;
    if (key === 'deleted_at' && typeof field !== 'string' && field !== null) return false;
    if (key === 'tags' && (!Array.isArray(field) || !field.every(isPoiTag))) return false;
  }

  return true;
}

function readOverrides(year: string): DataOverrides | undefined {
  const filePath = join(dataRoot, 'data', year, 'overrides.json');
  if (!existsSync(filePath)) return;

  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (!isRecord(parsed)) {
    console.error(`❌ [${year}] overrides.json must be an object`);
    hasError = true;
    return;
  }

  const allowedRootKeys = ['layers', 'pois'];
  for (const key of Object.keys(parsed)) {
    if (!allowedRootKeys.includes(key)) {
      console.error(`❌ [${year}] overrides.json cannot contain root key "${key}"`);
      hasError = true;
    }
  }

  if (parsed.layers !== undefined && !isRecord(parsed.layers)) {
    console.error(`❌ [${year}] overrides.layers must be an object keyed by layer ID`);
    hasError = true;
    return;
  }

  if (parsed.pois !== undefined && !isRecord(parsed.pois)) {
    console.error('❌ [' + year + '] overrides.pois must be an object keyed by POI ID');
    hasError = true;
    return;
  }

  const layers: Record<string, LayerOverride> = {};
  for (const [layerId, override] of Object.entries(parsed.layers ?? {})) {
    if (!isLayerOverride(override)) {
      console.error(
        `❌ [${year}] Override for layer ${layerId} must contain only a numeric fixed_id`
      );
      hasError = true;
      continue;
    }

    layers[layerId] = override;
  }

  const pois: Record<string, PoiOverride> = {};
  for (const [poiId, override] of Object.entries(parsed.pois ?? {})) {
    if (!isPoiOverride(override)) {
      console.error('❌ [' + year + '] Override for POI ' + poiId + ' contains invalid fields');
      hasError = true;
      continue;
    }

    pois[poiId] = override;
  }

  return { layers, pois };
}

function validateLayerOverrides(
  categories: RawCategory[],
  overrides: DataOverrides | undefined,
  year: string
): Set<number> {
  const overriddenLayerIds = new Set<number>();
  if (!overrides?.layers) return overriddenLayerIds;

  const categoriesById = new Set(categories.map((category) => category.id));

  for (const [layerId, override] of Object.entries(overrides.layers)) {
    const numericLayerId = Number(layerId);

    if (!Number.isInteger(numericLayerId) || !categoriesById.has(numericLayerId)) {
      console.error(`❌ [${year}] Override references unknown layer ID ${layerId}`);
      hasError = true;
      continue;
    }

    if (!FIXED_ID_CATEGORY_REGISTRY[override.fixed_id]) {
      console.error(
        `❌ [${year}] Override for layer ${layerId} uses unknown fixed_id ${override.fixed_id}`
      );
      hasError = true;
    }

    overriddenLayerIds.add(numericLayerId);
  }

  return overriddenLayerIds;
}

function validatePoiOverrides(
  pois: Poi[],
  categories: RawCategory[],
  overrides: DataOverrides | undefined,
  year: string
): void {
  if (!overrides?.pois) return;

  const poisById = new Set(pois.map((poi) => poi.id));
  const categoriesById = new Set(categories.map((category) => category.id));

  for (const [poiId, override] of Object.entries(overrides.pois)) {
    const numericPoiId = Number(poiId);

    if (!Number.isInteger(numericPoiId) || !poisById.has(numericPoiId)) {
      console.error('❌ [' + year + '] Override references unknown POI ID ' + poiId);
      hasError = true;
      continue;
    }

    if (override.category_id !== undefined && !categoriesById.has(override.category_id)) {
      console.error(
        '❌ [' +
          year +
          '] Override for POI ' +
          poiId +
          ' uses unknown layer ID ' +
          override.category_id
      );
      hasError = true;
    }
    if (
      override.category_fixed_id !== undefined &&
      !FIXED_ID_CATEGORY_REGISTRY[override.category_fixed_id]
    ) {
      console.error(
        `❌ [${year}] Override for POI ${poiId} uses unknown category_fixed_id ${override.category_fixed_id}`
      );
      hasError = true;
    }
  }
}

function validatePoiCoordinates(pois: Poi[], year: string): void {
  for (const poi of pois) {
    if (!poi.published || poi.deleted_at) continue;

    if (!Array.isArray(poi.coordinates) || poi.coordinates.length === 0) {
      console.error(`❌ [${year}] POI ${poi.name} (${poi.id}) has no coordinates`);
      hasError = true;
    }
  }
}

function validatePoiCategories(pois: Poi[], categories: RawCategory[], year: string): void {
  const categoriesById = new Set(categories.map((category) => category.id));

  for (const poi of pois) {
    if (!poi.published || poi.deleted_at) continue;

    if (poi.category_fixed_id !== undefined) {
      if (!FIXED_ID_CATEGORY_REGISTRY[poi.category_fixed_id]) {
        console.error(
          `❌ [${year}] POI ${poi.name} (${poi.id}) uses unknown category_fixed_id ${poi.category_fixed_id}`
        );
        hasError = true;
      }

      continue;
    }

    if (!poi.category_id) {
      console.error(`❌ [${year}] POI ${poi.name} (${poi.id}) has no category_id`);
      hasError = true;
      continue;
    }

    if (!categoriesById.has(poi.category_id)) {
      console.error(
        `❌ [${year}] POI ${poi.name} (${poi.id}) uses unknown layer ID ${poi.category_id}`
      );
      hasError = true;
    }
  }
}

function isKnownCategoryName(category: RawCategory, definition: Category): boolean {
  return definition.name === category.name || definition.aliases?.includes(category.name) === true;
}

function hasFixedId(category: RawCategory): category is CorrectedRawCategory {
  return Boolean(category.fixed_id);
}

function validateCategoryGroups(): void {
  const groupsById = new Map(
    CATEGORY_GROUP_LIST.map((group) => [group.category_group_id, group] as const)
  );

  if (groupsById.size !== CATEGORY_GROUP_LIST.length) {
    console.error('❌ Category groups cannot reuse category_group_id values');
    hasError = true;
  }

  for (const category of CATEGORY_LIST) {
    if (!groupsById.has(category.group_id)) {
      console.error(
        `❌ Category ${category.name} (${category.fixed_id}) uses unknown group ID ${category.group_id}`
      );
      hasError = true;
    }
  }

  for (const group of CATEGORY_GROUP_LIST) {
    const visitedGroupIds = new Set<string>([group.category_group_id]);
    let parentGroupId = group.parent_group_id;

    while (parentGroupId) {
      const parentGroup = groupsById.get(parentGroupId);

      if (!parentGroup) {
        console.error(
          `❌ Category group ${group.name} (${group.category_group_id}) uses unknown parent group ID ${parentGroupId}`
        );
        hasError = true;
        break;
      }

      if (visitedGroupIds.has(parentGroupId)) {
        console.error(
          `❌ Category group ${group.name} (${group.category_group_id}) has a recursive parent group cycle at ${parentGroupId}`
        );
        hasError = true;
        break;
      }

      visitedGroupIds.add(parentGroupId);
      parentGroupId = parentGroup.parent_group_id;
    }
  }
}

function validateCategory(
  category: RawCategory,
  year: string,
  overriddenLayerIds: ReadonlySet<number>
): void {
  if (IGNORED_CATEGORY_LAYERS[year]?.includes(category.id)) {
    return;
  }

  if (!hasFixedId(category)) {
    console.error(`❌ [${year}] Category ${category.name} (${category.id}) has no fixed_id`);
    hasError = true;
    return;
  }

  const known: Category | undefined = resolveCategory(category);

  if (!known) {
    console.error(
      `❌ [${year}] Unmapped category ${category.name} (${category.id}) with fixed_id ${category.fixed_id}`
    );
    hasError = true;
    return;
  }

  if (year !== latestYear || overriddenLayerIds.has(category.id)) {
    return;
  }

  if (category.color !== known.color) {
    console.warn(
      `⚠️ [${year}] Color mismatch for ${category.name} (${category.id}): expected ${known.color}, got ${category.color}`
    );
    hasError = true;
  }

  if (!isKnownCategoryName(category, known)) {
    console.warn(
      `⚠️ [${year}] Name mismatch for ${category.name} (${category.id}): expected ${known.name}, got ${category.name}`
    );
    hasError = true;
  }

  if (category.z_index !== known.z_index) {
    console.warn(
      `⚠️ [${year}] zIndex mismatch for ${category.name} (${category.id}): expected ${known.z_index}, got ${category.z_index}`
    );
    hasError = true;
  }
}

validateCategoryGroups();

for (const year of years) {
  const filePath = join(dataRoot, 'data', year, 'layers.json');
  const poisFilePath = join(dataRoot, 'data', year, 'pois.json');

  if (!existsSync(filePath)) {
    console.error(`❌ Missing layers.json for ${year}`);
    hasError = true;
    continue;
  }

  if (!existsSync(poisFilePath)) {
    console.error('❌ Missing pois.json for ' + year);
    hasError = true;
    continue;
  }

  const categories: RawCategory[] = JSON.parse(readFileSync(filePath, 'utf-8'));
  const pois: Poi[] = JSON.parse(readFileSync(poisFilePath, 'utf-8'));
  const overrides = readOverrides(year);
  const overriddenLayerIds = validateLayerOverrides(categories, overrides, year);
  validatePoiOverrides(pois, categories, overrides, year);
  const correctedPois = applyPoiOverrides(pois, overrides);
  validatePoiCoordinates(correctedPois, year);
  validatePoiCategories(correctedPois, categories, year);
  const correctedCategories = applyLayerOverrides(categories, overrides);

  for (const category of correctedCategories) {
    validateCategory(category, year, overriddenLayerIds);
  }
}

if (hasError) {
  console.error('\n❌ Validation failed');
  process.exit(1);
}

console.log('\n✅ All category data validated successfully.');
