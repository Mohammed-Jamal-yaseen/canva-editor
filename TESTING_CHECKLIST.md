# Testing Checklist - Canva Editor Mobile & Features

## Pre-Testing Setup
- [ ] Clear browser cache
- [ ] Test on actual mobile device (not just browser DevTools)
- [ ] Test on multiple screen sizes
- [ ] Test in both portrait and landscape orientations
- [ ] Ensure stable internet connection

---

## 1. Page Management Features

### Adding Pages
- [ ] Click "إضافة صفحة" button below canvas
- [ ] Click "+" card in grid view
- [ ] Use mobile page footer "إضافة صفحة" button
- [ ] Verify new page is created with correct dimensions
- [ ] Verify page count increases
- [ ] Verify auto-zoom after page creation

### Selecting Pages
- [ ] Enter grid view (zoom out or toggle)
- [ ] Click page thumbnail in top bar
- [ ] Click page card in grid
- [ ] Verify selected page opens in editor
- [ ] Verify current page indicator updates
- [ ] Verify page content loads correctly

### Duplicating Pages
- [ ] Click "تكرار" in mobile page footer
- [ ] Verify new page has same dimensions as current
- [ ] Verify page count increases
- [ ] Verify new page is created (even if empty for now)

### Deleting Pages
- [ ] Click "حذف" in mobile page footer
- [ ] Verify page content is cleared
- [ ] Verify canvas is empty after deletion
- [ ] Verify workspace remains intact

### Page Navigation
- [ ] Test next page button (desktop footer)
- [ ] Test previous page button (desktop footer)
- [ ] Verify page counter displays correctly (X / Y format)
- [ ] Verify navigation buttons disable appropriately

---

## 2. Mobile Layout & Responsiveness

### Bottom Toolbar (Mobile)
- [ ] Verify toolbar is fixed at bottom on mobile
- [ ] Verify toolbar is visible at all times
- [ ] Verify horizontal scrolling works smoothly
- [ ] Verify snap-to-item behavior
- [ ] Verify all tool icons are visible and tappable
- [ ] Verify toolbar switches to side on desktop (lg breakpoint)
- [ ] Verify proper spacing between items

### Main Content Area
- [ ] Verify no overlap with bottom toolbar
- [ ] Verify proper padding (72px on mobile)
- [ ] Verify canvas is centered
- [ ] Verify scrolling works properly
- [ ] Verify content is accessible in all orientations

### Footer Visibility
- [ ] Verify desktop footer is hidden on mobile
- [ ] Verify desktop footer shows on desktop (lg+)
- [ ] Verify no layout shift when toggling

### Z-Index Layering
- [ ] Verify mobile page footer (z-50) is on top
- [ ] Verify mobile zoom control (z-50) is accessible
- [ ] Verify sidebar (z-40) is below modals
- [ ] Verify backdrop overlay (z-30) covers content
- [ ] Verify no z-index conflicts

---

## 3. Mobile Zoom Controls

### Zoom Widget
- [ ] Verify widget appears on mobile only
- [ ] Verify widget is positioned at bottom-right
- [ ] Verify widget doesn't overlap other controls
- [ ] Verify widget has proper shadow and styling
- [ ] Verify widget hides in grid view

### Zoom Buttons
- [ ] Click "+" button - verify zoom in works
- [ ] Click "-" button - verify zoom out works
- [ ] Click "⛶" button - verify auto-fit works
- [ ] Verify smooth zoom transitions
- [ ] Verify canvas stays centered during zoom

### Pinch Gestures (Mobile Device)
- [ ] Pinch out - verify zoom in
- [ ] Pinch in - verify zoom out
- [ ] Verify smooth gesture response
- [ ] Verify zoom limits (min/max)
- [ ] Verify grid view activates at < 25% zoom

---

## 4. Grid View Functionality

### Entering Grid View
- [ ] Zoom out to < 25% - verify auto-activation
- [ ] Click grid toggle button (desktop)
- [ ] Verify smooth transition to grid view
- [ ] Verify canvas hides properly
- [ ] Verify grid displays all pages

### Grid Layout
- [ ] Verify responsive grid columns (2/3/4/5/6)
- [ ] Verify proper spacing on mobile (gap-4)
- [ ] Verify proper spacing on desktop (gap-6)
- [ ] Verify page cards are properly sized
- [ ] Verify "+" add page card is visible

### Page Thumbnails
- [ ] Verify top bar shows all page thumbnails
- [ ] Verify horizontal scrolling works
- [ ] Verify current page is highlighted
- [ ] Verify thumbnail click selects page
- [ ] Verify proper styling for selected page

