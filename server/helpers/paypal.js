const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "AcwKGDER3PheGKmNr5oDYbM4SGVxb8WPc7QEz672WqxF7WBMlZ-AsP28gC93d8Axx1yArCl1YS_fHOyt",
  client_secret: "EP0ikNlTwq_cz4iMfpjYT2s85E1vPikSUolBwHVFheWc0EhHv4DQwKmHSCWcwkIb_5SCiqPnx-kdcyRm",
});

module.exports = paypal;