const fs = require("fs/promises");
const path = require('path');
const markdownList = require('markdown-list');
const core = require("@actions/core");
const axios = require('axios');

const extension = core.getInput('extension') || 'png';
const username = core.getInput('username') || 'alisuleymantopuz';
const repository = core.getInput('repository') || 'mindMaps';
const contentPath = core.getInput('path') || '';
const readme_path = core.getInput('readme_path') || './README.MD';


(async () => {
  try {

    // get list of files
    const contentFilesArray = [];

    const url = `https://api.github.com/repos/${username}/${repository}/contents/${contentPath}`;

    await axios.get(url)
      .then(response => {
        let resData = response.data;
        if (resData.length > 0) {
          resData.map((data) => {
            if (data && data.type === 'file') {
              var ext = path.extname(data.html_url);
              if (ext === `.${extension}`) {
                const listItem = `[${data.name}](${data.html_url})`;
                contentFilesArray.push(listItem);
              }
            }
          })
        }
      });

    // convert to markdown list
    const list = markdownList(contentFilesArray);

    // prepare new list of files section
    let listOfFiles = `<!-- start list-of-files -->\n${list}\n${new Date().toUTCString()\n}<!-- end list-of-files -->`;

    // current listOfFile section format
    const listOfFilesSection = /<!-- start list-of-files -->[\s\S]*<!-- end list-of-files -->/g;

    // read file
    const currentText = await fs.readFile(readme_path, "utf8");

    // replace current section with new files
    const newText = currentText.replace(listOfFilesSection, listOfFiles);

    // write
    await fs.writeFile(readme_path, newText);

  } catch (error) {
    console.log(error.message);
  }
})();
