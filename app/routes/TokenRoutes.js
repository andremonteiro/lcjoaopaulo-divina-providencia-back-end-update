module.exports = function(app) {
    const controller = app.controllers.TokenController;
    app.route('/api/token')
        .get(controller.get);
    app.route('/api/signin')
        .post(controller.signin);
}