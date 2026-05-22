import test, { expect } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';

test('save data', async ({ page, browserName }, testInfo) => {
  const editor = await RestClientEditor.openRestClient(page);
  const dialog = await editor.main.openAddRestClientDialog();
  const newRestClientName = `restclient-${browserName}-${testInfo.retry}`;
  await dialog.name.locator.fill(newRestClientName);
  await dialog.create.click();
  const row = editor.main.table.lastRow();
  await row.expectToHaveColumnValues(newRestClientName, '');
  await row.locator.click();
  await expect(editor.detail.header).toHaveText(newRestClientName);
  await editor.detail.uri.locator.fill('www.axonivy.com');
  await row.expectToHaveColumnValues(newRestClientName, 'www.axonivy.com');

  await page.reload();
  await row.expectToHaveColumnValues(newRestClientName, 'www.axonivy.com');

  await row.locator.click();
  await editor.main.delete.click();
  await expect(row.column(0).locator).not.toHaveText(newRestClientName);
});

test('icon chooser client', async ({ page }) => {
  const editor = await RestClientEditor.openRestClient(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.icon.locator).toHaveValue('');

  await editor.detail.icon.choose('microsoft');
  await expect(editor.detail.icon.locator).toHaveValue('res:/webContent/icons/microsoft.svg');
  const selectedRow = editor.main.table.row(0);
  const iconInRow = selectedRow.locator.locator('img');
  for (const img of await iconInRow.all()) {
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  }
  await editor.detail.icon.locator.fill('');
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.icon.locator).toHaveValue('');
});
