# BDD Test Plan — Feature 4: SEO + AI Search Optimization
**Ticket:** `2026-07-24-01-engagement-pwa-seo` · Feature 4  
**Plan file:** `docs/plans/2026-07-24-01-engagement-pwa-seo-feature-4-plan.md`  
**Date:** 2026-07-24  
**Status:** 📋 Test plan — no implementation  

---

## Test Strategy

| Layer                    | Tool                                       | When to run   |
| ------------------------ | ------------------------------------------ | ------------- |
| **Unit**                 | Jest + `@testing-library/react`            | On every PR   |
| **Integration**          | Jest + `jsdom`                             | On every PR   |
| **E2E / DOM inspection** | Playwright or agent-browser                | Before deploy |
| **Manual / External**    | Google Rich Results Test, browser DevTools | After deploy  |

> **Note:** The project currently has no Jest setup. Tests marked `[UNIT]` or `[INTEGRATION]` require Jest to be bootstrapped first (`pnpm add -D jest @testing-library/react jest-environment-jsdom ts-jest`). Tests marked `[E2E]` can be run via the existing `agent-browser` regression script pattern. Tests marked `[MANUAL]` are human-verified checklists.

---

## Feature: AI Crawler Access

> As a search engine crawler (GPTBot, ClaudeBot, PerplexityBot),  
> I want explicit permission to crawl inutdesign.com,  
> So that the site appears in AI-powered search results.

---

### Scenario Group: robots.txt

#### TC-F4-1.1 — robots.txt allows all AI crawlers `[MANUAL]` `[E2E]`

```gherkin
Feature: AI Crawler Policy in robots.txt

  Background:
    Given the site is built and deployed
    And the URL "https://inutdesign.com/robots.txt" is accessible

  Scenario: GPTBot is explicitly allowed
    When I fetch the content of "/robots.txt"
    Then the response body contains "User-agent: GPTBot"
    And the response body contains "Allow: /"
    And the "GPTBot" block does not contain any "Disallow: /" rule

  Scenario: ClaudeBot is explicitly allowed
    When I fetch the content of "/robots.txt"
    Then the response body contains "User-agent: ClaudeBot"
    And the response body contains "Allow: /"

  Scenario: anthropic-ai is explicitly allowed
    When I fetch the content of "/robots.txt"
    Then the response body contains "User-agent: anthropic-ai"
    And the response body contains "Allow: /"

  Scenario: PerplexityBot is explicitly allowed
    When I fetch the content of "/robots.txt"
    Then the response body contains "User-agent: PerplexityBot"
    And the response body contains "Allow: /"

  Scenario: ChatGPT-User is explicitly allowed
    When I fetch the content of "/robots.txt"
    Then the response body contains "User-agent: ChatGPT-User"
    And the response body contains "Allow: /"

  Scenario: Sitemap reference is preserved
    When I fetch the content of "/robots.txt"
    Then the response body contains "Sitemap: https://inutdesign.com/sitemap.xml"

  Scenario: Existing wildcard policy is preserved
    When I fetch the content of "/robots.txt"
    Then the response body contains "User-agent: *"
    And the response body contains "Disallow: /*?updated-max=*"
    And the response body contains "Disallow: /signup"
```

---

### Scenario Group: llms.txt

#### TC-F4-1.2 — llms.txt exists and contains required content `[MANUAL]` `[E2E]`

```gherkin
Feature: LLMs.txt Business Profile

  Background:
    Given the file "public/llms.txt" exists in the project

  Scenario: File is publicly accessible
    When I fetch "https://inutdesign.com/llms.txt"
    Then the response status is 200
    And the Content-Type header is "text/plain"

  Scenario: English section contains business identity
    When I read the content of "public/llms.txt"
    Then the content contains "INUT Design"
    And the content contains "Da Nang"
    And the content contains "inutdesign.com"
    And the content contains "0327 124 321" or "0327124321"

  Scenario: English section lists all core products
    When I read the content of "public/llms.txt"
    Then the content contains "skin laptop"
    And the content contains "sticker"
    And the content contains "lighter" or "bật lửa"
    And the content contains "MACNUT" or "MacBook key skin"

  Scenario: Vietnamese section exists with correct keywords
    When I read the content of "public/llms.txt"
    Then the content contains "skin laptop đà nẵng"
    And the content contains "in bật lửa theo yêu cầu"
    And the content contains "sticker theo yêu cầu"
    And the content contains "dán skin laptop"

  Scenario: File contains opening hours
    When I read the content of "public/llms.txt"
    Then the content contains opening hours information
    And the hours indicate Monday to Saturday coverage

  Scenario: File size is reasonable for LLM context
    When I check the file size of "public/llms.txt"
    Then the file size is less than 10KB
    And the file size is greater than 500 bytes
```

