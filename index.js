// your code goes here ...
'use strict'

// Setting up them variablez

var age = document.querySelector('input[name=age]')
var relationship = document.querySelector('select[name=rel]')
var smoker = document.querySelector('input[name=smoker]')
var add = document.querySelector('button.add')
var submit = document.querySelector('button[type=submit]')
var household = document.querySelector('ol.household')
var debug = document.querySelector('pre.debug')

debug.style.display = 'none'

// State Management

var STATE = {
	form: defaultForm(),
	household: []
}

function defaultForm() {
	return {
		guid: null,
		age: '',
		rel: '',
		smoker: false
	}
}

// UI Interactions

function addMember(event) {
	event.preventDefault()
	var form = STATE.form
	if (!validateInput(form)) return
	form.guid = Date.now()
	STATE.household.push(Object.assign({}, form))
	updateHouseholdListInDOM()
	resetForm()
}

function deleteHouseholdMember(event) {
	var guid = event.target.id
	STATE.household = STATE.household.filter(function (item) {
		return item.guid != guid
	})
	updateHouseholdListInDOM()
}

function submitForm(event) {
	event.preventDefault()
	debug.innerText = JSON.stringify(STATE.household, null, 2)
	debug.style.display = 'block'
}

// Form Management

function resetForm() {
	age.value = ''
	relationship.value = ''
	smoker.checked = false
	STATE.form = defaultForm()
}

function validateInput(form) {
	try {
		var age = parseInt(form.age)
		if (!age || isNaN(age) || age <= 0) {
			throw ageError
		}
		if (form.rel === '') {
			throw relationshipError
		}
		return true
	} catch (error) {
		console.error(error)
		alert(error)
		return false
	}
}

// DOM Manipulation

function updateHouseholdListInDOM() {
	// Something I didn't know before… Array.prototype.reduce (as well as map and filter) were
	// actually introduced in ES5, and not ES6 as I had originally thought.
	// The More You Know 🌠
	var householdList = STATE.household.reduce(householdListReducer, '')
	household.innerHTML = householdList
}

function mutationEvent(e) {
	var form = STATE.form
	var target = e.target
	switch (target.type) {
		case 'checkbox':
			form[target.name] = target.checked
			target.checked = form[target.name]
			break
		default:
			form[target.name] = target.value
			target.value = form[target.name]
			break
	}
}

// Reducer

function householdListReducer(acc, cur) {
	var smokeStatus = cur.smoker ? '🚬' : '🚭'
	var newListItem =
		'<li>' +
		cur.rel +
		', ' +
		cur.age +
		' ' +
		smokeStatus +
		' <button onclick="deleteHouseholdMember(event)" id="' +
		cur.guid +
		'">Delete</button></li>'
	return (acc += newListItem)
}

// Event Listeners

add.addEventListener('click', addMember)
submit.addEventListener('click', submitForm)
age.oninput = mutationEvent
relationship.onchange = mutationEvent
smoker.onchange = mutationEvent

// Error Messages

var ageError = new Error(
	'Please specify an age (Hint: it must be a number and greater than 0)'
)
ageError.name = 'Invalid Age'

var relationshipError = new Error('Please select a relationship')
relationshipError.name = 'Invalid Relationship'
