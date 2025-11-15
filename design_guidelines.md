# AOZ Covenant NFT Browser - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing from AOZ's existing website aesthetic combined with Kudo's functional layout patterns. This utility-focused application prioritizes efficient covenant browsing while maintaining AOZ's distinctive crypto/AI visual identity through gradients, subtle blur effects, and premium finishes.

## Core Design Principles

- **Information Density**: Display maximum covenant data efficiently without overwhelming users
- **Scanability**: Users should quickly identify covenant status, agents, and key terms
- **Trust Signals**: Prominent verification badges, blockchain links, and attestation data
- **Progressive Disclosure**: Expandable cards reveal detailed information on demand

---

## Typography

**Font Family**: Inter or similar geometric sans-serif via Google Fonts CDN

**Hierarchy**:
- Page Header: 3xl (36px), bold weight
- Covenant Title: lg (18px), semibold weight
- Section Labels: sm (14px), uppercase, semibold, letter-spacing tight
- Body Text: base (16px), regular weight
- Wallet Addresses: mono font, sm (14px), regular weight
- Status Badges: xs (12px), semibold, uppercase

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24

**Container Structure**:
- Max width: max-w-7xl
- Page padding: px-4 md:px-8 lg:px-12
- Vertical rhythm: py-8 between major sections

**Grid System**:
- Single column on mobile (grid-cols-1)
- 2 columns on tablet (md:grid-cols-2)
- 3 columns on desktop (lg:grid-cols-3)
- Gap: gap-6 between cards

---

## Component Library

### 1. Header Navigation
**Structure**:
- Fixed header with logo on left
- Navigation links centered or right-aligned
- Wallet connection button on far right
- Height: h-16
- Padding: px-4 md:px-8

**Logo**: 
- AOZ brand mark (provided image asset)
- Height: h-8 to h-10

### 2. Filter Controls
**Layout**:
- Horizontal filter bar below header
- Filter dropdowns on left (All Agents, All Status)
- Toggle switch on right ("Show only my cNFTs")
- Padding: p-4, gap-4 between elements
- Sticky positioning (sticky top-16)

**Dropdown Selects**:
- Min-width: w-48
- Padding: px-4 py-2
- Border radius: rounded-lg
- Border width: border

**Toggle Switch**:
- Standard toggle component
- Label on left: text-sm
- Active/inactive states with smooth transition

### 3. Covenant NFT Cards
**Card Structure**:
- Border radius: rounded-xl
- Padding: p-6
- Border width: border
- Backdrop blur effect on hover
- Shadow on hover: shadow-xl

**Card Header**:
- Covenant ID: text-lg, semibold
- Status Badge: inline, text-xs, px-2 py-1, rounded-full
- Type Badge: (LOAN/TRANSACTION/EMPLOYMENT) uppercase, text-xs

**Card Content Sections**:

*Ask Section*:
- Label: "Ask" - text-xs, uppercase, mb-2
- Content: text-sm, leading-relaxed
- Settlement status indicator
- Padding bottom: pb-4, border-b

*Promise Section*:
- Label: "Promise" - text-xs, uppercase, mb-2
- Content: text-sm, leading-relaxed
- Details subsection with wallet addresses
- Status indicator for promise fulfillment

*Agent Info*:
- Agent name with verification badge (inline SVG icon)
- TEE Attestation link
- Wallet address (truncated with hover for full)
- Holder status

**Expandable Details**:
- Click-to-expand for full covenant terms
- Smooth height transition
- Additional padding when expanded: pt-4

### 4. Status Badges
**Types**: minted, completed, pending, settled

**Styling**:
- Inline-block
- Padding: px-3 py-1
- Border radius: rounded-full
- Text: text-xs, font-semibold, uppercase
- Each status uses distinct visual treatment

### 5. Buttons & Links

**Primary Button** (Wallet Connect):
- Padding: px-6 py-3
- Border radius: rounded-lg
- Font: text-sm, font-semibold
- Backdrop blur effect

**Link Buttons** (View on Magic Eden, blockchain explorer):
- Text-sm with underline on hover
- Icon on left (external link icon from Heroicons)
- Padding: py-1

### 6. Verification Badges
**Structure**:
- Inline with agent name
- Icon + "Verified" text
- Size: w-4 h-4 icon
- Text: text-xs

### 7. Wallet Address Display
**Format**:
- Monospace font family
- Truncated: 0x1234...5678
- Copy button on hover
- Click to view full address in modal

---

## Images

**Logo Assets**:
- AOZ logo in header (SVG preferred, PNG fallback)
- Partner logos for future features section
- All logos should be provided as SVG or high-DPI PNG

**No Hero Image**: This is a utility application focused on data display, not a marketing page. Start immediately with filters and covenant cards.

---

## Animations

**Minimal, Functional Only**:
- Card hover: subtle lift (translateY(-2px)) + shadow increase
- Filter dropdown: fade in/out (150ms)
- Expand/collapse: smooth height transition (300ms ease-in-out)
- Status badge pulse: subtle for "pending" status only
- Toggle switch: position transition (200ms)

**No decorative animations** - maintain fast, responsive feel

---

## Accessibility

- All interactive elements have visible focus states (ring-2)
- Status badges use both text and visual distinction
- Wallet addresses have copy functionality
- Links clearly indicate external destinations
- Keyboard navigation through all filters and cards
- ARIA labels for icon-only buttons

---

## Specific Layout Notes

**Empty State**:
When no covenants match filters:
- Centered content
- Icon (document search from Heroicons)
- Heading: "No covenants found"
- Subtext with filter reset button

**Loading State**:
- Skeleton cards matching covenant card structure
- Shimmer effect on skeleton elements
- 6-9 skeleton cards in grid

**Pagination**:
- Bottom of page
- "Showing X to Y of Z entries" text
- Next/Previous buttons
- Page numbers for long lists

---

## Mobile Considerations

- Single column card layout (grid-cols-1)
- Filter controls stack vertically
- Wallet addresses always truncated
- Sticky header with compact logo
- Touch-friendly tap targets (min h-12 for buttons)
- Collapsible filter panel on mobile

---

## Visual Treatments

**Gradient Accents**:
Apply gradient overlays to:
- Header background (subtle)
- Card borders on hover
- Primary action buttons
- Status badge backgrounds for "completed" status

**Blur Effects**:
- Backdrop blur on header (backdrop-blur-lg)
- Card hover states (backdrop-blur-sm)
- Button backgrounds over any gradient areas

**Depth & Layering**:
- Cards appear to float over background
- Sticky header has elevated z-index
- Dropdown menus appear above cards (z-50)