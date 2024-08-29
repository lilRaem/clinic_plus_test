document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('.boxForm').addEventListener('click', function (e) {
		if (e.target && e.target.id === 'btn-submit') {
			e.preventDefault()

			var currentForm = e.currentTarget.querySelector('form')
			currentForm.querySelectorAll('.formerror').forEach(function (error) {
				error.textContent = ''
			})
			ValidName(currentForm, 'name', '.formErrName')
			ValidMail(currentForm, 'email', '.formErrEmail')
			ValidPhone(currentForm, 'phone', '.formErrPhone')
			if (!ValidName(currentForm, 'name', '.formErrName')) return false
			if ($(currentForm).find('#email')[0].length != 0) {
				if (!ValidMail(currentForm, 'email', '.formErrEmail')) return false
			}
			if (!ValidPhone(currentForm, 'phone', '.formErrPhone')) return false

			var xhr = new XMLHttpRequest()
			xhr.open('POST', 'main.php', true)
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var response = JSON.parse(xhr.responseText)
						if (response.status === 'error') {
							console.error('Ошибка: ' + response.message)
						} else {
							console.log('sends')

							document.querySelector('.statusSend').classList.add('statusSucces')
							document.querySelector('.statusSend').style.opacity = '1'
							document.querySelector('.statusSend').style.visibility = 'visible'
							currentForm.querySelectorAll('input').forEach(function (input) {
								input.disabled = true
							})
							var submitButton = currentForm.querySelector('#btn-submit')
							submitButton.style.cursor = 'default'
							submitButton.style.backgroundColor = '#2770f1'
							currentForm
								.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]')
								.forEach(function (input) {
									input.value = ''
								})
						}
					} else {
						console.error('some error', xhr.statusText)
						document.querySelector('.statusSend').innerHTML =
							'Ошибка отправки.<br>Попробуйте обновить страницу'
						document.querySelector('.statusSend').classList.add('statusErr')
						document.querySelector('.statusSend').style.opacity = '1'
						document.querySelector('.statusSend').style.visibility = 'visible'
					}
				}
			}
			var params =
				'name=' +
				encodeURIComponent(currentForm.querySelector('#name').value) +
				'&email=' +
				encodeURIComponent(currentForm.querySelector('#email').value) +
				'&phone=' +
				encodeURIComponent(cleanPhoneNumber(currentForm.querySelector('#phone').value))
			xhr.send(params)
		}
	})

	function ValidName(currentForm, namefield, fielderror) {
		var re = /^(^[А-я]{3,}$)|(^[А-я]+\s[А-я]+$)|(^[А-я]+\s[А-я]+\s[А-я]+$)$/
		var errorElement = currentForm.querySelector(fielderror)
		errorElement.innerHTML = ''
		errorElement.previousElementSibling.style.border = 'solid 1px #c6c6c6'
		var nameValue = currentForm.querySelector('#' + namefield).value
		if (nameValue !== '') {
			var valid = re.test(nameValue.trim())
			if (!valid) {
				var output = 'Проверьте Имя!'
				errorElement.innerHTML = output
				errorElement.previousElementSibling.style.border = 'solid 1px red'
				return false
			}
			return true
		} else {
			var output = 'Введите свое Имя!'
			errorElement.innerHTML = output
			errorElement.previousElementSibling.style.border = 'solid 1px red'
			return false
		}
	}

	function ValidPhone(currentForm, namefield, fielderror) {
		var re =
			/^(^7\d{10})|(^8\d{10})|(^\+\d{11})|(^\+\d+\s\(\d+\)\s\d{3}\-\d{2}-\d{2})|(^\+7\s\d{3}\s\d{3}-\d{2}-\d{2})|(^\+\d{3}\s\(\d{4}\)\s\d{5})$/
		var errorElement = currentForm.querySelector(fielderror)
		errorElement.innerHTML = ''
		errorElement.previousElementSibling.style.border = 'solid 1px #c6c6c6'
		var phoneValue = currentForm
			.querySelector('#' + namefield)
			.value.replace(/\D+/g, '')
			.replace(' ', '')
		if (phoneValue !== '') {
			var valid = re.test(phoneValue.trim())
			if (!valid) {
				var output = 'Номер телефона введен неправильно!'
				errorElement.innerHTML = output
				errorElement.previousElementSibling.style.border = 'solid 1px red'
				return false
			}
			return true
		} else {
			var output = 'Введите номер телефона!'
			errorElement.innerHTML = output
			errorElement.previousElementSibling.style.border = 'solid 1px red'
			return false
		}
	}

	function ValidMail(currentForm, namefield, fielderror) {
		var re = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/
		var errorElement = currentForm.querySelector(fielderror)
		errorElement.innerHTML = ''
		errorElement.previousElementSibling.style.border = 'solid 1px #c6c6c6'
		var mailValue = currentForm.querySelector('#' + namefield).value
		if (mailValue !== '') {
			var valid = re.test(mailValue)
			if (!valid) {
				var output = 'Адрес электронной почты введен неправильно!'
				errorElement.innerHTML = output
				errorElement.previousElementSibling.style.border = 'solid 1px red'
				return false
			}
			return true
		} else {
			var output = 'Введите адрес электронной почты!'
			errorElement.innerHTML = output
			errorElement.previousElementSibling.style.border = 'solid 1px red'
			return false
		}
	}

	function cleanPhoneNumber(phoneNumber) {
		return phoneNumber.replace(/[+\s()-]/g, '')
	}
})
