var fs = require('fs');
var template = fs.readFileSync('./templates/page/page.html', 'utf8');

var page =
{
  compile: function(data) {
    var doc = '' + template;

    doc = doc.replace('__title__', data['title']);

    if (typeof data['icon'] == 'undefined') data['icon'] = '';
      doc = doc.replace('__icon__', '<link href="' + data['icon'] + '" id="icon" rel="shortcut icon" type="image/x-icon">');

    if (typeof data['css'] == 'undefined') data['css'] = '';
      doc = doc.replace('__css__', '<style>' + data['css'] + '</style>');

    if (typeof data['html'] == 'undefined') data['html'] = '';
      doc = doc.replace('__html__', data['html']);

    if (typeof data['json'] == 'undefined') data['json'] = '';
      doc = doc.replace('__json__', "<script>var jsonData=" + data['json'] + "</script>");

    if (typeof data['js'] == 'undefined') data['js'] = '';
      doc = doc.replace('__js__', '<script>' + data['js'] + '</script>');

    return doc;
  }
}

module.exports = page;
