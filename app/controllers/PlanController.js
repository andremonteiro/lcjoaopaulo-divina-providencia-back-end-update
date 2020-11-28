const STRIPE_API = require('../../utils/stripe-functions.js');

module.exports = function (app) {
    const _self = {};

    /**
     * getAllPlanList
     * @param {Object} req
     * @param {Object} res
     * @route /api/getAllPlanList
     * @method GET
    */
    _self.getAllPlanList = async (req, res, next) => {
        try{    
            STRIPE_API.getAllProductsAndPlans().then(products => {
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
    
    return _self;
}