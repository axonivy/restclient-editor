import { expect, test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';

test('table', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('invalid#restclient');
  await dialog.create.click();
  await expect(editor.main.table.locator.locator('.ui-message-row').first()).toHaveText('RestClient invalid#restclient contains invalid characters');
});

test('detail', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('invalid#restclient');
  await dialog.create.click();
  await editor.main.table.lastRow().locator.click();

  await (await editor.detail.name.message()).expectToBeError('RestClient invalid#restclient contains invalid characters');
  await (await editor.detail.uri.message()).expectToBeError('URI empty');
  await editor.detail.featuresSection.open();
  await editor.detail.features.expectToHaveRowCount(2);
  await expect(editor.detail.features.locator.getByRole('row').last()).toHaveText('Feature unknown');
});

test('add rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await (await dialog.name.message()).expectToBeError('Name cannot be empty.');
  await dialog.name.locator.fill('personService');
  await (await dialog.name.message()).expectToBeError('Rest Client already exists.');
  await dialog.name.locator.fill('personService1');
  await expect((await dialog.name.message()).locator).toBeHidden();
});
