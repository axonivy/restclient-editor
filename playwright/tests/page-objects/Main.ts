import { expect, type Locator, type Page } from '@playwright/test';
import { AddRestClientDialog } from './AddRestClientDialog';
import { Table } from './components/Table';

export class Main {
  readonly locator: Locator;
  readonly add: Locator;
  readonly delete: Locator;
  readonly search: Locator;
  readonly table: Table;

  constructor(readonly page: Page) {
    this.locator = page.locator('.restclient-editor-main-content');
    this.add = this.locator.getByRole('button', { name: 'Add Rest Client' });
    this.delete = this.locator.getByRole('button', { name: 'Delete Rest Client' });
    this.search = this.locator.getByRole('textbox').first();
    this.table = new Table(page, this.locator);
  }

  public async openAddRestClientDialog() {
    await this.add.click();
    const dialog = new AddRestClientDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
