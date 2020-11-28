module.exports = function (app) {
    const UserController = app.controllers.UserController;
    app.route('/api/user')
        .post(UserController.createUser);
    app.route('/api/upload')
        .post(UserController.updateAvatar);
    app.route('/api/getAvatar')
        .post(UserController.getAvatar);
    app.route('/api/updatePassword')
        .post(UserController.updatePassword);
}