import { expect, test } from '@playwright/test';
import { RestClientEditor } from '../page-objects/RestClientEditor';

const ICON_DISPLAY_VALUE = 'res:/webContent/icons/microsoft.svg';

test('empty', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await expect(editor.detail.header).toHaveText('Rest Client');
  await expect(editor.detail.locator.locator('.ui-panel-message')).toHaveText('No Rest Client Selected');
});

test('generate service', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await expect(editor.main.generate).toBeDisabled();
  await editor.main.table.row(0).locator.click();
  await expect(editor.main.generate).toBeEnabled();

  const dialog = await editor.main.openGenerateServiceDialog();
  await expect(dialog.namespaceInput).toBeDisabled();
  await expect(dialog.resolveFullyCheckbox).toBeDisabled();

  await dialog.fileInput.fill('tests/integration/schema.json');
  await expect(dialog.namespaceInput).toBeEnabled();
  await expect(dialog.resolveFullyCheckbox).toBeEnabled();
});

test('edit details', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await expect(editor.detail.key.locator).toBeDisabled();
  await expect(editor.detail.name).toHaveValue('personService');
  await expect(editor.detail.description).toBeEmpty();

  await expect(editor.detail.icon.locator).toHaveValue('');
  await expect(editor.detail.uri.locator).toHaveValue('{ivy.app.baseurl}/api/persons');

  await editor.detail.name.fill('Updated service');
  await editor.detail.description.fill('desc');
  await editor.detail.icon.locator.fill('file://icon');
  await editor.detail.uri.locator.fill('{ivy.app.baseurl}/api/updatedService');

  await expect(editor.detail.header).toHaveText('Updated service');
  await expect(editor.detail.name).toHaveValue('Updated service');
  await expect(editor.detail.description).toHaveValue('desc');
  await expect(editor.detail.icon.locator).toHaveValue('file://icon');
  await expect(editor.detail.uri.locator).toHaveValue('{ivy.app.baseurl}/api/updatedService');
});

test('icon chooser', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.icon.locator).toHaveValue('');

  await editor.detail.icon.choose('microsoft');
  await expect(editor.detail.icon.locator).toHaveValue(ICON_DISPLAY_VALUE);
  const selectedRow = editor.main.table.row(0);
  const iconInRow = selectedRow.locator.locator('img');
  await expect(iconInRow).toHaveAttribute('src', '/icons/microsoft.svg');
  await expect(iconInRow).toHaveAttribute('alt', 'icon');
});

test('icon chooser client', async ({ page }) => {
  const editor = await RestClientEditor.openRestClient(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.icon.locator).toHaveValue('');

  await editor.detail.icon.choose('microsoft');
  await expect(editor.detail.icon.locator).toHaveValue(ICON_DISPLAY_VALUE);
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

test('edit authentication type', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.authSection.open();
  await editor.detail.authenticationType.expectSelected('Basic');
  await editor.detail.featuresSection.open();
  await editor.detail.features.expectToHaveRowCount(2);
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature']
  );

  await editor.detail.authenticationType.choose('Digest');
  await editor.detail.features.expectToHaveRowCount(2);
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    ['ch.ivyteam.ivy.rest.client.authentication.HttpDigestAuthenticationFeature']
  );

  await editor.detail.authenticationType.choose('NTLM');
  await editor.detail.features.expectToHaveRowCount(2);
  await editor.detail.features.expectToHaveRowValues(['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'], ['ch.ivyteam.ivy.rest.client.authentication.NtlmAuthenticationFeature']);

  await editor.detail.authenticationType.choose('None');
  await editor.detail.features.expectToHaveRowCount(1);
  await editor.detail.features.expectToHaveRowValues(['ch.ivyteam.ivy.rest.client.mapper.JsonFeature']);
});

test('edit authentication properties', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.authSection.open();
  await expect(editor.detail.username).toHaveValue('theWorker');
  await expect(editor.detail.password).toHaveValue('theWorker');
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker']);

  await editor.detail.username.fill('newUser');
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'newUser'], ['Password', 'password', 'theWorker']);

  await editor.detail.password.fill('newPass');
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'newUser'], ['Password', 'password', 'newPass']);

  await editor.detail.username.clear();
  await editor.detail.properties.expectToHaveRowValues(['Password', 'password', 'newPass']);

  await editor.detail.username.fill('reguel');
  await editor.detail.properties.expectToHaveRowValues(['Password', 'password', 'newPass'], ['Text', 'username', 'reguel']);

  await editor.detail.password.clear();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'reguel']);
});

test('edit features', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.featuresSection.open();
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature']
  );

  const newRow = await editor.detail.features.addRow();
  await newRow.fill(['test']);
  await editor.detail.features.expectToHaveRowValues(
    ['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'],
    ['ch.ivyteam.ivy.rest.client.mapper.JsonFeature'],
    ['test']
  );

  await editor.detail.features.row(1).locator.click();
  await editor.detail.featuresSection.content.getByRole('button', { name: 'Remove Row' }).click();
  await editor.detail.features.expectToHaveRowValues(['ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature'], ['test']);
});

test('edit properties', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker']);

  const newRow = await editor.detail.properties.addRow();
  await newRow.fill(['Path', 'newProp', 'newValue']);
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker'], ['Path', 'newProp', 'newValue']);

  await editor.detail.properties.row(0).locator.click();
  await editor.detail.propertiesSection.content.getByRole('button', { name: 'Remove Row' }).click();
  await editor.detail.properties.expectToHaveRowValues(['Password', 'password', 'theWorker'], ['Path', 'newProp', 'newValue']);
});

test('keyboard properties', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Somehow not correclty working in webkit');
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username', 'theWorker'], ['Password', 'password', 'theWorker']);
  await editor.detail.properties.row(0).column(1).locator.click();
  await page.keyboard.type('1');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await editor.detail.properties.expectToHaveRowCount(3);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.type('new');
  await page.keyboard.press('Escape');
  await editor.detail.properties.expectToHaveRowValues(['Text', 'username1', 'theWorker'], ['Password', 'password', 'theWorker'], ['Text', 'new', '']);
});
