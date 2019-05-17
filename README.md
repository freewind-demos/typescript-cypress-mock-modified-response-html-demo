TypeScript Cypress Mock Modified Response Html Demo
===================================================

在Cypress中，虽然我们可以通过`cy.route`来设置mock response，但是它只对XHR有效，
`cy.visit`会绕过它。

目前因为cypress的限制，还做不到修改：https://github.com/cypress-io/cypress/issues/4211

在这个Demo中，我尝试了一种失败的办法：

利用`cy.visit`可以读取本地文件的特性，首先使用`cy.request`拿到原始的html，
把它的内容修改后保存为本地文件，再立刻使用`cy.visit`访问该本地文件，访问的就是修改后的代码。

然而这种做法有两个问题：
1. 如果在cypress中设置了baseUrl，那么`cy.visit`会始终把baseUrl加到我们传入的本地文件路径的前面，使得本地文件无效
2. 虽然我们可以通过`Cypress.config().baseUrl = null`暂时把它去掉，但是拿到的代码中引用的第三方文件（比如`src="./index.js")还是拿不到
  - 我还尝试拿到`Cypress.config().port`（cypress本身提供的server），拼成完整的url，让cypress server提供文件（可以不修改baseUrl），但是发现cypress server禁止访问其下面的资源文件
  - 为了解决前面的问题，还考虑到把生成的临时文件放到真正的server下面，但是同样有问题，就是页面中引用到的资源文件拿不到

还有人提到了使用[pollyjs](https://netflix.github.io/pollyjs/)，它似乎可以在浏览器中模拟出一个server提供mock response，但是感觉一切都很复杂，就没有尝试了。

好在最后发现其实官方已经有一种推荐的workaround：在cy.visit中的`onBeforeLoad`中，通过`Object.defineProperty`的方式来修改我们想修改的值，应该可以解决问题。具体参看另一个Demo

详情查看<./cypress/integration/hello_spec.ts>

```
npm install
npm run server

npm run test:open
npm run test:run
```
