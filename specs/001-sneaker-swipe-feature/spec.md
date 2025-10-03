# Feature Specification: Sneaker Swipe Matching Interface

**Feature Branch**: `001-sneaker-swipe-feature`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: User description: "La webapp es una especie de tinder de zapatillas. Yo te voy a pasar el logo, las imagenes de las zapatillas y su descripcion. Tambien imagenes de como quiero que se vea el disenio. Estan disponibles en la carpeta /info. El usuario al ingresar vera nuestro header con el logo y un swiper donde ira pasando los perfiles de las zapatillas. Al hacer swipe hacia la derecha sea como hacer LIKE (en ese momento debe aparecer una overlay trasparente en toda la pantalla con un fondo verde suave y un icono de corazon en el centro). Del mismo modo al hacer swipe hacia la izquierda seria DISLIKE (en este caso tendriamos un overlay transparente con fondo rojo suave y en el centro un icono de una X). Debajo de estos perfiles tendremos dos botones circulares que al apretarlos haran la misma funcion de LIKE y DISLIKE. El boton de la derecha sera el like (icono de corazon) y el de la izquierda el dislike (icono de X). En /info/ejemplo-perfil-sneaker.png tengo un ejemplo de como se veria cada perfil de zapatilla, la estructura seria logo en el header fijo y en la parte de swipe imagen de la zapatilla, nombre de la zapatilla, en de abajo de la imagen debe tener una seccion con purchase_type, avaliability_type y description cada item dentro de un recuadro como border negro como en la imagen y el fondo de esa seccion en vez de rosa deberia ser un rojo parecido al logo. Una vez hecho los 4 swipes y ya no haya mas zapatillas para elegir LIKE o DISLIKE tiene que aparece un cartel que diga: Mientras esperas tu Match aprovecha tu codigo de descuento del 10% en drifters.com.ar. Codigo: SNEAKERS_HEART"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## Clarifications

### Session 2025-10-01
- Q: ¿Cuánto tiempo deben mostrarse los overlays de feedback (verde para LIKE, rojo para DISLIKE) antes de mostrar la siguiente zapatilla? → A: 500ms - Rápido pero visible
- Q: Si falla la carga de una imagen de zapatilla, ¿qué debe mostrar el sistema? → A: Imagen placeholder genérica de zapatilla con mensaje "Imagen no disponible"
- Q: Después de que el usuario ve el mensaje final con el código de descuento, ¿qué debe suceder? → A: Incluir un enlace/botón que redirija a drifters.com.ar
- Q: ¿Qué distancia/porcentaje de deslizamiento debe recorrer el usuario para que se registre como swipe válido (LIKE o DISLIKE)? → A: 50% del ancho de la pantalla - Balance estándar
- Q: Para los iconos (corazón y X) que aparecen centrados en los overlays de feedback, ¿qué especificaciones deben tener? → A: Grande (100-150px), color blanco con opacidad 80%

## User Scenarios & Testing

### Primary User Story
A sneaker enthusiast visits Sneaker Heart to discover new sneaker releases in an engaging, Tinder-style interface. They swipe through sneaker profiles, expressing their preferences (like/dislike) for each pair. After reviewing all available sneakers (4 profiles), they receive a promotional code for Drifters.com.ar as a reward for their engagement.

### Acceptance Scenarios
1. **Given** the user loads the application, **When** the page renders, **Then** they see a fixed header with the Sneaker Heart logo and the first sneaker profile card ready to swipe
2. **Given** a sneaker profile is displayed, **When** the user swipes right or taps the heart button, **Then** a green transparent overlay with a heart icon appears briefly, and the next sneaker profile is shown
3. **Given** a sneaker profile is displayed, **When** the user swipes left or taps the X button, **Then** a red transparent overlay with an X icon appears briefly, and the next sneaker profile is shown
4. **Given** the user has reviewed all 4 sneaker profiles, **When** they complete the last swipe action, **Then** a completion screen displays the promotional message "Mientras esperas tu Match aprovecha tu codigo de descuento del 10% en drifters.com.ar. Codigo: SNEAKERS_HEART" with a clickable link/button to visit drifters.com.ar
5. **Given** a sneaker profile is displayed, **When** viewing the card, **Then** the user sees the sneaker image, name, and three info boxes (purchase_type, availability_type, description) with black borders on a red background matching the logo color

