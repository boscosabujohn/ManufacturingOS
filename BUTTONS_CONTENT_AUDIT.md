# Buttons/Links Content Audit

Scanned directories: `b3-erp/frontend/src`, `b3-erp/frontend/components`, `b3-erp/frontend/app`

Criteria: Each clickable element must have visible text or an accessible name via aria-label/title/label. Elements detected: <button>, <a>, role="button", Next.js <Link>, <Button>, <IconButton>. Disabled elements are ignored.

## Summary

- Files scanned: 1311
- Files with issues: 288
- Potential accessibility issues found: 664
- Issues by type:
  - native-button: 653
  - anchor: 2
  - next-link: 9

## Details

### b3-erp/frontend/src/app/(dashboard)/page.tsx
- [ ] Line 193 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg…
  ```

### b3-erp/frontend/src/app/(modules)/after-sales-service/billing/pending/page.tsx
- [ ] Line 406 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-emerald-600 hover:text-emerald-700">
                  <Download className="h-5 w-5" />
                </button>
  ```
- [ ] Line 409 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-emerald-600 hover:text-emerald-700">
                  <Eye className="h-5 w-5" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/after-sales-service/feedback/nps/page.tsx
- [ ] Line 465 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="ml-6 p-2 hover:bg-white/40 rounded-lg transition-colors flex-shrink-0">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/after-sales-service/feedback/ratings/page.tsx
- [ ] Line 421 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="ml-6 p-2 hover:bg-white/60 rounded-lg transition-colors text-gray-600 hover:text-gray-700 flex-shrink-0">
                <Download className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/after-sales-service/feedback/surveys/page.tsx
- [ ] Line 415 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700">
                  <Eye className="h-5 w-5" />
                </button>
  ```
- [ ] Line 418 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-emerald-600 hover:text-emerald-700">
                  <BarChart3 className="h-5 w-5" />
                </button>
  ```
- [ ] Line 421 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-orange-600 hover:text-orange-700">
                  <Download className="h-5 w-5" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/after-sales-service/installations/calendar/page.tsx
- [ ] Line 244 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            …
  ```
- [ ] Line 253 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </b…
  ```

### b3-erp/frontend/src/app/(modules)/after-sales-service/knowledge/articles/page.tsx
- [ ] Line 379 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700">
                  <Eye className="h-5 w-5" />
                </button>
  ```
- [ ] Line 382 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-amber-600 hover:text-amber-700">
                  <Edit className="h-5 w-5" />
                </button>
  ```
- [ ] Line 385 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600 hover:text-red-700">
                  <Trash2 className="h-5 w-5" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/after-sales-service/warranties/claims/[id]/page.tsx
- [ ] Line 584 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400 hover:text-gray-600">
                    <Download className="w-5 h-5" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/contracts/templates/page.tsx
- [ ] Line 371 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Eye className="h-4 w-4" />
              </button>
  ```
- [ ] Line 374 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Edit className="h-4 w-4" />
              </button>
  ```
- [ ] Line 377 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Copy className="h-4 w-4" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/guided-selling/playbooks/page.tsx
- [ ] Line 485 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                    <Eye className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 488 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                    <Edit2 className="h-4 w-4" />
                  </butto…
  ```
- [ ] Line 491 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                    <Copy className="h-4 w-4" />
                  </button…
  ```

### b3-erp/frontend/src/app/(modules)/cpq/integration/cad/page.tsx
- [ ] Line 305 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/integration/crm/page.tsx
- [ ] Line 326 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 329 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Settings className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 333 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg">
                          <Pause className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 337 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Play className="h-4 w-4" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/integration/ecommerce/page.tsx
- [ ] Line 360 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/integration/erp/page.tsx
- [ ] Line 397 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/pricing/contracts/page.tsx
- [ ] Line 294 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/pricing/customer/page.tsx
- [ ] Line 281 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/pricing/promotions/page.tsx
- [ ] Line 299 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/pricing/rules/page.tsx
- [ ] Line 288 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/pricing/volume/page.tsx
- [ ] Line 245 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/products/bundles/page.tsx
- [ ] Line 246 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="h-4 w-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/products/catalog/page.tsx
- [ ] Line 300 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs">
                  <Edit className="h-3 w-3" />
                </button>
  ```
- [ ] Line 303 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs">
                  <Copy className="h-3 w-3" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/products/options/page.tsx
- [ ] Line 256 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/products/rules/page.tsx
- [ ] Line 290 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/proposals/content/page.tsx
- [ ] Line 374 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                <Eye className="h-4 w-4" />
              </button>
  ```
- [ ] Line 377 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                <Download className="h-4 w-4" />
              </button>
  ```
- [ ] Line 380 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                <Edit className="h-4 w-4" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/proposals/templates/page.tsx
- [ ] Line 393 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                  <Eye className="h-4 w-4" />
                </button>
  ```
- [ ] Line 396 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                  <Edit className="h-4 w-4" />
                </button>
  ```
- [ ] Line 399 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                  <Copy className="h-4 w-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/quotes/page.tsx
- [ ] Line 316 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 319 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 322 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 325 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <Send className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/quotes/templates/page.tsx
- [ ] Line 283 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Eye className="h-4 w-4" />
              </button>
  ```
- [ ] Line 286 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Edit className="h-4 w-4" />
              </button>
  ```
- [ ] Line 289 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Copy className="h-4 w-4" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/quotes/versions/page.tsx
- [ ] Line 309 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 312 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/settings/notifications/page.tsx
- [ ] Line 261 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 264 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 267 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 417 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 420 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/cpq/settings/numbering/page.tsx
- [ ] Line 328 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 bg-white rounded-lg hover:bg-blue-50">
                <Eye className="h-4 w-4" />
              </button>
  ```
- [ ] Line 331 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 bg-white rounded-lg hover:bg-blue-50">
                <Copy className="h-4 w-4" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/activities/calls/page.tsx
