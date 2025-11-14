# Chart of Accounts Documentation

## Overview

This document describes the comprehensive multi-level Chart of Accounts (COA) implemented for manufacturing companies. The COA follows Indian Accounting Standards and is GST compliant.

## Structure

The Chart of Accounts is organized into major categories with a 4-digit account code system:

- **1000-1999**: Assets
- **2000-2999**: Liabilities
- **3000-3999**: Equity
- **4000-4999**: Income/Revenue
- **5000-5999**: Cost of Goods Sold
- **6000-6999**: Operating Expenses
- **7000-7999**: Other Income & Expenses
- **8000-8999**: Tax Accounts

## Account Hierarchy

### Assets (1000-1999)

#### Current Assets (1000-1499)
- **1000**: Current Assets (Header)
  - **1010-1099**: Cash and Cash Equivalents
    - 1011: Cash in Hand
    - 1012: Petty Cash
    - 1021-1024: Bank Accounts (Current, Savings, Foreign Currency, Overdraft)
  - **1100-1199**: Accounts Receivable
    - 1110: Trade Receivables - Domestic
    - 1115: Trade Receivables - Export
    - 1120: Bills Receivable
    - 1130: Unbilled Revenue
    - 1140: Allowance for Doubtful Accounts (Contra)
  - **1200-1299**: Inventory
    - 1210: Raw Materials
    - 1220: Work in Progress (WIP)
    - 1230: Finished Goods
    - 1240: Packing Materials
    - 1250: Consumables and Supplies
    - 1260: Goods in Transit
    - 1270: Inventory Reserve (Contra)
  - **1300-1399**: Other Current Assets
    - 1310: Prepaid Expenses
    - 1320: Advance to Suppliers
    - 1330: Advance to Employees
    - 1340: GST Input Tax Credit
    - 1350: TDS Receivable
    - 1360: Security Deposits
    - 1370: Short-term Investments

#### Fixed Assets (1500-1999)
- **1500**: Fixed Assets (Header)
  - **1510-1599**: Property, Plant & Equipment
    - 1511: Land
    - 1520: Buildings
    - 1521: Accumulated Depreciation - Buildings (Contra)
    - 1530: Plant and Machinery
    - 1531: Accumulated Depreciation - Plant and Machinery (Contra)
    - 1540: Furniture and Fixtures
    - 1541: Accumulated Depreciation - Furniture and Fixtures (Contra)
    - 1550: Vehicles
    - 1551: Accumulated Depreciation - Vehicles (Contra)
    - 1560: Office Equipment
    - 1561: Accumulated Depreciation - Office Equipment (Contra)
    - 1570: Computer Hardware
    - 1571: Accumulated Depreciation - Computer Hardware (Contra)
    - 1580: Leasehold Improvements
    - 1581: Accumulated Amortization - Leasehold Improvements (Contra)
  - **1700-1799**: Intangible Assets
    - 1710: Goodwill
    - 1720: Patents
    - 1730: Trademarks
    - 1740: Computer Software
    - 1741: Accumulated Amortization - Software (Contra)
  - **1800-1899**: Other Non-Current Assets
    - 1810: Long-term Investments
    - 1820: Long-term Deposits
    - 1830: Deferred Tax Asset

### Liabilities (2000-2999)

#### Current Liabilities (2000-2499)
- **2000**: Current Liabilities (Header)
  - **2010-2099**: Accounts Payable
    - 2011: Trade Payables - Domestic
    - 2012: Trade Payables - Import
    - 2020: Bills Payable
    - 2030: Unearned Revenue
  - **2100-2199**: Statutory Liabilities
    - 2110: GST Payable - CGST
    - 2111: GST Payable - SGST
    - 2112: GST Payable - IGST
    - 2120: TDS Payable
    - 2130: TCS Payable
    - 2140: Professional Tax Payable
    - 2150: Provident Fund Payable
    - 2160: ESI Payable
    - 2170: Labour Welfare Fund Payable
  - **2200-2299**: Payroll Liabilities
    - 2210: Salary Payable
    - 2220: Wages Payable
    - 2230: Bonus Payable
    - 2240: Leave Encashment Payable
    - 2250: Gratuity Payable
  - **2300-2399**: Other Current Liabilities
    - 2310: Accrued Expenses
    - 2320: Interest Payable
    - 2330: Dividends Payable
    - 2340: Short-term Borrowings
    - 2350: Bank Overdraft
    - 2360: Security Deposits Received

#### Long-term Liabilities (2500-2999)
- **2500**: Long-term Liabilities (Header)
  - **2510-2599**: Long-term Loans
    - 2511: Term Loans - Banks
    - 2512: Term Loans - Financial Institutions
  - 2520: Debentures
  - 2530: Deferred Tax Liability
  - 2540: Long-term Lease Obligations