### Exiting Grid View
- [ ] Click page thumbnail - verify exits grid view
- [ ] Click page card - verify exits grid view
- [ ] Verify smooth transition back to editor
- [ ] Verify selected page loads correctly
- [ ] Verify auto-zoom after selection

---

## 5. Mobile Page Footer

### Visibility
- [ ] Verify shows only in grid view
- [ ] Verify hides in normal edit mode
- [ ] Verify proper positioning (bottom-4)
- [ ] Verify doesn't overlap with grid content
- [ ] Verify proper shadow and styling

### Button Functionality
- [ ] "إضافة صفحة" - verify opens add page modal
- [ ] "تكرار" - verify duplicates page
- [ ] "حذف" - verify deletes page
- [ ] "تحديد" - verify selection mode (placeholder)
- [ ] "المزيد" - verify opens page drawer
- [ ] "✓" button - verify action (placeholder)

### Touch Targets
- [ ] Verify all buttons are easy to tap
- [ ] Verify proper spacing between buttons
- [ ] Verify visual feedback on tap
- [ ] Verify no accidental taps

---

## 6. Page Drawer

### Opening/Closing
- [ ] Click "المزيد" - verify drawer opens
- [ ] Click X button - verify drawer closes
- [ ] Click outside - verify drawer closes
- [ ] Verify smooth animation
- [ ] Verify proper backdrop

### Action Grid
- [ ] Verify all 4 action buttons are visible
- [ ] Click "نسخ" (Copy) - verify action
- [ ] Click "لصق" (Paste) - verify action
- [ ] Click "تكرار" (Duplicate) - verify action
- [ ] Click "حذف" (Delete) - verify deletes and closes

### Options List
- [ ] Verify all options are scrollable
- [ ] Verify proper icons for each option
- [ ] Verify badge indicators show correctly
- [ ] Click each option - verify appropriate action
- [ ] Verify "تحميل الصفحة" downloads page

---

## 7. Add Page Modal

### Opening Modal
- [ ] Click "إضافة صفحة" button
- [ ] Verify modal opens smoothly
- [ ] Verify backdrop appears
- [ ] Verify modal is centered

### Page Type Selection
- [ ] Verify all 7 page types are listed
- [ ] Click each type - verify selection
- [ ] Verify dimensions display correctly
- [ ] Verify icons are appropriate

### Creating Page
- [ ] Select type and click create
- [ ] Verify page is created with correct dimensions
- [ ] Verify modal closes
- [ ] Verify new page opens in editor
- [ ] Verify auto-zoom applies

### Custom Dimensions
- [ ] Click "تخصيص" (Custom) option
- [ ] Enter custom width and height
- [ ] Verify validation works
- [ ] Create page - verify correct dimensions

---

## 8. Touch Interactions (Mobile Device)

### Single Tap
- [ ] Tap object - verify selection
- [ ] Tap canvas - verify deselection
- [ ] Tap tool - verify tool activation
- [ ] Tap button - verify action

### Double Tap
- [ ] Double tap text - verify edit mode
- [ ] Double tap image - verify selection
- [ ] Verify no accidental actions

### Long Press
- [ ] Long press object - verify context menu (if implemented)
- [ ] Verify proper feedback

### Drag
- [ ] Drag object - verify movement
- [ ] Drag canvas - verify pan (in hand mode)
- [ ] Verify smooth dragging
- [ ] Verify object stays under finger

### Two-Finger Gestures
- [ ] Two-finger drag - verify pan
- [ ] Pinch - verify zoom
- [ ] Rotate (if implemented) - verify rotation
- [ ] Verify smooth gesture handling

---

## 9. Tool Sidebars (Mobile)

### Opening Sidebars
- [ ] Tap tool in bottom toolbar
- [ ] Verify sidebar slides in from right
- [ ] Verify backdrop appears
- [ ] Verify sidebar is scrollable

### Using Tools
- [ ] Select shape tool - verify shapes appear
- [ ] Select text tool - verify text options
- [ ] Select image tool - verify upload options
- [ ] Verify tool functionality works

### Closing Sidebars
- [ ] Tap backdrop - verify sidebar closes
- [ ] Tap X button - verify sidebar closes
- [ ] Tap another tool - verify sidebar switches
- [ ] Verify smooth transitions

---

## 10. Performance Testing

### Load Time
- [ ] Measure initial page load
- [ ] Measure time to interactive
- [ ] Verify < 3 seconds on good connection
- [ ] Verify loading indicators show

### Responsiveness
- [ ] Test with 10 pages - verify smooth
- [ ] Test with 50 objects - verify smooth
- [ ] Test rapid tool switching
- [ ] Test rapid zoom in/out
- [ ] Verify no lag or freezing

### Memory Usage
- [ ] Monitor memory during use
- [ ] Create/delete many pages
- [ ] Verify no memory leaks
- [ ] Verify app doesn't crash

