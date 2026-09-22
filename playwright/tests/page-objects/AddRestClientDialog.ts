import { expect, type Locator, type Page } from '@playwright/test';
import { Textbox } from './components/Textbox';

export class AddRestClientDialog {
  readonly page: Page;
  readonly locator: Locator;
  readonly name: Textbox;
  readonly schemaUri: Textbox;
  readonly openApiGenerator: Locator;
  readonly cancel: Locator;
  readonly create: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.schemaUri = new Textbox(this.locator, { name: 'Schema URI' });
    this.openApiGenerator = this.locator.getByRole('button', { name: 'Generate an OpenAPI client' });
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
    this.create = this.locator.getByRole('button', { name: 'Create' });
  }

  async openOpenApiGenerator() {
    await this.openApiGenerator.click();
    await expect(this.schemaUri.locator).toBeVisible();
  }
}
