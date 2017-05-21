# Snip

Snip is an add-on for Google Forms to help teachers turn printed worksheets into digital forms. With Snip, users can easily crop and save sections of their worksheets (such as instructions, questions, and answers) to their Google Drive. They can then insert the cropped portions of the worksheet directly into questions and responses in Google Forms instead of having to type and recreate diagrams.

# Installation

1. Clone/download this repository
2. Run `npm install`

# Use with node-google-apps-script

`gapps` is a node module that allows users to push local changes to Google Apps Script projects to their Google Drives.

## `gapps` configuration

1. Complete the installation and authentication (steps 1 and 2 of Quickstart) process for [node-google-apps-script](https://github.com/danthareja/node-google-apps-script)
2. Rename `gapps.config.sample.json` as `gapps.config.json`
3. Replace the `fileId` property in `gapps.config.json` with the ID of your Google Apps Script project's file ID
    1. To find the file ID, open your project from Google Drive. The ID is in the address bar, after the `/d/` and before `/edit`
    2. For example, '//script.google.com/a/google.com/d/**abc123-xyz098**/edit?usp=drive_web'

## `gapps` usage

Run `gulp upload-latest` to compile your files and automatically upload them to your Google Drive project

# Use without node-google-apps-script

Run `gulp copy-latest` to compile your files to the `./build` directory. From here, you can manually copy them to your Google Apps Script project.