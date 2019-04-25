/*
 *
 */
var App = {
  preview_header: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><script type="text/javascript" src="../js/jquery-3.4.0.min.js"></script></head><body>',
  preview_footer: '</body></html>',
  editors: {},

  /*
   *
   */
  init: function() {
    this.initEditors();
  },

  /*
   *
   */
  initEditors: function() {
    var thisApp = this;
    ['html','css','js','json'].forEach(function(lang) {
      thisApp.editors[lang] = new Editor('textarea_' + lang, lang, Options.getTheme(lang));
    });
  },

  /*
   *
   */
  selectTheme: function(el, lang) {
    Options.setTheme(lang, el.value);
    this.editors[lang].setTheme(el.value);
  },

  /*
   *
   */
  toggleOptions: function() {
    $('#options_overlay').toggle();
  },

  /*
   *
   */
  toggleLang: function(el, lang) {
    $(el).toggleClass('active');
    this.editors[lang].toggle();
  },

  /*
   *
   */
  toggleLeftPanels: function(el) {
    $(el).toggleClass('active');
    $('#leftPanels').toggle();

    var rightBasis = $('#leftPanels').is(':hidden') ? '100%' : '50%';
    $('#rightPanels').css({'flex-basis': rightBasis,'max-width': rightBasis});
  },

  /*
   *
   */
  toggleRightPanels: function(el) {
    $(el).toggleClass('active');
    $('#rightPanels').toggle();
    
    var leftBasis = $('#rightPanels').is(':hidden') ? '100%' : '50%';
    $('#leftPanels').css({'flex-basis': leftBasis,'max-width': leftBasis});
  },

  /*
   *
   */
  toggleIconPanel: function(el) {
    $(el).toggleClass('active');
    $('#iconPanel').toggle();
  },

  /*
   *
   */
  toggleBrowserPanel: function(el) {
    $(el).toggleClass('active');
    $('#browserPanel').toggle();
  },

  /*
   *
   */
  preview: function() {
    var jsonCode = this.editors['json'].getValue();
    if (jsonCode.length == 0)
      jsonCode = '{}';

    let html = this.editors['html'].getValue();
    let json = "<script>var jsonData = " + jsonCode  + "</script>";
    let css  = '<style>' + this.editors['css'].getValue() + '</style>';
    let js   = '<script>' + this.editors['js'].getValue() + '</script>';
  
    $('#preview').removeAttr('src');
    $('#preview').attr('srcdoc', App.preview_header + css + html + json + js + App.preview_footer);
  },

  /*
   *
   */
  new: function() {
    $('#title').val('');

    this.editors['json'].setValue('');
    this.editors['html'].setValue('');
    this.editors['css'].setValue('');
    this.editors['js'].setValue('');

    $('#iconPanel').val('');
  
    $('#preview').removeAttr('srcdoc');
    $('#preview').removeAttr('src');
    $('#preview').html('');
  },

  /*
   *
   */
  save: function() {
    var temp = {
      json: this.editors['json'].getValue(),
      html: this.editors['html'].getValue(),
      css:  this.editors['css'].getValue(),
      js: this.editors['js'].getValue(),
      icon: $('#iconPanel').val()
    };

    if (temp.json.length == 0)
      temp.json = '{}';

    var data = {
      title: $('#title').val(),
    };

    for (var i in temp)
      if (temp[i].length > 0)
        data[i] = temp[i];

    $.ajax({
      type: 'post',
      data: { data: data },
      url: '/editor/save',
      success: function() {
        App.preview();
      },
      error: function() {
        // do error
      }
    });
  },

  /*
   *
   */
  load: function() {
    var thisApp = this;
    var title = $('#title').val();
    $.ajax({
      type: 'post',
      data: { title: title },
      url: '/editor/load',
      success: function(page) {
        ['html','css','js','json'].forEach(function(lang) {
          if (typeof page[lang] != 'undefined')
            thisApp.editors[lang].setValue(page[lang]);
        });

        if (typeof page.icon != 'undefined')
          $('#iconPanel').val(page.icon);
  
        App.preview();
      }
    });
  }
}

$(function() {
  ['html','css','js','json'].forEach(function(lang) {
    $('#options_theme_' + lang).html($('#theme_selections_proto').html());
    $('#options_theme_' + lang).val(Options.getTheme(lang) || 'default');
  });

  App.init();
});
