const STRIPE_API = require('../../utils/stripe-functions.js');

module.exports = function (app) {
    const _self = {};
    const Key = app.models.Enviroment;

    init = async () => {
        const temp = {'test':'', 'live': ''};
        const { count, rows } = await Key.findAndCountAll({ where: { flag:"secret" } });
        var result = rows.filter(key => key.dataValues.comment == "sk_live");
        
        temp.live = result[0].dataValues.key;
        var result1 = rows.filter(key => key.dataValues.comment == "sk_test");
        temp.test = result1[0].dataValues.key;
        
        STRIPE_API.initStripe(temp);
    }

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
    
    return _self;
}