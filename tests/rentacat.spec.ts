import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:8080';

test.beforeEach(async ({ context, page }) => {
  await context.addCookies(['1', '2', '3'].map(name => ({
    name, value: 'false', url: baseURL,
  })));
  await page.goto(baseURL);
});

test('TEST-1-RESET', async ({ context, page }) => {
  await context.addCookies(['1', '2', '3'].map(name => ({
    name, value: 'true', url: baseURL,
  })));
  await page.getByRole('link', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('list', { name: 'Cat names' }).getByRole('listitem'))
    .toHaveText(['ID 1. Jennyanydots', 'ID 2. Old Deuteronomy', 'ID 3. Mistoffelees']);
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog', exact: true }).click();
  const secondPhoto = page.getByRole('list', { name: 'Cat photos' })
    .getByRole('listitem').nth(1).getByRole('img');
  await expect(secondPhoto).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog', exact: true }).click();
  const names = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');
  await expect(names).toHaveCount(3);
  await expect(names.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Rent', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return', exact: true })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat', exact: true }).click();
  await page.getByLabel('Enter the ID of the cat to rent:', { exact: true }).fill('1');
  await page.getByRole('button', { name: 'Rent', exact: true }).click();
  await expect(page.getByRole('list', { name: 'Cat names' }).getByRole('listitem'))
    .toHaveText(['Rented out', 'ID 2. Old Deuteronomy', 'ID 3. Mistoffelees']);
  await expect(page.getByText('Success!', { exact: true })).toBeVisible();
});

test('TEST-6-RETURN', async ({ context, page }) => {
  await context.addCookies(['2', '3'].map(name => ({
    name, value: 'true', url: baseURL,
  })));
  await page.getByRole('link', { name: 'Rent-A-Cat', exact: true }).click();
  await page.getByLabel('Enter the ID of the cat to return:', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Return', exact: true }).click();
  await expect(page.getByRole('list', { name: 'Cat names' }).getByRole('listitem'))
    .toHaveText(['ID 1. Jennyanydots', 'ID 2. Old Deuteronomy', 'Rented out']);
  await expect(page.getByText('Success!', { exact: true })).toBeVisible();
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Feed', exact: true })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat', exact: true }).click();
  await page.getByLabel('Number of catnips to feed:', { exact: true }).fill('6');
  await page.getByRole('button', { name: 'Feed', exact: true }).click();
  await expect(page.getByText('Nom, nom, nom.', { exact: true }))
    .toBeVisible({ timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Greet-A-Cat', exact: true }).click();
  await expect(page.getByText('Meow!Meow!Meow!', { exact: true })).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto(baseURL + '/greet-a-cat/Jennyanydots');
  await expect(page.getByText('Meow! from Jennyanydots.', { exact: true })).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ context, page }) => {
  await context.addCookies(['1', '2', '3'].map(name => ({
    name, value: 'true', url: baseURL,
  })));
  await page.getByRole('link', { name: 'Feed-A-Cat', exact: true }).click();
  await expect(page.getByRole('list', { name: 'Cat names' }).getByRole('listitem'))
    .toHaveText(['Rented out', 'Rented out', 'Rented out']);
  await expect(page.locator('body')).toHaveScreenshot();
});
