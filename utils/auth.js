const hasPermission = (user, permission) => {
    return user.permissions[permission];
  };
  
  module.exports = { hasPermission };
  