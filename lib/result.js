var Result = function() {
  this.success = false;
  this.warnings = [];
  this.errors = [];
  this.data = {};
}

Result.prototype = {
  succeed: function() {
    this.success = true;
    return this;
  },

  error: function(err) {
    this.errors.push(err);
    this.succeed = false;
    return this;
  },

  warning: function(err) {
    this.warnings.push(err);
  },

  json: function() {
    var j = { success: this.success };

    if (this.warnings.length)
      j['warnings'] = this.warnings;

    if (this.errors.length)
      j['errors'] = this.errors;

    if (Object.keys(this.data).length === 0)
      j['data'] = this.data;

    return JSON.stringify(j);
  }
}

module.exports = Result;
