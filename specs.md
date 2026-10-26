# Build a Realistic Random Playing Card Draw Website

Build a polished, responsive web application that allows users to randomly draw cards from a virtual deck containing numbers from **1 to N**, where N is specified by the user.

## 1. Core Requirements

### Deck Setup
- Provide an input field where users can enter the maximum number `N`.
- The deck contains cards numbered sequentially from `1` to `N`.
- Validate the input: N must be a positive integer within a reasonable limit, such as 1–500.
- Provide a **Start / Create Deck** button to initialize a new deck.
- Display the total number of cards remaining in the deck.
- Allow users to start a new session by creating a new deck with a different N or resetting the current deck.

### Draw a Random Card
- Provide a prominent **Draw Card** button.
- When the user clicks the button:
  1. Disable the draw button immediately to prevent duplicate clicks.
  2. Wait approximately 1 second before revealing the result.
  3. Play a smooth, realistic card-drawing animation, such as a card sliding out of a deck, flipping over, and revealing its number.
  4. Randomly select one card from the remaining deck.
  5. Display the selected card with its number clearly visible.
  6. Permanently remove that card from the current session's remaining deck so it cannot be drawn again.
  7. Re-enable the draw button after the animation completes.

- Use a proper random selection algorithm that guarantees every remaining card has an equal probability of being drawn.
- Never allow duplicate draws within the same session.
- Handle rapid clicks safely and prevent concurrent draw operations.

### Session and Deck State
- Maintain the remaining deck in application state for the duration of the current session.
- Once a card is drawn, it must be removed from the available deck immediately, not merely hidden from the UI.
- Display useful statistics:
  - Total cards in the deck.
  - Cards already drawn.
  - Cards remaining.
- Optionally display a history of previously drawn cards.
- When all cards have been drawn, disable the draw button and display a message such as "All cards have been drawn!"
- Starting a new session should restore the deck according to the newly configured N.
- Persist the deck state in `sessionStorage` if appropriate, so refreshing the page does not restore previously drawn cards during the same browser session. Clear or replace this state when the user starts a new session.

## 2. Visual Design — Realistic Playing Cards

The UI should look and feel like a real physical playing card experience rather than a generic number generator.

### Card Appearance
- Use a standard playing-card aspect ratio of approximately 5:7.
- Give each card:
  - A white or warm ivory background.
  - Rounded corners.
  - A subtle border and realistic shadow.
  - A large, centered number.
  - Small corner markings showing the number, similar to traditional playing cards.
- Use a tasteful red and black color scheme inspired by traditional playing cards.
- Add subtle paper texture or fine details if they improve realism without hurting performance.
- The card should look convincing even though it represents a number rather than a standard suit and rank.

### Deck Visualization
- Show a stacked deck of cards with slightly offset edges to create the appearance of a physical pile.
- Update the deck visualization as cards are drawn.
- Make the deck visually smaller or thinner as cards are removed, while keeping the layout stable and attractive.
- Display the remaining card count near the deck.

### Animation
Create a polished card-drawing experience:
- The draw button triggers a card emerging from the deck.
- The card moves smoothly toward the center of the screen.
- Include a 3D flip animation to reveal the number.
- Use smooth easing and natural motion.
- Target an animation duration of approximately 600–1000 ms, with the result revealed after the requested 1-second delay.
- Prevent the user from triggering another draw while the current animation is running.
- Respect `prefers-reduced-motion` for accessibility.

## 3. User Interface

Design a clean, modern interface with the following elements:

- A clear page title, such as "Random Card Draw".
- An input for N and a button to create the deck.
- A visual representation of the remaining deck.
- A prominent draw button.
- An animated area where the drawn card is revealed.
- Statistics showing total, drawn, and remaining cards.
- An optional draw history displayed as small card thumbnails or numbered chips.
- A reset/new-session action with confirmation if the current session has already drawn cards.

The layout should be intuitive and visually balanced on desktop, tablet, and mobile.

## 4. Technical Requirements

- Use the existing project's framework and coding conventions if working in an existing repository.
- If starting from scratch, use React, TypeScript, and Vite.
- Use CSS transitions, CSS keyframes, or Framer Motion for animations, depending on the existing dependencies.
- Avoid unnecessary dependencies.
- Keep deck logic separate from presentation components.
- Use clear TypeScript types and reusable components.
- Ensure the application works without a backend.
- Do not use `Math.random()` in a way that can select cards outside the remaining deck or cause duplicates. Select from the current remaining-card array and remove the selected card atomically.
- Ensure the UI state remains consistent throughout the drawing animation and after a page refresh when session persistence is enabled.

## 5. Suggested User Flow

1. The user enters `N = 52`.
2. The user clicks "Create Deck".
3. A visual deck of 52 numbered cards appears.
4. The user clicks "Draw Card".
5. The application waits approximately 1 second while playing the drawing animation.
6. A card, for example number 17, flips over and is revealed.
7. Card 17 is removed from the remaining deck.
8. The remaining count decreases from 52 to 51.
9. The user can continue drawing without receiving card 17 again.
10. When no cards remain, the application displays a completion state.

## 6. Acceptance Criteria

The implementation is complete only when all of the following are satisfied:

- [ ] The user can configure N and create a deck containing exactly the numbers 1 through N.
- [ ] Every draw has approximately a 1-second delay and a polished drawing/reveal animation.
- [ ] Each card has a realistic playing-card appearance.
- [ ] Every card can be drawn at most once per session.
- [ ] The drawn card is removed from the remaining deck immediately and correctly.
- [ ] Rapid clicks cannot cause duplicate or concurrent draws.
- [ ] Deck statistics always match the actual application state.
- [ ] The draw button is disabled when the deck is empty.
- [ ] Starting a new session creates a fresh deck.
- [ ] The layout works on desktop and mobile.
- [ ] No backend is required.

Please implement the complete, working application rather than just providing a mockup or a code example. If you are working in an existing repository, inspect the project structure first and integrate the feature without unnecessarily rewriting unrelated code. After implementation, run the available checks and fix any errors.