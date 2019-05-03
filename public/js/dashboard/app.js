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
      thisApp.editors[lang] = new Editor('textarea_' + lang, lang);
    });
  },

  /*
   *
   */
  selectTheme: function(lang, theme) {
    Options.setTheme(lang, theme);
    App.editors[lang].setTheme(theme);
  },

  /*
   *
   */
  toggleEditor: function(lang) {
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
      url: '/dashboard/save',
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
      url: '/dashboard/load',
      success: function(page) {
        ['html','css','js','json'].forEach(function(lang) {
          thisApp.editors[lang].setValue((typeof page[lang] != 'undefined') ? page[lang] : '');
        });

        if (typeof page.icon != 'undefined')
          $('#iconPanel').val(page.icon);
  
        App.preview();
      }
    });
  }
}

$(function() {
  App.init();

  toolbar.addButton('<i class="fas fa-file"></i>', App.new);
  Panels.addPanel('optionsPanel', '<i class="fas fa-cog"></i>', null, false);
  toolbar.addButton('<i class="fas fa-bug"></i>', App.preview);
  toolbar.addButton('<i class="fas fa-save"></i>', App.save);
  toolbar.addButton('<i class="fas fa-file-upload"></i>', App.load);
  toolbar.addInput('title');
  toolbar.addButton('<i class="fas fa-caret-square-left"></i>', App.toggleLeftPanels, true);
  toolbar.addButton('<i class="fas fa-caret-square-right"></i>', App.toggleRightPanels, true);

  // add language panels
  ['html','css','js','json'].forEach(function(lang) {
    Panels.addPanel('textarea_' + lang, lang, function() {
      App.toggleEditor(lang);
    }, true);
  });

  // add browser panel
  Panels.addPanel('browserPanel', '<i class="fas fa-globe-americas"></i>', null, false);
  Panels.addPanel('iconPanel', 'I', null, false);

  // options theme selectors
  ['html','css','js','json'].forEach(function(lang) {
    var select = document.createElement('select');
    select.id = 'options_theme_' + lang;
    select.innerHTML = themes.getThemesAsOptionsHtml();
    select.value = Options.getTheme(lang) || themes.getRandomTheme();
    select.onchange = function() {
      App.selectTheme(lang, select.value);
    }

    let label = document.createElement('label');
    label.innerText = lang;

    let p = document.createElement('p');
    p.appendChild(label);
    p.appendChild(select);

    select.dispatchEvent(new Event("change"));

    document.getElementById('optionsPanel').appendChild(p);
  });
});
