import { type Locator, type Page } from '@playwright/test';

export class OpenApiDialog {
  readonly locator: Locator;
  readonly fileInput: Locator;
  readonly namespaceInput: Locator;
  readonly resolveFullyCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.locator = page.getByRole('dialog');
    this.fileInput = page.getByRole('textbox', { name: 'Schema URI' });
    this.namespaceInput = page.getByRole('textbox', { name: 'Namespace' });
    this.resolveFullyCheckbox = page.getByRole('checkbox', { name: 'Resolve Fully: generate types for generic allOf, anyOf references' });
    this.submitButton = page.getByRole('button', { name: 'Create' });
  }
}
