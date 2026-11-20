import { expect, test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';

test('table', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('invalid-restclient');
  await dialog.create.click();
  const validationRows = editor.main.table.locator.locator('.ui-message-row');
  await expect(validationRows.first()).toHaveText('RestClient invalid-restclient contains invalid characters');
  const keyReference = validationRows.filter({ hasText: 'RestClient invalid-restclient contains invalid characters' }).getByRole('button', {
    name: 'INVALID_KEY'
  });
  await expect(keyReference).toBeVisible();

  const openUrlAction = page.waitForEvent('console', {
    predicate: message => message.type() === 'log' && message.text().startsWith('action ')
  });
  await keyReference.click();
  const actionLog = (await openUrlAction).text();
  expect(actionLog).toContain('"actionId":"openUrl"');
  expect(actionLog).toContain('https://example.com/invalid-key');
});

test('detail', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('invalid-restclient');
  await dialog.create.click();
  await editor.main.table.lastRow().locator.click();

  const keyMessage = await editor.detail.key.message();
  await keyMessage.expectToBeError('RestClient invalid-restclient contains invalid characters');
  await expect(keyMessage.locator.getByRole('button', { name: 'INVALID_KEY' })).toBeVisible();
  const uriMessage = await editor.detail.uri.message();
  await uriMessage.expectToBeError('URI empty');
  await editor.detail.featuresSection.open();
  await editor.detail.features.expectToHaveRowCount(2);
  await expect(editor.detail.features.locator.getByRole('row').last()).toHaveText('Feature unknown');
});

test('add rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await expect(dialog.create).toBeDisabled();
  await (await dialog.name.message()).expectToBeError('Name cannot be empty.');
  await dialog.name.locator.fill('personService');
  await (await dialog.name.message()).expectToBeError('Rest Client already exists.');
  await dialog.name.locator.fill('personService1');
  await (await dialog.name.message()).expectToBeInfo(`Sanitized key will be 'personService1'.`);
  await expect(dialog.create).toBeEnabled();
});
