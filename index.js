const { readdir } = require('fs/promises');
const fs = require("fs/promises");
const path = require('path');
const markdownList = require('markdown-list');
const core = require("@actions/core");

const extension = core.getInput('extension') || 'png';

const directory = core.getInput('directory') || '';

const readme_path = core.getInput('readme_path') || './README.md';

const directoryPath = path.join(__dirname, directory);


const findByExtension = async (dir, ext) => {

  const matchedFiles = [];

  const files = await readdir(dir);

  for (const file of files) {

    const fileExt = path.extname(file);

    if (fileExt === `.${ext}`) {
      matchedFiles.push(file);
    }
  }

  return matchedFiles;
};

const getMarkdownUrls = async (files) => {

  const markdownUrls = [];

  for (const file of files) {
    var url = `[${file}](${file.replace(/\ /g, "%20")})`;
    markdownUrls.push(url);
  }

  return markdownUrls;
};

(async () => {
  try {

    // get list of files
    const files = await findByExtension(directoryPath, extension);

    // get markdown urls
    const urls = await getMarkdownUrls(files);

    // convert to markdown list
    const list = markdownList(urls);

    // prepare new list of files section
    let listOfFiles = `<!-- start list-of-files -->\n${list}\n<!-- end list-of-files -->`;

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
