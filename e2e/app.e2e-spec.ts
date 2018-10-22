import { MatblogPage } from './app.po';

describe('matblog App', () => {
  let page: MatblogPage;

  beforeEach(() => {
    page = new MatblogPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
