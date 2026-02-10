import { expect, test } from '@playwright/test';
import { AddRestClientDialog } from '../page-objects/AddRestClientDialog';
import { RestClientEditor } from '../page-objects/RestClientEditor';

test('data', async ({ page }) => {
  const editor = await RestClientEditor.openRestClient(page);
  await expect(editor.main.locator.getByText('Rest Clients').first()).toBeVisible();
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRowValues(
    ['batchService', '{ivy.app.baseurl}/api/batch'],
    ['customClient', '{ivy.app.baseurl}/api/persons'],
    ['ivy.engine (local.backend)', '{ivy.app.baseurl}/api'],
    ['jsonPlaceholder', 'https://jsonplaceholder.typicode.com/']
  );
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('batchService');
});

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

test('select rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Rest Client');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');

  await editor.main.table.header(0).locator.click();
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Rest Client');
});

test('search', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(7);
  await editor.main.search.fill('vice');
  await editor.main.table.expectToHaveRowCount(4);
});

test('sort', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveRowValues(['personService']);
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRowValues(['batchService']);
});

test('add', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(7);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('NewRestClient');
  await dialog.cancel.click();
  await editor.main.table.expectToHaveRowCount(7);
  await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('NewRestClient');
  await dialog.create.click();
  await editor.main.table.expectToHaveRowCount(8);
  await editor.main.table.row(7).expectToHaveColumnValues('NewRestClient');
  await editor.main.table.row(7).expectToBeSelected();
  await expect(editor.detail.header).toHaveText('NewRestClient');
  await expect(editor.detail.id).toHaveValue(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  await editor.main.delete.click();
  await editor.main.table.expectToHaveRowCount(7);
});

test('empty', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.clear();
  await expect(editor.main.locator).toBeHidden();
  const mainPanel = page.locator('.restclient-editor-main-panel');
  const emptyMessage = mainPanel.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();

  await mainPanel.locator('button', { hasText: 'Add Rest Client' }).click();
  const dialog = new AddRestClientDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});
