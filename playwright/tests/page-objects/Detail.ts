import { type Locator, type Page } from '@playwright/test';
import { Table } from './components/Table';

export class Detail {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly help: Locator;
  readonly content: Locator;
  readonly id: Locator;
  readonly name: Locator;
  readonly description: Locator;
  readonly icon: Locator;
  readonly uri: Locator;
  readonly properties: Table;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('.restclient-editor-detail-panel');
    this.header = this.locator.locator('.restclient-editor-detail-header');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
    this.content = this.locator.locator('.restclient-editor-detail-content');
    this.id = this.locator.getByLabel('ID', { exact: true });
    this.name = this.locator.getByLabel('Name', { exact: true });
    this.description = this.locator.getByLabel('Description', { exact: true });
    this.icon = this.locator.getByLabel('Icon', { exact: true });
    this.uri = this.locator.getByLabel('URI', { exact: true });
    this.properties = new Table(page, this.locator);
  }
}