---

## Feature: LocalBusiness Structured Data

> As a Google Search crawler,  
> I want to see LocalBusiness JSON-LD on the homepage,  
> So that INUT Design appears in Google Maps / Knowledge Panel rich results.

---

#### TC-F4-2.1 — LocalBusiness schema is rendered on the homepage `[UNIT]` `[E2E]`

```gherkin
Feature: LocalBusiness JSON-LD Schema

  Background:
    Given the homepage "/" is rendered

  Scenario: LocalBusiness script tag is present in HTML
    When I inspect the rendered HTML of "/"
    Then there is a <script type="application/ld+json"> element
    And its content is valid JSON
    And the JSON contains "@type": "LocalBusiness"

  Scenario: LocalBusiness has correct identity fields
    When I parse the LocalBusiness JSON-LD from "/"
    Then "name" equals "INUT Design"
    And "url" equals "https://inutdesign.com"
    And "telephone" equals "+84327124321" or "+84-327-124-321"

  Scenario: LocalBusiness has Da Nang address
    When I parse the LocalBusiness JSON-LD from "/"
    Then "address.addressLocality" equals "Đà Nẵng"
    And "address.addressCountry" equals "VN"
    And "address.streetAddress" contains "Ông Ích Khiêm"

  Scenario: LocalBusiness has business hours
    When I parse the LocalBusiness JSON-LD from "/"
    Then "openingHours" is a non-empty array or string
    And it covers Monday through Saturday

  Scenario: LocalBusiness has a price range
    When I parse the LocalBusiness JSON-LD from "/"
    Then "priceRange" is present and non-empty

  Scenario: No duplicate @type Organization and LocalBusiness schemas conflict
    When I inspect all JSON-LD scripts on "/"
    Then there is exactly one schema with "@type" of "LocalBusiness" or "Organization"
    And no two schemas define conflicting "name" values

  Scenario: Google Rich Results Test passes for LocalBusiness [MANUAL]
    Given I copy the JSON-LD from the homepage
    When I paste it into https://search.google.com/test/rich-results
    Then the tool reports no errors for LocalBusiness
    And the tool detects a valid "Local Business" rich result
```

---

## Feature: BreadcrumbList Structured Data

> As a Google Search crawler,  
> I want BreadcrumbList JSON-LD on every product detail page,  
> So that breadcrumb navigation appears below search result titles.

---

#### TC-F4-3.1 — BreadcrumbSchema component renders correct JSON-LD `[UNIT]`

```gherkin
Feature: BreadcrumbSchema Component

  Background:
    Given the BreadcrumbSchema component is imported from "@/components/scripts"

  Scenario: Component renders a valid script tag
    Given items = [{ name: "Trang chủ", url: "https://inutdesign.com" },
                   { name: "Bật lửa Custom", url: "https://inutdesign.com/san-pham/lighters" },
                   { name: "Test Lighter", url: "https://inutdesign.com/san-pham/lighters/test" }]
    When I render <BreadcrumbSchema items={items} />
    Then the output contains one <script type="application/ld+json"> element
    And the parsed JSON has "@type": "BreadcrumbList"
    And "itemListElement" has length 3

  Scenario: Each breadcrumb item has correct position
    When I render BreadcrumbSchema with 3 items
    Then itemListElement[0].position equals 1
    And itemListElement[1].position equals 2
    And itemListElement[2].position equals 3

  Scenario: Each breadcrumb item has name and url
    When I render BreadcrumbSchema with items
    Then each ListItem has "@type": "ListItem"
    And each ListItem has a "name" field
    And each ListItem has an "item" field matching the URL

  Scenario: Component handles single-item breadcrumb
    Given items = [{ name: "Trang chủ", url: "https://inutdesign.com" }]
    When I render <BreadcrumbSchema items={items} />
    Then "itemListElement" has length 1
    And itemListElement[0].position equals 1
```

#### TC-F4-3.2 — BreadcrumbList present on all product detail pages `[E2E]`

