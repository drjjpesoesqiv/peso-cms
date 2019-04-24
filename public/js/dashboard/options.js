/*
 *
 */
var Options = {
  storage: window.localStorage,
  
  /*
   *
   */
  setTheme: function(lang, theme) {
    this.storage.setItem('options_theme_' + lang, theme);
  },

  /*
   *
   */
  getTheme: function(lang) {
    return this.storage.getItem('options_theme_' + lang);
  }
}