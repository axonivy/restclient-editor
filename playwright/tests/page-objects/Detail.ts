import { type Locator, type Page } from '@playwright/test';
import { Table } from './components/Table';

export class Detail {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly help: Locator;
  readonly content: Locator;
  readonly name: Locator;
  readonly password: Locator;
  readonly fullName: Locator;
  readonly emailAddress: Locator;
  readonly properties: Table;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('.restclient-editor-detail-panel');
    this.header = this.locator.locator('.restclient-editor-detail-header');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
    this.content = this.locator.locator('.restclient-editor-detail-content');
    this.name = this.locator.getByLabel('Name', { exact: true });
    this.password = this.locator.getByLabel('Password', { exact: true });
    this.fullName = this.locator.getByLabel('Full Name', { exact: true });
    this.emailAddress = this.locator.getByLabel('Email Address', { exact: true });
    this.properties = new Table(page, this.locator);
  }
}
