module.exports = function(app) {
    const controller = app.controllers.PaymentController;
    app.route('/api/appointments')
        .post(controller.pay);
    app.route('/api/updateplan')
        .post(controller.update)
    app.route('/api/exitplan')
        .post(controller.exitplan)
}