const config = require("../../config/config.json")

const stripe = require('stripe')(config.secret);
const STRIPE_API = require('../../utils/stripe-functions.js');

module.exports = function (app) {
    const _self = {};
    const User = app.models.User;
    /**
     * get
     * @param {Object} req
     * @param {Object} res
     * @route /api/token
     * @method GET
     */
    _self.pay = async (req, res) => {
      STRIPE_API.createCustomerAndSubscription(req.body).then((responseData) => {
        User.update(
          { subscription: responseData.id },
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
      }).catch(err => {
        return res.status(500).json({
          errors: err.message,
        });
      });
    }

    _self.update = async (req, res) => {
      STRIPE_API.updateSubscription(req.body).then(() => {
        return res.status(200).json({ message: 'sucess' });
      }).catch(err => {
        return res.status(500).json({
          errors: err.message,
        });
      });
    }

    _self.exitplan = async (req, res) => {
      STRIPE_API.getSubscription(req.body).then((data)=>{
        return res.status(200).json({ responsedata: data.items.data[0]['plan'] });
      }).catch(err => {
        return res.status(500).json({
          errors: err.message,
        });
      })
    }

    return _self;
}
