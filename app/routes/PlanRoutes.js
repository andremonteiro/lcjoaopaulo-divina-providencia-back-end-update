module.exports = function(app) {
    const controller = app.controllers.PlanController;
    app.route('/api/getAllPlanList')
        .get(controller.getAllPlanList);
}