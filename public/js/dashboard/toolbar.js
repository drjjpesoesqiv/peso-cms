var toolbar = {
  elId: "topPanel",

  addButton: function(label, callback, toggle, active) {
    var btn =  document.createElement('button');
    btn.className = (toggle) ? 'active' : '';
    btn.innerHTML = label;
    btn.onclick = function() {
      console.log('hello');
      if (toggle)
        btn.classList.toggle('active');
      callback();
    };
    document.getElementById(this.elId).append(btn);
    if (toggle && active === false)
      btn.dispatchEvent(new Event('click'));
  },

  addInput: function(id) {
    var input = document.createElement('input');
    input.id = id;
    input.type = 'text';
    document.getElementById(this.elId).append(input);
  }
}