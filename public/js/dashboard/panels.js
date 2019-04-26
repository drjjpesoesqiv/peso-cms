var Panels = {
  list: {},

  addPanel: function(id, label, toggleCallback, active) {
    var el = document.getElementById(id);
    el.toggle = toggleCallback || function() {
      el.classList.toggle('hide');
    }
    toolbar.addButton(label, el.toggle, true, active);
    this.list[id] = el;
  }
}