```gherkin
Feature: BreadcrumbList on Product Detail Pages

  Scenario Outline: Product detail page has BreadcrumbList JSON-LD
    Given I navigate to <page_url>
    When I inspect all <script type="application/ld+json"> tags
    Then at least one script contains "@type": "BreadcrumbList"
    And "itemListElement[0].name" equals "Trang chủ"
    And "itemListElement[0].item" equals "https://inutdesign.com"
    And the last itemListElement name matches the product/page title

    Examples:
      | page_url |
      | /san-pham/lighters/{any-lighter-slug} |
      | /san-pham/skin-laptop/{any-product-slug} |
      | /san-pham/skin-nut-phim/{any-product-slug} |
      | /services/sticker/sticker-sheet |
      | /services/ca-nhan-hoa/skin-bat-lua-customize |

  Scenario: Breadcrumb URLs use absolute https:// format
    When I parse BreadcrumbList from any product page
    Then each "item" field starts with "https://inutdesign.com"
    And no item field is relative (does not start with "/")

  Scenario: Breadcrumb depth is at least 2 levels
    When I parse BreadcrumbList from any product page
    Then "itemListElement" has length >= 2

  Scenario: Google Rich Results Test passes [MANUAL]
    Given I copy the BreadcrumbList JSON-LD from a product page
    When I paste it into https://search.google.com/test/rich-results
    Then the tool reports no errors
    And the tool detects a valid "Breadcrumb" rich result
```

---

## Feature: FAQPage Structured Data

> As a Google Search crawler,  
> I want FAQPage JSON-LD on product pages,  
> So that FAQ answers appear directly in Google Search results (accordion snippets).

---

#### TC-F4-4.1 — FAQSchema component renders correct JSON-LD `[UNIT]`

```gherkin
Feature: FAQSchema Component

  Background:
    Given the FAQSchema component is imported from "@/components/scripts"

  Scenario: Component renders valid FAQPage schema
    Given items = [{ question: "Q1?", answer: "A1." }, { question: "Q2?", answer: "A2." }]
    When I render <FAQSchema items={items} />
    Then the output contains one <script type="application/ld+json"> element
    And the parsed JSON has "@context": "https://schema.org"
    And the parsed JSON has "@type": "FAQPage"

  Scenario: Each FAQ item maps to a Question entity
    When I render FAQSchema with 2 items
    Then "mainEntity" has length 2
    And each entity has "@type": "Question"
    And each entity has a "name" field (the question text)
    And each entity has "acceptedAnswer.@type" equals "Answer"
    And each entity has "acceptedAnswer.text" (the answer text)

  Scenario: Component handles empty items array gracefully
    Given items = []
    When I render <FAQSchema items={[]} />
    Then the output renders a script tag with "mainEntity": []
    And no JavaScript errors are thrown

  Scenario: FAQ content is not HTML-encoded incorrectly
    Given a question contains Vietnamese characters (e.g., "Đà Nẵng")
    When I render FAQSchema
    Then the JSON output preserves the characters as UTF-8
    And the text is not HTML-encoded (no &agrave; style entities)
```

#### TC-F4-4.2 — FAQ content constants are complete and valid `[UNIT]`

```gherkin
Feature: FAQ Content Constants in seo-constants.ts

  Background:
    Given LIGHTERS_FAQ, SKIN_LAPTOP_FAQ, MACNUT_FAQ, SERVICES_FAQ
    are exported from "@/utils/seo-constants"

  Scenario: LIGHTERS_FAQ has 5 Q&A pairs
    When I import LIGHTERS_FAQ
    Then it is an array of length 5
    And each item has a "question" string with length > 10
    And each item has an "answer" string with length > 20

  Scenario: SKIN_LAPTOP_FAQ has 5 Q&A pairs
    When I import SKIN_LAPTOP_FAQ
    Then it is an array of length 5
    And each item has a "question" string
    And each item has an "answer" string

  Scenario: MACNUT_FAQ has 5 Q&A pairs
    When I import MACNUT_FAQ
    Then it is an array of length 5
    And each item has a "question" string
    And each item has an "answer" string

  Scenario: SERVICES_FAQ has at least 3 Q&A pairs
    When I import SERVICES_FAQ
    Then it is an array of length >= 3
    And each item has a "question" string
    And each item has an "answer" string

  Scenario: No FAQ items have empty strings
    When I import all four FAQ arrays
    Then no item has question === ""
    And no item has answer === ""
    And no item has question === undefined
    And no item has answer === undefined
```

#### TC-F4-4.3 — FAQPage present on all targeted product pages `[E2E]`