### Edge Cases
- What happens when the user tries to swipe before the card animation completes? → Swipe should be disabled until animation finishes
- What happens if the user starts swiping but doesn't reach the 50% threshold? → Card returns to center position (swipe cancelled)
- What happens if sneaker images fail to load? → Display a generic sneaker placeholder image with "Imagen no disponible" message, allow user to continue swiping
- What happens if the user refreshes the page mid-session? → Session restarts from the first sneaker (no persistence per constitution - no database)
- What happens on very small mobile screens? → Design must be responsive and maintain usability

## Requirements

### Functional Requirements
- **FR-001**: System MUST display a fixed header containing the Sneaker Heart logo across all screens
- **FR-002**: System MUST load sneaker data from the static JSON file located at `/info/sneakers-data.json`
- **FR-003**: System MUST display sneaker profiles one at a time in a swipeable card interface
- **FR-004**: Each sneaker profile card MUST display:
  - Sneaker image (full size, prominent)
  - Sneaker name
  - Purchase type in a bordered info box
  - Availability type in a bordered info box
  - Description in a bordered info box
  - Info boxes MUST have black borders and be placed on a red background matching the logo color
- **FR-005**: System MUST support swipe gestures:
  - Swipe right = LIKE action
  - Swipe left = DISLIKE action
  - Swipe is registered as valid when card is dragged at least 50% of screen width
- **FR-006**: System MUST provide two circular action buttons below the sneaker card:
  - Right button (heart icon) = LIKE action
  - Left button (X icon) = DISLIKE action
- **FR-007**: System MUST display visual feedback for LIKE actions:
  - Full-screen transparent overlay with soft green background
  - Heart icon centered in the overlay (size: 100-150px, white color with 80% opacity)
  - Overlay appears briefly (500ms animation duration)
- **FR-008**: System MUST display visual feedback for DISLIKE actions:
  - Full-screen transparent overlay with soft red background
  - X icon centered in the overlay (size: 100-150px, white color with 80% opacity)
  - Overlay appears briefly (500ms animation duration)
- **FR-009**: System MUST automatically show the next sneaker profile after a LIKE or DISLIKE action
- **FR-010**: System MUST display exactly 4 sneaker profiles in sequence (matching available sneakers in data file)
- **FR-011**: System MUST display a completion screen after all sneakers have been reviewed with the exact message: "Mientras esperas tu Match aprovecha tu codigo de descuento del 10% en drifters.com.ar. Codigo: SNEAKERS_HEART" and MUST include a clickable link or button that redirects users to drifters.com.ar
- **FR-012**: System MUST be fully responsive and work on mobile and desktop devices
- **FR-013**: System MUST use the design reference from `/info/ejemplo-perfil-sneaker.png` as visual guidance
- **FR-014**: System MUST handle image loading failures gracefully by displaying a generic sneaker placeholder image with the text "Imagen no disponible" when a sneaker image fails to load

### Key Entities

- **Sneaker Profile**: Represents a single sneaker with its marketing information
  - Name: Display name of the sneaker model
  - Description: Marketing copy or unique selling point
  - Purchase Type: How the sneaker can be acquired (e.g., "Raffle", "Venta Directa", "A definir")
  - Availability Type: When/where it's available (e.g., "Lanzamiento 10/10", "Disponible en Drifters")
  - Images: Array of image paths (currently one image per sneaker)

- **User Interaction**: Represents user's choice for each sneaker
  - Action Type: LIKE or DISLIKE
  - Note: Per constitution (no database), interactions are not persisted; they only affect the immediate session flow

## Design Assets Reference

All design assets are located in `/info/`:
- Logo: `sneakers-heart-logo.png`
- Design reference: `ejemplo-perfil-sneaker.png`
- Sneaker data: `sneakers-data.json`
- Sneaker images: `sneakers-images/` folder containing 4 sneaker product photos

Visual design notes:
- Info box section background: Red color matching the Sneaker Heart logo (not pink as in reference image)
- Info boxes: Black border styling
- Action buttons: Circular shape, left button (X icon), right button (heart icon)

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain (all clarifications resolved)
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (5 items)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed (all clarifications resolved)
