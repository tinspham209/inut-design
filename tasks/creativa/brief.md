# New sub brand: INUT Creativa


/creativa
for now just show some placeholder, because for now we just start the project skin-laptop, but later, we will sell another product type, so let think the logic so that we can extend/scale without any conflict.

/creativa/skin-laptop
list all products

/creativa/skin-laptop/id
screen detail:

- carousel (at least 3 hình: lưng, đáy, kê tay)
- select macbook model
- select Skin Coverage: Lưng - Đáy - Phím - kê tay
- price: lưng 120, đáy 100, phím + kê tay 150, full 310

context:
- for now the /san-pham/skin-laptop and /san-pham/skin-nut-phim is just show the product, so user can easy to choose the product, and click order, is just send the message to sale, and we do it manually to design + delivery the skin laptop to user
- And now, we plan to start the ecom with skin laptop, to sell the skin laptop via this website subbrand: inutdesign.com/creativa/skin-laptop/......
- and first, we just clone 1:1 with the uniqfind for the product skin laptop, focus on the image product visual, and keep current logic workflow of the ecom in this repo.

design style:
- light theme, with more focus on the image visual, not so much spacing, refer to the uniqfind style
- mobile first, because the data analytics, over 70% traffic to this website is mobile, and over 60% is ios.
- refer to current the /san-pham/skin-laptop and /san-pham/skin-nut-phim to understand the current visual.

technical solution
- keep current header logic, when access via this creativa, it will show another header, another footer because this one is a sub brand, and the product to sell is difference with the root of inut design. for now just duplicate the header and footer with the array const to config value, and later i will update the what config will keep and what will be update.
- refer to current flow ecommerce of product lighters, this one will be the same workflow in the behind, the diff is the UI.
- cart: /cart/skin-laptop
- checkout: /checkout/skin-laptop
- order-tracking: add new dropdown item in the search function, then navigate to /order-tracking/skin-laptop/[slug].tsx
- about /san-pham/skin-laptop, /san-pham/skin-nut-phim will be sunset, but i dont want to disappear because will loose the SEO index, so that will keep it, but when user click any action related to order, will be navigate into this /creativa/skin-laptop, just keep these page and product to keep the SEO index.
- new page: creativa/skin-laptop/huong-dan-su-dung + creativa/skin-laptop/huong-dan-su-dung/[slug].tsx - this page will be the list content to guide user how to use the skin laptop, how to manually insert the skin into user's laptop, a lot of content for guideline.


refer:

- https://www.uniqfind.com/products/hot-toddy-plaid-macbook-skin-case?variant=51274338959492
- https://www.uniqfind.com/collections/macbook-cases?page=1#db05f66c669805d21858d2a5dc8daa95