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