$(document).ready(function () {
	$('#phone').inputmask('+7 (999) 999-99-99', { placeholder: 'O' })
	$('#phone').on('focus', function () {
		if ($(this).val() === '') {
			$(this).val('+7 (___) ___-__-__')
		}
	})

	$('#phone').on('blur', function () {
		var input = $(this).val().replace(/\D/g, '') // Удаляем все нецифровые символы
		if (input.length < 11) {
			$(this).val('') // Очищаем поле ввода при потере фокуса, если введено недостаточное количество цифр
		}
	})

	$('.boxForm').on('click', '#btn-submit', function (e) {
		e.preventDefault()

		var currentForm = e.delegateTarget.children.form
		$(currentForm).find('.formerror').text('')
		if (!ValidName(currentForm, 'name', '.formErrName')) return false
		// console.log($(currentForm).find('#email')[0])
		if ($(currentForm).find('#email')[0].length != 0) {
			// console.log($(currentForm).find('#email')[0].length)
			if (!ValidMail(currentForm, 'email', '.formErrEmail')) return false
		}
		if (!ValidPhone(currentForm, 'phone', '.formErrPhone')) return false

		$.ajax({
			url: 'main.php',
			type: 'POST',
			data: {
				name: $(currentForm).find('#name').val(),
				email: $(currentForm).find('#email').val(),
				phone: cleanPhoneNumber($(currentForm).find('#phone').val()),
			},
			success: function (response) {
				if (response.status === 'error') {
					console.error('Ошибка: ' + response.message)
				} else {
					$('.statusSend').addClass('statusSucces')
					$('.statusSend').css({
						opacity: '1',
						visibility: 'visible',
					})
					$(currentForm).find('input').attr('disabled', 'disabled')
					$(currentForm).find('#btn-submit').css({ cursor: 'default' })
					$(currentForm).find('#btn-submit').hover({ 'background-color': '#2770f1' })
					$(currentForm).find('input[type="text"], input[type="email"], input[type="tel"]').val('')
				}
			},
			error: function (xhr, status, error) {
				console.error('some error', error, status)
				$('.statusSend').html('Ошибка отправки.<br>Попробуйте обновить страницу')
				$('.statusSend').addClass('statusErr')
				$('.statusSend').css({
					opacity: '1',
					visibility: 'visible',
				})
			},
		})
	})

	function ValidName(currentForm, namefield, fielderror) {
		var re = /^(^[А-я]{3,}$)|(^[А-я]+\s[А-я]+$)|(^[А-я]+\s[А-я]+\s[А-я]+$)$/
		$(currentForm).find(fielderror)[0].innerHTML = ''
		$(currentForm).find(fielderror).prev().css({
			border: 'solid 1px #c6c6c6',
		})
		if (
			$(currentForm)
				.find('#' + namefield)
				.val() != ''
		) {
			var myName = $(currentForm)
				.find('#' + namefield)
				.val()
			var valid = re.test(myName.trim())
			if (!valid) {
				output = 'Проверьте Имя!'
				$(currentForm).find(fielderror)[0].innerHTML =
					$(currentForm).find(fielderror)[0].innerHTML.replace(output, '') + ' ' + output
				$(currentForm).find(fielderror).prev().css({
					border: 'solid 1px red',
				})
				return false
			} else {
				output = ''
				$(currentForm).find(fielderror)[0].innerHTML =
					$(currentForm).find(fielderror)[0].innerHTML + ' ' + output
				return valid
			}
		} else {
			output = 'Введите свое Имя!'

			$(currentForm).find(fielderror)[0].innerHTML =
				$(currentForm).find(fielderror)[0].innerHTML.replace(output, '') + ' ' + output
			$(currentForm).find(fielderror).prev().css({
				border: 'solid 1px red',
			})
		}
		return false
	}

	function ValidPhone(currentForm, namefield, fielderror) {
		var re =
			/^(^7\d{10})|(^8\d{10})|(^\+\d{11})|(^\+\d+\s\(\d+\)\s\d{3}\-\d{2}-\d{2})|(^\+7\s\d{3}\s\d{3}-\d{2}-\d{2})|(^\+\d{3}\s\(\d{4}\)\s\d{5})$/
		$(currentForm).find(fielderror)[0].innerHTML = ''
		$(currentForm).find(fielderror).prev().css({
			border: 'solid 1px #c6c6c6',
		})
		if (
			$(currentForm)
				.find('#' + namefield)
				.val() != ''
		) {
			var myPhone = $(currentForm)
				.find('#' + namefield)
				.val()
				.replace(/\D+/g, '')
				.replace(' ', '')
			var valid = re.test(myPhone.trim())
			if (!valid) {
				output = 'Номер телефона введен неправильно!'
				$(currentForm).find(fielderror)[0].innerHTML =
					$(currentForm).find(fielderror)[0].innerHTML.replace(output, '') + ' ' + output
				$(currentForm).find(fielderror).prev().css({
					border: 'solid 1px red',
				})
				return false
			} else {
				output = ''
				$(currentForm).find(fielderror)[0].innerHTML =
					$(currentForm).find(fielderror)[0].innerHTML + ' ' + output
				return valid
			}
		} else {
			output = 'Введите номер телефона!'
			$(currentForm).find(fielderror)[0].innerHTML =
				$(currentForm).find(fielderror)[0].innerHTML.replace(output, '') + ' ' + output
			$(currentForm).find(fielderror).prev().css({
				border: 'solid 1px red',
			})
		}
		return false
	}

	function ValidMail(currentForm, namefield, fielderror) {
		var re = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/
		$(currentForm).find(fielderror)[0].innerHTML = ''
		$(currentForm).find(fielderror).prev().css({
			border: 'solid 1px #c6c6c6',
		})
		if (
			$(currentForm)
				.find('#' + namefield)
				.val() != ''
		) {
			var myMail = $(currentForm)
				.find('#' + namefield)
				.val()
			var valid = re.test(myMail)
			if (!valid) {
				output = 'Адрес электронной почты введен неправильно!'
				$(currentForm).find(fielderror)[0].innerHTML =
					$(currentForm).find(fielderror)[0].innerHTML.replace(output, '') + ' ' + output
				$(currentForm).find(fielderror).prev().css({
					border: 'solid 1px red',
				})
				return false
			} else {
				output = ''
				$(currentForm).find(fielderror)[0].innerHTML =
					$(currentForm).find(fielderror)[0].innerHTML + ' ' + output
				return valid
			}
		} else {
			output = 'Введите адрес электронной почты!'
			$(currentForm).find(fielderror)[0].innerHTML =
				$(currentForm).find(fielderror)[0].innerHTML.replace(output, '') + ' ' + output
			$(currentForm).find(fielderror).prev().css({
				border: 'solid 1px red',
			})
		}
		return false
	}
	function cleanPhoneNumber(phoneNumber) {
		return phoneNumber.replace(/[+\s()-]/g, '')
	}
})
