console.clear();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
        markers: true
      }
    })
    .to("img", {
      scale: 2,
      z: 350,
      transformOrigin: "center center",
      ease: "power1.inOut"
    })
    .to(
      ".section.hero",
      {
        scale: 1.1,
        transformOrigin: "center center",
        ease: "power1.inOut"
      },
      "<"
    );
});
let mousePos = {x: 0, y:0}
let lastMousePos = {x: 0, y:0}
let isMouseDown = false
document.addEventListener("mousemove", (event) => {
	console.log("mouseMove")
	mousePos.x = event.clientX;
	mousePos.y = event.clientY
})
document.addEventListener("touchmove", (event) => {
	console.log("touchMove")
	mousePos.x = event.touches[0].clientX;
	mousePos.y = event.touches[0].clientY
})
document.addEventListener("mousedown", (event) => {
	isMouseDown = true
	lastMousePos.x = event.clientX
	lastMousePos.y = event.clientY
})
document.addEventListener("touchstart", (event) => {
	isMouseDown = true
	lastMousePos.x = event.touches[0].clientX
	lastMousePos.y = event.touches[0].clientY
})
document.addEventListener("mouseup", () => isMouseDown = false)
document.addEventListener("touchend", () => isMouseDown = false)

let scrollPosition = 0
let targetPosition = 0
let targetVelocity = 0
function frame() {
	window.requestAnimationFrame(frame)
	const contentEl = document.querySelector(".cont")
	if (isMouseDown) {
		const rect = contentEl.getBoundingClientRect();
		targetVelocity = -1 * (mousePos.x - lastMousePos.x) / rect.width
		lastMousePos.x = mousePos.x
		lastMousePos.y = mousePos.y
		targetPosition += targetVelocity
		scrollPosition = scrollPosition * 0.8 + targetPosition * 0.2
	} else {
		const snappingPosition = Math.min(Math.max(0,Math.round(targetPosition)),8)
		const snappingForce = 0.05
		targetVelocity += (snappingPosition - targetPosition) * snappingForce
		const damping = 0.8
		targetVelocity *= damping
		targetPosition += targetVelocity
		scrollPosition = scrollPosition * 0.9 + targetPosition * 0.1
	}
	contentEl.style.setProperty("--scroll", scrollPosition)
	contentEl.querySelectorAll("section").forEach(el => {
		const relativePosition = parseInt(getComputedStyle(el).getPropertyValue('--position')) - scrollPosition
		if (relativePosition > 0) {
			el.style.setProperty("--relPosition", relativePosition ** 0.75)
		} else if (relativePosition < 0) {
			el.style.setProperty("--relPosition", -1 * ((-1 * relativePosition) ** 0.75))
		} else {
			el.style.setProperty("--relPosition", 0)
		}
	})
}
frame()

/***********************
 *    Helper Functions   *
 ***********************/

function mapNumberRange(n, a, b, c, d) {
  return ((n - a) * (d - c)) / (b - a) + c
}

/***********************
 *        Setup        *
 ***********************/

function setup() {
  Array.from(document.querySelectorAll('.card')).map((cardEl) =>
    initCard(cardEl)
  )
}

/***********************
 *      initCard       *
 ***********************/

function initCard(card) {
  const cardContent = card.querySelector('.card__content')
  const gloss = card.querySelector('.card__gloss')

  requestAnimationFrame(() => {
    gloss.classList.add('card__gloss--animatable')
  })

  card.addEventListener('mousemove', (e) => {
    const pointerX = e.clientX
    const pointerY = e.clientY

    const cardRect = card.getBoundingClientRect()

    const halfWidth = cardRect.width / 2
    const halfHeight = cardRect.height / 2

    const cardCenterX = cardRect.left + halfWidth
    const cardCenterY = cardRect.top + halfHeight

    const deltaX = pointerX - cardCenterX
    const deltaY = pointerY - cardCenterY

    const distanceToCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    const maxDistance = Math.max(halfWidth, halfHeight)

    const degree = mapNumberRange(distanceToCenter, 0, maxDistance, 0, 10)

    const rx = mapNumberRange(deltaY, 0, halfWidth, 0, 1)
    const ry = mapNumberRange(deltaX, 0, halfHeight, 0, 1)

    cardContent.style.transform = `perspective(400px) rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`

    gloss.style.transform = `translate(${-ry * 100}%, ${-rx * 100}%) scale(2.4)`

    gloss.style.opacity = `${mapNumberRange(
      distanceToCenter,
      0,
      maxDistance,
      0,
      0.6
    )}`
  })

  card.addEventListener('mouseleave', () => {
    cardContent.style = null
    gloss.style.opacity = 0
  })
}

/***********************
 *      Start Here     *
 ***********************/

setup()