- [ ] Line 469 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 472 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 475 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/activities/emails/page.tsx
- [ ] Line 507 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 510 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 513 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/activities/meetings/page.tsx
- [ ] Line 476 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 479 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 482 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/activities/tasks/page.tsx
- [ ] Line 488 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 491 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 494 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/campaigns/automation/page.tsx
- [ ] Line 353 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                </button>
  ```
- [ ] Line 356 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                </button>
  ```
- [ ] Line 359 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Copy className="w-4 h-4" />
                </button>
  ```
- [ ] Line 363 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-yellow-300 rounded-lg hover:bg-yellow-50">
                    <Pause className="w-4 h-4 text-yellow-600" />
                  </button>
  ```
- [ ] Line 368 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-green-300 rounded-lg hover:bg-green-50">
                    <Play className="w-4 h-4 text-green-600" />
                  </button>
  ```
- [ ] Line 372 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/campaigns/email/page.tsx
- [ ] Line 285 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 288 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Edit className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 291 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Copy className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 295 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-green-300 rounded-lg hover:bg-green-50">
                      <Play className="w-4 h-4 text-green-600" />
                    </button>
  ```
- [ ] Line 299 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/campaigns/page.tsx
- [ ] Line 450 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 453 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 457 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-yellow-300 rounded-lg hover:bg-yellow-50">
                      <Pause className="w-4 h-4 text-yellow-600" />
                    </button>
  ```
- [ ] Line 461 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/campaigns/templates/page.tsx
- [ ] Line 330 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                </button>
  ```
- [ ] Line 333 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                </button>
  ```
- [ ] Line 336 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Copy className="w-4 h-4" />
                </button>
  ```
- [ ] Line 339 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </b…
  ```

### b3-erp/frontend/src/app/(modules)/crm/contacts/lists/page.tsx
- [ ] Line 529 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 532 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 535 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 538 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/contacts/roles/page.tsx
- [ ] Line 573 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                </button>
  ```
- [ ] Line 576 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </b…
  ```

### b3-erp/frontend/src/app/(modules)/crm/contacts/view/[id]/page.tsx
- [ ] Line 250 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/contracts/amendments/page.tsx
- [ ] Line 483 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
  ```
- [ ] Line 486 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/contracts/page.tsx
- [ ] Line 470 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 473 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 476 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/contracts/renewals/page.tsx
- [ ] Line 560 (anchor): Anchor link has no visible text or accessible name (aria-label/title)
  ```html
  <a href={`mailto:${renewal.contactEmail}`} className="text-teal-700 hover:text-teal-800">
                      <Mail className="w-4 h-4" />
                    </a>
  ```
- [ ] Line 563 (anchor): Anchor link has no visible text or accessible name (aria-label/title)
  ```html
  <a href={`tel:${renewal.contactPhone}`} className="text-teal-700 hover:text-teal-800">
                      <Phone className="w-4 h-4" />
                    </a>
  ```

### b3-erp/frontend/src/app/(modules)/crm/contracts/templates/page.tsx
- [ ] Line 492 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                </button>
  ```
- [ ] Line 495 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                </button>
  ```
- [ ] Line 498 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </b…
  ```

### b3-erp/frontend/src/app/(modules)/crm/customers/add/page.tsx
- [ ] Line 2396 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <…
  ```

### b3-erp/frontend/src/app/(modules)/crm/customers/hierarchy/page.tsx
- [ ] Line 312 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 315 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/customers/portal/page.tsx
- [ ] Line 480 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
  ```
- [ ] Line 483 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
  ```
- [ ] Line 486 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/customers/segments/page.tsx
- [ ] Line 361 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                </button>
  ```
- [ ] Line 364 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </b…
  ```

### b3-erp/frontend/src/app/(modules)/crm/interactions/add/page.tsx
- [ ] Line 483 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus cla…
  ```

### b3-erp/frontend/src/app/(modules)/crm/interactions/edit/[id]/page.tsx
- [ ] Line 482 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus cla…
  ```

### b3-erp/frontend/src/app/(modules)/crm/leads/add/page.tsx
- [ ] Line 1252 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5"…
  ```

### b3-erp/frontend/src/app/(modules)/crm/leads/assignment/page.tsx
- [ ] Line 332 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 455 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <UserPlus className="h-5 w-5" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/leads/edit/[id]/page.tsx
- [ ] Line 1027 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus cla…
  ```

### b3-erp/frontend/src/app/(modules)/crm/leads/view/[id]/page.tsx
- [ ] Line 237 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/opportunities/add/page.tsx
- [ ] Line 746 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus cla…
  ```

### b3-erp/frontend/src/app/(modules)/crm/opportunities/edit/[id]/page.tsx
- [ ] Line 753 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus cla…
  ```

### b3-erp/frontend/src/app/(modules)/crm/proposals/page.tsx
- [ ] Line 376 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 379 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 382 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 385 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 394 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/quotes/page.tsx
- [ ] Line 469 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 472 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 475 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 478 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-blue-300 rounded-lg hover:bg-blue-50">
                  <Copy className="w-4 h-4 text-blue-600" />
                </button>
  ```
- [ ] Line 482 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-green-300 rounded-lg hover:bg-green-50">
                    <Send className="w-4 h-4 text-green-600" />
                  </button>
  ```
- [ ] Line 486 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/quotes/pricing/page.tsx
- [ ] Line 317 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-700">
                    <ToggleRight className="w-6 h-6" />
                  </button>
  ```
- [ ] Line 321 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400 hover:text-gray-600">
                    <ToggleLeft className="w-6 h-6" />
                  </button>
  ```
- [ ] Line 325 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
  ```
- [ ] Line 328 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/quotes/templates/page.tsx
- [ ] Line 400 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                </button>
  ```
- [ ] Line 403 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                </button>
  ```
- [ ] Line 406 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </b…
  ```

### b3-erp/frontend/src/app/(modules)/crm/settings/stages/page.tsx
- [ ] Line 301 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 304 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/support/knowledge/page.tsx
- [ ] Line 550 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 553 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/crm/support/sla/page.tsx
- [ ] Line 379 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/estimation/boq/view/[id]/page.tsx
- [ ] Line 302 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/estimation/costing/view/[id]/page.tsx
- [ ] Line 258 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/estimation/pricing/view/[id]/page.tsx
- [ ] Line 353 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/estimation/settings/categories/page.tsx
- [ ] Line 553 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="h-…
  ```
- [ ] Line 559 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="h-4 w…
  ```

