# Snip

Snip is an add-on for Google Forms to help teachers turn printed worksheets into digital forms. With Snip, users can easily crop and save sections of their worksheets (such as instructions, questions, and answers) to their Google Drive. They can then insert the cropped portions of the worksheet directly into questions and responses in Google Forms instead of having to type and recreate diagrams.

## Development/modification

1. Install Google's [clasp tool](https://github.com/google/clasp):

   `npm i @google/clasp -g`
   
2. Log into your Google Apps Script account via clasp

   `clasp login`
   
3. Clone/download this repo

4. Run `npm install`

5. Copy `.clasp.json.sample` to `.clasp.json`

6. Edit `.clasp.json` and set your project ID.
    1. To find the file ID, open your project from Google Drive. The ID is in the address bar, after the `/d/` and before `/edit`
    2. For example, '//script.google.com/a/google.com/d/**abc123-xyz098**/edit?usp=drive_web'
    
7. Develop the code. When you're ready to push it to the Google Apps Script server, run `npm run dev`
       
 **Note**: The `dev` command will not create a deployment. It will just push a copy of your code to the specified project for development purposes