import { test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';
import { screenshot } from './screenshot-util';

test('editor', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await screenshot(page, 'restclient-editor');
});
