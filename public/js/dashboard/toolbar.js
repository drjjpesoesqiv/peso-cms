var toolbar = {
  elId: "topPanel",

  addButton: function(label, callback, active) {
    var btn =  document.createElement('button');
    btn.className = (active) ? 'active' : '';
    btn.innerHTML = label;
    btn.onclick = function() {
      btn.classList.toggle('active');
      callback();
    };
    document.getElementById(this.elId).append(btn);
  },

  addInput: function(id) {
    var input = document.createElement('input');
    input.id = id;
    input.type = 'text';
    document.getElementById(this.elId).append(input);
  }
}