```gherkin
Feature: FAQPage on Product Pages

  Scenario Outline: Product page has FAQPage JSON-LD
    Given I navigate to <page_url>
    When I inspect all <script type="application/ld+json"> tags
    Then at least one script contains "@type": "FAQPage"
    And "mainEntity" is a non-empty array
    And each mainEntity item has "@type": "Question"
    And each question has a non-empty "name" (question text)
    And each question has a non-empty "acceptedAnswer.text"

    Examples:
      | page_url |
      | /san-pham/lighters/{any-lighter-slug} |
      | /san-pham/skin-laptop/{any-product-slug} |
      | /san-pham/skin-nut-phim/{any-product-slug} |
      | /services/sticker/sticker-sheet |

  Scenario: FAQ answers contain contact information where relevant
    When I read all LIGHTERS_FAQ answers
    Then at least one answer mentions "Zalo" or "0327 124 321"

  Scenario: FAQ question text does not exceed 250 characters
    When I inspect all FAQ items across all arrays
    Then no question has length > 250 characters
    And no answer has length > 1000 characters

  Scenario: Google Rich Results Test detects FAQ rich result [MANUAL]
    Given I copy the FAQPage JSON-LD from /san-pham/lighters/{slug}
    When I paste into https://search.google.com/test/rich-results
    Then the tool reports no errors
    And the tool detects a valid "FAQ" rich result
    And all questions are listed in the preview
```

---

## Feature: Meta Description Upgrades

> As a potential customer searching on Google or AI search tools,  
> I want keyword-rich, intent-first meta descriptions on product pages,  
> So that I click through to inutdesign.com instead of a competitor.

---

#### TC-F4-5.1 — Updated meta descriptions are correct `[UNIT]` `[E2E]`

```gherkin
Feature: Meta Descriptions on Product Index Pages

  Scenario Outline: Page has a non-empty meta description
    Given I render <page_url>
    When I inspect the <head> element
    Then there is a <meta name="description"> tag
    And its content attribute is not empty
    And its content attribute length is between 100 and 165 characters

    Examples:
      | page_url |
      | / |
      | /san-pham/skin-laptop |
      | /san-pham/skin-nut-phim |
      | /san-pham/lighters |

  Scenario: Skin Laptop index has keyword "đà nẵng" in description
    When I read the meta description of "/san-pham/skin-laptop"
    Then the description contains "đà nẵng" (case-insensitive)
    And the description contains "skin laptop"
    And the description does not contain "Thiệp - Card - Tem Nhãn"
      # (that was boilerplate from the old description)

  Scenario: Macnut index has relevant keywords
    When I read the meta description of "/san-pham/skin-nut-phim"
    Then the description contains "macbook" or "nút phím" (case-insensitive)
    And the description does not contain "Skin Laptop" as the primary keyword
      # (old description incorrectly used skin-laptop copy)

  Scenario: Lighters index has conversion-oriented description
    When I read the meta description of "/san-pham/lighters"
    Then the description contains "bật lửa"
    And the description contains "đà nẵng" (case-insensitive)
    And the description contains a contact signal ("Zalo" or phone number)

  Scenario: Homepage description is updated and includes brand keywords
    When I read the meta description of "/"
    Then the description contains "INUT Design" or "inutdesign"
    And the description contains "Đà Nẵng" (case-insensitive)
    And the description contains a unique value proposition (year, speed, or service range)
```

#### TC-F4-5.2 — Meta description character limits `[UNIT]`

```gherkin
Feature: Meta Description Length Validation

  Scenario Outline: Meta description is within Google's display limit
    When I read the meta description of <page_url>
    Then the character count is >= 100
    And the character count is <= 165
      # Google truncates at ~155–165 chars; under 100 = too short

    Examples:
      | page_url |
      | / |
      | /san-pham/skin-laptop |
      | /san-pham/skin-nut-phim |
      | /san-pham/lighters |

  Scenario: Meta title is within Google's title display limit
    When I read the <title> of any updated page
    Then the character count is <= 70
      # Google displays ~60–70 chars of title
```

---

## Feature: Structured Data — No Conflicts or Regressions

> As a developer,  
> I want to ensure the new schemas don't conflict with existing schemas,  
> So that Google doesn't invalidate structured data that was working before.

---

#### TC-F4-6.1 — No JSON-LD parse errors on any page `[E2E]`

