const config = require("../../config/config.json")

const STRIPE_API = require('../../utils/stripe-functions.js');  

module.exports = function (app) {
    const _self = {};
    const User = app.models.User;
    const Key = app.models.Enviroment;

    /**
     * get
     * @param {Object} req
     * @param {Object} res
     * @route /api/token
     * @method GET
     */
    
    _self.pay = async (req, res) => {
      await init();
      const flag = req.body.env;
      STRIPE_API.createCustomerAndSubscription(req.body).then((responseData) => {
        if(flag == "test"){
          User.update(
            { subscription_test: responseData.id },
            { where: { 'email': req.body.customerEmail } }
          )
          .then( result=> {
            return res.status(200).json({ message: 'sucess' });
          })
          .catch( err=> {
              return res.status(500).json({
                  errors: err,
              });
          })
        }else{
          User.update(
            { subscription_live: responseData.id },
            { where: { 'email': req.body.customerEmail } }
          )
          .then( result=> {
            return res.status(200).json({ message: 'sucess' });
          })
          .catch( err=> {
              return res.status(500).json({
                  errors: err,
              });
          })
        }
      }).catch(err => {
        return res.status(500).json({
          errors: err.message,
        });
      });
    }

    _self.update = async (req, res) => {
      await init();
      STRIPE_API.updateSubscription(req.body).then(() => {
        return res.status(200).json({ message: 'sucess' });
      }).catch(err => {
        return res.status(500).json({
          errors: err.message,
        });
      });
    }

    _self.exitplan = async (req, res) => {
      await init();

      STRIPE_API.getSubscription(req.body).then((data)=>{
        return res.status(200).json({ responsedata: data.items.data[0]['plan'] });
      }).catch(err => {
        return res.status(500).json({
          errors: err.message,
        });
      })
    }

    init = async () => {
      const { count, rows } = await Key.findAndCountAll({ where: { flag:"secret" } });
      const temp = {'test':'', 'live': ''};
      temp.live = rows[1].dataValues.key;
      temp.test = rows[0].dataValues.key;
      STRIPE_API.initStripe(temp);
     }

    return _self;
}
