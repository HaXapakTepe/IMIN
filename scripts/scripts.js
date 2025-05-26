document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.header')
	const body = document.querySelector('body')
	const burger = document.querySelector('.burger')
	const menu = document.querySelector('.menu')
	const up = document.querySelector('.up')
	const info = document.querySelector('.info')

	let isLoaded = false
	function loadCSS(url) {
		var link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = url
		var stylesheets = document.querySelectorAll('link[rel="stylesheet"]')
		var targetStylesheet = Array.from(stylesheets).find(sheet => sheet.href.includes('style.min.css'))

		if (targetStylesheet) {
			targetStylesheet.parentNode.insertBefore(link, targetStylesheet)
		} else {
			document.head.appendChild(link)
		}
	}

	function loadJS(url, callback) {
		var script = document.createElement('script')
		script.src = url
		script.defer = true
		script.onload = callback
		document.body.appendChild(script)
	}

	loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css')

	function handleFirstInteraction() {
		if (isLoaded) return
		isLoaded = true

		loadJS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', function () {
			if (typeof Swiper !== 'undefined') {
				if (document.querySelector('.reviews__swiper')) {
					new Swiper('.reviews__swiper', {
						slidesPerView: 1,
						loop: true,
						effect: 'fade',
						pagination: {
							el: '.reviews__pagination',
						},
						navigation: {
							nextEl: '.reviews__arrow-next',
							prevEl: '.reviews__arrow-prev',
						},
					})
				}
			}
		})
	}

	document.addEventListener('click', handleFirstInteraction)
	document.addEventListener('scroll', handleFirstInteraction)
	document.addEventListener('keydown', handleFirstInteraction)
	document.addEventListener('touchstart', handleFirstInteraction)
	document.addEventListener('mousemove', handleFirstInteraction)

	// to top
	if (up) {
		function toTop() {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			})
		}

		function toggleUpButton() {
			const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
			up.classList.toggle('up--visible', scrollTop > 500)
		}

		up.addEventListener('click', toTop)
		window.addEventListener('scroll', toggleUpButton)

		if (document.querySelector('.aff--brandFixed')) {
			const block = document.querySelector('.aff--brandFixed')

			if (innerWidth <= 992) {
				if (up) {
					up.style.bottom = 8 + block.clientHeight + header.clientHeight + 'px'
				}
			}
		}
	}

	// header
	if (header) {
		window.addEventListener('scroll', function () {
			const header = document.querySelector('header')

			if (this.innerWidth > 992) {
				if (window.scrollY > 0) {
					header.classList.add('header--scrolled')
				} else {
					header.classList.remove('header--scrolled')
				}
			}
		})
	}

	// menu
	if (menu) {
		const toggleMenu = () => {
			menu.classList.toggle('menu--active')
			burger.classList.toggle('burger--active')
			body.classList.toggle('no-scroll')
		}

		const clickOutsideMenu = event => {
			if (!menu.contains(event.target) && !burger.contains(event.target)) {
				menu.classList.remove('menu--active')
				burger.classList.remove('burger--active')
				body.classList.remove('no-scroll')
			}
		}

		burger.addEventListener('click', toggleMenu)
		document.addEventListener('click', clickOutsideMenu)

		if (innerWidth < 993) {
			burger.classList.remove('accordionIndex--active')
		}
	}

	if (info) {
		const infoItem = document.querySelectorAll('.info__item')

		infoItem.forEach(item => {
			const btn = item.querySelector('.showModal')
			const close = item.querySelector('.info__modal-close')
			const modal = item.querySelector('.info__modal')

			btn?.addEventListener('click', e => {
				modal?.classList.add('info__modal--active')
				setTimeout(() => {
					body.classList.add('no-scroll')
				}, 100)
			})

			close?.addEventListener('click', e => {
				body.classList.remove('no-scroll')
				modal?.classList.remove('info__modal--active')
			})
		})
	}

	// accordionIndex
	function initAccordion() {
		const accordionIndexes = document.querySelectorAll('.accordionIndex')
		const accordionIndexContents = document.querySelectorAll('.accordionIndex-content')

		accordionIndexes.forEach((accordion, index) => {
			const content = accordionIndexContents[index]

			if (accordion.classList.contains('accordionIndex--active')) {
				content.style.maxHeight = content.scrollHeight + 'px'
			} else {
				content.style.maxHeight = '0'
			}

			accordion.addEventListener('click', e => {
				e.preventDefault()
				accordion.classList.toggle('accordionIndex--active')
				if (accordion.classList.contains('accordionIndex--active')) {
					content.style.maxHeight = content.scrollHeight + 'px'
				} else {
					content.style.maxHeight = '0'
				}
			})
		})
	}

	initAccordion()

	// Smooth scrolling to target element with header offset
	const headerOffset = document.querySelector('header').offsetHeight

	function smoothScroll(event) {
		event.preventDefault()

		const targetId = this.getAttribute('href').substring(1)
		const targetElement = document.getElementById(targetId)

		if (targetElement) {
			const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset
			window.scrollTo({
				top: elementPosition,
				behavior: 'smooth',
			})
		}
	}

	// scroll to link
	document.body.addEventListener('click', event => {
		const link = event.target.closest('a[href^="#"]')
		if (link) {
			smoothScroll.call(link, event)
		}
	})

	AOS.init({
		disable: window.innerWidth < 992,
	})

	window.addEventListener('resize', () => {
		AOS.refresh()
	})
})
