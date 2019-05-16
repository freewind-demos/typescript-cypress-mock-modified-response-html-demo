let tmpFileId = 0;

function nextTmpFileId() {
  tmpFileId += 1;
  return tmpFileId;
}

function visitModifiedHtml(url: string, modify: (html: string) => string) {
  cy.request(url).its('body').then(html => {
    const tmpFile = `tmp/${nextTmpFileId()}.html`;
    cy.writeFile(tmpFile, modify(html));
    cy.visit(tmpFile);
  });

}

const url = 'http://localhost:39483/index.html';

describe('TypeScript', () => {
  it('checks shape of an object', () => {
    visitModifiedHtml(url, (html) => {
      return html.replace(`'cypress'`, `'modified-html'`)
    });

    cy.get('#main').should('have.text', 'Hello, modified-html!');
  })
})
