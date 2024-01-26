import {expect, test} from "@playwright/test"

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})
test('Locator syntax rules', async({page}) => {
    //by Tag name
    await page.locator('input').first().click()
    
    //by ID
    page.locator('#inputEmail')

    //by Class Value
    page.locator(".shape-rectangle")

    //by Attribute
    page.locator("[placeholder='Email']")

    //by Class Value(full)
    page.locator("[class='input-full-width size-medium status-basic shape-rectangle nb-transition']")

    //combine different selectors
    page.locator("input[placeholder='Email'][nbinput]")

    //by XPath(NOT RECOMMENDED)
    page.locator("//*[@id='inputEmail1']")

    //by partial text match
    page.locator(":text('Using')")

    //by exact text match
    page.locator(":text-is('Using the Grid')")
})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click();
    await page.getByRole('button', { name: "Sign in"}).first().click();

    await page.getByLabel("Email").first().click();

    await page.getByPlaceholder('Jane Doe').click();

    await page.getByText("Using the Grid").click();

    await page.getByTitle("IoT Dashboard").click();
})

test("Locating Child Elements", async({page}) => {
    await page.locator("nb-card nb-radio :text-is('Option 1')").click();
    // You can chain the locator
    await page.locator("nb-card").locator("nb-radio").locator(":text-is('Option 2')").click();

    //Find a sign in button by combination of normal locator and user facing locator
    await page.locator("nb-card").getByRole('button', {name: "Sign in"}).first().click();

    await page.locator("nb-card").nth(3).getByRole('button').click();
})

test("Locating parent elements", async({page}) => {
    // To find parent nb-card using "Using the Grid" keyword so the keyword can be within anywhere in nb-card
    await page.locator("nb-card", {hasText: "Using the Grid"}).getByRole("textbox", {name: "Email"}).click();
    await page.locator("nb-card", {has: page.locator("#inputEmail")}).getByRole("textbox", {name: "Email"}).click();

    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("textbox", {name: "Email"}).click();
    //Filter based on the color of the button
    await page.locator("nb-card").filter({has: page.locator(".status-danger")}).getByRole("textbox", {name: "Password"}).click();
    // Only one nb-card will be unique and returned
    await page.locator("nb-card").filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole("textbox", {name: "Email"}).click();
})

test("Reusing the locators", async({page}) => {
    //Automate a scenario to fill up the basic form
    const basicForm = page.locator("nb-card").filter({hasText: "Basic form"});
    const emailField = basicForm.getByRole("textbox", {name: "Email"})

    await emailField.fill("test@test.com");
    await basicForm.getByRole("textbox", {name: "Password"}).fill("Welcome123");
    await basicForm.locator("nb-checkbox").click();
    await basicForm.getByRole("button").click();

    await expect(emailField).toHaveValue("test@test.com")
})

test("Extracting Values", async({page}) => {
    //single test value
    const basicForm = page.locator("nb-card").filter({hasText: "Basic form"});
    //extract text from button
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual("Submit")

    //all text values
    const allRadioButtonsLabels = await page.locator("nb-radio").allTextContents()
    //check that at least one radio button contain "Option 1"
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill("test@test.com")
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual("test@test.com")

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual("Email")
})
