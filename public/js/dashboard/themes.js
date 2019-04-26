var themes = {
  getRandomTheme: function() {
    return this.list[Math.floor((Math.random() * this.list.length) + 1)];
  },

  list: []
}