### b3-erp/frontend/src/app/(modules)/estimation/settings/templates/page.tsx
- [ ] Line 354 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit2 className="h-4 w-4" />
                </button>
  ```
- [ ] Line 357 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Copy className="h-4 w-4" />
                </button>
  ```
- [ ] Line 360 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/estimation/workflow/drafts/page.tsx
- [ ] Line 334 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Copy className="h-4 w-4" />
                </button>
  ```
- [ ] Line 337 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
  ```
- [ ] Line 341 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 text-green-600 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100">
                    <Send className="h-4 w-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/finance/budgeting/multi-year-planning/page.tsx
- [ ] Line 265 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 268 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors">
                            <Copy className="h-4 w-4" />
                          </button>
  ```

### b3-erp/frontend/src/app/(modules)/finance/consolidation/intercompany/page.tsx
- [ ] Line 289 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 292 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/finance/controls/documents/page.tsx
- [ ] Line 76 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="h-4 w-4" /></button>
  ```
- [ ] Line 77 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Download className="h-4 w-4" /></button>
  ```
- [ ] Line 78 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
  ```

### b3-erp/frontend/src/app/(modules)/finance/costing/standard-costing/page.tsx
- [ ] Line 321 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
  ```
- [ ] Line 324 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Edit className="h-5 w-5" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/finance/currency/management/page.tsx
- [ ] Line 319 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 322 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 325 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors">
                          <TrendingUp className="h-4 w-4" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/hr/attendance/add/page.tsx
- [ ] Line 189 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button onClick={handleCancel} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/hr/attendance/view/[id]/page.tsx
- [ ] Line 197 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button onClick={handleBack} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/hr/employees/add/page.tsx
- [ ] Line 205 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button onClick={handleCancel} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/hr/employees/edit/[id]/page.tsx
- [ ] Line 197 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button onClick={handleCancel} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/hr/employees/view/[id]/page.tsx
- [ ] Line 308 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={handleBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </bu…
  ```

### b3-erp/frontend/src/app/(modules)/hr/leave/edit/[id]/page.tsx
- [ ] Line 500 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                          type="button"
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Download …
  ```

### b3-erp/frontend/src/app/(modules)/hr/leave/view/[id]/page.tsx
- [ ] Line 126 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button onClick={handleBack} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/analytics/reports/page.tsx
- [ ] Line 329 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 332 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Download className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/cycle-count/variance/page.tsx
- [ ] Line 392 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 395 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <CheckCircle className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 398 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                        <MessageSquare className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/kitting/assembly/page.tsx
- [ ] Line 368 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 372 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                          <CheckCircle className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/kitting/disassembly/page.tsx
- [ ] Line 386 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 390 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-orange-600 hover:text-orange-800">
                          <Undo2 className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/kitting/kits/page.tsx
- [ ] Line 348 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 351 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/settings/categories/page.tsx
- [ ] Line 271 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 274 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 277 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/settings/policies/page.tsx
- [ ] Line 456 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 459 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/settings/storage/page.tsx
- [ ] Line 394 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 397 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/settings/uom/page.tsx
- [ ] Line 298 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 301 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 305 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/tracking/serial/page.tsx
- [ ] Line 312 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 315 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/transfers/pending/page.tsx
- [ ] Line 301 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                            <CheckCircle className="w-4 h-4" />
                          </button>
  ```
- [ ] Line 304 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                            <XCircle className="w-4 h-4" />
                          </button>
  ```

### b3-erp/frontend/src/app/(modules)/inventory/warehouse/locations/page.tsx
- [ ] Line 449 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
  ```
- [ ] Line 452 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/audit/changes/page.tsx
- [ ] Line 639 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/audit/compliance/page.tsx
- [ ] Line 831 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/audit/logins/page.tsx
- [ ] Line 591 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/license/users/page.tsx
- [ ] Line 457 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                      <UserMinus className="h-4 w-4 inline" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/monitoring/errors/page.tsx
- [ ] Line 510 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/monitoring/health/page.tsx
- [ ] Line 725 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/monitoring/logs/page.tsx
- [ ] Line 469 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/roles/hierarchy/page.tsx
- [ ] Line 227 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
  ```
- [ ] Line 230 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/roles/policies/page.tsx
- [ ] Line 364 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/scheduler/automation/page.tsx
- [ ] Line 530 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/scheduler/history/page.tsx
- [ ] Line 494 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/scheduler/jobs/page.tsx
- [ ] Line 550 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/users/active/page.tsx
- [ ] Line 174 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/users/groups/page.tsx
- [ ] Line 185 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                      <Edit2 className="w-5 h-5" />
                    </button>
  ```