### Equity (3000-3999)
- **3000**: Owner's Equity (Header)
  - **3010-3099**: Share Capital
    - 3011: Equity Share Capital
    - 3012: Preference Share Capital
  - **3100-3199**: Reserves and Surplus
    - 3110: Capital Reserve
    - 3120: Securities Premium
    - 3130: General Reserve
    - 3140: Revaluation Reserve
  - **3200-3299**: Retained Earnings
    - 3200: Retained Earnings
    - 3210: Current Year Earnings
    - 3220: Dividends (Debit balance)

### Income (4000-4999)
- **4000**: Revenue (Header)
  - **4010-4099**: Sales Revenue
    - 4011: Domestic Sales
    - 4012: Export Sales
  - 4020: Service Revenue
  - 4030: Job Work Revenue
  - **4100-4199**: Sales Adjustments (Contra Revenue)
    - 4110: Sales Returns
    - 4120: Sales Discounts
    - 4130: Sales Allowances

### Cost of Goods Sold (5000-5999)
- **5000**: Cost of Goods Sold (Header)
  - **5010-5099**: Direct Materials
    - 5011: Raw Material Purchases
    - 5012: Raw Material Consumed
  - 5020: Purchase Returns (Contra COGS)
  - 5030: Freight Inward
  - **5100-5199**: Direct Labor
    - 5110: Production Wages
    - 5120: Production Staff Salaries
  - **5200-5299**: Manufacturing Overhead
    - 5210: Factory Rent
    - 5220: Factory Utilities
    - 5230: Factory Maintenance
    - 5240: Consumable Stores
    - 5250: Packing Materials
    - 5260: Quality Control Expenses
  - 5300: Sub-contracting Charges

### Operating Expenses (6000-6999)
- **6000**: Operating Expenses (Header)
  - **6100-6299**: Administrative Expenses
    - 6110: Office Salaries
    - 6120: Office Rent
    - 6130: Office Utilities
    - 6140: Office Supplies
    - 6150: Telephone and Internet
    - 6160: Postage and Courier
    - 6170: Printing and Stationery
    - 6180: Professional Fees
    - 6190: Legal and Compliance
    - 6200: Audit Fees
    - 6210: Insurance
    - 6220: IT and Software
  - **6300-6499**: Selling and Distribution Expenses
    - 6310: Sales Salaries and Commission
    - 6320: Marketing and Advertising
    - 6330: Business Promotion
    - 6340: Transportation and Freight
    - 6350: Warehouse Expenses
    - 6360: Customer Service
  - **6500-6599**: Employee Benefits
    - 6510: Employee Welfare
    - 6520: Training and Development
    - 6530: Staff Recruitment
    - 6540: Travel and Conveyance
  - **6600-6699**: Repairs and Maintenance
    - 6610: Building Maintenance
    - 6620: Machinery Maintenance
    - 6630: Vehicle Maintenance
  - **6700-6799**: Depreciation and Amortization
    - 6710: Depreciation Expense
    - 6720: Amortization Expense

### Other Income & Expenses (7000-7999)
- **7000**: Other Income (Header)
  - 7010: Interest Income
  - 7020: Dividend Income
  - 7030: Rental Income
  - 7040: Gain on Sale of Assets
  - 7050: Foreign Exchange Gain
  - 7060: Miscellaneous Income
- **7500**: Financial Expenses (Header)
  - 7510: Interest Expense
  - 7520: Bank Charges
  - 7530: Loss on Sale of Assets
  - 7540: Foreign Exchange Loss
  - 7550: Bad Debts Written Off
  - 7560: Provision for Doubtful Debts

### Tax Accounts (8000-8999)
- **8000**: Tax Accounts (Header)
  - 8010: Income Tax Expense
  - 8020: Current Tax
  - 8030: Deferred Tax

## Account Attributes

Each account has the following attributes:

- **accountCode**: 4-digit unique identifier
- **accountName**: Descriptive name
- **accountType**: ASSET, LIABILITY, EQUITY, INCOME, EXPENSE
- **accountSubType**: More specific classification
- **normalBalance**: DEBIT or CREDIT
- **description**: Optional description
- **parentAccountCode**: For hierarchical structure
- **level**: 0 (header), 1 (sub-header), 2 (posting account)
- **allowPosting**: Whether transactions can be posted directly
- **isSystemAccount**: Cannot be deleted
- **isTaxAccount**: Tax-related account
- **taxType**: GST, TDS, TCS, etc.
- **requiresReconciliation**: Needs periodic reconciliation

## Normal Balance Rules

- **Assets**: Debit balance (except contra accounts like Accumulated Depreciation)
- **Liabilities**: Credit balance
- **Equity**: Credit balance (except Dividends which has debit balance)
- **Income**: Credit balance (except contra revenue like Sales Returns)
- **Expenses**: Debit balance (except contra expense like Purchase Returns)

## API Endpoints

### Seeding Operations

#### 1. Seed Default Chart of Accounts
```
POST /finance/chart-of-accounts/seed?overwrite=false
```

Seeds the database with the default chart of accounts.

**Query Parameters:**
- `overwrite` (optional): `true` or `false` (default: `false`)
  - If `false`: Only creates accounts if none exist
  - If `true`: Deletes all existing accounts and recreates them

