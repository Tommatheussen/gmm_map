import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { CATEGORY_REGISTRY, resolveCategoryId } from '../src/lib/data/Categories.ts';
import { CategoryDefinition, RawCategory } from '../src/lib/interfaces/Category.ts';

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

function isKnownCategoryName(category: RawCategory, definition: CategoryDefinition): boolean {
  return definition.name === category.name || definition.aliases?.includes(category.name) === true;
}

function validateCategory(category: RawCategory, year: string): void {
  if (IGNORED_CATEGORY_LAYERS[year]?.includes(category.id)) {
    return;
  }

  const categoryId = resolveCategoryId(category, year);
  const known: CategoryDefinition | undefined = categoryId
    ? CATEGORY_REGISTRY[categoryId]
    : undefined;

  if (!categoryId || !known) {
    console.error(
      `❌ [${year}] Unmapped category ${category.name} (${category.id})${
        category.fixed_id ? ` with fixed_id ${category.fixed_id}` : ''
      }`
    );
    hasError = true;
    return;
  }

  console.log(year, latestYear, category.fixed_id);
  if (year !== latestYear || !category.fixed_id) {
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

for (const year of years) {
  const filePath = join(dataRoot, 'data', year, 'layers.json');

  if (!existsSync(filePath)) {
    console.error(`❌ Missing layers.json for ${year}`);
    hasError = true;
    continue;
  }

  const categories: RawCategory[] = JSON.parse(readFileSync(filePath, 'utf-8'));

  for (const category of categories) {
    validateCategory(category, year);
  }
}

if (hasError) {
  console.error('\n❌ Validation failed');
  process.exit(1);
}

console.log('\n✅ All category data validated successfully.');
