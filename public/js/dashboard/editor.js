/*
 *
 */
var Editor = function(textAreaId, syntax) {
  this.textAreaId = textAreaId;
  this.mirror = null;

  switch (syntax) {
    case 'html':
      syntax = 'xml';
      break;
    case 'js':
    case 'json':
      syntax = 'javascript';
      break;
  }

  this.init(syntax);
}
Editor.prototype = {
  /*
   *
   */
  init: function(syntax) {
    this.mirror = CodeMirror.fromTextArea(document.getElementById(this.textAreaId), {
      lineNumbers: true,
      matchBrackets: true,
      mode: {
        name: syntax,
        globalVars: true
      },
      styleActiveLine: true,
      htmlMode: (syntax == 'xml') ? true : false,
      extraKeys: {
        "Alt-F": function(cm) {
          cm.setOption("fullScreen", ! cm.getOption("fullScreen"));
        },
        "F11": function(cm) {
          cm.setOption("fullScreen", ! cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
      }
    });
  },

  /*
   *
   */
  setTheme: function(theme) {
    this.mirror.setOption('theme', theme);
  },

  getValue: function() {
    return this.mirror.getValue();
  },

  setValue: function(value) {
    this.mirror.setValue(value);
  },

  toggle() {
    $('#' + this.textAreaId).next().toggle();
    this.mirror.refresh();
  }
}
