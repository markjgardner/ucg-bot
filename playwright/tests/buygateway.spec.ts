import { test, expect } from '@playwright/test';
test('buy-ucg', async ({ page, request }) => {

  //TODO: call function endpoint to check if you have already bought one.
  var response = await request.get("https://ucgbot.azurewebsites.net/api/status");
  if ((await response.status()) == 201)
  {
    console.log("Already bought UCG");
    expect(true).toBeTruthy();
  }

  await page.goto('https://store.ui.com/us/en/pro/category/all-unifi-cloud-gateways/products/ucg-ultra');

  var button = await page.getByRole("button").getByText("Add to Cart");
  if (await button.count() == 0)
  {
    console.log("UCG currently sold out");
    expect(false).toBeTruthy();
  }
  await page.getByRole("button").getByText("Add to Cart").click();
  console.log("UCG in cart");

  await page.goto('https://store.ui.com/us/en/pro/category/switching-utility/collections/pro-ultra/products/usw-ultra-60w');
  await page.getByRole("button").getByText("Add to Cart").click();
  console.log("USW in cart");

  await page.goto("https://store.ui.com/us/en/checkout");
  await page.getByText("Check Out").click();
  await page.getByRole("button").getByText("Sign In").click();
  await page.getByText("Continue to Shipping").click();
  await page.getByText("Continue to Payment").click();

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

  var payresponse = await page.waitForResponse(response => response.url().startsWith('https://api.stripe.com/v1/payment_intents/') && response.url().endsWith('/confirm'));
  if (payresponse.status() < 200 || payresponse.status() >= 300)
  {
    console.log("Payment failed: " + payresponse.status());
    expect(false).toBeTruthy();
  }

  var response = await request.put("https://ucgbot.azurewebsites.net/api/bought");
  console.log("UCG purchase complete: " + response.status());
  expect(true).toBeTruthy();
});