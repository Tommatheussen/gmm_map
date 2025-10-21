import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { CATEGORY_REGISTRY } from '../src/lib/data/Categories.ts';
import { FixedCategory, RawCategory } from '../src/lib/interfaces/Category.ts';

const dataRoot = resolve('static');
const yearsFile = join(dataRoot, 'years.json');

if (!existsSync(yearsFile)) {
  console.error('❌ Missing years.json file in static/');
  process.exit(1);
}

const years = Object.keys(JSON.parse(readFileSync(yearsFile, 'utf-8'))).sort();
const latestYear = years.at(-1)!;

let hasError = false;

console.log(`🔍 Validating categories for year: ${latestYear}`);

const filePath = join(dataRoot, 'data', latestYear, 'layers.json');

if (!existsSync(filePath)) {
  console.error(`❌ Missing layers.json for ${latestYear}`);
  process.exit(1);
}

const categories: RawCategory[] = JSON.parse(readFileSync(filePath, 'utf-8'));

for (const cat of categories) {
  const known: FixedCategory = CATEGORY_REGISTRY[cat.fixed_id];
  if (!known) {
    console.error(`❌ [${latestYear}] Unknown fixed_id ${cat.fixed_id} (${cat.name})`);
    hasError = true;
    continue;
  }

  if (cat.color !== known.color) {
    console.warn(
      `⚠️ [${latestYear}] Color mismatch for ${cat.name} (${cat.id}): expected ${known.color}, got ${cat.color}`
    );
    hasError = true;
  }

  if (cat.name !== known.name) {
    console.warn(
      `⚠️ [${latestYear}] name mismatch for ${cat.name} (${cat.id}): expected ${known.name}, got ${cat.name}`
    );
    hasError = true;
  }

  if (cat.z_index !== known.z_index) {
    console.warn(
      `⚠️ [${latestYear}] zIndex mismatch for ${cat.name} (${cat.id}): expected ${known.z_index}, got ${cat.z_index}`
    );
    hasError = true;
  }
}

if (hasError) {
  console.error('\n❌ Validation failed');
  process.exit(1);
}

console.log('\n✅ All category data validated successfully.');
