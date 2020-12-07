const STRIPE_API = require('../../utils/stripe-functions.js');

module.exports = function (app) {
    const _self = {};
    const Key = app.models.Enviroment;
    /**
     * getAllPlanList
     * @param {Object} req
     * @param {Object} res
     * @route /api/getAllPlanList
     * @method GET
    */
    _self.getAllPlanList = async (req, res, next) => {
        try{    
            await init();
            STRIPE_API.getAllProductsAndPlans(req.body.env).then(products => {
                products = products.filter(product => {
                    return product.plans.length > 0;
                });
                
                return res.status(200).json({ products: products });
            });
        }catch(e){
            return res.status(500).json({
                errors: e.message,
            });
        }
    }

    init = async () => {
        const { count, rows } = await Key.findAndCountAll({ where: { flag:"secret" } });
        const temp = {'test':'', 'live': ''};
        temp.live = rows[0].dataValues.key;
        temp.test = rows[1].dataValues.key;
        STRIPE_API.initStripe(temp);
    }
    
    return _self;
}