```gherkin
Feature: JSON-LD Integrity

  Scenario Outline: All JSON-LD blocks on a page are valid JSON
    Given I navigate to <page_url>
    When I collect all <script type="application/ld+json"> elements
    Then JSON.parse() succeeds for each script content
    And no script contains undefined, NaN, or circular references

    Examples:
      | page_url |
      | / |
      | /san-pham/lighters/{slug} |
      | /san-pham/skin-laptop/{slug} |
      | /san-pham/skin-nut-phim/{slug} |
      | /services/sticker/sticker-sheet |

  Scenario: Existing Product schema is not broken after changes
    When I navigate to /san-pham/lighters/{any-slug}
    Then the page still contains a JSON-LD block with "@type": "Product"
    And "Product.name" is non-empty
    And "Product.offers" is present
      # Regression: existing product schema must not be removed

  Scenario: Multiple JSON-LD blocks coexist without conflict
    When I navigate to /san-pham/lighters/{any-slug}
    Then there are multiple <script type="application/ld+json"> blocks
    And each block has a unique "@type"
    And the page does not have two blocks with the same "@type"
      # Allowed: Product + BreadcrumbList + FAQPage — all different types
```

#### TC-F4-6.2 — Schema.org validation `[MANUAL]`

```gherkin
Feature: Schema.org Validator Check

  Scenario: Homepage passes schema.org validation
    Given I open https://validator.schema.org/
    When I paste the homepage URL "https://inutdesign.com"
    Then the tool reports 0 errors
    And warnings (if any) are non-critical

  Scenario: Lighter detail page passes schema.org validation
    When I paste a lighter detail page URL
    Then the tool detects: Product, BreadcrumbList, FAQPage, and LocalBusiness (global)
    And reports 0 errors
```

---

## Test Coverage Matrix

| Test ID   | Feature                           | Layer        | Priority | Automated?           |
| --------- | --------------------------------- | ------------ | -------- | -------------------- |
| TC-F4-1.1 | robots.txt AI bots                | E2E + Manual | 🔴 P0     | Partial (curl check) |
| TC-F4-1.2 | llms.txt content                  | Manual       | 🔴 P0     | No                   |
| TC-F4-2.1 | LocalBusiness JSON-LD on homepage | Unit + E2E   | 🟠 P1     | Yes                  |
| TC-F4-3.1 | BreadcrumbSchema component        | Unit         | 🟠 P1     | Yes                  |
| TC-F4-3.2 | BreadcrumbList on product pages   | E2E          | 🟠 P1     | Yes                  |
| TC-F4-4.1 | FAQSchema component               | Unit         | 🟠 P1     | Yes                  |
| TC-F4-4.2 | FAQ constants completeness        | Unit         | 🟡 P2     | Yes                  |
| TC-F4-4.3 | FAQPage on product pages          | E2E          | 🟠 P1     | Yes                  |
| TC-F4-5.1 | Meta descriptions correct         | E2E          | 🟠 P1     | Yes                  |
| TC-F4-5.2 | Meta description length           | Unit         | 🟡 P2     | Yes                  |
| TC-F4-6.1 | No JSON-LD parse errors           | E2E          | 🔴 P0     | Yes                  |
| TC-F4-6.2 | Schema.org validator              | Manual       | 🟡 P2     | No                   |

---

## Acceptance Criteria (Definition of Done)

For this feature to be considered **done**, all of the following must pass:

- [ ] `public/robots.txt` contains explicit `Allow: /` for all 5 AI bots
- [ ] `public/llms.txt` is publicly accessible and < 10KB
- [ ] Homepage JSON-LD contains `@type: LocalBusiness` with Da Nang address
- [ ] `/san-pham/lighters/[slug]` contains `BreadcrumbList` + `FAQPage` + `Product` schemas
- [ ] `/san-pham/skin-laptop/[slug]` contains `BreadcrumbList` + `FAQPage` + `Product` schemas
- [ ] `/san-pham/skin-nut-phim/[slug]` contains `BreadcrumbList` + `FAQPage` + `Product` schemas
- [ ] `/services/[...slug]` contains `BreadcrumbList` + `FAQPage` schemas
- [ ] All meta descriptions are 100–165 chars and contain target keywords
- [ ] No JSON-LD block fails `JSON.parse()`
- [ ] `pnpm lint` passes with 0 errors
- [ ] Google Rich Results Test shows no errors for at least one lighter detail page
- [ ] Macnut index no longer uses skin-laptop boilerplate description

---

*BDD Test Plan generated by GitHub Copilot CLI — 2026-07-24*
