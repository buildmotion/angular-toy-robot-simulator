# Setup

## Create Workspace

## Create Web Application 

The command:

```bash
nx generate @nx/angular:application --name=toy-robot-ui --directory=apps/toy-robot-ui --standalone=false --backendProject=toy-robot-api --port=4200 --projectNameAndRootFormat=as-provided --style=scss --no-interactive
```

The output.

```bash
CREATE tsconfig.base.json
CREATE .prettierrc
CREATE .prettierignore
UPDATE .vscode/extensions.json
UPDATE package.json
UPDATE .gitignore
UPDATE nx.json
CREATE apps/toy-robot-ui/project.json
CREATE apps/toy-robot-ui/src/index.html
CREATE apps/toy-robot-ui/src/styles.scss
CREATE apps/toy-robot-ui/tsconfig.app.json
CREATE apps/toy-robot-ui/tsconfig.editor.json
CREATE apps/toy-robot-ui/tsconfig.json
CREATE apps/toy-robot-ui/public/favicon.ico
CREATE apps/toy-robot-ui/src/app/app.component.scss
CREATE apps/toy-robot-ui/src/app/app.component.html
CREATE apps/toy-robot-ui/src/app/app.component.spec.ts
CREATE apps/toy-robot-ui/src/app/app.component.ts
CREATE apps/toy-robot-ui/src/app/app.module.ts
CREATE apps/toy-robot-ui/src/app/app.routes.ts
CREATE apps/toy-robot-ui/src/main.ts
CREATE apps/toy-robot-ui/src/app/nx-welcome.component.ts
CREATE eslint.config.js
CREATE apps/toy-robot-ui/eslint.config.js
CREATE jest.preset.js
CREATE jest.config.ts
CREATE apps/toy-robot-ui/jest.config.ts
CREATE apps/toy-robot-ui/src/test-setup.ts
CREATE apps/toy-robot-ui/tsconfig.spec.json
CREATE apps/toy-robot-ui-e2e/project.json
CREATE apps/toy-robot-ui-e2e/src/example.spec.ts
CREATE apps/toy-robot-ui-e2e/playwright.config.ts
CREATE apps/toy-robot-ui-e2e/tsconfig.json
CREATE apps/toy-robot-ui-e2e/eslint.config.js
CREATE apps/toy-robot-ui/proxy.conf.json
```

## Create UI Component Library

The purpose of the library is to create reusable components that can be used in other Angular web applications.

```bash
nx generate @nx/angular:library --name=toy-robot-components --directory=libs/toy-robot-components --publishable=true --routing=true --importPath=@buldmotion/robot-toy-components --projectNameAndRootFormat=as-provided --simpleName=true --standalone=false --style=scss --no-interactive
```

The output.

```bash
CREATE toy-robot-components/project.json
CREATE toy-robot-components/README.md
CREATE toy-robot-components/tsconfig.json
CREATE toy-robot-components/tsconfig.lib.json
CREATE toy-robot-components/src/index.ts
CREATE toy-robot-components/jest.config.ts
CREATE toy-robot-components/src/test-setup.ts
CREATE toy-robot-components/tsconfig.spec.json
UPDATE nx.json
CREATE toy-robot-components/src/lib/toy-robot-components/toy-robot-components.component.css
CREATE toy-robot-components/src/lib/toy-robot-components/toy-robot-components.component.html
CREATE toy-robot-components/src/lib/toy-robot-components/toy-robot-components.component.spec.ts
CREATE toy-robot-components/src/lib/toy-robot-components/toy-robot-components.component.ts
CREATE toy-robot-components/eslint.config.js
UPDATE tsconfig.base.json
```

## Create Service Library

```bash
nx generate @nx/angular:library --name=toy-robot-service --directory=libs/toy-robot-service --publishable=true --importPath=@buildmotion/toy-robot-service --projectNameAndRootFormat=as-provided --simpleName=true --standalone=false --style=scss --no-interactive
```

The output.

```bash
UPDATE nx.json
CREATE libs/toy-robot-service/project.json
CREATE libs/toy-robot-service/README.md
CREATE libs/toy-robot-service/ng-package.json
CREATE libs/toy-robot-service/package.json
CREATE libs/toy-robot-service/tsconfig.json
CREATE libs/toy-robot-service/tsconfig.lib.json
CREATE libs/toy-robot-service/tsconfig.lib.prod.json
CREATE libs/toy-robot-service/src/index.ts
CREATE libs/toy-robot-service/jest.config.ts
CREATE libs/toy-robot-service/src/test-setup.ts
CREATE libs/toy-robot-service/tsconfig.spec.json
CREATE libs/toy-robot-service/src/lib/toy-robot-service/toy-robot-service.component.css
CREATE libs/toy-robot-service/src/lib/toy-robot-service/toy-robot-service.component.html
CREATE libs/toy-robot-service/src/lib/toy-robot-service/toy-robot-service.component.spec.ts
CREATE libs/toy-robot-service/src/lib/toy-robot-service/toy-robot-service.component.ts
CREATE libs/toy-robot-service/eslint.config.js
UPDATE eslint.config.js
UPDATE tsconfig.base.json
```