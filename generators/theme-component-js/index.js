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
      required: true,
      type: String,
      desc: 'The javascript file name that the behavior should sit within.'
    });
  }

  initializing() {
    // Create an object to contain all our name variations.
    this.behaviorName = {};

    // Preserve the raw layout name.
    this.behaviorName.raw = this.options.name;

    // Make sure it's the dashed version fo the component name.
    this.behaviorName.dashed = _.kebabCase(this.options.name);

    // Create a dashed version of the layout name.
    this.behaviorName.camel = _.camelCase(this.options.name);

    this.log('Creating Drupal JavaScript behavior ' + this.behaviorName.dashed + '.es6.js');
  }

  writing() {
    var destPath = this.destinationPath();

    this.fs.copyTpl(
      this.templatePath('_theme-component-js.es6.js'),
      this.destinationPath('templates/' + this.behaviorName.dashed + '/' + this.behaviorName.dashed + '.es6.js'),
      {
        camel: this.behaviorName.camel
      }
    );

    // Auto add this component to the libraries file in Drupal.
    var libraryDefinition = `
${this.behaviorName.dashed}:
  js:
    assets/js/${this.behaviorName.dashed}.js: {}

`;

    fs.readdir(
      destPath, function (err, list) {
        if (err) {
          console.log('There was an error adding this component to the libraries.yml file');
          throw err;
        } else {
          list.forEach(function (item) {
            if (item.indexOf('libraries.yml') !== -1) {
              // @TODO Check if behavior already exists.
              // fs.readFile(`${destPath}/${item}`, function (err, data) {
              //   if (err) throw err;
              //   if (data.includes(this.behaviorName.dashed)) {
              //     console.log(data);
              //   }
              // });

              fs.appendFile(`${destPath}/${item}`, libraryDefinition, function (err) {
                if (err) {
                  console.log('There was an error adding this component to the libraries.yml file');
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
    this.log('Created a new JavaScript behavior named ' + chalk.red(this.options.name) + '.');
    this.log('-----------------------------------------');
  }
};
