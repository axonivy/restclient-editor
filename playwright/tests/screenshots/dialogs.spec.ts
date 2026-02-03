import { test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';
import { screenshotElement } from './screenshot-util';

test('add rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('New RestClient');
  await screenshotElement(dialog.locator, 'dialog-add-restclient');
});
