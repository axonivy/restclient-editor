import { expect, test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';

test('table', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('invalid#restclient');
  await dialog.create.click();
  await expect(editor.main.table.locator.locator('.ui-message-row')).toHaveText('RestClient invalid#restclient contains invalid characters');
});

test('add rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await (await dialog.name.message()).expectToBeError('Name cannot be empty.');
  await dialog.name.locator.fill('wt');
  await (await dialog.name.message()).expectToBeError('Rest Client already exists.');
  await dialog.name.locator.fill('wt1');
  await expect((await dialog.name.message()).locator).toBeHidden();
});