- [ ] Line 188 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/it-admin/users/inactive/page.tsx
- [ ] Line 152 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/analytics/reports/page.tsx
- [ ] Line 490 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <RefreshCw className="w-4 h-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/carriers/add/page.tsx
- [ ] Line 240 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={handleCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </…
  ```

### b3-erp/frontend/src/app/(modules)/logistics/carriers/edit/[id]/page.tsx
- [ ] Line 232 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={handleCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </…
  ```

### b3-erp/frontend/src/app/(modules)/logistics/carriers/rates/page.tsx
- [ ] Line 539 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/carriers/view/[id]/page.tsx
- [ ] Line 270 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={handleBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </bu…
  ```

### b3-erp/frontend/src/app/(modules)/logistics/drivers/assignments/page.tsx
- [ ] Line 611 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 614 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 617 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-purple-600 hover:text-purple-800">
                        <FileText className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/drivers/compliance/page.tsx
- [ ] Line 1130 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 1133 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <FileText className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 1136 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-purple-600 hover:text-purple-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/drivers/performance/page.tsx
- [ ] Line 783 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 786 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Award className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/fleet/fuel/page.tsx
- [ ] Line 589 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 592 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 595 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-purple-600 hover:text-purple-800">
                        <FileText className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/fleet/maintenance/page.tsx
- [ ] Line 566 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 569 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 572 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-purple-600 hover:text-purple-800">
                        <FileText className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/fleet/tracking/page.tsx
- [ ] Line 555 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 558 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/fleet/utilization/page.tsx
- [ ] Line 578 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 581 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <BarChart3 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/freight/invoicing/page.tsx
- [ ] Line 430 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
  ```
- [ ] Line 433 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/planning/consolidation/page.tsx
- [ ] Line 500 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 503 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/planning/dispatch/page.tsx
- [ ] Line 540 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 543 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/planning/loads/page.tsx
- [ ] Line 466 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 469 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/planning/routes/page.tsx
- [ ] Line 538 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 541 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/planning/trips/page.tsx
- [ ] Line 599 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 602 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/logistics/shipping/add/page.tsx
- [ ] Line 415 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={handleCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </…
  ```

### b3-erp/frontend/src/app/(modules)/logistics/shipping/edit/[id]/page.tsx
- [ ] Line 303 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={handleCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </…
  ```

### b3-erp/frontend/src/app/(modules)/logistics/tracking/view/[id]/page.tsx
- [ ] Line 262 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
              onClick={handleBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </bu…
  ```

### b3-erp/frontend/src/app/(modules)/logistics/warehouse/dock/page.tsx
- [ ] Line 437 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/budget/page.tsx
- [ ] Line 107 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <RefreshCw className="h-5 w-5" />
            </button>
  ```
- [ ] Line 110 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/calendar/page.tsx
- [ ] Line 380 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Settings className="h-5 w-5" />
            </button>
  ```
- [ ] Line 383 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/contracts/page.tsx
- [ ] Line 625 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 628 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Edit className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 631 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 654 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                              <Download className="h-4 w-4" />
                            </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/grn/[id]/inspect/page.tsx
- [ ] Line 324 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
              href="/procurement/grn"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            …
  ```

### b3-erp/frontend/src/app/(modules)/procurement/invoices/page.tsx
- [ ] Line 445 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </button>
  ```
- [ ] Line 448 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/notifications/page.tsx
- [ ] Line 445 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <RefreshCw className="h-5 w-5" />
            </button>
  ```
- [ ] Line 448 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
            </button>
  ```
- [ ] Line 525 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
                        <Archive className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 528 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/page.tsx
- [ ] Line 433 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
  ```
- [ ] Line 436 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="h-4 w-4 text-gray-500" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/purchase-orders/create/page.tsx
- [ ] Line 295 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
              href="/procurement/purchase-orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
…
  ```
- [ ] Line 491 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                    <Search className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 714 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                            <Edit2 className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 717 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                            <Copy className="h-4 w-4" />
                          </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/purchase-orders/page.tsx
- [ ] Line 764 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
                          href={`/procurement/purchase-orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                …
  ```
- [ ] Line 770 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                          <Edit className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 773 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                          <Printer className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 776 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 880 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
                        href={`/procurement/purchase-orders/${order.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
           …
  ```
- [ ] Line 886 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 889 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                        <Printer className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 892 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 896 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/requisitions/edit/[id]/page.tsx
- [ ] Line 773 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </but…
  ```

### b3-erp/frontend/src/app/(modules)/procurement/rfq/[id]/compare/page.tsx
- [ ] Line 259 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
              href="/procurement/rfq"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            …
  ```
- [ ] Line 407 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 410 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Mail className="h-4 w-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/supplier-portal/page.tsx
- [ ] Line 88 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
  ```
- [ ] Line 91 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
  ```
- [ ] Line 275 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
  ```
- [ ] Line 278 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
            </button>
  ```
- [ ] Line 318 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
  ```
- [ ] Line 321 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
  ```
- [ ] Line 325 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <Truck className="h-4 w-4 text-blue-600" />
                        </button>
  ```
- [ ] Line 363 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
  ```
- [ ] Line 437 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
  ```
- [ ] Line 440 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <Download className="h-4 w-4 text-gray-600" />
                        </button>
  ```
- [ ] Line 444 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                            <Send className="h-4 w-4 text-blue-600" />
                          </button>
  ```
- [ ] Line 579 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-white rounded-lg">
                <Download className="h-4 w-4 text-gray-600" />
              </button>
  ```
- [ ] Line 591 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-white rounded-lg">
                <Download className="h-4 w-4 text-gray-600" />
              </button>
  ```
- [ ] Line 683 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
  ```
- [ ] Line 691 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                </button>
  ```
- [ ] Line 695 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/vendor-performance/page.tsx
- [ ] Line 564 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <BarChart3 className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/procurement/vendors/add/page.tsx
- [ ] Line 1209 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={addOtherCertification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus classNam…
  ```

### b3-erp/frontend/src/app/(modules)/procurement/vendors/edit/[id]/page.tsx
- [ ] Line 1083 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={addOtherCertification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus classNam…
  ```

### b3-erp/frontend/src/app/(modules)/procurement/vendors/view/[id]/page.tsx
- [ ] Line 1148 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50">
                      <ExternalLink className="h-3.5 w-3.5" />
   …
  ```

### b3-erp/frontend/src/app/(modules)/production/planning/page.tsx
- [ ] Line 1888 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 1891 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                            <Copy className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 1894 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
  ```

### b3-erp/frontend/src/app/(modules)/production/quality/view/[id]/page.tsx
- [ ] Line 502 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-700">
                      <ExternalLink className="h-3 w-3" />
                    </button>
  ```
- [ ] Line 543 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="h-5 w-5 text-gray-600" />
              </button>
  ```
- [ ] Line 546 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/production/settings/lines/page.tsx
- [ ] Line 396 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
  ```
- [ ] Line 399 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/production/settings/shifts/page.tsx
- [ ] Line 417 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
  ```
- [ ] Line 420 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/production/settings/work-centers/page.tsx
- [ ] Line 363 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
  ```
- [ ] Line 366 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/production/work-orders/add/page.tsx
- [ ] Line 902 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      onClick={addSecondaryWorkCenter}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                 …
  ```

### b3-erp/frontend/src/app/(modules)/production/work-orders/edit/[id]/page.tsx
- [ ] Line 721 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      onClick={addSecondaryWorkCenter}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                 …
  ```

### b3-erp/frontend/src/app/(modules)/production/work-orders/view/[id]/page.tsx
- [ ] Line 693 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/project-management/budget/page.tsx
- [ ] Line 383 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 386 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/project-management/documents/page.tsx
- [ ] Line 709 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 text-green-600 hover:text-green-800">
                      <Download className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/project-management/milestone-templates/page.tsx
- [ ] Line 1289 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Copy className="w-4 h-4" />
                </button>
  ```
- [ ] Line 1292 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Edit className="w-4 h-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/project-management/project-types/page.tsx
- [ ] Line 600 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/project-management/reports/page.tsx
- [ ] Line 593 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4" />
                      <…
  ```

### b3-erp/frontend/src/app/(modules)/project-management/schedule/page.tsx
- [ ] Line 179 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
  ```
- [ ] Line 182 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
  ```

### b3-erp/frontend/src/app/(modules)/project-management/templates/page.tsx
- [ ] Line 674 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm">
                <Copy className="w-4 h-4" />
              </button>
  ```
- [ ] Line 677 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <Edit className="w-4 h-4" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/project-management/view/[id]/page.tsx
- [ ] Line 152 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
            href="/project-management"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
   …
  ```
- [ ] Line 176 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
  ```

### b3-erp/frontend/src/app/(modules)/reports/custom/page.tsx
- [ ] Line 823 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Edit className="w-4 h-4" />
                    </button>
  ```
- [ ] Line 877 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Edit className="w-4 h-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/reports/dashboards/page.tsx
- [ ] Line 321 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
  ```
- [ ] Line 726 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={handleShareDashboard}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <Share2 className="w-5 h-5" …
  ```
- [ ] Line 732 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={handleExportDashboard}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <Download className="w-5 h-…
  ```

### b3-erp/frontend/src/app/(modules)/rfq/edit/[id]/page.tsx
- [ ] Line 751 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button type="button" className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/delivery/installation/page.tsx
- [ ] Line 566 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/delivery/notes/page.tsx
- [ ] Line 420 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 423 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Printer className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/handover/accepted/page.tsx
- [ ] Line 426 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 430 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/handover/pending/page.tsx
- [ ] Line 485 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/invoices/credit-notes/page.tsx
- [ ] Line 381 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/invoices/overdue/page.tsx
- [ ] Line 345 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
  ```
- [ ] Line 348 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/invoices/paid/page.tsx
- [ ] Line 319 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/invoices/pending/page.tsx
- [ ] Line 242 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
  ```
- [ ] Line 293 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
  ```
- [ ] Line 296 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/orders/create/page.tsx
- [ ] Line 351 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/pricing/lists/page.tsx
- [ ] Line 450 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
  ```
- [ ] Line 453 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-indigo-600" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/quotations/create/page.tsx
- [ ] Line 320 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/rfp/create/page.tsx
- [ ] Line 466 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/(modules)/sales/settings/terms/page.tsx
- [ ] Line 375 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/assets/hardware/page.tsx
- [ ] Line 454 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/assets/tracking/page.tsx
- [ ] Line 561 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <History className="h-4 w-4 text-gray-600" />
                        </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/automation/assignment/page.tsx
- [ ] Line 404 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-200 rounded-lg">
                      <Settings className="h-4 w-4 text-gray-600" />
                    </button>
  ```
- [ ] Line 407 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-200 rounded-lg">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/automation/responses/page.tsx
- [ ] Line 517 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
  ```
- [ ] Line 520 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Copy className="h-4 w-4 text-blue-600" />
                </button>
  ```
- [ ] Line 523 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/automation/rules/page.tsx
- [ ] Line 447 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 450 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
  ```
- [ ] Line 453 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/changes/scheduled/page.tsx
- [ ] Line 305 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={previousMonth}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </b…
  ```
- [ ] Line 311 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={nextMonth}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </butt…
  ```

### b3-erp/frontend/src/app/(modules)/support/incidents/critical/page.tsx
- [ ] Line 487 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5" />
                </button>
  ```
- [ ] Line 490 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Mail className="w-5 h-5" />
                </button>
  ```
- [ ] Line 493 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                </button>
  ```
- [ ] Line 511 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/support/incidents/major/page.tsx
- [ ] Line 559 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/support/incidents/tracking/page.tsx
- [ ] Line 530 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </…
  ```

### b3-erp/frontend/src/app/(modules)/support/knowledge/create/page.tsx
- [ ] Line 391 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={addTag}
                  className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  <Plus…
  ```
- [ ] Line 436 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={addRelatedArticle}
                  className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
            …
  ```
- [ ] Line 480 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                  onClick={addReviewer}
                  className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  …
  ```

### b3-erp/frontend/src/app/(modules)/support/problems/known-errors/page.tsx
- [ ] Line 318 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-purple-600 hover:text-purple-700">
                <ChevronRight className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/problems/page.tsx
- [ ] Line 362 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="ml-4 text-purple-600 hover:text-purple-700 p-2">
                  <Eye className="h-5 w-5" />
                </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/reports/page.tsx
- [ ] Line 468 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 471 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Settings className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 499 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Settings className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/sla/settings/page.tsx
- [ ] Line 263 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 499 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/(modules)/support/tickets/open/page.tsx
- [ ] Line 299 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/dashboard/page.tsx
- [ ] Line 238 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                  <Bell className="h-6 w-6" />
                  <span className="ab…
  ```

### b3-erp/frontend/src/app/hr/attendance/biometric/page.tsx
- [ ] Line 75 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                      <Activity className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 78 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/hr/attendance/calendar/page.tsx
- [ ] Line 19 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
  ```
- [ ] Line 23 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
  ```

### b3-erp/frontend/src/app/hr/attendance/working-hours/page.tsx
- [ ] Line 58 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="h-4 w-4" />
                  </button>
  ```

### b3-erp/frontend/src/app/hr/employees/designations/page.tsx
- [ ] Line 63 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 66 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/hr/employees/directory/all/page.tsx
- [ ] Line 160 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 163 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-pink-600 hover:text-pink-900">
                        <Edit className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/hr/employees/teams/page.tsx
- [ ] Line 42 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-teal-600 hover:text-teal-700">
                <UserPlus className="h-5 w-5" />
              </button>
  ```

### b3-erp/frontend/src/app/hr/shifts/master/page.tsx
- [ ] Line 60 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
  ```

### b3-erp/frontend/src/app/hr/shifts/roster/page.tsx
- [ ] Line 20 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
  ```
- [ ] Line 24 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
  ```

### b3-erp/frontend/src/app/hr/shifts/swaps/page.tsx
- [ ] Line 90 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-900">
                        <Check className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 93 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                        <X className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/app/hr/timesheets/approval/page.tsx
- [ ] Line 83 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 86 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-900">
                      <Check className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 89 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                      <X className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/app/rfq/page.tsx
- [ ] Line 285 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
                          href={`/rfq/view/${rfq.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye classN…
  ```
- [ ] Line 291 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
                          href={`/rfq/edit/${rfq.id}`}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          <Edit cla…
  ```
- [ ] Line 297 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/Breadcrumbs.tsx
- [ ] Line 54 (next-link): Next.js <Link> has no visible text or accessible name
  ```html
  <Link
        href="/dashboard"
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
  ```

### b3-erp/frontend/src/components/common-masters/AuditMaster.tsx
- [ ] Line 462 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 465 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 468 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                        <FileText className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/common-masters/BankMaster.tsx
- [ ] Line 284 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 287 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 290 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-purple-600 hover:bg-purple-50 rounded">
                    <Download className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/BarcodeMaster.tsx
- [ ] Line 223 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 226 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <Edit3 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 229 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-purple-600 hover:bg-purple-50 rounded">
                        <Download className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/common-masters/BrandMaster.tsx
- [ ] Line 407 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/CategoryMaster.tsx
- [ ] Line 647 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/CertificateMaster.tsx
- [ ] Line 433 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                          <Edit3 className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 436 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 439 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <FileCheck className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/ChartOfAccountsMaster.tsx
- [ ] Line 720 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/CompanyMaster.tsx
- [ ] Line 681 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
          </button>
  ```
- [ ] Line 769 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:text-gray-800 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/CreditTermsMaster.tsx
- [ ] Line 251 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 254 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/CustomerMaster.tsx
- [ ] Line 392 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/DepartmentMaster.tsx
- [ ] Line 590 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 885 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      type="button"
                      onClick={addResponsibility}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      …
  ```
- [ ] Line 960 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      type="button"
                      onClick={addCollaborator}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        …
  ```

### b3-erp/frontend/src/components/common-masters/DesignationMaster.tsx
- [ ] Line 308 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 311 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/DiscountMaster.tsx
- [ ] Line 254 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 257 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/EmployeeMaster.tsx
- [ ] Line 523 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/GradeMaster.tsx
- [ ] Line 339 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 342 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/HSNSACCodeMaster.tsx
- [ ] Line 362 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 365 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <Edit3 className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/common-masters/ItemGroupMaster.tsx
- [ ] Line 398 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 401 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <Edit3 className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/ItemMaster.tsx
- [ ] Line 780 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-600 hover:text-gray-800 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/ItemSpecificationMaster.tsx
- [ ] Line 254 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 257 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 260 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-purple-600 hover:bg-purple-50 rounded">
                    <Download className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/ItemVariantsMaster.tsx
- [ ] Line 358 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
  ```
- [ ] Line 361 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
  ```
- [ ] Line 364 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-purple-600 hover:bg-purple-50 rounded">
                            <Copy className="w-4 h-4" />
                          </button>
  ```

### b3-erp/frontend/src/components/common-masters/LicenseMaster.tsx
- [ ] Line 424 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                          <Edit3 className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 427 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 430 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <FileText className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/MachineMaster.tsx
- [ ] Line 374 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 377 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/PaymentTermsMaster.tsx
- [ ] Line 237 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 240 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/PolicyMaster.tsx
- [ ] Line 310 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
  ```
- [ ] Line 311 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-900"><Edit3 className="w-4 h-4" /></button>
  ```
- [ ] Line 312 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
  ```

### b3-erp/frontend/src/components/common-masters/PriceListMaster.tsx
- [ ] Line 230 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 233 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/RegulatoryBodyMaster.tsx
- [ ] Line 401 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 404 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 407 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                        <FileText className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/common-masters/SOPMaster.tsx
- [ ] Line 343 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900"><FileText className="w-4 h-4" /></button>
  ```
- [ ] Line 344 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-900"><Edit3 className="w-4 h-4" /></button>
  ```
- [ ] Line 345 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
  ```

### b3-erp/frontend/src/components/common-masters/TaxMaster.tsx
- [ ] Line 479 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 851 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                      type="button"
                      onClick={handleAddComponent}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
     …
  ```

### b3-erp/frontend/src/components/common-masters/UOMConversionMaster.tsx
- [ ] Line 391 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 394 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
  ```

### b3-erp/frontend/src/components/common-masters/UOMMaster.tsx
- [ ] Line 528 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/VendorMaster.tsx
- [ ] Line 416 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/common-masters/WarehouseMaster.tsx
- [ ] Line 484 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/DashboardLayout.tsx
- [ ] Line 92 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                  <Bell className="h-5 w-5" />
                  <span className="ab…
  ```

### b3-erp/frontend/src/components/finance/AccountsReceivableManagement.tsx
- [ ] Line 683 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                            <Mail className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 686 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-900">
                            <Phone className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 689 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                            <Eye className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 692 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
  ```

### b3-erp/frontend/src/components/finance/AssetManagement.tsx
- [ ] Line 639 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
  ```
- [ ] Line 642 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-green-600">
                            <QrCodeIcon className="w-4 h-4" />
                          </button>
  ```

### b3-erp/frontend/src/components/finance/BankReconciliation.tsx
- [ ] Line 722 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 1084 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <EyeIcon className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 1087 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 1123 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 1126 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className={`${rule.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 1246 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                          <EyeIcon className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 1249 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/finance/BudgetManagement.tsx
- [ ] Line 478 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 695 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                <PencilIcon className="w-4 h-4" />
              </button>
  ```

### b3-erp/frontend/src/components/finance/CashFlowManagement.tsx
- [ ] Line 607 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
  ```
- [ ] Line 663 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 666 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 669 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
  ```

### b3-erp/frontend/src/components/finance/CostCenterManagement.tsx
- [ ] Line 793 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 901 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                    <PencilIcon className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 904 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-green-600">
                    <ShareIcon className="w-4 h-4" />
                  </button>
  ```
- [ ] Line 1100 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <EyeIcon className="w-4 h-4" />
              </button>
  ```

### b3-erp/frontend/src/components/finance/CreditManagement.tsx
- [ ] Line 622 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                            <CheckCircle className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 625 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                            <XCircle className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 631 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/finance/EnhancedFinanceDashboard.tsx
- [ ] Line 341 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-200 hover:text-white">
              <Eye className="h-4 w-4" />
            </button>
  ```
- [ ] Line 359 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-200 hover:text-white">
              <Eye className="h-4 w-4" />
            </button>
  ```
- [ ] Line 377 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-orange-200 hover:text-white">
              <Eye className="h-4 w-4" />
            </button>
  ```
- [ ] Line 395 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-purple-200 hover:text-white">
              <Eye className="h-4 w-4" />
            </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialAnalytics.tsx
- [ ] Line 801 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                <EyeIcon className="w-5 h-5" />
              </button>
  ```
- [ ] Line 832 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <DocumentArrowDownIcon className="w-4 h-4" />
              </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialAutomation.tsx
- [ ] Line 556 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                    <Settings className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 559 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-yellow-600 hover:text-yellow-800">
                    <Pause className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 751 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-yellow-600 hover:text-yellow-800">
                            <Pause className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 755 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                            <Play className="h-4 w-4" />
                          </button>
  ```
- [ ] Line 881 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
  ```
- [ ] Line 1109 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialConsolidation.tsx
- [ ] Line 269 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 358 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Settings className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 428 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
  ```
- [ ] Line 492 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <Check className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 606 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 610 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Check className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 872 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                  <Download className="h-5 w-5" />
                </button>
  ```
- [ ] Line 956 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Check className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialControls.tsx
- [ ] Line 731 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 734 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-green-600">
                  <CogIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 895 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 899 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
  ```
- [ ] Line 1057 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                    </button>
  ```
- [ ] Line 1092 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <EyeIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 1095 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialIntegrations.tsx
- [ ] Line 389 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                      <Pause className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 393 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                      <Play className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 397 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                    <Settings className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 564 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-yellow-600 hover:text-yellow-800">
                          <RefreshCw className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 729 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <Settings className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 732 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                      <X className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialPeriodManagement.tsx
- [ ] Line 588 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Play className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 593 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Check className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 827 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Check className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 831 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800 ml-2">
                      <Eye className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialReporting.tsx
- [ ] Line 390 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
  ```
- [ ] Line 439 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-red-600">
                  <TrashIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 485 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center">
                <EyeIcon className="w-4 h-4" />
              </button>
  ```
- [ ] Line 488 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center">
                <DocumentDuplicateIcon className="w-4 h-4" />
              </…
  ```
- [ ] Line 600 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <PencilIcon className="w-4 h-4" />
                    </button>
  ```
- [ ] Line 603 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                      <PlayIcon className="w-4 h-4" />
                    </button>
  ```

### b3-erp/frontend/src/components/finance/FinancialWorkflows.tsx
- [ ] Line 503 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                    <X className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 593 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                      <Settings className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 597 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-yellow-600 hover:text-yellow-800">
                        <Pause className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 601 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                        <Play className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 746 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <Settings className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 749 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                      <X className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/components/finance/GeneralLedger.tsx
- [ ] Line 761 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 897 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 901 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-red-600">
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/finance/InvestmentPortfolio.tsx
- [ ] Line 813 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                          <X className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 902 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                          <Check className="h-4 w-4" />
                        </button>
  ```
- [ ] Line 905 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800">
                          <X className="h-4 w-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/finance/MultiCurrencyManagement.tsx
- [ ] Line 828 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 831 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-green-600">
                          <CogIcon className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 913 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 916 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/finance/TaxManagement.tsx
- [ ] Line 682 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
  ```
- [ ] Line 807 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-blue-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
  ```
- [ ] Line 811 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-green-600">
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
  ```
- [ ] Line 1056 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center">
                <EyeIcon className="w-4 h-4" />
              </button>
  ```

### b3-erp/frontend/src/components/logistics/DriverMaster.tsx
- [ ] Line 83 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
  ```
- [ ] Line 84 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600"><Trash2 className="h-4 w-4" /></button>
  ```

### b3-erp/frontend/src/components/logistics/FreightMaster.tsx
- [ ] Line 82 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
  ```
- [ ] Line 83 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600"><Trash2 className="h-4 w-4" /></button>
  ```

### b3-erp/frontend/src/components/logistics/PackagingMaster.tsx
- [ ] Line 85 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
  ```
- [ ] Line 86 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600"><Trash2 className="h-4 w-4" /></button>
  ```

### b3-erp/frontend/src/components/logistics/PortMaster.tsx
- [ ] Line 96 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
  ```
- [ ] Line 97 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600"><Trash2 className="h-4 w-4" /></button>
  ```

### b3-erp/frontend/src/components/logistics/RouteMaster.tsx
- [ ] Line 88 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
  ```
- [ ] Line 89 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600"><Trash2 className="h-4 w-4" /></button>
  ```

### b3-erp/frontend/src/components/logistics/VehicleMaster.tsx
- [ ] Line 100 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800"><Edit2 className="h-4 w-4" /></button>
  ```
- [ ] Line 101 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
  ```

### b3-erp/frontend/src/components/procurement/ContractManagement.tsx
- [ ] Line 589 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 592 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
  ```

### b3-erp/frontend/src/components/procurement/DarkModeExamples.tsx
- [ ] Line 365 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        <Eye className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 368 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                        <Edit className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 371 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/procurement/DarkModeTheme.tsx
- [ ] Line 263 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Settings className="h-5 w-5 text-gray…
  ```

### b3-erp/frontend/src/components/procurement/DataTable.tsx
- [ ] Line 266 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                </button>
  ```

### b3-erp/frontend/src/components/procurement/EProcurementMarketplace.tsx
- [ ] Line 392 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                    </button>
  ```
- [ ] Line 456 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    <Eye className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 467 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
  ```
- [ ] Line 480 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded hover:bg-gray-50">
            <ChevronRight className="h-4 w-4" />
          </button>
  ```
- [ ] Line 763 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 766 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                        <Download className="h-4 w-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/procurement/FormValidation.tsx
- [ ] Line 432 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </button>
  ```

### b3-erp/frontend/src/components/procurement/HelpExamples.tsx
- [ ] Line 115 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-500 hover:text-blue-700">
                <AlertTriangle className="h-4 w-4" />
              </button>
  ```
- [ ] Line 205 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 210 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
  ```
- [ ] Line 403 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400 hover:text-blue-500">
              <AlertTriangle className="h-5 w-5" />
            </button>
  ```
- [ ] Line 543 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-blue-500">
                  <Mail className="h-4 w-4" />
                </button>
  ```
- [ ] Line 620 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-blue-500">
              <Download className="h-5 w-5" />
            </button>
  ```
- [ ] Line 625 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 text-gray-400 hover:text-blue-500">
              <Settings className="h-5 w-5" />
            </button>
  ```

### b3-erp/frontend/src/components/procurement/ProcurementAnalytics.tsx
- [ ] Line 247 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 932 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
            </button>
  ```
- [ ] Line 935 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </button>
  ```

### b3-erp/frontend/src/components/procurement/ProcurementAutomation.tsx
- [ ] Line 541 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
  ```
- [ ] Line 922 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
  ```
- [ ] Line 933 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
  ```

### b3-erp/frontend/src/components/procurement/ProcurementCompliance.tsx
- [ ] Line 168 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
  ```

### b3-erp/frontend/src/components/procurement/ProcurementRiskManagement.tsx
- [ ] Line 568 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Eye className="h-4 w-4" />
              </button>
  ```

### b3-erp/frontend/src/components/procurement/PurchaseRequisitionWorkflow.tsx
- [ ] Line 427 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 430 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 433 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
  ```

### b3-erp/frontend/src/components/procurement/QualityAssurance.tsx
- [ ] Line 396 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="h-4 w-4" />
                </button>
  ```
- [ ] Line 399 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-green-600 hover:text-green-800">
                  <ClipboardCheck className="h-4 w-4" />
                </button>
  ```
- [ ] Line 536 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Edit3 className="h-4 w-4" />
              </button>
  ```
- [ ] Line 674 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                    <Eye className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 689 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400">
                    <Upload className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 709 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400">
                    <Upload className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 851 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 854 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 868 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 871 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 885 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 888 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-600 hover:text-gray-800">
                      <Eye className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/components/procurement/RFQRFPManagement.tsx
- [ ] Line 462 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
  ```
- [ ] Line 585 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 588 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 591 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 714 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
  ```
- [ ] Line 717 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                                <ThumbsUp className="w-4 h-4 text-green-600" />
                              </button>
  ```
- [ ] Line 720 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                                <XCircle className="w-4 h-4 text-red-600" />
                              </button>
  ```
- [ ] Line 931 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
  ```
- [ ] Line 945 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                        <Eye className="w-4 h-4" />
                      </button>
  ```

### b3-erp/frontend/src/components/procurement/SpendAnalysis.tsx
- [ ] Line 640 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
  ```

### b3-erp/frontend/src/components/procurement/StrategicSourcing.tsx
- [ ] Line 502 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 505 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
  ```

### b3-erp/frontend/src/components/procurement/SupplierCollaboration.tsx
- [ ] Line 377 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  <MessageCircle className="h-4 w-4" />
                </button>
  ```
- [ ] Line 410 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
  ```
- [ ] Line 488 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <MessageCircle className="h-4 w-4" />
              </button>
  ```
- [ ] Line 491 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Video className="h-4 w-4" />
              </button>
  ```
- [ ] Line 533 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Bell className="h-4 w-4" />
            </button>
  ```
- [ ] Line 595 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded">
                    <Eye className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 598 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded">
                    <MessageCircle className="h-4 w-4" />
                  </button>
  ```
- [ ] Line 668 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Share2 className="h-4 w-4" />
            </button>
  ```
- [ ] Line 739 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded">
                      <Eye className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 742 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded">
                      <Download className="h-4 w-4" />
                    </button>
  ```
- [ ] Line 745 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-2 hover:bg-gray-100 rounded">
                      <Share2 className="h-4 w-4" />
                    </button>
  ```

### b3-erp/frontend/src/components/procurement/SupplierOnboarding.tsx
- [ ] Line 578 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 581 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
  ```
- [ ] Line 584 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                              <MessageSquare className="w-4 h-4 text-gray-600" />
                            </button>
  ```

### b3-erp/frontend/src/components/procurement/SupplierScorecard.tsx
- [ ] Line 596 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
  ```
- [ ] Line 886 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
  ```
- [ ] Line 889 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="p-1 hover:bg-gray-100 rounded">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                        </button>
  ```

### b3-erp/frontend/src/components/procurement/TooltipsAndHelp.tsx
- [ ] Line 611 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button className="text-gray-400 hover:text-blue-500 transition-colors">
        <HelpCircle className={sizeClasses[size]} />
      </button>
  ```

### b3-erp/frontend/src/components/procurement/ui/index.tsx
- [ ] Line 153 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button onClick={handleClose} className="ml-3">
            <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
  ```
- [ ] Line 197 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
  ```

### b3-erp/frontend/src/components/Sidebar.tsx
- [ ] Line 3285 (native-button): Button has no visible text or accessible name (aria-label/title)
  ```html
  <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
          >
            <ChevronRight classNa…
  ```
