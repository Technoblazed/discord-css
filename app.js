const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const basePath = path.join(process.env.APPDATA, 'discordcanary');

let css;
let index;

fs.readFile('./files/custom.css', 'utf8', (err, data)=> {
  css = data;
});

fs.readFile('./files/index.js', 'utf8', (err, data) =>{
  index = data;
});

setTimeout(() =>{
  fs.readdir(basePath, (err, files) => {
    _.forEach(files, (file) =>{
      if (file.startsWith('0.0')) {
        const discordPath = path.join(basePath, file, 'modules', 'discord_rpc');

        let foundCss = false;

        fs.readdir(discordPath, (err, files) => {
          _.forEach(files, (file) =>{
            if (file == 'custom.css') {
              foundCss = true;
            }
          });
        });

        setTimeout(() =>{
          fs.readFile(path.join(discordPath, 'index.js'), (err, data) => {
            if (!data.includes('globiCssStyleId')) {
              fs.appendFile(path.join(discordPath, 'index.js'), index, (err) => {
                if (err) throw err;
                console.log('Saved!');
              });
            }
          });

          if (!foundCss) {
            fs.writeFile(path.join(discordPath, 'custom.css'), css, (err) =>{
              if (err) {
                return console.log(err);
              }
            });
          }
        }, 1 * 1000);

        return false;
      }
    });
  });
}, 1 * 1000);
