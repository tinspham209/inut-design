Feature: Lighter Skin Builder - Custom Design Tool
  As a customer of INUT Design
  I want to upload my design image and preview it on a 3D lighter model
  So that I can visualize my custom lighter before placing an order

  Background:
    Given I am on the lighter builder page at "/builder/lighters"
    And the page has loaded completely
    And the 3D lighter model is rendered and auto-rotating

  # ===========================================
  # SCENARIO: Initial Page Load
  # ===========================================
  Scenario: Page loads with correct initial state
    Then I should see the header with "Lighter Builder" subtitle
    And I should see the 3D lighter canvas on the left side
    And I should see the control panel on the right side
    And I should see the helper text "Please upload image with size 1640×2048 px or higher"
    And I should see the image upload zone
    And the "Next" button should be disabled
    And the 3D model should be auto-rotating

  # ===========================================
  # SCENARIO: Successful Image Upload
  # ===========================================
  Scenario: User uploads a valid image file
    Given I have a valid PNG image file "design.png" with size 5 MB and resolution 2048x2560
    When I click on the upload zone
    And I select the file "design.png"
    Then the image should be uploaded successfully
    And I should see a thumbnail preview of the uploaded image
    And I should see the image metadata (dimensions: 2048x2560, size: 5 MB)
    And the image should be applied as texture on the 3D lighter model
    And I should see the scroll X and scroll Y controls
    And the "Next" button should be enabled

  Scenario: User uploads a valid JPG image file
    Given I have a valid JPG image file "artwork.jpg" with size 3 MB and resolution 1640x2048
    When I click on the upload zone
    And I select the file "artwork.jpg"
    Then the image should be uploaded successfully
    And the image should be applied as texture on the 3D lighter model
    And the "Next" button should be enabled

  Scenario: User uploads a valid WEBP image file
    Given I have a valid WEBP image file "design.webp" with size 2 MB and resolution 2000x2500
    When I click on the upload zone
    And I select the file "design.webp"
    Then the image should be uploaded successfully
    And the image should be applied as texture on the 3D lighter model
    And the "Next" button should be enabled

  # ===========================================
  # SCENARIO: Low Resolution Warning
  # ===========================================
  Scenario: User uploads an image with low resolution
    Given I have a PNG image file "small-design.png" with resolution 1200x1500
    When I click on the upload zone
    And I select the file "small-design.png"
    Then the image should be uploaded successfully
    And I should see a yellow warning "Image resolution is below recommended 1640×2048 px"
    And the warning should be non-blocking
    And the "Next" button should still be enabled
    And the image should still be applied to the 3D model

  # ===========================================
  # SCENARIO: File Type Validation
  # ===========================================
  Scenario: User attempts to upload an unsupported file type
    Given I have a PDF file "document.pdf"
    When I click on the upload zone
    And I select the file "document.pdf"
    Then I should see an error toast "Only PNG, JPG, WEBP accepted"
    And the file should not be uploaded
    And the 3D model should remain in its previous state
    And the "Next" button should remain disabled

  Scenario: User attempts to upload a GIF file
    Given I have a GIF file "animation.gif"
    When I click on the upload zone
    And I select the file "animation.gif"
    Then I should see an error toast "Only PNG, JPG, WEBP accepted"
    And the file should not be uploaded

  # ===========================================
  # SCENARIO: File Size Validation
  # ===========================================
  Scenario: User attempts to upload a file exceeding 10 MB
    Given I have a PNG image file "large-design.png" with size 15 MB
    When I click on the upload zone
    And I select the file "large-design.png"
    Then I should see an error toast "File too large (max 10 MB)"
    And the file should not be uploaded
    And the 3D model should remain in its previous state
    And the "Next" button should remain disabled

  Scenario: User uploads a file exactly at 10 MB limit
    Given I have a PNG image file "max-size.png" with size 10 MB and resolution 2048x2560
    When I click on the upload zone
    And I select the file "max-size.png"
    Then the image should be uploaded successfully
    And the "Next" button should be enabled

  # ===========================================
  # SCENARIO: 3D Model Interaction - Rotate
  # ===========================================
  Scenario: User rotates the 3D model using mouse drag
    Given I have uploaded a valid image
    When I click and hold on the 3D canvas
    And I drag the mouse from left to right
    Then the 3D lighter model should rotate horizontally
    When I drag the mouse from top to bottom
    Then the 3D lighter model should rotate vertically
    And the texture should remain applied to the model during rotation

  Scenario: User rotates the 3D model on mobile using touch
    Given I have uploaded a valid image
    And I am on a mobile device
    When I touch and hold on the 3D canvas
    And I swipe my finger from left to right
    Then the 3D lighter model should rotate horizontally
    And the rotation should be smooth without lag

  # ===========================================
  # SCENARIO: 3D Model Interaction - Zoom
  # ===========================================
  Scenario: User zooms in on the 3D model using scroll wheel
    Given I have uploaded a valid image
    When I scroll up on the 3D canvas using mouse wheel
    Then the 3D model should zoom in
    And the model should not zoom beyond the maximum distance

  Scenario: User zooms out on the 3D model using scroll wheel
    Given I have uploaded a valid image
    When I scroll down on the 3D canvas using mouse wheel
    Then the 3D model should zoom out
    And the model should not zoom beyond the minimum distance

  Scenario: User zooms on mobile using pinch gesture
    Given I have uploaded a valid image
    And I am on a mobile device
    When I place two fingers on the 3D canvas
    And I pinch my fingers together
    Then the 3D model should zoom out
    When I spread my fingers apart
    Then the 3D model should zoom in

  # ===========================================
  # SCENARIO: Image Position Adjustment
  # ===========================================
  Scenario: User adjusts image position using 2D canvas preview
    Given I have uploaded a valid image
    Then I should see a 2D canvas preview area with frame "1640x2048 px"
    When I click and drag within the 2D canvas preview to the right
    Then the image texture on the 3D model should shift horizontally
    And the coordinate display "X: ..." should update
    When I click and drag within the 2D canvas preview upward
    Then the image texture on the 3D model should shift vertically
    And the coordinate display "Y: ..." should update

  # ===========================================
  # SCENARIO: Replace Image
  # ===========================================
  Scenario: User replaces the uploaded image
    Given I have uploaded a valid image "design-v1.png"
    And the image is displayed on the 3D model
    When I click the "Replace" button
    And I select a new file "design-v2.png"
    Then the old image should be replaced with the new image
    And the new image should be applied to the 3D model
    And the thumbnail should update to show the new image
    And the scroll X and scroll Y values should reset to 0

  # ===========================================
  # SCENARIO: Clear Image
  # ===========================================
  Scenario: User clears the uploaded image
    Given I have uploaded a valid image
    And the image is displayed on the 3D model
    When I click the "Clear" button
    Then the image should be removed from the 3D model
    And the 3D model should return to its default state
    And the upload zone should reappear
    And the "Next" button should be disabled
    And the 3D model should resume auto-rotating

  # ===========================================
  # SCENARIO: Add to Cart Flow
  # ===========================================
  Scenario: User successfully adds custom lighter to cart
    Given I have uploaded a valid image "my-design.png"
    And the image is correctly previewed on the 3D model
    When I click the "Next" button
    Then the system should fetch the product "Bật lửa Thường - In Thường - Thiết kế theo yêu cầu" from Sanity
    And the system should create a preview image from the canvas
    And the item should be added to the cart with the following details:
      | field        | value                                              |
      | productName  | Bật lửa Thường - In Thường - Thiết kế theo yêu cầu |
      | quantity     | 1                                                  |
      | previewImage | [canvas snapshot]                                  |
    And I should be redirected to "/checkout/lighters"

  Scenario: System handles product not found error
    Given I have uploaded a valid image
    When I click the "Next" button
    And the product "Bật lửa Thường - In Thường - Thiết kế theo yêu cầu" is not found in Sanity
    Then I should see an error toast "Không tìm thấy sản phẩm bật lửa custom"
    And I should remain on the builder page
    And my uploaded image should still be displayed

  # ===========================================
  # SCENARIO: Checkout Page Integration
  # ===========================================
  Scenario: Checkout page displays custom lighter item correctly
    Given I have added a custom lighter to my cart
    And I am on the checkout page "/checkout/lighters"
    Then I should see the custom lighter item in the order summary
    And the item should display the 2D preview image (not 3D)
    And the item name should be "Bật lửa Thường - In Thường - Thiết kế theo yêu cầu"
    And the quantity should be 1
    And the unit price should be calculated based on the price tiers
    And the subtotal should be calculated correctly

  Scenario: User updates quantity of custom lighter item
    Given I have added a custom lighter to my cart with quantity 1
    And I am on the checkout page "/checkout/lighters"
    When I increase the quantity to 5
    Then the unit price should recalculate based on the new quantity tier
    And the subtotal should update to unit price × 5
    And the total amount should update accordingly

  # ===========================================
  # SCENARIO: Complete Order Flow
  # ===========================================
  Scenario: User completes order for custom lighter
    Given I have added a custom lighter to my cart
    And I am on the checkout page "/checkout/lighters"
    When I fill in the customer information:
      | field           | value                  |
      | customerName    | Nguyễn Văn A           |
      | customerPhone   | 0123456789             |
      | customerEmail   | test@example.com       |
      | deliveryAddress | 123 Đường ABC, Đà Nẵng |
    And I select payment method "COD"
    And I click "Place order"
    Then the order should be created in Sanity with status "pending"
    And the order should include the design image
    And I should be redirected to "/order-tracking/lighters/{orderNumber}?justOrdered=1"
    And I should see the order confirmation message

  # ===========================================
  # SCENARIO: Empty Cart State
  # ===========================================
  Scenario: User navigates to checkout with empty cart
    Given I have not added any items to my cart
    When I navigate to "/checkout/lighters"
    Then I should see the message "Giỏ hàng của bạn đang trống"
    And I should see a button to return to the products page

  # ===========================================
  # SCENARIO: Auto-rotate Behavior
  # ===========================================
  Scenario: 3D model continuously auto-rotates
    Given I am on the lighter builder page
    When I have not uploaded any image
    Then the 3D lighter model should auto-rotate continuously
    When I upload a valid image
    Then the 3D model should continue auto-rotating
    And the auto-rotate should never stop

  # ===========================================
  # SCENARIO: WebGL Not Supported
  # ===========================================
  Scenario: Browser does not support WebGL
    Given my browser does not support WebGL
    When I navigate to the lighter builder page
    Then I should see a fallback 2D image with CSS rotation effect
    And I should still be able to upload an image
    And I should still be able to proceed to checkout

  # ===========================================
  # SCENARIO: Mobile Responsive Layout
  # ===========================================
  Scenario: Page layout on mobile devices
    Given I am on a mobile device with screen width 375px
    When I navigate to the lighter builder page
    Then the 3D canvas should occupy the top half of the screen
    And the control panel should occupy the bottom half of the screen
    And all touch targets should be at least 44x44px
    And I should be able to scroll the control panel independently

  # ===========================================
  # SCENARIO: Performance - iOS Safari
  # ===========================================
  Scenario: Canvas renders correctly on iOS Safari
    Given I am using an iOS Safari browser
    When I navigate to the lighter builder page
    Then the canvas pixelRatio should be capped at 2
    And the 3D model should render without memory issues
    And the rotation and zoom should be smooth

  # ===========================================
  # SCENARIO: Navigation
  # ===========================================
  Scenario: User navigates back from builder page
    Given I am on the lighter builder page
    When I click the "Back" button
    Then I should be navigated to the previous page

  # ===========================================
  # SCENARIO: Multiple Uploads Session
  # ===========================================
  Scenario: User goes through multiple upload-then-clear cycles
    Given I am on the lighter builder page
    When I upload an image "design-1.png"
    And I see the preview on the 3D model
    And I click "Clear"
    And I upload another image "design-2.png"
    Then the new image should be applied to the 3D model
    And the "Next" button should be enabled
    And I should be able to proceed to checkout

  # ===========================================
  # SCENARIO: Analytics Tracking
  # ===========================================
  Scenario: Analytics events are fired correctly
    Given I am on the lighter builder page
    Then a page view event should be tracked for the builder page
    When I upload an image
    Then an upload event should be tracked with image metadata
    When I click "Next" to add to cart
    Then an add_to_cart event should be tracked
    When I complete the checkout
    Then a purchase event should be tracked with order details

  # ===========================================
  # SCENARIO: Design Image in Order
  # ===========================================
  Scenario: Design image is stored in Sanity order
    Given I have completed an order with a custom lighter design
    When I view the order in Sanity Studio
    Then the order should contain the design image field
    And the design image should be downloadable by the designer
    And the designer should be able to use the image directly for production