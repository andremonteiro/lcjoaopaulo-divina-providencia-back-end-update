const { secret } = require('../config/config.json');

const stripe = require('stripe')(secret);
const UTILS = require('./format-numbers.js');

function getAllProductsAndPlans() {
    return Promise.all(
        [
        stripe.products.list({}),
        stripe.plans.list({})
        ]
    ).then(stripeData => {
        var products = stripeData[0].data;
        var plans = stripeData[1].data; 

        plans = plans.sort((a, b) => {
        /* Sort plans in ascending order of price (amount)
            * Ref: https://www.w3schools.com/js/js_array_sort.asp */
        return a.amount - b.amount;
        }).map(plan => {
        /* Format plan price (amount) */
        amount = UTILS.formatUSD(plan.amount)
        return {...plan, amount};
        });

        products.forEach(product => {
        const filteredPlans = plans.filter(plan => {
            return plan.product === product.id;
        });

        product.plans = filteredPlans;
        });

        return products;
    });
}

updateSubscription = async (requestBody) => {
  const subscription = await stripe.subscriptions.retrieve(requestBody.subscription);
  return stripe.subscriptions.update(requestBody.subscription, {
    cancel_at_period_end: false,
    proration_behavior: 'none',
    items: [{
      id: subscription.items.data[0].id,
      price: requestBody.updateplan,
    }]
  });
}

function createCustomerAndSubscription(requestBody) {
    return stripe.customers.create({
      source: requestBody.stripeToken.id,
      email: requestBody.customerEmail
    }).then(customer => {
      return stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            plan: requestBody.planId
          }
        ]
      })
    });
  }

function getSubscription(requestBody){
  return stripe.subscriptions.retrieve(requestBody.subscription);
}

module.exports = {
    getAllProductsAndPlans,
    createCustomerAndSubscription,
    getSubscription,
    updateSubscription
};