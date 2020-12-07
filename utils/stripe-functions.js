const { secret } = require('../config/config.json');
const stripe = require('stripe');

var stripe_test;
var stripe_live;
const UTILS = require('./format-numbers.js');
const { request } = require('express');


function initStripe(key){
  console.log(key)
  stripe_live = require('stripe')(key.live);
  stripe_test = require('stripe')(key.test);
  return 'ok'
}

function getAllProductsAndPlans(flag) {
    const stripe = flag? stripe_test: stripe_live;
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
  const stripe = requestBody.env == "test"? stripe_test: stripe_live;
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
    const stripe = requestBody.env == "test"? stripe_test: stripe_live;
    // console.log(stripe)
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
  const stripe = requestBody.env == "test"? stripe_test: stripe_live;

  return stripe.subscriptions.retrieve(requestBody.subscription);
}

module.exports = {
    getAllProductsAndPlans,
    createCustomerAndSubscription,
    getSubscription,
    initStripe,
    updateSubscription
};