**Response:**
```json
{
  "success": true,
  "message": "Chart of Accounts seeded successfully",
  "data": {
    "created": 150,
    "skipped": 0,
    "errors": 0
  }
}
```

#### 2. Seed Missing Accounts
```
POST /finance/chart-of-accounts/seed/missing
```

Seeds only missing accounts from the default chart of accounts. Useful for adding new accounts without affecting existing ones.

**Response:**
```json
{
  "success": true,
  "message": "Missing accounts seeded successfully",
  "data": {
    "created": 5,
    "skipped": 145,
    "errors": 0
  }
}
```

#### 3. Get Statistics
```
GET /finance/chart-of-accounts/seed/stats
```

Returns statistics about the default chart of accounts.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byLevel": {
      "0": 9,
      "1": 35,
      "2": 106
    },
    "byType": {
      "Asset": 50,
      "Liability": 35,
      "Equity": 10,
      "Income": 15,
      "Expense": 40
    },
    "systemAccounts": 44,
    "postingAccounts": 106,
    "taxAccounts": 12
  }
}
```

#### 4. Validate Default Accounts
```
GET /finance/chart-of-accounts/seed/validate
```

Validates the default chart of accounts data for consistency.

**Response:**
```json
{
  "success": true,
  "message": "Default chart of accounts is valid",
  "data": {
    "isValid": true,
    "errors": [],
    "warnings": []
  }
}
```

## Usage Instructions

### Initial Setup

1. **Validate the default accounts** (optional but recommended):
   ```bash
   curl http://localhost:3000/finance/chart-of-accounts/seed/validate
   ```

2. **Check statistics**:
   ```bash
   curl http://localhost:3000/finance/chart-of-accounts/seed/stats
   ```

3. **Seed the database**:
   ```bash
   curl -X POST http://localhost:3000/finance/chart-of-accounts/seed
   ```

### Adding Custom Accounts

After seeding the default accounts, you can add custom accounts using the regular Chart of Accounts API:

```bash
POST /finance/chart-of-accounts
```

Example:
```json
{
  "accountCode": "1515",
  "accountName": "3D Printing Equipment",
  "accountType": "Asset",
  "accountSubType": "Fixed Asset",
  "normalBalance": "Debit",
  "parentAccountCode": "1510",
  "level": 2,
  "allowPosting": true,
  "isSystemAccount": false
}
```

### Updating the Chart of Accounts

If new default accounts are added to the system:

1. **Seed only missing accounts**:
   ```bash
   curl -X POST http://localhost:3000/finance/chart-of-accounts/seed/missing
   ```

This will add new accounts without affecting existing ones.

### Resetting the Chart of Accounts

⚠️ **WARNING**: This will delete all existing accounts and transactions!

```bash
curl -X POST http://localhost:3000/finance/chart-of-accounts/seed?overwrite=true
```

## Best Practices

1. **Account Codes**: Follow the 4-digit numbering scheme. Leave gaps for future additions.
   - Example: Use 1010, 1020, 1030 instead of 1010, 1011, 1012 for main categories

2. **Posting Accounts**: Only post transactions to level 2 accounts (detail accounts).
   - Level 0 and 1 accounts are for reporting/grouping only

3. **System Accounts**: Mark essential accounts as system accounts to prevent accidental deletion

4. **Reconciliation**: Mark bank and cash accounts with `requiresReconciliation: true`

5. **Tax Accounts**: Always mark tax-related accounts with `isTaxAccount: true` and specify `taxType`

6. **Contra Accounts**: Use appropriate contra accounts:
   - Accumulated Depreciation (contra to Fixed Assets)
   - Allowance for Doubtful Accounts (contra to Receivables)
   - Sales Returns (contra to Sales Revenue)
   - Purchase Returns (contra to COGS)

## GST Compliance

The chart includes GST-compliant accounts:
- **1340**: GST Input Tax Credit (Asset)
- **2110**: GST Payable - CGST (Liability)
- **2111**: GST Payable - SGST (Liability)
- **2112**: GST Payable - IGST (Liability)

## Indian Statutory Compliance

Includes accounts for Indian statutory requirements:
- **2120**: TDS Payable
- **2130**: TCS Payable
- **2140**: Professional Tax Payable
- **2150**: Provident Fund Payable
- **2160**: ESI Payable
- **2170**: Labour Welfare Fund Payable
- **1350**: TDS Receivable

## Manufacturing-Specific Accounts

Special accounts for manufacturing operations:
- **1220**: Work in Progress (WIP)
- **5200-5299**: Manufacturing Overhead accounts
- **5300**: Sub-contracting Charges

## Notes

- All monetary values are stored in INR (Indian Rupees)
- The system supports multi-currency if needed (set `allowMultiCurrency: true`)
- Account codes should be unique across the entire chart
- Parent-child relationships enforce hierarchical structure
- Level 0 accounts cannot have transactions posted directly
- System accounts cannot be deleted through the API

## Support

For questions or issues with the Chart of Accounts, please contact the finance module maintainer.
