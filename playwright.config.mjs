import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir:'./tests', testMatch:['browser.spec.mjs','catalogue-browser.spec.mjs','character-browser.spec.mjs'], timeout:45000, workers:1,
    use:{ baseURL:'http://127.0.0.1:5173/AG-Home/', channel:'chrome', headless:true, screenshot:'only-on-failure', trace:'retain-on-failure' },
    reporter:[['list']], outputDir:'test-results'
});
