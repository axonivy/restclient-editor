import { expect, test } from '@playwright/test';
import { AddRestClientDialog } from '../page-objects/AddRestClientDialog';
import { RestClientEditor } from '../page-objects/RestClientEditor';

// eslint-disable-next-line playwright/no-skipped-test
test.skip('data', async ({ page }) => {
  const editor = await RestClientEditor.openRestClient(page);
  await expect(editor.main.locator.getByText('Rest Clients').first()).toBeVisible();
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRows(['bf', 'Benjamin Franklin', 'Executive ManagerFinance'], ['hb', 'Hugo Boss'], ['hf', 'Henry Ford', 'IT Manager'], ['jb']);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('bf');
});

// eslint-disable-next-line playwright/no-skipped-test
test.skip('save data', async ({ page, browserName }, testInfo) => {
  const editor = await RestClientEditor.openRestClient(page);
  const dialog = await editor.main.openAddRestClientDialog();
  const newRestClientName = `restclient-${browserName}-${testInfo.retry}`;
  await dialog.name.locator.fill(newRestClientName);
  await dialog.create.click();
  const row = editor.main.table.lastRow();
  await row.expectToHaveColumns(newRestClientName, '', '');
  await row.locator.click();
  await expect(editor.detail.header).toHaveText(newRestClientName);
  await editor.detail.fullName.fill('fullname');
  await row.expectToHaveColumns(newRestClientName, 'fullname', 'Teamleader');

  await page.reload();
  await row.expectToHaveColumns(newRestClientName, 'fullname', 'Teamleader');

  await row.locator.click();
  await editor.main.delete.click();
  await expect(row.column(0).locator).not.toHaveText(newRestClientName);
});

test('select rest client', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Rest Client');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('wt');

  await editor.main.table.header(0).locator.click();
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('Rest Client');
});

test('search', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(8);
  await editor.main.search.fill('bo');
  await editor.main.table.expectToHaveRowCount(2);
});

test('sort', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveRows(['wt']);
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRows(['bf']);
});

test('add', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(8);
  const dialog = await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('NewRestClient');
  await dialog.cancel.click();
  await editor.main.table.expectToHaveRowCount(8);
  await editor.main.openAddRestClientDialog();
  await dialog.name.locator.fill('NewRestClient');
  await dialog.create.click();
  await editor.main.table.expectToHaveRowCount(9);
  await editor.main.table.row(8).expectToHaveColumns('NewRestClient');
  await editor.main.table.row(8).locator.click();
  await editor.main.delete.click();
  await editor.main.table.expectToHaveRowCount(8);
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
