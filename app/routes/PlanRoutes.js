module.exports = function(app) {
    const controller = app.controllers.PlanController;
    app.route('/api/getAllPlanList')
        .post(controller.getAllPlanList);
}