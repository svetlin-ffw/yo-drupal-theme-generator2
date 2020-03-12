'use strict';
/* eslint no-multi-spaces: 0 */
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _ = require('lodash');
/* eslint no-multi-spaces: 1 */

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cool ' + chalk.red('Yeoman Drupal theme') + ' generator!'
    ));

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'themeName',
        message: 'What is your theme\'s human readable name?',
        default: this.appname
        // Store: true
      },
      {
        type: 'input',
        name: 'themeNameMachine',
        message: 'What is your theme\'s machine name? EX: unicorn_theme',
        default: answers => {
          return _.snakeCase(answers.themeName);
        }
        // Store: true
      },
      {
        type: 'input',
        name: 'themeDesc',
        message: 'What is your theme\'s description',
        default: answers => {
          return `Update ${answers.themeName}.info.yml if you want to change the theme description later.`;
        }
      },
      {
        type: 'list',
        name: 'whichBaseTheme',
        message: 'Which base theme you you like to use? If you don\'t want to use a base theme ping "stable" as that\'s what\'s used by Drupal if you don\'t specify a base.',
        choices: [
          {
            value: 'stable',
            name: 'Use Stable as a base theme'
          },
          {
            value: 'classy',
            name: 'Use Classy as a base theme'
          }
        ]
      },
      {
        type: 'confirm',
        name: 'kssSections',
        message: 'Would you like some sample Style Guide sections?'
      }
    ]);

    this.kssNode = 'KSS Node style guide';

    // Add the base theme to the object.
    this.baseTheme = this.answers.whichBaseTheme;

    // Set kssSections if it's needed.
    if (this.kssNode === true) {
      this.kssSections = this.answers.kssSections;
    } else {
      this.kssSections = false;
    }

    // Create a underscored version of the theme name.
    this.cleanThemeName = _.snakeCase(this.answers.themeName);

    // Use the user provided theme machine name.
    this.themeNameMachine = this.answers.themeNameMachine;

    // Create a dashed version of the theme name.
    this.dashedThemeName = _.kebabCase(this.answers.themeName);

    // Get pkg info so we can create a 'generated on' comment.
  }

  writing() {
    this.log(this.templatePath('_package.json'));
    this.log(this.destinationPath);
    // Create the project configuration.
    // This adds node modules and tools needed.
    const projectConfig = () => {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          themeName: this.themeNameMachine
        }
      );
      this.fs.copy(
        this.templatePath('_babel.config.json'),
        this.destinationPath('babel.config.json')
      );
      this.fs.copy(
        this.templatePath('_editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('_eslintignore'),
        this.destinationPath('.eslintignore')
      );
      this.fs.copy(
        this.templatePath('_eslintrc.yml'),
        this.destinationPath('.eslintrc.yml')
      );
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('_kss.json'),
        this.destinationPath('.kss.json')
      );
      this.fs.copy(
        this.templatePath('_prettierrc.json'),
        this.destinationPath('.prettierrc.json')
      );
      this.fs.copy(
        this.templatePath('_README.md'),
        this.destinationPath('README.md')
      );
      this.fs.copy(
        this.templatePath('_screenshot.png'),
        this.destinationPath('screenshot.png')
      );
      this.fs.copy(
        this.templatePath('_stylelintrc.json'),
        this.destinationPath('.stylelintrc.json')
      );
      this.fs.copy(
        this.templatePath('TODO.md'),
        this.destinationPath('TODO.md')
      );
    };

    projectConfig();

    // Build out the theme folders.
    const scaffoldFolders = () => {
      mkdirp('components');
      mkdirp('templates');
    };

    scaffoldFolders();

    // Create the theme files.
    const projectFiles = () => {
      // Create theme.info.yml with data provided.
      this.fs.copyTpl(
        this.templatePath('_theme_name.info.yml'),
        this.destinationPath(this.themeNameMachine + '.info.yml'),
        {
          themeName: this.answers.themeName,
          themeDesc: this.answers.themeDesc,
          themeNameMachine: this.themeNameMachine,
          baseTheme: this.baseTheme
        }
      );
      // Create theme.libraries.yml with data provided.
      this.fs.copyTpl(
        this.templatePath('_theme_name.libraries.yml'),
        this.destinationPath(this.themeNameMachine + '.libraries.yml'),
        {
          themeNameMachine: this.themeNameMachine
        }
      );
      // Create theme.breakpoints.yml with data provided.
      this.fs.copyTpl(
        this.templatePath('_theme_name.breakpoints.yml'),
        this.destinationPath(this.themeNameMachine + '.breakpoints.yml'),
        {
          themeName: this.answers.themeName,
          themeNameMachine: this.themeNameMachine
        }
      );
      // Create theme.theme with data provided.
      this.fs.copyTpl(
        this.templatePath('_theme_name.theme'),
        this.destinationPath(this.themeNameMachine + '.theme'),
        {
          themeNameMachine: this.themeNameMachine
        }
      );

      // Create template folders
      this.fs.copy(
        this.templatePath('_src/templates/page'),
        this.destinationPath('templates/page')
      );
      this.fs.copy(
        this.templatePath('_src/templates/region'),
        this.destinationPath('templates/region')
      );

      // Create main global Sass file and partials.
      this.fs.copy(
        this.templatePath('_src/templates/_sass'),
        this.destinationPath('templates/_sass')
      );
      this.fs.copy(
        this.templatePath('_src/templates/base'),
        this.destinationPath('templates/base')
      );
      this.fs.copy(
        this.templatePath('_src/templates/forms'),
        this.destinationPath('templates/forms')
      );
      this.fs.copy(
        this.templatePath('_src/templates/typography'),
        this.destinationPath('templates/typography')
      );

      // If we're including sample sections, add the icons section,
      // which is a component.
      if (this.kssSections === true) {
        this.fs.copy(
          this.templatePath('_src/_sample-components/_icons'),
          this.destinationPath('components/icons')
        );
        this.fs.copyTpl(
          this.templatePath('_src/_sample-components/_icons.scss'),
          this.destinationPath('components/icons/icons.scss'),
          {
            themeNameMachine: this.themeNameMachine
          }
        );
        this.fs.copyTpl(
          this.templatePath('_src/_sample-components/_icons/icons.twig'),
          this.destinationPath('components/icons/icons.twig'),
          {
            themeNameMachine: this.themeNameMachine
          }
        );
      }

      // If we're including sample sections, add a sample list component.
      // Use the component and component-js subgenerators to build the component.
      if (this.kssSections === true) {
        // Add the sample .scss, .json and .twig files.
        this.composeWith(require.resolve('../component'),
          {
            name: 'Sample List'
          }
        );
        // Add a sample JavaScript behavior.
        this.composeWith(require.resolve('../component-js'),
          {
            name: 'sample-list'
          }
        );
      }
    };

    projectFiles();
  }

  install() {
    this.npmInstall();
  }

  end() {
    this.log(chalk.cyan.bgBlack.bold(
      `
      Your new Drupal theme is ready to use.
      `));
  }
};
