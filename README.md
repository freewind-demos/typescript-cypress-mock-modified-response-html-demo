TypeScript Cypress Mock Modified Response Html Demo
===================================================

在Cypress中，虽然我们可以通过`cy.route`来设置mock response，但是它只对XHR有效，
`cy.visit`与`cy.request`都会绕过它。

好在`cy.visit`可以读取本地文件，所以我们可以变通一下：首先使用`cy.request`拿到原始的html，
把它的内容修改后保存为本地文件，再立刻使用`cy.visit`访问该本地文件，就可以实现对某个http请求返回的html
进行修改的作用。

详情查看<./cypress/integration/hello_spec.ts>

```
npm install
npm run server

npm run test:open
npm run test:run
```
