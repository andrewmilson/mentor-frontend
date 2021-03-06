function User(username, present) {
  this.ws = new WebSocket("ws://" + SERVER_IP + "/chat?username=" + username);
  this.username = username;
  this.present = present || this.defaultPresent;

  this.ws.onopen = function(e) {
    console.log(e);
  };

  this.ws.onmessage = function(e) {
    console.log("New message!");
    var d = JSON.parse(e.data);

    this.present.call(this, d);
  };
};

User.prototype.sendMessage = function(to, message) {
  var msg = {
    "username": to,
    "message": message,
    "muted": false
  };

  this.ws.send(JSON.stringify(msg));

  msg.username = this.username;

  return msg;
};

User.prototype.defaultPresent = function(d) {
  document.write(d.username + ": " + d.message);
};
