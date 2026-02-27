import { type Locator, type Page } from '@playwright/test';
import { RadioGroup } from './components/RadioGroup';
import { Section } from './components/Section';
import { Table } from './components/Table';
import { Textbox } from './components/Textbox';
import { OpenApiDialog } from './OpenApiDialog';

export class Detail {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly help: Locator;
  readonly id: Locator;
  readonly name: Textbox;
  readonly description: Locator;
  readonly icon: Locator;
  readonly uri: Textbox;
  readonly openApi: Locator;
  readonly authSection: Section;
  readonly authenticationType: RadioGroup;
  readonly username: Locator;
  readonly password: Locator;
  readonly featuresSection: Section;
  readonly features: Table;
  readonly propertiesSection: Section;
  readonly properties: Table;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('#restclient-editor-detail');
    this.header = this.locator.locator('.ui-sidebar-header');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
    this.id = this.locator.getByLabel('ID', { exact: true });
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.description = this.locator.getByLabel('Description', { exact: true });
    this.icon = this.locator.getByLabel('Icon', { exact: true });
    this.uri = new Textbox(this.locator, { name: 'URI' });
    this.openApi = this.locator.getByRole('button', { name: 'Generate REST classes' });

    this.authSection = new Section(page, this.locator, 'Authentication');
    this.authenticationType = new RadioGroup(this.authSection.content);
    this.username = this.authSection.content.getByLabel('Username', { exact: true });
    this.password = this.authSection.content.getByLabel('Password', { exact: true });

    this.featuresSection = new Section(page, this.locator, 'Features');
    this.features = new Table(page, this.featuresSection.content, ['input']);

    this.propertiesSection = new Section(page, this.locator, 'Properties');
    this.properties = new Table(page, this.propertiesSection.content, ['select', 'input', 'input']);
  }

  get openApiDialog() {
    return new OpenApiDialog(this.page);
  }
}
