# DQ-Tool

Web application for running Data Quality (DQ) checks on data coming from REDCap, built with React and Vite.
It connects to a REDCap project, retrieves the data and checks it for issues such as missing, inconsistent or invalid values.


## Prerequisites

- [Node.js] (https://nodejs.org) (LTS version recommended), which also includes "npm".
- [Git] (https://git-scm.com)


## Installation and setup

### 1. Clone the repository

```bash
git clone https://github.com/AndreaBazzoni/Mockup_DQ-Tool.git
```

Downloads a local copy of the project, including the full commit history.


### 2. Enter the project folder

```bash
cd Mockup_DQ-Tool
```

All the following commands must be run from this folder.


### 3. Install dependencies

```bash
# NOTE: required: { node: '^20.19.0 || ^22.13.0 || >=24' }
npm install
```

Reads the "package.json" file and downloads all the libraries required by the project into the "node_modules" folder.


### 4. Start the application in development mode

```bash
npm run dev
```

Starts the Vite development server. The terminal will display the local URL (usually `http://localhost:5173`) to open in your browser. The server supports Hot Module Replacement (HMR), automatically reflecting code changes in the browser during development.
Note: If the default port (:5173) is already in use, Vite will automatically try the next available port.


### 5. Start the application in preview mode

```bash
npm run build && npm run preview
```

Builds the application for production and starts the Vite preview server to locally test the production build. The terminal will display the local URL (usually `http://localhost:4173`) to open in your browser.
Note: If the default port (:4173) is already in use, Vite will automatically try the next available port.

NOTE: to change the REDCap Directory name and the Cohort File name, see the corresponding section in "ManageCohort".
To manage everything else (centers, analysis, bucket), see the corresponding section in "ManageCenters".
