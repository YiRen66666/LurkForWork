Layout:
The layout ensures good usability through a clear visual hierarchy and accessible design. The .button-group uses CSS Grid to evenly distribute action buttons horizontally on larger screens, enhancing readability and interaction. On smaller screens (under 950px), a media query switches the layout to a vertical flex column, improving mobile usability by making buttons stack for easier tapping.

Font:
This project uses only one font family — Arial, sans-serif, which ensures readability, clean appearance. 
For those clickable elements, such as links to user profiles, are visually distinguished using bold, italic, and a unique blue color, providing clear visual cues and enhancing user navigation

Harmonious Color choice:
To improve usability and accessibility, a consistent HSL hue value of 199 is chosen to across all interactive elements such as buttons, links, and backgrounds. There is also use subtle color changes on hover using the same hue but lighter/darker values, helping users identify clickable areas.

Visual hierarchy:
Titles use larger font sizes to emphasize important content such as job title. The job creator's name is displayed in italic and bold to make visual contrast. Action buttons like "Add Job", "My profile" and "Watch a user by entering email" are clearly placed at the top of the page, so users can immediately understand what they can do. Besides, Consistent spacing is applied between components using gap and padding, ensuring that elements like job cards and buttons are not crowded and feel easy to read. All elements are centrally aligned with flex and grid layouts, maintaining a balanced look across different screen sizes. All job posts follow the same card format, making UI predictable.

Accessibility on Alt text and aria-label text:
All images include meaningful alt attributes to support screen reader users. Each image is assigned descriptive alt text so users can understand what the image represents, even if it fails to load.
It also applies aria-label attributes to all key interactive buttons. Each button is given a clear, descriptive label to explain its purpose — such as "Go to profile", "Add a new job", "Delete this job", or "Toggle comment list". Dynamic buttons like the like/unlike button also update their aria-label according to state, e.g., "Like this job" or "Unlike this job". This ensures users can navigate and interact with the interface using assistive technologies with confidence and clarity.

Affordance:
All interactive elements in the interface clearly communicate their function. For example, buttons like “Add Job”, “My Profile”, and “Show Comments” have visible text labels that match user expectations. For special actions like search and logout, emoji icons are used (🔍, 🚪) to create a familiar, minimalist experience — but these are still easily recognizable due to their universal meaning and placement. No elements feel hidden or misleading, and users always know what they can interact with.


