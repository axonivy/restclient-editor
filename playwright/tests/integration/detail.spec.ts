import { expect, test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';

test('empty', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await expect(editor.detail.header).toHaveText('Rest Client');
  await expect(editor.detail.content).toBeHidden();
  const emptyMessage = editor.detail.locator.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();
  await expect(emptyMessage).toHaveText('No Rest Client Selected');
});

test('edit rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await expect(editor.detail.content).toBeVisible();
  await expect(editor.detail.id).toBeDisabled();
  await expect(editor.detail.name).toHaveValue('personService');
  await expect(editor.detail.description).toBeEmpty();
  await expect(editor.detail.icon).toBeEmpty();
  await expect(editor.detail.uri).toHaveValue('{ivy.app.baseurl}/api/persons');
  // await editor.detail.properties.expectToHaveRowValues(['perms', 'sa'], ['status', 'married']);

  await editor.detail.name.fill('Updated service');
  await editor.detail.description.fill('desc');
  await editor.detail.icon.fill('file://icon');
  await editor.detail.uri.fill('{ivy.app.baseurl}/api/updatedService');
  // const row = await editor.detail.properties.addRow();
  // await row.fill(['newProp', 'newValue']);
  // await editor.main.table.row(0).expectToHaveColumns('Updated service', 'Updated Full Name');

  // await editor.main.table.row(1).locator.click();
  // await expect(editor.detail.header).toHaveText('ldv');

  // await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('Updated service');
  await expect(editor.detail.name).toHaveValue('Updated service');
  await expect(editor.detail.description).toHaveValue('desc');
  await expect(editor.detail.icon).toHaveValue('file://icon');
  await expect(editor.detail.uri).toHaveValue('{ivy.app.baseurl}/api/updatedService');
  // await editor.detail.properties.expectToHaveRowValues(['perms', 'sa'], ['status', 'married'], ['newProp', 'newValue']);
});

// eslint-disable-next-line playwright/no-skipped-test
test.skip('keyboard properties', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.properties.expectToHaveRowValues(['perms', 'sa'], ['status', 'married']);
  await editor.detail.properties.row(0).column(0).locator.click();
  await page.keyboard.type('1');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await editor.detail.properties.expectToHaveRowCount(3);
  await page.keyboard.press('Tab');
  await page.keyboard.type('new');
  await page.keyboard.press('Escape');
  await editor.detail.properties.expectToHaveRowValues(['perms1', 'sa'], ['status', 'married'], ['new', '']);
});
