# DQ-Tool

Web application for running Data Quality (DQ) checks on data coming from REDCap, built with React and Vite.
It connects to a REDCap project, retrieves the data and checks it for issues such as missing, inconsistent or invalid values.

## Prerequisites

- [Node.js] (https://nodejs.org) (LTS version recommended), which also includes "npm".
- [Git] (https://git-scm.com)

## Installation and setup

### 1. Clone the repository

```bash
git clone https://github.com/biomeris/redcap-webdq-2.git
```

Downloads a local copy of the project, including the full commit history.

### 2. Enter the project folder

```bash
cd redcap-webdq-2
```

All the following commands must be run from this folder.

### 3. Install dependencies

```bash
npm install
```

Reads the "package.json" file and downloads all the libraries required by the project into the "node_modules" folder.

### 4. Start the application in development mode

```bash
npm run dev
```

Starts the Vite development server. The terminal will show the local address (usually `http://localhost:5173`) to open in your browser. The server reloads automatically whenever the code changes.
