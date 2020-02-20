/**
 * @file
 * Use this to describe what your behavior does.
 */

((document, Drupal, $) => {
  Drupal.behaviors.<%= camel %> = {
    attach(context) {
      $('.<%= dashed %>', context).addClass('testing');
    },
  };
})(document, Drupal, jQuery);
