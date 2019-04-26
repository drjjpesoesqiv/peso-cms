var themes = {
  getRandomTheme: function() {
    return this.list[Math.floor((Math.random() * this.list.length) + 1)];
  },

  getThemesAsOptionsHtml: function() {
    var div = document.createElement('div');

    this.list.forEach(function(theme) {
      var option = document.createElement('option');
      option.value = theme;
      option.innerText = theme;
      div.appendChild(option);
    });

    return div.innerHTML;
  },

  list: []
}