### Battery Impact
- [ ] Use app for 30 minutes
- [ ] Monitor battery drain
- [ ] Verify reasonable consumption

---

## 11. Cross-Browser Testing

### Chrome (Desktop & Mobile)
- [ ] Test all features
- [ ] Verify layout is correct
- [ ] Verify gestures work
- [ ] Verify no console errors

### Safari (Desktop & Mobile)
- [ ] Test all features
- [ ] Verify layout is correct
- [ ] Verify gestures work
- [ ] Verify no console errors

### Firefox (Desktop & Mobile)
- [ ] Test all features
- [ ] Verify layout is correct
- [ ] Verify gestures work
- [ ] Verify no console errors

### Edge (Desktop)
- [ ] Test all features
- [ ] Verify layout is correct
- [ ] Verify no console errors

---

## 12. Device Testing

### Phone (Portrait)
- [ ] iPhone 12/13/14 (390x844)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] Google Pixel 6 (412x915)
- [ ] Verify all features work
- [ ] Verify layout is optimized

### Phone (Landscape)
- [ ] Test same devices in landscape
- [ ] Verify layout adapts
- [ ] Verify controls are accessible
- [ ] Verify no overflow issues

### Tablet (Portrait)
- [ ] iPad (768x1024)
- [ ] Samsung Galaxy Tab (800x1280)
- [ ] Verify layout uses more space
- [ ] Verify grid shows more columns

### Tablet (Landscape)
- [ ] Test same tablets in landscape
- [ ] Verify desktop layout may activate
- [ ] Verify proper breakpoint handling

### Desktop
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Common laptop)
- [ ] 2560x1440 (2K)
- [ ] Verify side navigation shows
- [ ] Verify footer shows
- [ ] Verify mobile controls hide

---

## 13. Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all controls
- [ ] Verify focus indicators
- [ ] Verify logical tab order
- [ ] Test keyboard shortcuts

### Screen Reader
- [ ] Test with VoiceOver (iOS)
- [ ] Test with TalkBack (Android)
- [ ] Verify labels are read correctly
- [ ] Verify actions are announced

### Color Contrast
- [ ] Verify text is readable
- [ ] Verify buttons have good contrast
- [ ] Verify selected states are clear
- [ ] Test in bright sunlight (mobile)

### Touch Target Size
- [ ] Verify all buttons are ≥ 44x44px
- [ ] Verify proper spacing between targets
- [ ] Verify easy to tap on small screens

---

## 14. Edge Cases

### Empty States
- [ ] No pages - verify proper message
- [ ] Empty page - verify placeholder
- [ ] No objects - verify canvas is clean

### Maximum Limits
- [ ] Create 100 pages - verify performance
- [ ] Add 1000 objects - verify handling
- [ ] Zoom to maximum - verify limits
- [ ] Zoom to minimum - verify limits

### Network Issues
- [ ] Disconnect internet - verify offline handling
- [ ] Slow connection - verify loading states
- [ ] Reconnect - verify sync works

### Error Handling
- [ ] Invalid page dimensions - verify validation
- [ ] Failed image upload - verify error message
- [ ] Failed save - verify retry mechanism

---

## 15. Integration Testing

### Save/Load
- [ ] Create design - verify saves
- [ ] Reload page - verify loads correctly
- [ ] Verify all pages persist
- [ ] Verify page order persists

### Export
- [ ] Export as PNG - verify quality
- [ ] Export as JPG - verify quality
- [ ] Export as SVG - verify vector
- [ ] Export as JSON - verify format

### Undo/Redo
- [ ] Add page - undo - verify reverts
- [ ] Delete page - undo - verify restores
- [ ] Modify object - undo - verify reverts
- [ ] Redo - verify reapplies

---

## Bug Reporting Template

When you find a bug, report it with:

```markdown
**Bug Title:** [Brief description]

**Severity:** [Critical/High/Medium/Low]

**Device:** [Device name and OS version]

**Browser:** [Browser name and version]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[Attach screenshots if applicable]

**Console Errors:**
[Copy any console errors]

**Additional Notes:**
[Any other relevant information]
```

---

## Testing Sign-Off

### Tester Information
- **Name:** _________________
- **Date:** _________________
- **Device:** _________________
- **Browser:** _________________

### Results Summary
- **Total Tests:** _____
- **Passed:** _____
- **Failed:** _____
- **Blocked:** _____

### Overall Assessment
- [ ] Ready for production
- [ ] Needs minor fixes
- [ ] Needs major fixes
- [ ] Not ready for release

### Notes:
_________________________________________
_________________________________________
_________________________________________

---

**Happy Testing! 🧪✅**
