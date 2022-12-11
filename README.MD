# List of files by extension

## Updates README with list of files by extension


  - directory:
    description: 'Directory to be listed'
    required: false
    default: ''

  - extension:
    description: 'Extension of files to be listed'
    required: false
    default: 'png'
    

  - readme_path:
    description: 'Path of the readme file to update'
    default: './README.md'
    required: false

Example as follows:

<!-- start list-of-files -->
- [test1 copy 2.png](test1%20copy%202.png)
- [test1 copy 3.png](test1%20copy%203.png)
- [test1 copy 4.png](test1%20copy%204.png)
- [test1 copy.png](test1%20copy.png)
- [test1.png](test1.png)

<!-- end list-of-files -->
