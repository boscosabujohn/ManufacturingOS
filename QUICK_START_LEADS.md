# Quick Start Guide - CRM Leads Feature

## 🚀 Getting Started

### 1. Start the Backend Server
```bash
cd d:\KreupAI\ManufacturingOS-1\b3-erp\backend
npm run start:dev
```
Backend will run on: `http://localhost:3001`

### 2. Start the Frontend Server
```bash
cd d:\KreupAI\ManufacturingOS-1\b3-erp\frontend
npm run dev
```
Frontend will run on: `http://localhost:3000`

### 3. Access the New Lead Form
Open your browser and navigate to:
```
http://localhost:3000/crm/leads/add
```

**Important:** The correct URL is `/crm/leads/add` (not `/new`)

---

## 📋 Key Features at a Glance

### ✨ What You Can Do:
1. **Create Comprehensive Leads** - 40+ fields covering all aspects
2. **Multi-Step Form** - Easy-to-use wizard with 5 steps
3. **Automatic Scoring** - AI-powered lead quality score (0-100)
4. **Smart Validation** - Real-time field validation with helpful errors
5. **Product Selection** - Choose from 12+ kitchen & furniture products
6. **File Attachments** - Upload documents, images, and files
7. **Compliance Tracking** - GDPR, email opt-in, Do Not Call flags
8. **Social Media** - Link LinkedIn, Twitter, Facebook profiles

---

## 🎯 Form Steps Overview

### Step 1: Basic Information
- Name, Title, Company
- Industry, Employee Count, Revenue
- **Required:** First Name, Last Name, Company

### Step 2: Contact Details
- Email, Phone, Mobile, Fax
- Full Address
- Social Media Links
- **Required:** Email

### Step 3: Lead Details
- Status (New, Contacted, Qualified, etc.)
- Rating (Hot, Warm, Cold)
- Lead Source & Sub-Source
- Campaign Tracking
- Sales Rep Assignment
- Compliance Checkboxes
- **Required:** Lead Source

### Step 4: Opportunity Information
- Deal Value
- Close Date
- Win Probability (slider)
- Product Interest Selection
- Custom Products

### Step 5: Additional Information
- Description/Notes
- Tags
- File Attachments
- **Lead Score Calculator** (visual progress bar)

---

## 💡 Tips for Best Results

### Getting a High Lead Score:
- ✅ Fill in company size (larger = higher score)
- ✅ Add revenue information
- ✅ Provide email AND phone
- ✅ Set rating to "Hot" for ready-to-buy leads
- ✅ Select multiple products of interest
- ✅ Choose "Referral" as lead source for quality leads

### Lead Source Examples:
- **Website → Organic Search**: Found via Google
- **Referral → Customer Referral**: Referred by existing customer
- **Events → Trade Show**: Met at industry event
- **Marketing → Free Trial**: Signed up for trial
- **Sales → Cold Call**: Outbound prospecting

---

## 🔥 Quick Test Data

Copy and paste this for quick testing:

```
First Name: Sarah
Last Name: Johnson
Company: Premium Interiors Ltd
Email: sarah.johnson@premiuminteriors.com
Phone: +1 (555) 234-5678
Industry: Real Estate
Employee Count: 50-99
Annual Revenue: $10M-$50M
Lead Source: Referral
Lead Sub-Source: Customer Referral
Status: New
Rating: Hot
Street: 123 Business Park Drive
City: Los Angeles
State: California
Postal Code: 90001
Country: United States
Estimated Value: 75000
Probability: 75
Description: Interested in modular kitchen solutions for 3 luxury apartments. Looking for premium granite countertops and custom cabinets. Budget approved, ready to proceed.
```

Products to Select:
- ✅ Modular Kitchen Solutions
- ✅ Kitchen Cabinets & Storage
- ✅ Kitchen Countertops (Granite/Quartz/Solid Surface)

Tags to Add:
- high-priority
- luxury-segment
- quick-close

**Expected Lead Score:** 80-85 (Excellent!)

---

## 🐛 Troubleshooting

### Issue: "Failed to create lead"
**Solution:** Check if backend server is running on port 3001

### Issue: Form fields showing red
**Solution:** These are required fields - fill them in before saving

### Issue: Email validation error
**Solution:** Use valid email format (e.g., name@company.com)

### Issue: Lead score shows 0
**Solution:** Click the "Calculate Score" button in Step 5

---

## 📊 API Endpoints Reference

All endpoints are prefixed with `/api/crm/leads`

```
GET    /                  - List all leads (with filters)
POST   /                  - Create new lead
GET    /stats             - Get statistics
GET    /:id               - Get single lead
PATCH  /:id               - Update lead
DELETE /:id               - Delete lead
POST   /:id/convert-to-customer - Convert to customer
```

---

## 🎨 UI Features

- 🎨 **Color-Coded Progress**: Green checkmarks for completed steps
- 🔴 **Error Indicators**: Red borders on invalid fields
- ⚡ **Real-time Validation**: Instant feedback as you type
- 💾 **Auto-save Protection**: Confirmation before leaving page
- 📱 **Mobile Responsive**: Works on all device sizes
- ♿ **Accessible**: Keyboard navigation supported

---

## 📈 Next Steps

After creating a lead, you can:
1. View all leads at `/crm/leads`
2. Edit lead details
3. Track interactions
4. Convert to customer when deal closes
5. Generate reports and analytics

---

## 🆘 Need Help?

### Documentation:
- Full Feature List: See `LEADS_FEATURES.md`
- API Documentation: See inline JSDoc comments
- Backend Entity: `backend/src/modules/crm/entities/lead.entity.ts`
- Frontend Component: `frontend/src/app/(modules)/crm/leads/add/page.tsx`

### Common Questions:

**Q: Can I edit a lead after creating it?**
A: Yes! Go to `/crm/leads` and click "Edit" on any lead

**Q: What file types can I attach?**
A: PDF, DOC, DOCX, XLS, XLSX, and common image formats

**Q: Is there a character limit for description?**
A: No hard limit, but keep it concise for best UX

**Q: Can I assign leads to teams?**
A: Yes! Use the "Team Assignment" field in Step 3

---

## ✅ Feature Checklist

Mark what you've explored:

- [ ] Created a test lead
- [ ] Used all 5 form steps
- [ ] Calculated lead score
- [ ] Added product interests
- [ ] Uploaded an attachment
- [ ] Added tags
- [ ] Tested form validation
- [ ] Viewed lead in list
- [ ] Edited a lead
- [ ] Checked lead statistics

---

**Ready to get started? Navigate to http://localhost:3000/crm/leads/add and create your first lead!** 🎉
