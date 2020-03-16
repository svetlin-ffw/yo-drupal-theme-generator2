# Installation
1. Clone the generator repo (https://github.com/svetlin-ffw/yo-drupal-theme-generator)
2. `cd yo-drupal-theme-generator`
3. `npm install`
4. `cd YOUR_PROJECT/themes/custom`
5. `mkdir THEME_NAME`
6. `cd THEME_NAME`
7. `yo drupal-theme` - will generate a new theme. See the [example theme](https://github.com/ffwagency/ffw_theme/tree/feature/d8_yo_components)
8. `yo drupal-theme:component 'COMPONENT NAME'`  
   Will generate a new folder in the `components` folder with the name `component-name` with the following files inside:
      - component-name.json
      - component-name.scss
      - component-name.twig
9.  `yo drupal-theme:theme-component 'COMPONENT NAME'`
    1.  Will generate a new folder in the `templates` folder with the name `component-name` with  the following files inside:
        - component-name.scss
        - component-name.twig
    2. Will update `THEME_NAME.libraries.yml` with the path to the theme component CSS file:

        ```
        component-name:
          css:
            component:
              templates/component-name/component-name.css: {}
        ```
10.  `yo drupal-theme:theme-component-js 'BEHAVIOR NAME'`    
     1.   Will reuse an exisitng folder in the `templates` folder with the name `behavior-name` or create a new one with the following file:
          - component-name.es6
     2.  Will update `THEME_NAME.libraries.yml` with the path to the theme component JS file:
          ```
          component-name:
            js:
              assets/js/component-name.js: {}
          ```

