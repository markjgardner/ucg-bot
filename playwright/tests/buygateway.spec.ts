import { test, expect } from '@playwright/test';

test('buy-ucg', async ({ page, request }) => {
  const fs = require('fs');  

  // Check if we already bought the UCG
  var bought = await fs.readFileSync('state/bought.txt', 'utf8');
  if (bought == "true")
  {
    console.log("Already bought UCG");
    expect(true).toBeTruthy();
    return;
  }
  console.log("UCG not bought, checking availability");

  // Check if it's in stock
  await page.goto('https://store.ui.com/us/en/pro/category/all-unifi-cloud-gateways/products/ucg-ultra');

  var button = await page.getByRole("button").getByText("Add to Cart");
  if (await button.count() == 0)
  {
    console.log("UCG currently sold out");
    expect(false).toBeTruthy();
  }

  // Buy one
  await page.getByRole("button").getByText("Add to Cart").click();
  console.log("UCG in cart");

  // And a USW
  await page.goto('https://store.ui.com/us/en/pro/category/switching-utility/collections/pro-ultra/products/usw-ultra-60w');
  await page.getByRole("button").getByText("Add to Cart").click();
  console.log("USW in cart");

  await page.goto("https://store.ui.com/us/en/checkout");
  console.log("Checking out");
  await page.getByText("Check Out").click();
  await page.getByRole("button").getByText("Sign In").click();
  console.log("Signed In");
  await page.getByText("Continue to Shipping").click();
  console.log("Shipping");
  await page.getByText("Continue to Payment").click();
  console.log("Payment");

  var frame = await page.getByTitle("Secure card number input frame").frameLocator(":scope");
  if (frame != null)
  {
    console.log("Filling in card number");
    var ccnum = process.env.CCNUM || '';
    await frame.getByLabel("Credit or debit card number").fill(ccnum);
  }
  else
  {
    console.log("Card number frame not found");
    expect(false).toBeTruthy();
  }

  var frame = await page.getByTitle("Secure CVC input frame").frameLocator(":scope");
  if (frame != null)
  {
    console.log("Filling in cvc");
    var cvc = process.env.CVC || '';
    await frame.getByLabel("Credit or debit card CVC/CVV").fill(cvc);
  }
  else
  {
    console.log("CVC number frame not found");
    expect(false).toBeTruthy();
  }

  var frame = await page.getByTitle("Secure expiration date input frame").frameLocator(":scope");
  if (frame != null)
  {
    console.log("Filling in card expiration date");
    var exp = process.env.CCEXP || '';
    await frame.getByLabel("Credit or debit card expiration date").fill(exp);
  }
  else
  {
    console.log("Card expiration frame not found");
    expect(false).toBeTruthy();
  }
  
  await page.getByText("Pay Now", {exact: true}).click();
  console.log("Paid");

  // Wait for the payment to go through
  var payresponse = await page.waitForResponse(response => response.url().startsWith('https://api.stripe.com/v1/payment_intents/') && response.url().endsWith('/confirm'));
  if (payresponse.status() < 200 || payresponse.status() >= 300)
  {
    console.log("Payment failed: " + payresponse.status());
    expect(false).toBeTruthy();
  }

  // Save the fact that we bought the UCG
  await fs.writeFileSync('state/bought.txt', 'true');
  console.log("UCG purchase complete");
  expect(true).toBeTruthy();
});