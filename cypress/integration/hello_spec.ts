let tmpFileId = 0;

function nextTmpFileId() {
  tmpFileId += 1;
  return tmpFileId;
}

// Notice: if there is 'baseUrl' set, `cy.visit` will prefix it to the tmp file,
// which makes it to request the file from server.
// We have to disable it when visit the tmp file.
function forceVisitTmpFile(tmpFile: string) {
  Cypress.config().baseUrl = null;

  const port = Cypress.config().port;
  const tmpFileUrl = `http://localhost:${port}/${tmpFile}`;
  console.log('### tmpFileUrl', tmpFileUrl)

  // FIXME
  // `cy.visit` is a promise, we can't just reset `Cypress.config().baseUrl = baseUrl` after it,
  // instead, we need to put it in `onBeforeLoad`, which is after html code fetched, but before AJAX requests happen
  cy.visit(tmpFile, {
    // onBeforeLoad: () => {
    //   Cypress.config().baseUrl = baseUrl;
    // }
  });
}

function visitModifiedHtml(url: string, modify: (html: string) => string) {
  cy.request(url).its('body').then(html => {
    const tmpFile = `tmp/${nextTmpFileId()}.html`;
    cy.writeFile(tmpFile, modify(html));
    forceVisitTmpFile(tmpFile)
    console.log(Cypress.config().baseUrl)
  });
}

describe('TypeScript', () => {
  it('checks shape of an object', () => {
    visitModifiedHtml('/index.html', (html) => {
      return html.replace(`'cypress'`, `'modified-html'`)
    });

    cy.get('#main').should('have.text', 'Hello, modified-html!');
  })
})
