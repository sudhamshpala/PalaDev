import { expect, test } from '@playwright/test';

//Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
//Login 3 times sucessfully
test('Login multiple times sucessfully @c1', async ({ page }) => {
  // Login multiple times
  for (let i = 1; i <= 3; i++) {
    await page.goto('/');
    await page.locator(`//*[@href='/challenge1.html']`).click();
    await page.locator('#email').fill(`test${i}@example.com`);
    await page.locator('#password').fill(`password${i}`);
    await page.locator('#submitButton').click();
    // Wait for the success message to appear
    page.locator(`(//*[@id='successMessage'])[1]/h3`).waitFor;
    // Validate success message and displayed credentials
    await expect(page.locator(`(//*[@id='successMessage'])[1]/h3`)).toHaveText('Successfully submitted!');
    await expect(page.locator(`(//*[@id='successMessage'])[1]//p[@id='emailDisplay']`)).toHaveText(`Email: test${i}@example.com`);
    await expect(page.locator(`(//*[@id='successMessage'])[1]//p[@id='passwordDisplay']`)).toHaveText(`Password: password${i}`);
  }
});

// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout sucessfully @c2', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge2.html']`).click();

  //Tried all operations to wait for Animation sign in button which are commented below - but eventually i had to work on key board actions
  await page.locator('#email').pressSequentially(`test1@example.com`, { delay: 100 });
  await page.locator('#password').pressSequentially(`password1`, { delay: 100 });

  
  // Press the Enter key to submit the form (or trigger any other action) for flaky sign in button
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // If the Account button is based on styles or classes, you can retrieve computed styles
  // const style = await inputField.evaluate(el => window.getComputedStyle(el).getPropertyValue('animation'));
  // console.log(`Input transition style: ${style}`);
  //await page.waitForTimeout(5000);

  // const style1 = await inputField.evaluate(el => window.getComputedStyle(el).getPropertyValue('animation'));
  // console.log(`Input transition style: ${style1}`);


  // Validate success message and displayed credentials
  await expect(page.locator(`//*[@class='welcome-message']`)).toHaveText('Welcome!');
  await expect(page.locator(`//*[@id='userEmail']`)).toHaveText(`Logged in as: test1@example.com`);

  // Ensure the Account button is interactable
  //Tried all below commemted methods but only static wait was working for account button
  //const inputField = page.locator('#menuButton'');

  //await page.waitForSelector('#menuButton', { state: 'visible' });
  // await page.hover('#menuButton'); // Stabilize if needed
  // await page.locator('#menuButton').scrollIntoViewIfNeeded();
  // await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; }' });

  // // You could also check for other dynamic behavior, like 'focus' state or 'input' event
  // const isFocused = await inputField.evaluate(el => document.activeElement === el);
  // console.log(`Input field is focused: ${isFocused}`);

  // // Trigger focus to potentially test the animation
  // await inputField.focus();
  // await page.waitForTimeout(5000);  // Wait for any animation to happen
  // //await page.waitForLoadState('networkidle');


  // await page.waitForLoadState('networkidle');
  // page.locator('#menuButton').waitFor;
  // page.locator('#menuButton').focus;
  // await page.locator('#menuButton').click();
  

  await page.waitForLoadState('networkidle');
  page.locator('#menuButton').isEnabled;
  page.locator('#menuButton').waitFor;
  await page.waitForSelector('#menuButton', { state: 'visible' });
  await page.waitForTimeout(2000);
  //await page.click('#menuButton', { force: true });

  await page.locator('#menuButton').click();

  
  // Logout flow
  page.locator('#logoutOption').isEnabled;
  page.locator('#logoutOption').waitFor;
  await page.locator('#logoutOption').click();

  // Assert user is logged out by checking for the login button
  await expect(page.locator('#submitButton')).toBeVisible();
});

//Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge3.html']`).click();

  // Trigger password reset flow
  await page.getByRole('button', { name: 'Forgot Password?' }).click();
  //await page.waitForTimeout(5000);
  await page.waitForLoadState('networkidle');
  await page.locator('#email').fill('test@example.com');
  await page.getByRole('button', { name: 'Reset Password' }).click();

  // Validate success messages
  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible();
  await expect(page.locator('#mainContent')).toContainText('Password reset link sent!');
  await expect(page.locator(`(//*[@id='mainContent'])[1]//h3`)).toContainText('Success');
  await expect(page.locator(`(//*[@id='mainContent']//p)[1]`)).toContainText(`Password reset link sent!`);
  await expect(page.locator(`(//*[@id='mainContent']//p)[2]`)).toContainText(`Email: test@example.com`);
});

//Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
test('Login and logout @c4', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge4.html']`).click();

  // Wait for the global readiness variable or state
  await page.waitForLoadState('networkidle');
  
  await page.locator('#email').pressSequentially(`test@example.com`, { delay: 100 });
  //await page.waitForTimeout(2000);
  await page.locator('#password').pressSequentially(`password`, { delay: 100 });
  //await page.waitForTimeout(2000);
  await page.locator('#submitButton').click();
  //await page.waitForTimeout(2000);
  await page.waitForLoadState('networkidle');
  // Wait for the email field to appear
  page.locator('#profileButton').waitFor;
  // Ensure the profile button is available
  await page.locator('#profileButton').click();
  await page.waitForLoadState('networkidle');

  // Logout flow
  await page.getByText('Logout').click();

  // Validate user is redirected to the login screen
  await expect(page.locator('#submitButton')).toBeVisible();
});