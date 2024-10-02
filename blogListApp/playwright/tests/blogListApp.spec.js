const { test, expect, describe, beforeEach } = require('@playwright/test');
const url = 'http://localhost:5173/';

describe('BlogsApp', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post('http://localhost:3003/api/testing/reset');
    // Add single user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'name',
        username: 'user',
        password: 'pass',
      },
    });
  });

  test('has title', async ({ page }) => {
    await page.goto(url);
    await expect(page).toHaveTitle(/Blog List/);
  });

  test('can login with correct username/password', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.locator('input[name="username"]').fill('user');
    await page.locator('input[name="password"]').fill('pass');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Hi, user!')).toBeVisible();
  });

  test("'not found' appears with wrong username", async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.locator('input[name="username"]').fill('wrong');
    await page.locator('input[name="password"]').fill('pass');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(
      page.getByText('username or password not found')
    ).toBeVisible();
  });

  test("'not found' appears with wrong password", async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.locator('input[name="username"]').fill('user');
    await page.locator('input[name="password"]').fill('wrong');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(
      page.getByText('username or password not found')
    ).toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await page.locator('input[name="username"]').fill('user');
      await page.locator('input[name="password"]').fill('pass');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Hi, user!')).toBeVisible();
    });

    test('user can create a blog', async ({ page }) => {
      await page.getByRole('button', { name: 'Add blog' }).click();
      await page.getByPlaceholder('title').fill('a tittle');
      await page.getByPlaceholder('author').fill('a author');
      await page.getByPlaceholder('url').fill('a url');
      await page.getByRole('button', { name: 'post' }).click();
      await expect(page.getByRole('listitem')).toBeVisible();
    });

    describe('when theres one blog', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'Add blog' }).click();
        await page.getByPlaceholder('title').fill('a tittle');
        await page.getByPlaceholder('author').fill('a author');
        await page.getByPlaceholder('url').fill('a url');
        await page.getByRole('button', { name: 'post' }).click();
        await expect(page.getByRole('listitem')).toBeVisible();
      });
      test('clicking +1 button increases likes', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: '+' }).click();
        await page.getByRole('button', { name: '+' }).click();
        await page.getByRole('button', { name: '+' }).click();
        await expect(page.getByText('likes:')).toContainText('3');
      });
      test('owner of blog can delete blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        page.once('dialog', (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialog.dismiss().catch(() => {});
        });
        await page.getByRole('button', { name: 'delete' }).click();

        await expect(
          page.getByRole('listItem', { name: 'a tittle' })
        ).toBeHidden();
      });
      test('no delete button on others blogs', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'name2',
            username: 'user2',
            password: 'pass2',
          },
        });
        await page.getByRole('button', { name: 'logout' }).click();
        await page.locator('input[name="username"]').fill('user2');
        await page.locator('input[name="password"]').fill('pass2');
        await page.getByRole('button', { name: 'login' }).click();
        await page.getByRole('button', { name: 'view' }).click();
        await expect(page.getByRole('button', { name: 'delete' })).toBeHidden();
      });
      test('blogs are sorted by likes', async ({page}) => {
        // Add blog
        await page.getByRole('button', { name: 'Add blog' }).click();
        await page.getByPlaceholder('title').fill('most liked');
        await page.getByPlaceholder('author').fill('author');
        await page.getByPlaceholder('url').fill('url');
        await page.getByRole('button', { name: 'post' }).click();
      
        // Add blog
        await page.getByRole('button', { name: 'Add blog' }).click();
        await page.getByPlaceholder('title').fill('least liked');
        await page.getByPlaceholder('author').fill('author');
        await page.getByPlaceholder('url').fill('url');
        await page.getByRole('button', { name: 'post' }).click();

        // Like most liked twice
        await page.getByRole('heading', { name: 'most liked view' }).getByRole('button').click();
        await page.getByRole('button', { name: '+' }).click();
        await page.getByRole('button', { name: '+' }).click();
        
        // Like the default blog once 
        await page.getByRole('heading', { name: 'a tittle view' }).getByRole('button').click();
        await page.getByRole('button', { name: '+' }).nth(1).click();


        const blogs = await page.getByTestId('blogTitle').all()
        const blogTitles = [];
        for (const blog of blogs) {
          const blogText = await blog.innerText();
          blogTitles.push(blogText.split('\n')[0]);
        }
        await expect(blogTitles).toEqual([ 'most liked', 'a tittle', 'least liked' ])
      })
    });
  });
});
