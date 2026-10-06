import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {LANGUAGES} from '../src/js/language-data.js';
import {t,translations} from '../src/js/localization.js';
import {
    catalogueTranslations, CATALOGUE_KEYS, DEVELOPMENT_KEYS, RESPONSIBILITY_KEYS, TEAM_BIO_KEYS, CATALOGUE_ERROR_KEYS, CATALOGUE_WEBSITE_KEYS
} from '../src/js/catalogue-translations.js';

test('catalogue, responsibility, development and biography text covers every configured language', () => {
    assert.deepEqual(Object.keys(catalogueTranslations).sort(), Object.keys(LANGUAGES).sort());
    for (const language of Object.keys(LANGUAGES)) {
        for (const key of [...CATALOGUE_KEYS, ...DEVELOPMENT_KEYS, ...RESPONSIBILITY_KEYS, ...TEAM_BIO_KEYS, ...CATALOGUE_ERROR_KEYS, ...CATALOGUE_WEBSITE_KEYS]) {
            assert.ok(catalogueTranslations[language][key]?.trim(), language + ': ' + key);
            assert.equal(t(key, language), catalogueTranslations[language][key]);
            assert.equal(translations[language][key], catalogueTranslations[language][key]);
        }
        if (language !== 'en') {
            for (const key of ['catalogue.pendingDescription', 'catalogue.ownerHint', ...TEAM_BIO_KEYS]) {
                assert.notEqual(t(key, language), t(key, 'en'), language + ': untranslated ' + key);
            }
        }
    }
});

test('the localized biography retains the complete supplied source and Urdu responsibilities', async () => {
    const seed = JSON.parse(await readFile(new URL('../functions/team-seed.json', import.meta.url), 'utf8'));
    assert.equal(TEAM_BIO_KEYS.map(key => t(key, 'en')).join('\n\n'), seed.members[0].bio);
    assert.match(t('team.bioParagraph1', 'ur'), /محمد حمزہ صابر.*AG/);
    assert.match(t('team.bioParagraph2', 'ur'), /ہر AG مصنوع/);
    assert.match(t('responsibility.researchInnovation', 'ur'), /تحقیق/);
    assert.match(t('responsibility.testingDeployment', 'ur'), /ٹیسٹنگ/);
});
