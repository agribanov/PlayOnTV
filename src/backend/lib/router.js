var routes = {},
    bindRoute = function(command, callback){
      routes[command] = callback;
    },
    bindRoutes = function(namespace, controller){
      for (action in controller){
        bindRoute(namespace + ':' + action, controller[action]);
      };
    },
    call = function(socket, command){
      return function(data){
        return routes[command](socket, data);
      }
    };

module.exports = {
  add: function(namespace, controller){
    if (typeof controller == 'function')
      bindRoute(namespace, controller);
    else
      bindRoutes(namespace, controller);
  },
  apply: function(socket){
    for (command in routes){
      socket.on(command, call(socket, command));
    }
  }
}