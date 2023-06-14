const url = new URL(window.location.href)
const id = url.searchParams.get('id')
const blood_pressure = document.querySelector('#blood_pressure')
const oxygen_saturation = document.querySelector('#oxygen_saturation')
const heart_rate = document.querySelector('#heart_rate')
const breathing_frequency = document.querySelector('#breathing_frequency')
const temperature = document.querySelector('#temperature')
const current_condition = document.querySelector('#current_condition')
const physical_examination = document.querySelector('#physical_examination')
const indications = document.querySelector('#indications')
const printPrescription = document.querySelector('#print_prescription')
const name = document.querySelector('#name')
const age = document.querySelector('#age')
const gender = document.querySelector('#gender')
const height = document.querySelector('#height')
const weight = document.querySelector('#weight')
const allergies = document.querySelector('#allergies')
const pathological_personal_history = document.querySelector('#pathological_personal_history')
const medicationPrescriptionTable = document.querySelector('#medication-prescription-table')
const medicationPrescriptionTableBody = document.querySelector('#medication-prescription-table-body')
const diagnosticPrescriptionTable = document.querySelector('#diagnostic-prescription-table')
const diagnosticPrescriptionTableBody = document.querySelector('#diagnostic-prescription-table-body')

let username = ''


const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return [year, month, day].join('-')
}

const getPrescriptionData = () => {
    http.get(`${server}/prescription/${id}`)
        .then((response) => {
            const current_date = getCurrentDate()
            username = response.username
            name.value = response.name
            age.value = Math.abs(new Date(new Date(response.birth_date) - new Date(current_date)).getUTCFullYear() - 1970)
            gender.value = response.gender
            height.value = response.height
            weight.value = response.weight
            allergies.innerHTML = response.allergies
            pathological_personal_history.innerHTML = response.pathological_personal_history
            blood_pressure.value = response.blood_pressure
            oxygen_saturation.value = response.oxygen_saturation 
            heart_rate.value = response.heart_rate 
            breathing_frequency.value = response.breathing_frequency 
            temperature.value = response.temperature 
            current_condition.value = response.current_condition
            physical_examination.value = response.physical_examination
            indications.value = response.indications
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const getMedications = () => {
    http.get(`${server}/medication/prescription/${id}`)
        .then((response) => {
            if (response.status !== 404) {
                medicationPrescriptionTable.classList.remove('d-none')
            medicationPrescriptionTableBody.innerHTML = ''
            medicationPrescriptionTable.classList.remove('d-none')
                response.forEach((medication) => {
                    medicationPrescriptionTableBody.innerHTML += `
                    <tr id="${medication.id}">
                        <td>${medication.active_substance}</td>
                        <td>${medication.dose}</td>
                        <td>${medication.presentation}</td>
                        <td>${medication.name}</td>
                    </tr>
                    `
                })
            }
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const getDiagnostics = () => {
    http.get(`${server}/diagnostic/prescription/${id}`)
        .then((response) => {
            if (response.status !== 404) {
                diagnosticPrescriptionTable.classList.remove('d-none')
                diagnosticPrescriptionTableBody.innerHTML = ''
                diagnosticPrescriptionTable.classList.remove('d-none')
                response.forEach((diagnostic) => {
                    diagnosticPrescriptionTableBody.innerHTML += `
                        <td>${diagnostic.name}</td>
                    </tr>
                    `
                })
            }
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

printPrescription.addEventListener('click', () => {
    window.open(`print_prescription_${username}.html?id=${id}`, '_blank')
})

getPrescriptionData()
getMedications()
getDiagnostics()