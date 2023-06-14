const url = new URL(window.location.href)
const server = 'http://localhost:3000'
const http = new EasyHTTP()
const prescription_id = url.searchParams.get('id')

const name = document.querySelector('.name')
const age = document.querySelector('.age')
const calculatedAge = document.querySelector('#age')
const date = document.querySelector('.date')
const male = document.querySelector('.male')
const female = document.querySelector('.female')
const weight = document.querySelector('.weight')
const height = document.querySelector('.height')
const blood_pressure = document.querySelector('.blood_pressure')
const oxygen_saturation = document.querySelector('.oxygen_saturation')
const heart_rate = document.querySelector('.heart_rate')
const breathing_frequency = document.querySelector('.breathing_frequency')
const allergies = document.querySelector('.allergies')
const temperature = document.querySelector('.temperature')
const medication = document.querySelector('.medication')
const indications = document.querySelector('.indications')

const getMedications = () => {
    http.get(`${server}/medication/prescription/${prescription_id}`)
        .then((response) => {
            medication.innerHTML = ''
            for (const medicine in response) {
                if (Object.hasOwnProperty.call(response, medicine)) {
                    const element = response[medicine];
                    medication.innerHTML += `
                        <li>${element.active_substance}, ${element.dose}, ${element.presentation}</li>
                    `
                }
            }
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return [year, month, day].join('-')
}

const getPatientData = () => {
    http.get(`${server}/prescription/${prescription_id}`)
        .then((response) => {
            const current_date = getCurrentDate()
            name.innerText = response.name
            calculatedAge.innerText = Math.abs(new Date(new Date(response.birth_date) - new Date(current_date)).getUTCFullYear() - 1970) + ' años'
            response.gender == 'male' ? (male.innerText = 'X') : (female.innerText = 'X')
            date.innerText = response.created_at
            weight.innerText = `${response.weight} kgs`
            height.innerText = `${response.height} mts`
            blood_pressure.innerHTML = response.blood_pressure
            oxygen_saturation.innerHTML = response.oxygen_saturation
            heart_rate.innerHTML = response.heart_rate
            breathing_frequency.innerHTML = response.breathing_frequency
            allergies.innerText = response.allergies
            temperature.innerText = `${response.temperature} °C`
            indications.innerText = response.indications
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

getMedications()
getPatientData()