# Corporate Moderne Fiable Style Guide

**Style Overview**:
A professional corporate design using modern shadow-based elevation to create refined depth and visual hierarchy, centered on deep navy blue with sophisticated complementary accents and warm off-white backgrounds for accessible professionalism.

## Colors
### Primary Colors
  - **primary-base**: `text-[#1A3A5C]` or `bg-[#1A3A5C]`
  - **primary-lighter**: `bg-[#2B5280]`
  - **primary-darker**: `text-[#0F2438]` or `bg-[#0F2438]`

### Background Colors

#### Structural Backgrounds

Choose based on layout type:

**For Vertical Layout** (Top Header + Optional Side Panels):
- **bg-nav-primary**: `bg-[hsla(210, 18%, 96%, 1)]` - Top header
- **bg-nav-secondary**: `bg-[hsla(210, 20%, 98%, 1)]` - Inner Left sidebar (if present)
- **bg-page**: `bg-[hsla(40, 30%, 99%, 1)]` - Page background (bg of Main Content area)

**For Horizontal Layout** (Side Navigation + Optional Top Bar):
- **bg-nav-primary**: `bg-[hsla(210, 18%, 96%, 1)]` - Left main sidebar
- **bg-nav-secondary**: `bg-[hsla(210, 20%, 98%, 1)]` - Inner Top header (if present)
- **bg-page**: `bg-[hsla(40, 30%, 99%, 1)]` - Page background (bg of Main Content area)

#### Container Backgrounds
For main content area. Adjust values when used on navigation backgrounds to ensure sufficient contrast.
- **bg-container-primary**: `bg-white`
- **bg-container-secondary**: `bg-[hsla(210, 25%, 98%, 1)]`
- **bg-container-inset**: `bg-[#4A8BC2]/8`
- **bg-container-inset-strong**: `bg-[#1A3A5C]/12`

### Text Colors
- **color-text-primary**: `text-[hsla(210, 30%, 20%, 1)]`
- **color-text-secondary**: `text-[hsla(210, 20%, 40%, 1)]`
- **color-text-tertiary**: `text-[hsla(210, 15%, 55%, 1)]`
- **color-text-quaternary**: `text-[hsla(210, 10%, 70%, 1)]`
- **color-text-on-dark-primary**: `text-white/95` - Text on dark backgrounds and primary-base color surfaces
- **color-text-on-dark-secondary**: `text-white/75` - Text on dark backgrounds and primary-base color surfaces
- **color-text-link**: `text-[#2B5280]` - Links, text-only buttons without backgrounds, and clickable text in tables

### Functional Colors
Use **sparingly** to maintain a professional and refined overall style. Used for the surfaces of text-only cards, simple cards, buttons, and tags.
  - **color-success-default**: #4CAF8D
  - **color-success-light**: #E8F5F0 - tag/label bg
  - **color-error-default**: #D64545 - alert banner bg
  - **color-error-light**: #FDEAEA - tag/label bg
  - **color-warning-default**: #F5A623 - tag/label bg
  - **color-warning-light**: #FFF4E0 - tag/label bg, alert banner bg
  - **color-function-default**: #2B5280
  - **color-function-light**: #E3EDF7 - tag/label bg

### Accent Colors
  - A secondary palette for occasional highlights and categorization. **Avoid overuse** to protect brand identity. Use **sparingly**.
  - **accent-blue-sky**: `text-[#4A8BC2]` or `bg-[#4A8BC2]`
  - **accent-gray-slate**: `text-[#7B8FA3]` or `bg-[#7B8FA3]`

### Data Visualization Charts
For data visualization charts only.
  - Standard data colors: #1A3A5C, #2B5280, #4A8BC2, #7B8FA3, #A8B8CA, #D4DCE5
  - Important data can use small amounts of: #F5A623, #4CAF8D, #5C7A99, #3A5F84

