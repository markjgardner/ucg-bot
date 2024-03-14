import { test, expect } from '@playwright/test';
test('buy-ucg', async ({ page, request }) => {

  //TODO: call function endpoint to check if you have already bought one.
  var response = await request.get("https://ucgbot.azurewebsites.net/api/status?code=VCGTOwSoy_T1E0uExTj-kGgp0nt4ctd4i1eUX1VspyTyAzFu2uKy8w==");
  if ((await response.status()) == 201)
  {
    console.log("Already bought UCG");
    expect(true).toBeTruthy();
    return;
  }

  await page.goto('https://store.ui.com/us/en/pro/category/all-unifi-cloud-gateways/products/ucg-ultra');

  var button = await page.getByRole("button").getByText("Add to Cart");
  if (await button.count() == 0)
  {
    console.log("UCG currently sold out");
    expect(false).toBeTruthy();
    return;
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

  var frame = await page.getByTitle("Secure CVC input frame").frameLocator(":scope");
  if (frame != null)
  {
    console.log("Filling in cvc");
    var cvc = process.env.CVC || '';
    await frame.getByLabel("Credit or debit card CVC/CVV").fill(cvc);
  }

  var frame = await page.getByTitle("Secure expiration date input frame").frameLocator(":scope");
  if (frame != null)
  {
    console.log("Filling in card expiration date");
    var exp = process.env.CCEXP || '';
    await frame.getByLabel("Credit or debit card expiration date").fill(exp);
  }
  
  await page.getByText("Pay Now", {exact: true}).click();
  console.log("Paid");

  await page.waitForURL("https://store.ui.com/us/en/checkout/thank-you");

  await request.put("https://ucgbot.azurewebsites.net/api/bought?code=Nn81x7TVTI43DHsGo4ZmtlNjXrWZyk3yGfk0S3gI_1N8AzFuX5x2CA==");
  console.log("UCG purchase complete");
  expect(true).toBeTruthy();
});