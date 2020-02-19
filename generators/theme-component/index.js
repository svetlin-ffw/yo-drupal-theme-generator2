'use strict';
var Generator = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
var fs = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Get more info with `--help`.
    this.argument('name', {
      required: false,
      type: String,
      desc: 'The new Drupal component name'
    });
  }

  initializing() {
    // Create an object to contain all our name variations.
    this.componentName = {};

    // Preserve the raw layout name.
    this.componentName.raw = this.options.name;

    // Create a dashed version of the layout name.
    this.componentName.dashed = _.kebabCase(this.options.name);

    this.log('Creating a new theme component called ' + this.options.name + ' (' + this.componentName.dashed + ').');
  }

  // Write each file the component needs, adding the component
  // name where needed.
  writing() {
    var destPath = this.destinationPath();

    this.fs.copyTpl(
      this.templatePath('_theme-component/_component.scss'),
      this.destinationPath('templates/' + this.componentName.dashed + '/' + this.componentName.dashed + '.scss'),
      {
        name: this.componentName.raw,
        dashed: this.componentName.dashed
      }
    );
    this.fs.copyTpl(
      this.templatePath('_theme-component/_component.html.twig'),
      this.destinationPath('templates/' + this.componentName.dashed + '/' + this.componentName.dashed + '.html.twig'),
      {
        dashed: this.componentName.dashed,
        theme_name: destPath.split('/').slice(-1).pop()
      }
    );

    // @TODO: Check if library already exists.
    // Auto add this component to the libraries file in Drupal.
    var libraryDefinition = `
${this.componentName.dashed}:
  css:
    component:
      templates/${this.componentName.dashed}/${this.componentName.dashed}.css: {}
`;

    fs.readdir(
      destPath, function (err, list) {
        if (err) {
          console.log('There was an error adding this component to the libraries.yml file');
          throw err;
        } else {
          list.forEach(function (item) {
            if (item.indexOf('libraries.yml') !== -1) {
              // @TODO Check if theme component already exists.
              // fs.readFile(`${destPath}/${item}`, function (err, data) {
              //   if (err) throw err;
              //   if (data.includes(this.componentName.dashed)) {
              //     console.log(data);
              //   }
              // });
              fs.appendFile(`${destPath}/${item}`, libraryDefinition, function (err) {
                if (err) {
                  console.log('There was an error adding this theme component to the libraries.yml file');
                  throw err;
                }
              });
            }
          });
        }
      }
    );
  }

  install() {
    this.log('=========================================');
    this.log('Created a new component named ' + chalk.red(this.options.name) + '.');
    this.log('-----------------------------------------');
  }
};