## Typography
- **Font Stack**:
  - **font-family-base**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` — For regular UI copy

- **Font Size & Weight**:
  - **Caption**: `text-sm font-normal`
  - **Body**: `text-base font-normal`
  - **Body Emphasized**: `text-base font-semibold`
  - **Card Title / Subtitle**: `text-lg font-semibold`
  - **Page Title**: `text-2xl font-bold`
  - **Headline**: `text-4xl font-bold`

- **Line Height**: 1.6

## Border Radius
  - **Small**: 8px — Elements inside cards (e.g., photos)
  - **Medium**: 12px — Buttons, inputs
  - **Large**: 16px — Cards, panels
  - **Full**: full — Toggles, avatars, small tags

## Layout & Spacing
  - **Tight**: 8px - For closely related small internal elements, such as icons and text within buttons
  - **Compact**: 12px - For small gaps between small containers, such as a line of tags
  - **Standard**: 20px - For gaps between medium containers like list items
  - **Relaxed**: 32px - For gaps between large containers and sections
  - **Section**: 48px - For major section divisions


## Create Boundaries (contrast of surface color, borders, shadows)
Modern shadow-based elevation design creates refined visual hierarchy through layered shadows at different depths, with solid-color surfaces maintaining professional consistency.

### Borders
  - **Default**: 1px solid #E0E6ED. Used sparingly for inputs and specific emphasis. `border border-[#E0E6ED]`
  - **Stronger**: 1px solid #C5D1DD. Used for active or focused states. `border border-[#C5D1DD]`

### Dividers
  - **Default divider**: `border-t border-[#E0E6ED]` or `border-b border-[#E0E6ED]`

### Shadows & Effects
  - **Case 1 (subtle elevation)**: `shadow-[0_2px_8px_rgba(26,58,92,0.06)]` - For subtle container separation
  - **Case 2 (standard elevation)**: `shadow-[0_4px_12px_rgba(26,58,92,0.08)]` - For cards and primary containers
  - **Case 3 (moderate elevation)**: `shadow-[0_6px_16px_rgba(26,58,92,0.10)]` - For elevated panels and dropdowns
  - **Case 4 (prominent elevation)**: `shadow-[0_8px_24px_rgba(26,58,92,0.12)]` - For modals and high-priority elements

## Visual Emphasis for Containers
When containers (tags, cards, list items, rows) need visual emphasis to indicate priority, status, or category, use the following techniques:

| Technique | Implementation Notes | Best For | Avoid |
|-----------|---------------------|----------|-------|
| Background Tint | Slightly darker/lighter color or reduce transparency of backgrounds | Gentle, common approach for moderate emphasis needs | Heavy colors on large areas (e.g., red background for entire large cards) |
| Border Highlight | Use thin border with opacity for subtlety | Active/selected states, form validation | - |
| Glow/Shadow Effect | Keep shadow subtle with low opacity | Premium aesthetics, hover states | Flat/minimal designs |
| Status Tag/Label | Add colored tag/label inside container | Larger containers | - |
| Side Accent Bar | **Left edge only**, for **non-rounded containers** | Small non-rounded list items (e.g., side nav tabs), small non-rounded cards (e.g., task cards) | Large cards, wide list items, rounded containers |

## Assets
### Image

- For normal `<img>`: object-cover
- For `<img>` with:
  - Slight overlay: object-cover brightness-90
  - Heavy overlay: object-cover brightness-75

### Icon

- Use Lucide icons from Iconify.
- To ensure an aesthetic layout, each icon should be centered in a square container, typically without a background, matching the icon's size.
- Use Tailwind font size to control icon size
- Example:
  ```html
  <div class="flex items-center justify-center bg-transparent w-5 h-5">
  <iconify-icon icon="lucide:briefcase" class="text-base"></iconify-icon>
  </div>
  ```

### Third-Party Brand Logos:
   - Use Brand Icons from Iconify.
   - Logo Example:
     Monochrome Logo: `<iconify-icon icon="simple-icons:x"></iconify-icon>`
     Colored Logo: `<iconify-icon icon="logos:google-icon"></iconify-icon>`

### User's Own Logo:
- To protect copyright, do **NOT** use real product logos as a logo for a new product, individual user, or other company products.
- **Icon-based**:
  - **Graphic**: Use a simple, relevant icon (e.g., a `building-2` icon for corporate, a `shield-check` icon for reliability).

## Page Layout - Web (*EXTREMELY* important)
### Determine Layout Type
- Choose between Vertical or Horizontal layout based on whether the primary navigation is a full-width top header or a full-height sidebar (left/right).
- User requirements typically indicate the layout preference. If unclear, consider:
  - Marketing/content sites typically use Vertical Layout.
  - Functional/dashboard sites can use either, depending on visual style. Sidebars accommodate more complex navigation than top bars. For complex navigation needs with a preference for minimal chrome (Vertical Layout adds an extra fixed header), choose Horizontal Layout (omits the fixed top header).
- Vertical Layout Diagram:
┌──────────────────────────────────────────────────────┐
│  Header (Primary Nav)                                │
├──────────┬──────────────────────────────┬────────────┤
│Left      │ Sub-header (Tertiary Nav)    │ Right      │
│Sidebar   │ (optional)                   │ Sidebar    │
│(Secondary├──────────────────────────────┤ (Utility   │
│Nav)      │ Main Content                 │ Panel)     │
│(optional)│                              │ (optional) │
│          │                              │            │
└──────────┴──────────────────────────────┴────────────┘
- Horizontal Layout Diagram:
┌──────────┬──────────────────────────────┬───────────┐
│          │ Header (Secondary Nav)       │           │
│ Left     │ (optional)                   │ Right     │
│ Sidebar  ├──────────────────────────────┤ Sidebar   │
│ (Primary │ Main Content                 │ (Utility  │
│ Nav)     │                              │ Panel)    │
│          │                              │ (optional)│
│          │                              │           │
└──────────┴──────────────────────────────┴───────────┘
### Detailed Layout Code
**Vertical Layout**
```html
<!-- Body: Adjust width (w-[1440px]) based on target screen size -->
<body class="w-[1440px] min-h-[900px] font-[-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif] leading-[1.6]">

  <!-- Header (Primary Nav): Fixed height -->
  <header class="w-full">
    <!-- Header content -->
  </header>

  <!-- Content Container: Must include 'flex' class -->
  <div class="w-full flex min-h-[850px]">
    <!-- Left Sidebar (Secondary Nav) (Optional): Remove if not needed. If Left Sidebar exists, use its ml to control left page margin -->
    <aside class="flex-shrink-0 min-w-fit">

    </aside>

    <!-- Main Content Area:
     Use Main Content Area's horizontal padding (px) to control distance from main content to sidebars or page edges.
     For pages without sidebars (like Marketing Pages, simple content pages such as help centers, privacy policies) use larger values (px-40 to px-80), for pages with sidebars (Functional/Dashboard Pages, complex content pages with multi-level navigation like knowledge base articles) use moderate values (px-12 to px-20) -->
    <main class="flex-1 overflow-x-hidden flex flex-col">
    <!--  Main Content -->

    </main>

    <!-- Right Sidebar (Utility Panel) (Optional): Remove if not needed. If Right Sidebar exists, use its mr to control right page margin -->
    <aside class="flex-shrink-0 min-w-fit">
    </aside>

  </div>
</body>
```

**Horizontal Layout**

```html
<!-- Body: Adjust width (w-[1440px]) based on target screen size. Must include 'flex' class -->
<body class="w-[1440px] min-h-[900px] flex font-[-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif] leading-[1.6]">

<!-- Left Sidebar (Primary Nav): Use its ml to control left page margin -->
  <aside class="flex-shrink-0 min-w-fit">
  </aside>

  <!-- Content Container-->
  <div class="flex-1 overflow-x-hidden flex flex-col min-h-[900px]">

    <!-- Header (Secondary Nav) (Optional): Remove if not needed. If Header exists, use its mx to control distance to left/right sidebars or page margins -->
    <header class="w-full">
    </header>

    <!-- Main Content Area: Use Main Content Area's pl to control distance from main content to left sidebar. Use pr to control distance to right sidebar/right page edge -->
    <main class="w-full">
    </main>


  </div>

  <!-- Right Sidebar (Utility Panel) (Optional): Remove if not needed. If Right Sidebar exists, use its mr to control right page margin -->
  <aside class="flex-shrink-0 min-w-fit">
  </aside>

</body>
```

## Tailwind Component Examples (Key attributes)
**Important Note**: Use utility classes directly. Do NOT create custom CSS classes or add styles in <style> tags for the following components
### Basic

- **Button**: (Note: Use flex and items-center for the container)
  - Example 1 (Solid primary button):
    - button: flex items-center gap-2 px-6 py-3 bg-[#1A3A5C] text-white/95 rounded-xl hover:bg-[#2B5280] transition-colors shadow-[0_2px_8px_rgba(26,58,92,0.15)]
      - icon (optional): w-5 h-5
      - span(button copy): whitespace-nowrap font-semibold text-base
  - Example 2 (Secondary button):
    - button: flex items-center gap-2 px-6 py-3 bg-white border border-[#E0E6ED] text-[#1A3A5C] rounded-xl hover:bg-[hsla(210,25%,98%,1)] transition-colors shadow-[0_2px_8px_rgba(26,58,92,0.06)]
      - icon (optional): w-5 h-5
      - span(button copy): whitespace-nowrap font-semibold text-base
  - Example 3 (Text button):
    - button: flex items-center gap-2 px-4 py-2 text-[#2B5280] hover:text-[#1A3A5C] transition-colors
      - icon (optional): w-5 h-5
      - span(button copy): whitespace-nowrap font-semibold text-base

- **Tag Group (Filter Tags)** (Note: `overflow-x-auto` and `whitespace-nowrap` are required)
  - container(scrollable): flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden
    - label (Tag item):
      - input: type="radio" name="tag1" class="sr-only peer" checked
      - div: px-4 py-2 bg-[hsla(210,25%,98%,1)] text-[hsla(210,20%,40%,1)] peer-checked:bg-[#1A3A5C] peer-checked:text-white/95 peer-checked:shadow-[0_2px_8px_rgba(26,58,92,0.12)] hover:bg-[hsla(210,25%,96%,1)] transition-all rounded-full whitespace-nowrap font-medium text-sm

### Data Entry
- **Progress bars/Slider**: h-2 bg-[#E0E6ED] rounded-full
  - fill: bg-[#1A3A5C] h-full rounded-full
- **Checkbox**
  - label: flex items-center gap-3
    - input: type="checkbox" class="sr-only peer"
    - div: w-5 h-5 bg-white border border-[#C5D1DD] rounded flex items-center justify-center peer-checked:bg-[#1A3A5C] peer-checked:border-[#1A3A5C] text-transparent peer-checked:text-white transition-all
      - svg(Checkmark): stroke="currentColor" stroke-width="3" fill="none" viewBox="0 0 24 24" class="w-4 h-4"
    - span(text): text-base text-[hsla(210,30%,20%,1)]
- **Radio button**
  - label: flex items-center gap-3
    - input: type="radio" name="option1" class="sr-only peer"
    - div: w-5 h-5 bg-white border border-[#C5D1DD] rounded-full flex items-center justify-center peer-checked:bg-[#1A3A5C] peer-checked:border-[#1A3A5C] transition-all
      - svg(dot indicator): fill="white" viewBox="0 0 24 24" class="w-2.5 h-2.5"
    - span(text): text-base text-[hsla(210,30%,20%,1)]
- **Switch/Toggle**
  - label: flex items-center gap-3
    - div: relative
      - input: type="checkbox" class="sr-only peer"
      - div(Toggle track): w-12 h-6 bg-[#E0E6ED] peer-checked:bg-[#1A3A5C] transition-colors rounded-full
      - div(Toggle thumb): absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-6 transition-transform shadow-[0_2px_4px_rgba(26,58,92,0.15)]
    - span(text): text-base text-[hsla(210,30%,20%,1)]

- **Select/Dropdown**
  - Select container: flex items-center gap-2 px-4 py-3 bg-white border border-[#E0E6ED] rounded-xl hover:border-[#C5D1DD] transition-colors cursor-pointer
    - text: text-base text-[hsla(210,30%,20%,1)]
    - Dropdown icon(square container): flex items-center justify-center bg-transparent w-5 h-5
      - icon: text-[hsla(210,20%,40%,1)]


### Container
- **Navigation Menu - horizontal**
    - Navigation with sections/grouping:
        - Nav Container: flex items-center justify-between w-full px-12 py-4
        - Left Section: flex items-center gap-10
          - Menu Item: flex items-center gap-2 text-base font-medium text-[hsla(210,20%,40%,1)] hover:text-[#1A3A5C] transition-colors
            - icon (optional): w-5 h-5
        - Right Section: flex items-center gap-6
          - Menu Item: flex items-center gap-2 text-base font-medium text-[hsla(210,20%,40%,1)] hover:text-[#1A3A5C] transition-colors
          - Notification (if applicable): relative flex items-center justify-center w-10 h-10 hover:bg-[hsla(210,25%,98%,1)] rounded-full transition-colors
            - notification-icon: w-5 h-5 text-[hsla(210,20%,40%,1)]
            - badge (if has unread): absolute -top-1 -right-1 w-5 h-5 bg-[#D64545] rounded-full flex items-center justify-center
              - badge-count: text-xs text-white font-semibold
          - Avatar(if applicable): flex items-center gap-3 cursor-pointer
            - avatar-image: w-9 h-9 rounded-full object-cover
            - dropdown-icon (if applicable): w-4 h-4 text-[hsla(210,20%,40%,1)]

- **Card**
    - Example 1 (Standard card with shadow elevation):
        - Card: bg-white rounded-2xl flex flex-col p-6 gap-5 shadow-[0_4px_12px_rgba(26,58,92,0.08)] hover:shadow-[0_6px_16px_rgba(26,58,92,0.10)] transition-shadow
        - card-title: text-lg font-semibold text-[hsla(210,30%,20%,1)]
        - card-content: text-base text-[hsla(210,20%,40%,1)]
    - Example 2 (Card with image):
        - Card: bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(26,58,92,0.08)] hover:shadow-[0_6px_16px_rgba(26,58,92,0.10)] transition-shadow
        - Image: w-full h-48 object-cover
        - Text area: p-6 flex flex-col gap-4
          - card-title: text-lg font-semibold text-[hsla(210,30%,20%,1)]
          - card-subtitle: text-base text-[hsla(210,20%,40%,1)]
    - Example 3 (Horizontal card):
        - Card: bg-white rounded-2xl flex gap-6 p-6 shadow-[0_4px_12px_rgba(26,58,92,0.08)] hover:shadow-[0_6px_16px_rgba(26,58,92,0.10)] transition-shadow
        - Image: w-32 h-32 rounded-xl object-cover flex-shrink-0
        - Text area: flex flex-col gap-3 flex-1
          - card-title: text-lg font-semibold text-[hsla(210,30%,20%,1)]
          - card-subtitle: text-base text-[hsla(210,20%,40%,1)]

## Additional Notes

This style guide creates a professional corporate aesthetic that balances modern sophistication with accessibility. The deep navy primary color establishes authority and trust, while soft shadow-based elevation provides refined visual hierarchy without overwhelming the content. Sky blue and slate gray accents offer subtle variety for categorization and emphasis while maintaining the professional tone.

The warm off-white backgrounds create comfortable reading environments suitable for extended viewing sessions typical of corporate websites. Typography remains clean and highly legible with sans-serif fonts at comfortable sizes, ensuring excellent readability across all content types.

Moderate corner radius (8-16px) strikes a balance between contemporary approachability and professional refinement, avoiding both overly playful roundness and stark sharp edges. The shadow system provides clear visual layering that guides user attention naturally through the interface hierarchy.

This design system is particularly well-suited for corporate websites, professional services, B2B platforms, and enterprise applications where credibility, sophistication, and user trust are paramount.

<colors_extraction>
#1A3A5C
#2B5280
#0F2438
#4A8BC2
#7B8FA3
#E0E6ED
#C5D1DD
#A8B8CA
#D4DCE5
#FFFFFF
#4CAF8D
#E8F5F0
#D64545
#FDEAEA
#F5A623
#FFF4E0
#E3EDF7
#5C7A99
#3A5F84
hsla(210, 18%, 96%, 1)
hsla(210, 20%, 98%, 1)
hsla(40, 30%, 99%, 1)
hsla(210, 25%, 98%, 1)
hsla(210, 30%, 20%, 1)
hsla(210, 20%, 40%, 1)
hsla(210, 15%, 55%, 1)
hsla(210, 10%, 70%, 1)
rgba(26, 58, 92, 0.06)
rgba(26, 58, 92, 0.08)
rgba(26, 58, 92, 0.10)
rgba(26, 58, 92, 0.12)
rgba(26, 58, 92, 0.15)
</colors_extraction>
