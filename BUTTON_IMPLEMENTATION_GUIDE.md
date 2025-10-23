# Button Accessibility Implementation Guide

This guide provides a step-by-step checklist for adding accessible text/labels to all buttons.

**Total Issues:** 664

**Modules Affected:** 18

## Implementation Approach

For each button, add one of the following:
1. **aria-label**: `<button aria-label="View Details">...</button>`
2. **Visible text**: `<button><Eye className="h-4 w-4" /> View</button>`
3. **title attribute**: `<button title="View Details">...</button>`

---

## Table of Contents

- [After-Sales-Service](#after-sales-service) (7 files, 13 issues)
- [Cpq](#cpq) (22 files, 45 issues)
- [Crm](#crm) (34 files, 88 issues)
- [Dashboard](#dashboard) (1 files, 1 issues)
- [Estimation](#estimation) (6 files, 11 issues)
- [Finance](#finance) (5 files, 12 issues)
- [Hr](#hr) (17 files, 25 issues)
- [Inventory](#inventory) (12 files, 27 issues)
- [It-Admin](#it-admin) (15 files, 17 issues)
- [Logistics](#logistics) (22 files, 39 issues)
- [Other](#other) (84 files, 250 issues)
- [Procurement](#procurement) (16 files, 54 issues)
- [Production](#production) (8 files, 15 issues)
- [Project-Management](#project-management) (8 files, 13 issues)
- [Reports](#reports) (2 files, 5 issues)
- [Rfq](#rfq) (1 files, 1 issues)
- [Sales](#sales) (13 files, 19 issues)
- [Support](#support) (15 files, 29 issues)

---

## After-Sales-Service

### b3-erp/frontend/src/app/(modules)/after-sales-service/billing/pending/page.tsx

**Issues to fix:** 2

#### Line 406

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** billing > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 409

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** billing > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/after-sales-service/feedback/nps/page.tsx

**Issues to fix:** 1

#### Line 465

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** feedback > nps > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/after-sales-service/feedback/ratings/page.tsx

**Issues to fix:** 1

#### Line 421

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** feedback > ratings > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/after-sales-service/feedback/surveys/page.tsx

**Issues to fix:** 3

#### Line 415

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** feedback > surveys > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 418

- **Icon:** `BarChart3`
- **Suggested Text:** `View Analytics`
- **Context:** feedback > surveys > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Analytics" className="...">
    <BarChart3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 421

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** feedback > surveys > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/after-sales-service/installations/calendar/page.tsx

**Issues to fix:** 2

#### Line 244

- **Icon:** `ChevronLeft`
- **Suggested Text:** `Previous`
- **Context:** installations > calendar > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Previous" className="...">
    <ChevronLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 253

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** installations > calendar > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/after-sales-service/knowledge/articles/page.tsx

**Issues to fix:** 3

#### Line 379

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** knowledge > articles > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 382

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** knowledge > articles > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 385

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** knowledge > articles > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/after-sales-service/warranties/claims/[id]/page.tsx

**Issues to fix:** 1

#### Line 584

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** claims > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed


---

## Cpq

### b3-erp/frontend/src/app/(modules)/cpq/contracts/templates/page.tsx

**Issues to fix:** 3

#### Line 371

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** contracts > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 374

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** contracts > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 377

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** contracts > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/guided-selling/playbooks/page.tsx

**Issues to fix:** 3

#### Line 485

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** guided-selling > playbooks > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 488

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** guided-selling > playbooks > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 491

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** guided-selling > playbooks > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/integration/cad/page.tsx

**Issues to fix:** 1

#### Line 305

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** integration > cad > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/integration/crm/page.tsx

**Issues to fix:** 4

#### Line 326

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** integration > crm > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 329

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** integration > crm > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 333

- **Icon:** `Pause`
- **Suggested Text:** `Pause`
- **Context:** integration > crm > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Pause" className="...">
    <Pause className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 337

- **Icon:** `Play`
- **Suggested Text:** `Play`
- **Context:** integration > crm > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Play" className="...">
    <Play className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/integration/ecommerce/page.tsx

**Issues to fix:** 1

#### Line 360

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** integration > ecommerce > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/integration/erp/page.tsx

**Issues to fix:** 1

#### Line 397

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** integration > erp > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/pricing/contracts/page.tsx

**Issues to fix:** 1

#### Line 294

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** pricing > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/pricing/customer/page.tsx

**Issues to fix:** 1

#### Line 281

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** pricing > customer > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/pricing/promotions/page.tsx

**Issues to fix:** 1

#### Line 299

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** pricing > promotions > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/pricing/rules/page.tsx

**Issues to fix:** 1

#### Line 288

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** pricing > rules > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/pricing/volume/page.tsx

**Issues to fix:** 1

#### Line 245

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** pricing > volume > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/products/bundles/page.tsx

**Issues to fix:** 1

#### Line 246

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** products > bundles > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/products/catalog/page.tsx

**Issues to fix:** 2

#### Line 300

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** products > catalog > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 303

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** products > catalog > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/products/options/page.tsx

**Issues to fix:** 1

#### Line 256

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** products > options > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/products/rules/page.tsx

**Issues to fix:** 1

#### Line 290

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** products > rules > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/proposals/content/page.tsx

**Issues to fix:** 3

#### Line 374

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** proposals > content > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 377

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** proposals > content > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 380

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** proposals > content > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/proposals/templates/page.tsx

**Issues to fix:** 3

#### Line 393

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** proposals > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 396

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** proposals > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 399

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** proposals > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/quotes/page.tsx

**Issues to fix:** 4

#### Line 316

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** cpq > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 319

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** cpq > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 322

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** cpq > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 325

- **Icon:** `Send`
- **Suggested Text:** `Send`
- **Context:** cpq > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Send" className="...">
    <Send className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/quotes/templates/page.tsx

**Issues to fix:** 3

#### Line 283

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** quotes > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 286

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** quotes > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 289

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** quotes > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/quotes/versions/page.tsx

**Issues to fix:** 2

#### Line 309

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** quotes > versions > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 312

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** quotes > versions > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/settings/notifications/page.tsx

**Issues to fix:** 5

#### Line 261

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** settings > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 264

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** settings > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 267

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 417

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** settings > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 420

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/cpq/settings/numbering/page.tsx

**Issues to fix:** 2

#### Line 328

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** settings > numbering > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 331

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** settings > numbering > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed


---

## Crm

### b3-erp/frontend/src/app/(modules)/crm/activities/calls/page.tsx

**Issues to fix:** 3

#### Line 469

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** activities > calls > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 472

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** activities > calls > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 475

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** activities > calls > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/activities/emails/page.tsx

**Issues to fix:** 3

#### Line 507

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** activities > emails > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 510

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** activities > emails > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 513

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** activities > emails > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/activities/meetings/page.tsx

**Issues to fix:** 3

#### Line 476

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** activities > meetings > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 479

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** activities > meetings > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 482

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** activities > meetings > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/activities/tasks/page.tsx

**Issues to fix:** 3

#### Line 488

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** activities > tasks > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 491

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** activities > tasks > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 494

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** activities > tasks > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/campaigns/automation/page.tsx

**Issues to fix:** 6

#### Line 353

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** campaigns > automation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 356

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** campaigns > automation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 359

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** campaigns > automation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 363

- **Icon:** `Pause`
- **Suggested Text:** `Pause`
- **Context:** campaigns > automation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Pause" className="...">
    <Pause className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 368

- **Icon:** `Play`
- **Suggested Text:** `Play`
- **Context:** campaigns > automation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Play" className="...">
    <Play className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 372

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** campaigns > automation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/campaigns/email/page.tsx

**Issues to fix:** 5

#### Line 285

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** campaigns > email > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 288

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** campaigns > email > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 291

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** campaigns > email > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 295

- **Icon:** `Play`
- **Suggested Text:** `Play`
- **Context:** campaigns > email > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Play" className="...">
    <Play className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 299

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** campaigns > email > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/campaigns/page.tsx

**Issues to fix:** 4

#### Line 450

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** crm > campaigns > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 453

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** crm > campaigns > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 457

- **Icon:** `Pause`
- **Suggested Text:** `Pause`
- **Context:** crm > campaigns > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Pause" className="...">
    <Pause className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 461

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** crm > campaigns > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/campaigns/templates/page.tsx

**Issues to fix:** 4

#### Line 330

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** campaigns > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 333

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** campaigns > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 336

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** campaigns > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 339

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** campaigns > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/contacts/lists/page.tsx

**Issues to fix:** 4

#### Line 529

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** contacts > lists > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 532

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** contacts > lists > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 535

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** contacts > lists > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 538

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** contacts > lists > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/contacts/roles/page.tsx

**Issues to fix:** 2

#### Line 573

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** contacts > roles > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 576

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** contacts > roles > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/contacts/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 250

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/contracts/amendments/page.tsx

**Issues to fix:** 2

#### Line 483

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** contracts > amendments > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 486

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** contracts > amendments > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/contracts/page.tsx

**Issues to fix:** 3

#### Line 470

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** crm > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 473

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** crm > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 476

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** crm > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/contracts/renewals/page.tsx

**Issues to fix:** 2

#### Line 560

- **Icon:** `Mail`
- **Suggested Text:** `Email`
- **Context:** contracts > renewals > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Email" className="...">
    <Mail className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 563

- **Icon:** `Phone`
- **Suggested Text:** `Call`
- **Context:** contracts > renewals > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Call" className="...">
    <Phone className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/contracts/templates/page.tsx

**Issues to fix:** 3

#### Line 492

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** contracts > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 495

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** contracts > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 498

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** contracts > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/customers/add/page.tsx

**Issues to fix:** 1

#### Line 2396

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** customers > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/customers/hierarchy/page.tsx

**Issues to fix:** 2

#### Line 312

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** customers > hierarchy > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 315

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** customers > hierarchy > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/customers/portal/page.tsx

**Issues to fix:** 3

#### Line 480

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** customers > portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 483

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** customers > portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 486

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** customers > portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/customers/segments/page.tsx

**Issues to fix:** 2

#### Line 361

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** customers > segments > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 364

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** customers > segments > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/interactions/add/page.tsx

**Issues to fix:** 1

#### Line 483

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** interactions > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/interactions/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 482

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/leads/add/page.tsx

**Issues to fix:** 1

#### Line 1252

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** leads > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/leads/assignment/page.tsx

**Issues to fix:** 2

#### Line 332

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** leads > assignment > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 455

- **Icon:** `UserPlus`
- **Suggested Text:** `Add User`
- **Context:** leads > assignment > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add User" className="...">
    <UserPlus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/leads/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 1027

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/leads/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 237

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/opportunities/add/page.tsx

**Issues to fix:** 1

#### Line 746

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** opportunities > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/opportunities/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 753

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/proposals/page.tsx

**Issues to fix:** 5

#### Line 376

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** crm > proposals > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 379

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** crm > proposals > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 382

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** crm > proposals > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 385

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** crm > proposals > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 394

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** crm > proposals > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/quotes/page.tsx

**Issues to fix:** 6

#### Line 469

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** crm > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 472

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** crm > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 475

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** crm > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 478

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** crm > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 482

- **Icon:** `Send`
- **Suggested Text:** `Send`
- **Context:** crm > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Send" className="...">
    <Send className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 486

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** crm > quotes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/quotes/pricing/page.tsx

**Issues to fix:** 4

#### Line 317

- **Icon:** `ToggleRight`
- **Suggested Text:** `Disable`
- **Context:** quotes > pricing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Disable" className="...">
    <ToggleRight className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 321

- **Icon:** `ToggleLeft`
- **Suggested Text:** `Enable`
- **Context:** quotes > pricing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Enable" className="...">
    <ToggleLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 325

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** quotes > pricing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 328

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** quotes > pricing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/quotes/templates/page.tsx

**Issues to fix:** 3

#### Line 400

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** quotes > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 403

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** quotes > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 406

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** quotes > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/settings/stages/page.tsx

**Issues to fix:** 2

#### Line 301

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** settings > stages > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 304

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > stages > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/support/knowledge/page.tsx

**Issues to fix:** 2

#### Line 550

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** support > knowledge > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 553

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** support > knowledge > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/crm/support/sla/page.tsx

**Issues to fix:** 1

#### Line 379

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** support > sla > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed


---

## Dashboard

### b3-erp/frontend/src/app/(dashboard)/page.tsx

**Issues to fix:** 1

#### Line 193

- **Icon:** `Bell`
- **Suggested Text:** `Notifications`
- **Context:** (dashboard) > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Notifications" className="...">
    <Bell className="..." />
  </button>
  ```

- [ ] Fixed


---

## Estimation

### b3-erp/frontend/src/app/(modules)/estimation/boq/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 302

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/estimation/costing/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 258

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/estimation/pricing/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 353

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/estimation/settings/categories/page.tsx

**Issues to fix:** 2

#### Line 553

- **Icon:** `Save`
- **Suggested Text:** `Save`
- **Context:** settings > categories > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Save" className="...">
    <Save className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 559

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** settings > categories > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/estimation/settings/templates/page.tsx

**Issues to fix:** 3

#### Line 354

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 357

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** settings > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 360

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/estimation/workflow/drafts/page.tsx

**Issues to fix:** 3

#### Line 334

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** workflow > drafts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 337

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** workflow > drafts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 341

- **Icon:** `Send`
- **Suggested Text:** `Send`
- **Context:** workflow > drafts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Send" className="...">
    <Send className="..." />
  </button>
  ```

- [ ] Fixed


---

## Finance

### b3-erp/frontend/src/app/(modules)/finance/budgeting/multi-year-planning/page.tsx

**Issues to fix:** 2

#### Line 265

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** budgeting > multi-year-planning > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 268

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** budgeting > multi-year-planning > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/finance/consolidation/intercompany/page.tsx

**Issues to fix:** 2

#### Line 289

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** consolidation > intercompany > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 292

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** consolidation > intercompany > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/finance/controls/documents/page.tsx

**Issues to fix:** 3

#### Line 76

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** controls > documents > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 77

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** controls > documents > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 78

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** controls > documents > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/finance/costing/standard-costing/page.tsx

**Issues to fix:** 2

#### Line 321

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** costing > standard-costing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 324

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** costing > standard-costing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/finance/currency/management/page.tsx

**Issues to fix:** 3

#### Line 319

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** currency > management > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 322

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** currency > management > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 325

- **Icon:** `TrendingUp`
- **Suggested Text:** `View Trends`
- **Context:** currency > management > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Trends" className="...">
    <TrendingUp className="..." />
  </button>
  ```

- [ ] Fixed


---

## Hr

### b3-erp/frontend/src/app/(modules)/hr/attendance/add/page.tsx

**Issues to fix:** 1

#### Line 189

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** attendance > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/hr/attendance/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 197

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/hr/employees/add/page.tsx

**Issues to fix:** 1

#### Line 205

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** employees > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/hr/employees/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 197

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/hr/employees/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 308

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/hr/leave/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 500

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/hr/leave/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 126

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/attendance/biometric/page.tsx

**Issues to fix:** 2

#### Line 75

- **Icon:** `Activity`
- **Suggested Text:** `View Activity`
- **Context:** attendance > biometric > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Activity" className="...">
    <Activity className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 78

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** attendance > biometric > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/attendance/calendar/page.tsx

**Issues to fix:** 2

#### Line 19

- **Icon:** `ChevronLeft`
- **Suggested Text:** `Previous`
- **Context:** attendance > calendar > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Previous" className="...">
    <ChevronLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 23

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** attendance > calendar > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/attendance/working-hours/page.tsx

**Issues to fix:** 1

#### Line 58

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** attendance > working-hours > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/employees/designations/page.tsx

**Issues to fix:** 2

#### Line 63

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** employees > designations > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 66

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** employees > designations > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/employees/directory/all/page.tsx

**Issues to fix:** 2

#### Line 160

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** directory > all > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 163

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** directory > all > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/employees/teams/page.tsx

**Issues to fix:** 1

#### Line 42

- **Icon:** `UserPlus`
- **Suggested Text:** `Add User`
- **Context:** employees > teams > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add User" className="...">
    <UserPlus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/shifts/master/page.tsx

**Issues to fix:** 1

#### Line 60

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** shifts > master > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/shifts/roster/page.tsx

**Issues to fix:** 2

#### Line 20

- **Icon:** `ChevronLeft`
- **Suggested Text:** `Previous`
- **Context:** shifts > roster > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Previous" className="...">
    <ChevronLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 24

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** shifts > roster > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/shifts/swaps/page.tsx

**Issues to fix:** 2

#### Line 90

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** shifts > swaps > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 93

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** shifts > swaps > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/hr/timesheets/approval/page.tsx

**Issues to fix:** 3

#### Line 83

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** timesheets > approval > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 86

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** timesheets > approval > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 89

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** timesheets > approval > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed


---

## Inventory

### b3-erp/frontend/src/app/(modules)/inventory/analytics/reports/page.tsx

**Issues to fix:** 2

#### Line 329

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** analytics > reports > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 332

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** analytics > reports > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/cycle-count/variance/page.tsx

**Issues to fix:** 3

#### Line 392

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** cycle-count > variance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 395

- **Icon:** `CheckCircle`
- **Suggested Text:** `Approve`
- **Context:** cycle-count > variance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Approve" className="...">
    <CheckCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 398

- **Icon:** `MessageSquare`
- **Suggested Text:** `Add Comment`
- **Context:** cycle-count > variance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add Comment" className="...">
    <MessageSquare className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/kitting/assembly/page.tsx

**Issues to fix:** 2

#### Line 368

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** kitting > assembly > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 372

- **Icon:** `CheckCircle`
- **Suggested Text:** `Approve`
- **Context:** kitting > assembly > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Approve" className="...">
    <CheckCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/kitting/disassembly/page.tsx

**Issues to fix:** 2

#### Line 386

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** kitting > disassembly > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 390

- **Icon:** `Undo2`
- **Suggested Text:** `Revert`
- **Context:** kitting > disassembly > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Revert" className="...">
    <Undo2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/kitting/kits/page.tsx

**Issues to fix:** 2

#### Line 348

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** kitting > kits > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 351

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** kitting > kits > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/settings/categories/page.tsx

**Issues to fix:** 3

#### Line 271

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** settings > categories > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 274

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > categories > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 277

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > categories > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/settings/policies/page.tsx

**Issues to fix:** 2

#### Line 456

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** settings > policies > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 459

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > policies > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/settings/storage/page.tsx

**Issues to fix:** 2

#### Line 394

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** settings > storage > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 397

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > storage > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/settings/uom/page.tsx

**Issues to fix:** 3

#### Line 298

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** settings > uom > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 301

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > uom > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 305

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > uom > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/tracking/serial/page.tsx

**Issues to fix:** 2

#### Line 312

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** tracking > serial > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 315

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** tracking > serial > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/transfers/pending/page.tsx

**Issues to fix:** 2

#### Line 301

- **Icon:** `CheckCircle`
- **Suggested Text:** `Approve`
- **Context:** transfers > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Approve" className="...">
    <CheckCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 304

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** transfers > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/inventory/warehouse/locations/page.tsx

**Issues to fix:** 2

#### Line 449

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** warehouse > locations > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 452

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** warehouse > locations > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed


---

## It-Admin

### b3-erp/frontend/src/app/(modules)/it-admin/audit/changes/page.tsx

**Issues to fix:** 1

#### Line 639

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** audit > changes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/audit/compliance/page.tsx

**Issues to fix:** 1

#### Line 831

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** audit > compliance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/audit/logins/page.tsx

**Issues to fix:** 1

#### Line 591

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** audit > logins > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/license/users/page.tsx

**Issues to fix:** 1

#### Line 457

- **Icon:** `UserMinus`
- **Suggested Text:** `Remove User`
- **Context:** license > users > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Remove User" className="...">
    <UserMinus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/monitoring/errors/page.tsx

**Issues to fix:** 1

#### Line 510

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** monitoring > errors > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/monitoring/health/page.tsx

**Issues to fix:** 1

#### Line 725

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** monitoring > health > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/monitoring/logs/page.tsx

**Issues to fix:** 1

#### Line 469

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** monitoring > logs > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/roles/hierarchy/page.tsx

**Issues to fix:** 2

#### Line 227

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** roles > hierarchy > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 230

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** roles > hierarchy > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/roles/policies/page.tsx

**Issues to fix:** 1

#### Line 364

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** roles > policies > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/scheduler/automation/page.tsx

**Issues to fix:** 1

#### Line 530

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** scheduler > automation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/scheduler/history/page.tsx

**Issues to fix:** 1

#### Line 494

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** scheduler > history > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/scheduler/jobs/page.tsx

**Issues to fix:** 1

#### Line 550

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** scheduler > jobs > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/users/active/page.tsx

**Issues to fix:** 1

#### Line 174

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** users > active > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/users/groups/page.tsx

**Issues to fix:** 2

#### Line 185

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** users > groups > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 188

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** users > groups > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/it-admin/users/inactive/page.tsx

**Issues to fix:** 1

#### Line 152

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** users > inactive > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed


---

## Logistics

### b3-erp/frontend/src/app/(modules)/logistics/analytics/reports/page.tsx

**Issues to fix:** 1

#### Line 490

- **Icon:** `RefreshCw`
- **Suggested Text:** `Refresh`
- **Context:** analytics > reports > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Refresh" className="...">
    <RefreshCw className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/carriers/add/page.tsx

**Issues to fix:** 1

#### Line 240

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** carriers > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/carriers/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 232

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/carriers/rates/page.tsx

**Issues to fix:** 1

#### Line 539

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** carriers > rates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/carriers/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 270

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/drivers/assignments/page.tsx

**Issues to fix:** 3

#### Line 611

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** drivers > assignments > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 614

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** drivers > assignments > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 617

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** drivers > assignments > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/drivers/compliance/page.tsx

**Issues to fix:** 3

#### Line 1130

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** drivers > compliance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1133

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** drivers > compliance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1136

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** drivers > compliance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/drivers/performance/page.tsx

**Issues to fix:** 2

#### Line 783

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** drivers > performance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 786

- **Icon:** `Award`
- **Suggested Text:** `View Recognition`
- **Context:** drivers > performance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Recognition" className="...">
    <Award className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/fleet/fuel/page.tsx

**Issues to fix:** 3

#### Line 589

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** fleet > fuel > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 592

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** fleet > fuel > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 595

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** fleet > fuel > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/fleet/maintenance/page.tsx

**Issues to fix:** 3

#### Line 566

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** fleet > maintenance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 569

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** fleet > maintenance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 572

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** fleet > maintenance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/fleet/tracking/page.tsx

**Issues to fix:** 2

#### Line 555

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** fleet > tracking > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 558

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** fleet > tracking > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/fleet/utilization/page.tsx

**Issues to fix:** 2

#### Line 578

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** fleet > utilization > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 581

- **Icon:** `BarChart3`
- **Suggested Text:** `View Analytics`
- **Context:** fleet > utilization > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Analytics" className="...">
    <BarChart3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/freight/invoicing/page.tsx

**Issues to fix:** 2

#### Line 430

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** freight > invoicing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 433

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** freight > invoicing > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/planning/consolidation/page.tsx

**Issues to fix:** 2

#### Line 500

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** planning > consolidation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 503

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** planning > consolidation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/planning/dispatch/page.tsx

**Issues to fix:** 2

#### Line 540

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** planning > dispatch > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 543

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** planning > dispatch > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/planning/loads/page.tsx

**Issues to fix:** 2

#### Line 466

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** planning > loads > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 469

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** planning > loads > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/planning/routes/page.tsx

**Issues to fix:** 2

#### Line 538

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** planning > routes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 541

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** planning > routes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/planning/trips/page.tsx

**Issues to fix:** 2

#### Line 599

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** planning > trips > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 602

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** planning > trips > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/shipping/add/page.tsx

**Issues to fix:** 1

#### Line 415

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** shipping > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/shipping/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 303

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/tracking/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 262

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/logistics/warehouse/dock/page.tsx

**Issues to fix:** 1

#### Line 437

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** warehouse > dock > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed


---

## Other

### b3-erp/frontend/src/app/dashboard/page.tsx

**Issues to fix:** 1

#### Line 238

- **Icon:** `Bell`
- **Suggested Text:** `Notifications`
- **Context:** dashboard > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Notifications" className="...">
    <Bell className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/rfq/page.tsx

**Issues to fix:** 3

#### Line 285

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** rfq > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 291

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** rfq > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 297

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** rfq > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/Breadcrumbs.tsx

**Issues to fix:** 1

#### Line 54

- **Icon:** `Home`
- **Suggested Text:** `Home`
- **Context:** src > components > Breadcrumbs
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Home" className="...">
    <Home className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/DashboardLayout.tsx

**Issues to fix:** 1

#### Line 92

- **Icon:** `Bell`
- **Suggested Text:** `Notifications`
- **Context:** src > components > DashboardLayout
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Notifications" className="...">
    <Bell className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/Sidebar.tsx

**Issues to fix:** 1

#### Line 3285

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** src > components > Sidebar
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/AuditMaster.tsx

**Issues to fix:** 3

#### Line 462

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > AuditMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 465

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > common-masters > AuditMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 468

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** components > common-masters > AuditMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/BankMaster.tsx

**Issues to fix:** 3

#### Line 284

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > BankMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 287

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > BankMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 290

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > common-masters > BankMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/BarcodeMaster.tsx

**Issues to fix:** 3

#### Line 223

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > BarcodeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 226

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > BarcodeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 229

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > common-masters > BarcodeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/BrandMaster.tsx

**Issues to fix:** 1

#### Line 407

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > BrandMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/CategoryMaster.tsx

**Issues to fix:** 1

#### Line 647

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > CategoryMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/CertificateMaster.tsx

**Issues to fix:** 3

#### Line 433

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > CertificateMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 436

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > common-masters > CertificateMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 439

- **Icon:** `FileCheck`
- **Suggested Text:** `FileCheck`
- **Context:** components > common-masters > CertificateMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="FileCheck" className="...">
    <FileCheck className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/ChartOfAccountsMaster.tsx

**Issues to fix:** 1

#### Line 720

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > ChartOfAccountsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/CompanyMaster.tsx

**Issues to fix:** 2

#### Line 681

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** components > common-masters > CompanyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 769

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** components > common-masters > CompanyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/CreditTermsMaster.tsx

**Issues to fix:** 2

#### Line 251

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > CreditTermsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 254

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > CreditTermsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/CustomerMaster.tsx

**Issues to fix:** 1

#### Line 392

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > CustomerMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/DepartmentMaster.tsx

**Issues to fix:** 3

#### Line 590

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > DepartmentMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 885

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > common-masters > DepartmentMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 960

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > common-masters > DepartmentMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/DesignationMaster.tsx

**Issues to fix:** 2

#### Line 308

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > DesignationMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 311

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > DesignationMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/DiscountMaster.tsx

**Issues to fix:** 2

#### Line 254

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > DiscountMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 257

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > DiscountMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/EmployeeMaster.tsx

**Issues to fix:** 1

#### Line 523

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > EmployeeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/GradeMaster.tsx

**Issues to fix:** 2

#### Line 339

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > GradeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 342

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > GradeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/HSNSACCodeMaster.tsx

**Issues to fix:** 2

#### Line 362

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > HSNSACCodeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 365

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > HSNSACCodeMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/ItemGroupMaster.tsx

**Issues to fix:** 2

#### Line 398

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > ItemGroupMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 401

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > ItemGroupMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/ItemMaster.tsx

**Issues to fix:** 1

#### Line 780

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** components > common-masters > ItemMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/ItemSpecificationMaster.tsx

**Issues to fix:** 3

#### Line 254

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > ItemSpecificationMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 257

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > ItemSpecificationMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 260

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > common-masters > ItemSpecificationMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/ItemVariantsMaster.tsx

**Issues to fix:** 3

#### Line 358

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > ItemVariantsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 361

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > ItemVariantsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 364

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** components > common-masters > ItemVariantsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/LicenseMaster.tsx

**Issues to fix:** 3

#### Line 424

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > LicenseMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 427

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > common-masters > LicenseMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 430

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** components > common-masters > LicenseMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/MachineMaster.tsx

**Issues to fix:** 2

#### Line 374

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > MachineMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 377

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > MachineMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/PaymentTermsMaster.tsx

**Issues to fix:** 2

#### Line 237

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > PaymentTermsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 240

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > PaymentTermsMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/PolicyMaster.tsx

**Issues to fix:** 3

#### Line 310

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > PolicyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 311

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > PolicyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 312

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > common-masters > PolicyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/PriceListMaster.tsx

**Issues to fix:** 2

#### Line 230

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > PriceListMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 233

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > PriceListMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/RegulatoryBodyMaster.tsx

**Issues to fix:** 3

#### Line 401

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > RegulatoryBodyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 404

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > common-masters > RegulatoryBodyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 407

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** components > common-masters > RegulatoryBodyMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/SOPMaster.tsx

**Issues to fix:** 3

#### Line 343

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** components > common-masters > SOPMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 344

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > SOPMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 345

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > common-masters > SOPMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/TaxMaster.tsx

**Issues to fix:** 2

#### Line 479

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > TaxMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 851

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > common-masters > TaxMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/UOMConversionMaster.tsx

**Issues to fix:** 2

#### Line 391

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > UOMConversionMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 394

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > common-masters > UOMConversionMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/UOMMaster.tsx

**Issues to fix:** 1

#### Line 528

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > UOMMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/VendorMaster.tsx

**Issues to fix:** 1

#### Line 416

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > VendorMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/common-masters/WarehouseMaster.tsx

**Issues to fix:** 1

#### Line 484

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > common-masters > WarehouseMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/AccountsReceivableManagement.tsx

**Issues to fix:** 4

#### Line 683

- **Icon:** `Mail`
- **Suggested Text:** `Email`
- **Context:** components > finance > AccountsReceivableManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Email" className="...">
    <Mail className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 686

- **Icon:** `Phone`
- **Suggested Text:** `Call`
- **Context:** components > finance > AccountsReceivableManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Call" className="...">
    <Phone className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 689

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > AccountsReceivableManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 692

- **Icon:** `MoreHorizontal`
- **Suggested Text:** `MoreHorizontal`
- **Context:** components > finance > AccountsReceivableManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="MoreHorizontal" className="...">
    <MoreHorizontal className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/AssetManagement.tsx

**Issues to fix:** 2

#### Line 639

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > AssetManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 642

- **Icon:** `QrCodeIcon`
- **Suggested Text:** `QrCodeIcon`
- **Context:** components > finance > AssetManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="QrCodeIcon" className="...">
    <QrCodeIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/BankReconciliation.tsx

**Issues to fix:** 7

#### Line 722

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > BankReconciliation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1084

- **Icon:** `EyeIcon`
- **Suggested Text:** `EyeIcon`
- **Context:** components > finance > BankReconciliation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="EyeIcon" className="...">
    <EyeIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1087

- **Icon:** `DocumentArrowDownIcon`
- **Suggested Text:** `DocumentArrowDownIcon`
- **Context:** components > finance > BankReconciliation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="DocumentArrowDownIcon" className="...">
    <DocumentArrowDownIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1123

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > BankReconciliation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1126

- **Icon:** `AdjustmentsHorizontalIcon`
- **Suggested Text:** `AdjustmentsHorizontalIcon`
- **Context:** components > finance > BankReconciliation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="AdjustmentsHorizontalIcon" className="...">
    <AdjustmentsHorizontalIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1246

- **Icon:** `EyeIcon`
- **Suggested Text:** `EyeIcon`
- **Context:** components > finance > BankReconciliation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="EyeIcon" className="...">
    <EyeIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1249

- **Icon:** `DocumentArrowDownIcon`
- **Suggested Text:** `DocumentArrowDownIcon`
- **Context:** components > finance > BankReconciliation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="DocumentArrowDownIcon" className="...">
    <DocumentArrowDownIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/BudgetManagement.tsx

**Issues to fix:** 2

#### Line 478

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > BudgetManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 695

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > BudgetManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/CashFlowManagement.tsx

**Issues to fix:** 4

#### Line 607

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** components > finance > CashFlowManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 663

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > CashFlowManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 666

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > finance > CashFlowManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 669

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > finance > CashFlowManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/CostCenterManagement.tsx

**Issues to fix:** 4

#### Line 793

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > CostCenterManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 901

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > CostCenterManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 904

- **Icon:** `ShareIcon`
- **Suggested Text:** `ShareIcon`
- **Context:** components > finance > CostCenterManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="ShareIcon" className="...">
    <ShareIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1100

- **Icon:** `EyeIcon`
- **Suggested Text:** `EyeIcon`
- **Context:** components > finance > CostCenterManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="EyeIcon" className="...">
    <EyeIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/CreditManagement.tsx

**Issues to fix:** 3

#### Line 622

- **Icon:** `CheckCircle`
- **Suggested Text:** `Approve`
- **Context:** components > finance > CreditManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Approve" className="...">
    <CheckCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 625

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** components > finance > CreditManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 631

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > CreditManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/EnhancedFinanceDashboard.tsx

**Issues to fix:** 4

#### Line 341

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > EnhancedFinanceDashboard
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 359

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > EnhancedFinanceDashboard
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 377

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > EnhancedFinanceDashboard
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 395

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > EnhancedFinanceDashboard
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialAnalytics.tsx

**Issues to fix:** 2

#### Line 801

- **Icon:** `EyeIcon`
- **Suggested Text:** `EyeIcon`
- **Context:** components > finance > FinancialAnalytics
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="EyeIcon" className="...">
    <EyeIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 832

- **Icon:** `DocumentArrowDownIcon`
- **Suggested Text:** `DocumentArrowDownIcon`
- **Context:** components > finance > FinancialAnalytics
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="DocumentArrowDownIcon" className="...">
    <DocumentArrowDownIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialAutomation.tsx

**Issues to fix:** 6

#### Line 556

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > finance > FinancialAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 559

- **Icon:** `Pause`
- **Suggested Text:** `Pause`
- **Context:** components > finance > FinancialAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Pause" className="...">
    <Pause className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 751

- **Icon:** `Pause`
- **Suggested Text:** `Pause`
- **Context:** components > finance > FinancialAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Pause" className="...">
    <Pause className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 755

- **Icon:** `Play`
- **Suggested Text:** `Play`
- **Context:** components > finance > FinancialAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Play" className="...">
    <Play className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 881

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** components > finance > FinancialAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1109

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > FinancialAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialConsolidation.tsx

**Issues to fix:** 8

#### Line 269

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 358

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 428

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 492

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 606

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 610

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 872

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 956

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** components > finance > FinancialConsolidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialControls.tsx

**Issues to fix:** 7

#### Line 731

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > FinancialControls
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 734

- **Icon:** `CogIcon`
- **Suggested Text:** `CogIcon`
- **Context:** components > finance > FinancialControls
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="CogIcon" className="...">
    <CogIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 895

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > FinancialControls
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 899

- **Icon:** `CheckCircleIcon`
- **Suggested Text:** `CheckCircleIcon`
- **Context:** components > finance > FinancialControls
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="CheckCircleIcon" className="...">
    <CheckCircleIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1057

- **Icon:** `DocumentMagnifyingGlassIcon`
- **Suggested Text:** `DocumentMagnifyingGlassIcon`
- **Context:** components > finance > FinancialControls
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="DocumentMagnifyingGlassIcon" className="...">
    <DocumentMagnifyingGlassIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1092

- **Icon:** `EyeIcon`
- **Suggested Text:** `EyeIcon`
- **Context:** components > finance > FinancialControls
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="EyeIcon" className="...">
    <EyeIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1095

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > FinancialControls
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialIntegrations.tsx

**Issues to fix:** 6

#### Line 389

- **Icon:** `Pause`
- **Suggested Text:** `Pause`
- **Context:** components > finance > FinancialIntegrations
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Pause" className="...">
    <Pause className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 393

- **Icon:** `Play`
- **Suggested Text:** `Play`
- **Context:** components > finance > FinancialIntegrations
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Play" className="...">
    <Play className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 397

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > finance > FinancialIntegrations
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 564

- **Icon:** `RefreshCw`
- **Suggested Text:** `Refresh`
- **Context:** components > finance > FinancialIntegrations
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Refresh" className="...">
    <RefreshCw className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 729

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > finance > FinancialIntegrations
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 732

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > finance > FinancialIntegrations
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialPeriodManagement.tsx

**Issues to fix:** 4

#### Line 588

- **Icon:** `Play`
- **Suggested Text:** `Play`
- **Context:** components > finance > FinancialPeriodManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Play" className="...">
    <Play className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 593

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** components > finance > FinancialPeriodManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 827

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** components > finance > FinancialPeriodManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 831

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > finance > FinancialPeriodManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialReporting.tsx

**Issues to fix:** 6

#### Line 390

- **Icon:** `ArrowDownTrayIcon`
- **Suggested Text:** `ArrowDownTrayIcon`
- **Context:** components > finance > FinancialReporting
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="ArrowDownTrayIcon" className="...">
    <ArrowDownTrayIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 439

- **Icon:** `TrashIcon`
- **Suggested Text:** `TrashIcon`
- **Context:** components > finance > FinancialReporting
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="TrashIcon" className="...">
    <TrashIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 485

- **Icon:** `EyeIcon`
- **Suggested Text:** `EyeIcon`
- **Context:** components > finance > FinancialReporting
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="EyeIcon" className="...">
    <EyeIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 488

- **Icon:** `DocumentDuplicateIcon`
- **Suggested Text:** `DocumentDuplicateIcon`
- **Context:** components > finance > FinancialReporting
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="DocumentDuplicateIcon" className="...">
    <DocumentDuplicateIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 600

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > FinancialReporting
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 603

- **Icon:** `PlayIcon`
- **Suggested Text:** `PlayIcon`
- **Context:** components > finance > FinancialReporting
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PlayIcon" className="...">
    <PlayIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/FinancialWorkflows.tsx

**Issues to fix:** 6

#### Line 503

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > finance > FinancialWorkflows
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 593

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > finance > FinancialWorkflows
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 597

- **Icon:** `Pause`
- **Suggested Text:** `Pause`
- **Context:** components > finance > FinancialWorkflows
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Pause" className="...">
    <Pause className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 601

- **Icon:** `Play`
- **Suggested Text:** `Play`
- **Context:** components > finance > FinancialWorkflows
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Play" className="...">
    <Play className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 746

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > finance > FinancialWorkflows
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 749

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > finance > FinancialWorkflows
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/GeneralLedger.tsx

**Issues to fix:** 3

#### Line 761

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > GeneralLedger
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 897

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > GeneralLedger
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 901

- **Icon:** `DocumentArrowDownIcon`
- **Suggested Text:** `DocumentArrowDownIcon`
- **Context:** components > finance > GeneralLedger
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="DocumentArrowDownIcon" className="...">
    <DocumentArrowDownIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/InvestmentPortfolio.tsx

**Issues to fix:** 3

#### Line 813

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > finance > InvestmentPortfolio
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 902

- **Icon:** `Check`
- **Suggested Text:** `Check`
- **Context:** components > finance > InvestmentPortfolio
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Check" className="...">
    <Check className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 905

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > finance > InvestmentPortfolio
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/MultiCurrencyManagement.tsx

**Issues to fix:** 4

#### Line 828

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > MultiCurrencyManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 831

- **Icon:** `CogIcon`
- **Suggested Text:** `CogIcon`
- **Context:** components > finance > MultiCurrencyManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="CogIcon" className="...">
    <CogIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 913

- **Icon:** `ArrowPathIcon`
- **Suggested Text:** `ArrowPathIcon`
- **Context:** components > finance > MultiCurrencyManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="ArrowPathIcon" className="...">
    <ArrowPathIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 916

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > MultiCurrencyManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/finance/TaxManagement.tsx

**Issues to fix:** 4

#### Line 682

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > TaxManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 807

- **Icon:** `PencilIcon`
- **Suggested Text:** `PencilIcon`
- **Context:** components > finance > TaxManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="PencilIcon" className="...">
    <PencilIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 811

- **Icon:** `DocumentArrowDownIcon`
- **Suggested Text:** `DocumentArrowDownIcon`
- **Context:** components > finance > TaxManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="DocumentArrowDownIcon" className="...">
    <DocumentArrowDownIcon className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1056

- **Icon:** `EyeIcon`
- **Suggested Text:** `EyeIcon`
- **Context:** components > finance > TaxManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="EyeIcon" className="...">
    <EyeIcon className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/logistics/DriverMaster.tsx

**Issues to fix:** 2

#### Line 83

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** components > logistics > DriverMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 84

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > logistics > DriverMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/logistics/FreightMaster.tsx

**Issues to fix:** 2

#### Line 82

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** components > logistics > FreightMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 83

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > logistics > FreightMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/logistics/PackagingMaster.tsx

**Issues to fix:** 2

#### Line 85

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** components > logistics > PackagingMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 86

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > logistics > PackagingMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/logistics/PortMaster.tsx

**Issues to fix:** 2

#### Line 96

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** components > logistics > PortMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 97

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > logistics > PortMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/logistics/RouteMaster.tsx

**Issues to fix:** 2

#### Line 88

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** components > logistics > RouteMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 89

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > logistics > RouteMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/logistics/VehicleMaster.tsx

**Issues to fix:** 2

#### Line 100

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** components > logistics > VehicleMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 101

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > logistics > VehicleMaster
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/ContractManagement.tsx

**Issues to fix:** 2

#### Line 589

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > ContractManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 592

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > ContractManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/DarkModeExamples.tsx

**Issues to fix:** 3

#### Line 365

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > DarkModeExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 368

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > DarkModeExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 371

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > procurement > DarkModeExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/DarkModeTheme.tsx

**Issues to fix:** 1

#### Line 263

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > procurement > DarkModeTheme
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/DataTable.tsx

**Issues to fix:** 1

#### Line 266

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > DataTable
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/EProcurementMarketplace.tsx

**Issues to fix:** 6

#### Line 392

- **Icon:** `Heart`
- **Suggested Text:** `Heart`
- **Context:** components > procurement > EProcurementMarketplace
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Heart" className="...">
    <Heart className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 456

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > EProcurementMarketplace
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 467

- **Icon:** `ChevronLeft`
- **Suggested Text:** `Previous`
- **Context:** components > procurement > EProcurementMarketplace
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Previous" className="...">
    <ChevronLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 480

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** components > procurement > EProcurementMarketplace
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 763

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > EProcurementMarketplace
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 766

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > EProcurementMarketplace
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/FormValidation.tsx

**Issues to fix:** 1

#### Line 432

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** components > procurement > FormValidation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/HelpExamples.tsx

**Issues to fix:** 7

#### Line 115

- **Icon:** `AlertTriangle`
- **Suggested Text:** `AlertTriangle`
- **Context:** components > procurement > HelpExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="AlertTriangle" className="...">
    <AlertTriangle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 205

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > HelpExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 210

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** components > procurement > HelpExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 403

- **Icon:** `AlertTriangle`
- **Suggested Text:** `AlertTriangle`
- **Context:** components > procurement > HelpExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="AlertTriangle" className="...">
    <AlertTriangle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 543

- **Icon:** `Mail`
- **Suggested Text:** `Email`
- **Context:** components > procurement > HelpExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Email" className="...">
    <Mail className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 620

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > HelpExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 625

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > procurement > HelpExamples
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/ProcurementAnalytics.tsx

**Issues to fix:** 3

#### Line 247

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > ProcurementAnalytics
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 932

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > ProcurementAnalytics
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 935

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > procurement > ProcurementAnalytics
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/ProcurementAutomation.tsx

**Issues to fix:** 3

#### Line 541

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > procurement > ProcurementAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 922

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > procurement > ProcurementAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 933

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** components > procurement > ProcurementAutomation
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/ProcurementCompliance.tsx

**Issues to fix:** 1

#### Line 168

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > ProcurementCompliance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/ProcurementRiskManagement.tsx

**Issues to fix:** 1

#### Line 568

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > ProcurementRiskManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/PurchaseRequisitionWorkflow.tsx

**Issues to fix:** 3

#### Line 427

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > PurchaseRequisitionWorkflow
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 430

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > PurchaseRequisitionWorkflow
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 433

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** components > procurement > PurchaseRequisitionWorkflow
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/QualityAssurance.tsx

**Issues to fix:** 12

#### Line 396

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 399

- **Icon:** `ClipboardCheck`
- **Suggested Text:** `ClipboardCheck`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="ClipboardCheck" className="...">
    <ClipboardCheck className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 536

- **Icon:** `Edit3`
- **Suggested Text:** `Edit3`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit3" className="...">
    <Edit3 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 674

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 689

- **Icon:** `Upload`
- **Suggested Text:** `Upload`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Upload" className="...">
    <Upload className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 709

- **Icon:** `Upload`
- **Suggested Text:** `Upload`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Upload" className="...">
    <Upload className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 851

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 854

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 868

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 871

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 885

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 888

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > QualityAssurance
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/RFQRFPManagement.tsx

**Issues to fix:** 9

#### Line 462

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 585

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 588

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 591

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 714

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 717

- **Icon:** `ThumbsUp`
- **Suggested Text:** `ThumbsUp`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="ThumbsUp" className="...">
    <ThumbsUp className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 720

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 931

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 945

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > RFQRFPManagement
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/SpendAnalysis.tsx

**Issues to fix:** 1

#### Line 640

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** components > procurement > SpendAnalysis
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/StrategicSourcing.tsx

**Issues to fix:** 2

#### Line 502

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > StrategicSourcing
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 505

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > StrategicSourcing
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/SupplierCollaboration.tsx

**Issues to fix:** 11

#### Line 377

- **Icon:** `MessageCircle`
- **Suggested Text:** `MessageCircle`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="MessageCircle" className="...">
    <MessageCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 410

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 488

- **Icon:** `MessageCircle`
- **Suggested Text:** `MessageCircle`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="MessageCircle" className="...">
    <MessageCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 491

- **Icon:** `Video`
- **Suggested Text:** `Video`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Video" className="...">
    <Video className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 533

- **Icon:** `Bell`
- **Suggested Text:** `Notifications`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Notifications" className="...">
    <Bell className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 595

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 598

- **Icon:** `MessageCircle`
- **Suggested Text:** `MessageCircle`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="MessageCircle" className="...">
    <MessageCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 668

- **Icon:** `Share2`
- **Suggested Text:** `Share2`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Share2" className="...">
    <Share2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 739

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 742

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 745

- **Icon:** `Share2`
- **Suggested Text:** `Share2`
- **Context:** components > procurement > SupplierCollaboration
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Share2" className="...">
    <Share2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/SupplierOnboarding.tsx

**Issues to fix:** 3

#### Line 578

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > SupplierOnboarding
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 581

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > SupplierOnboarding
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 584

- **Icon:** `MessageSquare`
- **Suggested Text:** `Add Comment`
- **Context:** components > procurement > SupplierOnboarding
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add Comment" className="...">
    <MessageSquare className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/SupplierScorecard.tsx

**Issues to fix:** 3

#### Line 596

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** components > procurement > SupplierScorecard
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 886

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** components > procurement > SupplierScorecard
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 889

- **Icon:** `MessageSquare`
- **Suggested Text:** `Add Comment`
- **Context:** components > procurement > SupplierScorecard
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add Comment" className="...">
    <MessageSquare className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/TooltipsAndHelp.tsx

**Issues to fix:** 1

#### Line 611

- **Icon:** `HelpCircle`
- **Suggested Text:** `Help`
- **Context:** components > procurement > TooltipsAndHelp
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Help" className="...">
    <HelpCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/components/procurement/ui/index.tsx

**Issues to fix:** 2

#### Line 153

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** procurement > ui > index
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 197

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** procurement > ui > index
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed


---

## Procurement

### b3-erp/frontend/src/app/(modules)/procurement/budget/page.tsx

**Issues to fix:** 2

#### Line 107

- **Icon:** `RefreshCw`
- **Suggested Text:** `Refresh`
- **Context:** procurement > budget > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Refresh" className="...">
    <RefreshCw className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 110

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > budget > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/calendar/page.tsx

**Issues to fix:** 2

#### Line 380

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** procurement > calendar > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 383

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > calendar > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/contracts/page.tsx

**Issues to fix:** 4

#### Line 625

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** procurement > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 628

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** procurement > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 631

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** procurement > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 654

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > contracts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/grn/[id]/inspect/page.tsx

**Issues to fix:** 1

#### Line 324

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** [id] > inspect > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/invoices/page.tsx

**Issues to fix:** 2

#### Line 445

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** procurement > invoices > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 448

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > invoices > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/notifications/page.tsx

**Issues to fix:** 4

#### Line 445

- **Icon:** `RefreshCw`
- **Suggested Text:** `Refresh`
- **Context:** procurement > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Refresh" className="...">
    <RefreshCw className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 448

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 525

- **Icon:** `Archive`
- **Suggested Text:** `Archive`
- **Context:** procurement > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Archive" className="...">
    <Archive className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 528

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** procurement > notifications > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/page.tsx

**Issues to fix:** 2

#### Line 433

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** (modules) > procurement > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 436

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** (modules) > procurement > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/purchase-orders/create/page.tsx

**Issues to fix:** 4

#### Line 295

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** purchase-orders > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 491

- **Icon:** `Search`
- **Suggested Text:** `Search`
- **Context:** purchase-orders > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Search" className="...">
    <Search className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 714

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** purchase-orders > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 717

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** purchase-orders > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/purchase-orders/page.tsx

**Issues to fix:** 9

#### Line 764

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 770

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 773

- **Icon:** `Printer`
- **Suggested Text:** `Print`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Print" className="...">
    <Printer className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 776

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 880

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 886

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 889

- **Icon:** `Printer`
- **Suggested Text:** `Print`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Print" className="...">
    <Printer className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 892

- **Icon:** `Mail`
- **Suggested Text:** `Email`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Email" className="...">
    <Mail className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 896

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** procurement > purchase-orders > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/requisitions/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 773

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/rfq/[id]/compare/page.tsx

**Issues to fix:** 3

#### Line 259

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** [id] > compare > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 407

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** [id] > compare > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 410

- **Icon:** `Mail`
- **Suggested Text:** `Email`
- **Context:** [id] > compare > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Email" className="...">
    <Mail className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/supplier-portal/page.tsx

**Issues to fix:** 16

#### Line 88

- **Icon:** `Bell`
- **Suggested Text:** `Notifications`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Notifications" className="...">
    <Bell className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 91

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 275

- **Icon:** `Filter`
- **Suggested Text:** `Filter`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Filter" className="...">
    <Filter className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 278

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 318

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 321

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 325

- **Icon:** `Truck`
- **Suggested Text:** `Track Shipment`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Track Shipment" className="...">
    <Truck className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 363

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 437

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 440

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 444

- **Icon:** `Send`
- **Suggested Text:** `Send`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Send" className="...">
    <Send className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 579

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 591

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 683

- **Icon:** `HelpCircle`
- **Suggested Text:** `Help`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Help" className="...">
    <HelpCircle className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 691

- **Icon:** `User`
- **Suggested Text:** `Profile`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Profile" className="...">
    <User className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 695

- **Icon:** `LogOut`
- **Suggested Text:** `Logout`
- **Context:** procurement > supplier-portal > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Logout" className="...">
    <LogOut className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/vendor-performance/page.tsx

**Issues to fix:** 1

#### Line 564

- **Icon:** `BarChart3`
- **Suggested Text:** `View Analytics`
- **Context:** procurement > vendor-performance > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Analytics" className="...">
    <BarChart3 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/vendors/add/page.tsx

**Issues to fix:** 1

#### Line 1209

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** vendors > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/vendors/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 1083

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/procurement/vendors/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 1148

- **Icon:** `ExternalLink`
- **Suggested Text:** `Open Link`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Open Link" className="...">
    <ExternalLink className="..." />
  </button>
  ```

- [ ] Fixed


---

## Production

### b3-erp/frontend/src/app/(modules)/production/planning/page.tsx

**Issues to fix:** 3

#### Line 1888

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** production > planning > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1891

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** production > planning > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1894

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** production > planning > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/production/quality/view/[id]/page.tsx

**Issues to fix:** 3

#### Line 502

- **Icon:** `ExternalLink`
- **Suggested Text:** `Open Link`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Open Link" className="...">
    <ExternalLink className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 543

- **Icon:** `Printer`
- **Suggested Text:** `Print`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Print" className="...">
    <Printer className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 546

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/production/settings/lines/page.tsx

**Issues to fix:** 2

#### Line 396

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > lines > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 399

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > lines > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/production/settings/shifts/page.tsx

**Issues to fix:** 2

#### Line 417

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > shifts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 420

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > shifts > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/production/settings/work-centers/page.tsx

**Issues to fix:** 2

#### Line 363

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** settings > work-centers > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 366

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > work-centers > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/production/work-orders/add/page.tsx

**Issues to fix:** 1

#### Line 902

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** work-orders > add > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/production/work-orders/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 721

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/production/work-orders/view/[id]/page.tsx

**Issues to fix:** 1

#### Line 693

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed


---

## Project-Management

### b3-erp/frontend/src/app/(modules)/project-management/budget/page.tsx

**Issues to fix:** 2

#### Line 383

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** project-management > budget > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 386

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** project-management > budget > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/project-management/documents/page.tsx

**Issues to fix:** 1

#### Line 709

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** project-management > documents > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/project-management/milestone-templates/page.tsx

**Issues to fix:** 2

#### Line 1289

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** project-management > milestone-templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 1292

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** project-management > milestone-templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/project-management/project-types/page.tsx

**Issues to fix:** 1

#### Line 600

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** project-management > project-types > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/project-management/reports/page.tsx

**Issues to fix:** 1

#### Line 593

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** project-management > reports > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/project-management/schedule/page.tsx

**Issues to fix:** 2

#### Line 179

- **Icon:** `ZoomOut`
- **Suggested Text:** `Zoom Out`
- **Context:** project-management > schedule > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Zoom Out" className="...">
    <ZoomOut className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 182

- **Icon:** `ZoomIn`
- **Suggested Text:** `Zoom In`
- **Context:** project-management > schedule > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Zoom In" className="...">
    <ZoomIn className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/project-management/templates/page.tsx

**Issues to fix:** 2

#### Line 674

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** project-management > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 677

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** project-management > templates > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/project-management/view/[id]/page.tsx

**Issues to fix:** 2

#### Line 152

- **Icon:** `ArrowLeft`
- **Suggested Text:** `Go Back`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Go Back" className="...">
    <ArrowLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 176

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** view > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed


---

## Reports

### b3-erp/frontend/src/app/(modules)/reports/custom/page.tsx

**Issues to fix:** 2

#### Line 823

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** reports > custom > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 877

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** reports > custom > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/reports/dashboards/page.tsx

**Issues to fix:** 3

#### Line 321

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** reports > dashboards > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 726

- **Icon:** `Share2`
- **Suggested Text:** `Share2`
- **Context:** reports > dashboards > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Share2" className="...">
    <Share2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 732

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** reports > dashboards > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed


---

## Rfq

### b3-erp/frontend/src/app/(modules)/rfq/edit/[id]/page.tsx

**Issues to fix:** 1

#### Line 751

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** edit > [id] > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed


---

## Sales

### b3-erp/frontend/src/app/(modules)/sales/delivery/installation/page.tsx

**Issues to fix:** 1

#### Line 566

- **Icon:** `Camera`
- **Suggested Text:** `View Photos`
- **Context:** delivery > installation > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Photos" className="...">
    <Camera className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/delivery/notes/page.tsx

**Issues to fix:** 2

#### Line 420

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** delivery > notes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 423

- **Icon:** `Printer`
- **Suggested Text:** `Print`
- **Context:** delivery > notes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Print" className="...">
    <Printer className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/handover/accepted/page.tsx

**Issues to fix:** 2

#### Line 426

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** handover > accepted > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 430

- **Icon:** `Camera`
- **Suggested Text:** `View Photos`
- **Context:** handover > accepted > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Photos" className="...">
    <Camera className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/handover/pending/page.tsx

**Issues to fix:** 1

#### Line 485

- **Icon:** `FileText`
- **Suggested Text:** `View Document`
- **Context:** handover > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View Document" className="...">
    <FileText className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/invoices/credit-notes/page.tsx

**Issues to fix:** 1

#### Line 381

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** invoices > credit-notes > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/invoices/overdue/page.tsx

**Issues to fix:** 2

#### Line 345

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** invoices > overdue > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 348

- **Icon:** `Send`
- **Suggested Text:** `Send`
- **Context:** invoices > overdue > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Send" className="...">
    <Send className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/invoices/paid/page.tsx

**Issues to fix:** 1

#### Line 319

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** invoices > paid > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/invoices/pending/page.tsx

**Issues to fix:** 3

#### Line 242

- **Icon:** `MoreVertical`
- **Suggested Text:** `More Options`
- **Context:** invoices > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="More Options" className="...">
    <MoreVertical className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 293

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** invoices > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 296

- **Icon:** `Download`
- **Suggested Text:** `Download`
- **Context:** invoices > pending > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Download" className="...">
    <Download className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/orders/create/page.tsx

**Issues to fix:** 1

#### Line 351

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** orders > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/pricing/lists/page.tsx

**Issues to fix:** 2

#### Line 450

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** pricing > lists > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 453

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** pricing > lists > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/quotations/create/page.tsx

**Issues to fix:** 1

#### Line 320

- **Icon:** `Plus`
- **Suggested Text:** `Add`
- **Context:** quotations > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Add" className="...">
    <Plus className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/rfp/create/page.tsx

**Issues to fix:** 1

#### Line 466

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** rfp > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/sales/settings/terms/page.tsx

**Issues to fix:** 1

#### Line 375

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** settings > terms > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed


---

## Support

### b3-erp/frontend/src/app/(modules)/support/assets/hardware/page.tsx

**Issues to fix:** 1

#### Line 454

- **Icon:** `Edit`
- **Suggested Text:** `Edit`
- **Context:** assets > hardware > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/assets/tracking/page.tsx

**Issues to fix:** 1

#### Line 561

- **Icon:** `History`
- **Suggested Text:** `View History`
- **Context:** assets > tracking > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View History" className="...">
    <History className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/automation/assignment/page.tsx

**Issues to fix:** 2

#### Line 404

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** automation > assignment > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 407

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** automation > assignment > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/automation/responses/page.tsx

**Issues to fix:** 3

#### Line 517

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** automation > responses > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 520

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** automation > responses > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 523

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** automation > responses > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/automation/rules/page.tsx

**Issues to fix:** 3

#### Line 447

- **Icon:** `Edit2`
- **Suggested Text:** `Edit`
- **Context:** automation > rules > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Edit" className="...">
    <Edit2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 450

- **Icon:** `Copy`
- **Suggested Text:** `Copy`
- **Context:** automation > rules > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Copy" className="...">
    <Copy className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 453

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** automation > rules > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/changes/scheduled/page.tsx

**Issues to fix:** 2

#### Line 305

- **Icon:** `ChevronLeft`
- **Suggested Text:** `Previous`
- **Context:** changes > scheduled > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Previous" className="...">
    <ChevronLeft className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 311

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** changes > scheduled > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/incidents/critical/page.tsx

**Issues to fix:** 4

#### Line 487

- **Icon:** `Phone`
- **Suggested Text:** `Call`
- **Context:** incidents > critical > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Call" className="...">
    <Phone className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 490

- **Icon:** `Mail`
- **Suggested Text:** `Email`
- **Context:** incidents > critical > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Email" className="...">
    <Mail className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 493

- **Icon:** `Bell`
- **Suggested Text:** `Notifications`
- **Context:** incidents > critical > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Notifications" className="...">
    <Bell className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 511

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** incidents > critical > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/incidents/major/page.tsx

**Issues to fix:** 1

#### Line 559

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** incidents > major > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/incidents/tracking/page.tsx

**Issues to fix:** 1

#### Line 530

- **Icon:** `XCircle`
- **Suggested Text:** `Close`
- **Context:** incidents > tracking > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Close" className="...">
    <XCircle className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/knowledge/create/page.tsx

**Issues to fix:** 3

#### Line 391

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** knowledge > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 436

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** knowledge > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 480

- **Icon:** `Unknown`
- **Suggested Text:** `Unknown`
- **Context:** knowledge > create > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Unknown" className="...">
    <Unknown className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/problems/known-errors/page.tsx

**Issues to fix:** 1

#### Line 318

- **Icon:** `ChevronRight`
- **Suggested Text:** `Next`
- **Context:** problems > known-errors > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Next" className="...">
    <ChevronRight className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/problems/page.tsx

**Issues to fix:** 1

#### Line 362

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** support > problems > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/reports/page.tsx

**Issues to fix:** 3

#### Line 468

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** support > reports > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 471

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** support > reports > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 499

- **Icon:** `Settings`
- **Suggested Text:** `Settings`
- **Context:** support > reports > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Settings" className="...">
    <Settings className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/sla/settings/page.tsx

**Issues to fix:** 2

#### Line 263

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** sla > settings > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

#### Line 499

- **Icon:** `Trash2`
- **Suggested Text:** `Delete`
- **Context:** sla > settings > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="Delete" className="...">
    <Trash2 className="..." />
  </button>
  ```

- [ ] Fixed

### b3-erp/frontend/src/app/(modules)/support/tickets/open/page.tsx

**Issues to fix:** 1

#### Line 299

- **Icon:** `Eye`
- **Suggested Text:** `View`
- **Context:** tickets > open > page
- **Implementation:**
  ```tsx
  // Add aria-label
  <button aria-label="View" className="...">
    <Eye className="..." />
  </button>
  ```

- [ ] Fixed


---

