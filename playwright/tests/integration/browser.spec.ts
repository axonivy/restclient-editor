import { expect, test } from '@playwright/test';
import { Browser } from '../page-objects/Browser';
import { RestClientEditor } from '../page-objects/RestClientEditor';

test('features', async ({ page }) => {
  const editor = await RestClientEditor.openRestClient(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.featuresSection.open();
  await editor.detail.features.row(1).expectToHaveColumnValues('ch.ivyteam.ivy.rest.client.mapper.JsonFeature');
  await editor.detail.features.row(1).locator.click();
  await editor.detail.features.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await expect(browser.view.getByRole('textbox')).toHaveValue('JsonFeature');
  await browser.table.expectToHaveRowCount(1);
  await browser.table.expectToHaveRowValues(['JsonFeaturech.ivyteam.ivy.rest.client.mapper']);

  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(8);
  await browser.table.expectToHaveRowValues(['MyFeaturecom.axonivy.connectivity.rest.client.connect'], ['JsonFeaturech.ivyteam.ivy.rest.client.mapper']);
});

test('features apply', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.featuresSection.open();
  await editor.detail.features.row(0).expectToHaveColumnValues('ch.ivyteam.ivy.rest.client.authentication.HttpBasicAuthenticationFeature');
  await editor.detail.features.row(0).locator.click();
  await editor.detail.features.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(2);
  await browser.table.row(0).locator.click();
  await browser.view.getByRole('button', { name: 'Apply' }).click();
  await editor.detail.features.row(0).expectToHaveColumnValues('org.glassfish.jersey.media.multipart.MultiPartFeature');
});

test('properties', async ({ page }) => {
  const editor = await RestClientEditor.openRestClient(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.row(0).expectToHaveColumnValues('Text', 'username', 'theWorker');
  await editor.detail.properties.row(0).column(1).locator.click();
  await editor.detail.properties.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await expect(browser.view.getByRole('textbox')).toHaveValue('username');
  await browser.table.expectToHaveRowCount(2);
  await browser.table.expectToHaveRowValues(['jersey.config.client.proxy.username'], ['usernameThe username used for authentication by Basic, Digest or NTLM authentication.']);

  await browser.table.row(1).locator.click();
  await expect(browser.info.content).toHaveText('InfoThe username used for authentication by Basic, Digest or NTLM authentication.');

  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(133);
  await browser.table.expectToHaveRowValues(['JSON.Deserialization.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT']);

  await browser.table.row(0).locator.click();
  await expect(browser.info.content).toHaveText('InfoDefault value: false');
});

test('properties apply', async ({ page }) => {
  const editor = await RestClientEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('personService');
  await editor.detail.propertiesSection.open();
  await editor.detail.properties.row(0).expectToHaveColumnValues('Text', 'username', 'theWorker');
  await editor.detail.properties.row(0).column(1).locator.click();
  await editor.detail.properties.locator.getByRole('button', { name: 'Browser' }).click();
  const browser = new Browser(page);
  await expect(browser.view).toBeVisible();
  await browser.view.getByRole('textbox').clear();
  await browser.table.expectToHaveRowCount(6);
  await browser.table.row(0).locator.click();
  await browser.view.getByRole('button', { name: 'Apply' }).click();
  await editor.detail.properties.row(0).expectToHaveColumnValues('Text', 'jersey.client.pool.maxConnections', 'theWorker');
});
