import { test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';
import { screenshotElement } from './screenshot-util';

test('add rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('New RestClient');
  await screenshotElement(dialog.locator, 'dialog-add-restclient');
});

test('generate rest classes', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  const dialog = await editor.main.openGenerateServiceDialog();
  await screenshotElement(dialog.locator, 'dialog-generate-rest-classes');
});
