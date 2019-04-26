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
    this.initDashboard();
    this.initEditors();
  },

  initDashboard: function() {

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
    App.editors[lang].setTheme(el.value);
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
  toggleLang: function(lang) {
    App.editors[lang].toggle();
  },

  /*
   *
   */
  toggleLeftPanels: function() {
    $('#leftPanels').toggle();

    var rightBasis = $('#leftPanels').is(':hidden') ? '100%' : '50%';
    $('#rightPanels').css({'flex-basis': rightBasis,'max-width': rightBasis});
  },

  /*
   *
   */
  toggleRightPanels: function() {
    $('#rightPanels').toggle();
    
    var leftBasis = $('#rightPanels').is(':hidden') ? '100%' : '50%';
    $('#leftPanels').css({'flex-basis': leftBasis,'max-width': leftBasis});
  },

  /*
   *
   */
  toggleIconPanel: function() {
    $('#iconPanel').toggle();
  },

  /*
   *
   */
  toggleBrowserPanel: function() {
    $('#browserPanel').toggle();
  },

  /*
   *
   */
  preview: function() {
    var jsonCode = App.editors['json'].getValue();
    if (jsonCode.length == 0)
      jsonCode = '{}';

    let html = App.editors['html'].getValue();
    let json = "<script>var jsonData = " + jsonCode  + "</script>";
    let css  = '<style>' + App.editors['css'].getValue() + '</style>';
    let js   = '<script>' + App.editors['js'].getValue() + '</script>';
  
    $('#preview').removeAttr('src');
    $('#preview').attr('srcdoc', App.preview_header + css + html + json + js + App.preview_footer);
  },

  /*
   *
   */
  new: function() {
    $('#title').val('');

    App.editors['json'].setValue('');
    App.editors['html'].setValue('');
    App.editors['css'].setValue('');
    App.editors['js'].setValue('');

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
      json: App.editors['json'].getValue(),
      html: App.editors['html'].getValue(),
      css:  App.editors['css'].getValue(),
      js: App.editors['js'].getValue(),
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
    var thisApp = App;
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
    $('#options_theme_' + lang).html(themes.getThemesAsOptionsHtml());
    $('#options_theme_' + lang).val(Options.getTheme(lang) || 'default');
  });

  App.init();

  let active = 1;
  toolbar.addButton('NEW', App.new);
  toolbar.addButton('OPTIONS', App.toggleOptions);
  toolbar.addButton('PREVIEW', App.preview);
  toolbar.addButton('SAVE', App.save);
  toolbar.addButton('LOAD', App.load);
  toolbar.addInput('title');
  toolbar.addButton('L', App.toggleLeftPanels, active);
  toolbar.addButton('R', App.toggleRightPanels, active);
  toolbar.addButton('html', function() { App.toggleLang('html') }, active);
  toolbar.addButton('css', function() { App.toggleLang('css') }, active);
  toolbar.addButton('js', function() { App.toggleLang('js') }, active);
  toolbar.addButton('json', function() { App.toggleLang('json') }, active);
  toolbar.addButton('B', App.toggleBrowserPanel);
  toolbar.addButton('I', App.toggleIconPanel, active);
});
