module.exports = function(app) {
    const controller = app.controllers.EnviromentController;
    app.route('/api/getkey')
        .get(controller.getKey);
}