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
      desc: 'The component file name that the javascript should sit within.'
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

    this.log('Creating component JavaScript ' + this.behaviorName.dashed + '.es6.js');
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_component-js.es6.js'),
      this.destinationPath('components/' + this.behaviorName.dashed + '/' + this.behaviorName.dashed + '.es6.js'),
      {
        camel: this.behaviorName.camel,
        dashed: this.behaviorName.dashed
      }
    );
  }

  install() {
    this.log('=========================================');
    this.log('Created a new component JavaScript named ' + chalk.red(this.options.name) + '.');
    this.log('-----------------------------------------');
  }
};
