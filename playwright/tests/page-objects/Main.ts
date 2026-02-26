import { expect, type Locator, type Page } from '@playwright/test';
import { AddRestClientDialog } from './AddRestClientDialog';
import { Table } from './components/Table';
import { OpenApiDialog } from './OpenApiDialog';

export class Main {
  readonly locator: Locator;
  readonly add: Locator;
  readonly delete: Locator;
  readonly search: Locator;
  readonly table: Table;
  readonly generate: Locator;

  constructor(readonly page: Page) {
    this.locator = page.locator('.restclient-editor-main-content');
    this.add = this.locator.getByRole('button', { name: 'Add Rest Client' });
    this.delete = this.locator.getByRole('button', { name: 'Delete Rest Client' });
    this.search = this.locator.getByRole('textbox').first();
    this.table = new Table(page, this.locator, ['text', 'text']);
    this.generate = this.locator.getByRole('button', { name: 'Generate REST Classes' });
  }

  public async openAddRestClientDialog() {
    await this.add.click();
    const dialog = new AddRestClientDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }

  public async openGenerateServiceDialog() {
    await this.generate.click();
    const dialog = new OpenApiDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
