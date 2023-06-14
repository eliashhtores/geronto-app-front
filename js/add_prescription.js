// @TODO Remove all jquery
const url = new URL(window.location.href)
const patient_id = url.searchParams.get('patient_id')
const blood_pressure = document.querySelector('#blood_pressure')
const oxygen_saturation = document.querySelector('#oxygen_saturation')
const heart_rate = document.querySelector('#heart_rate')
const breathing_frequency = document.querySelector('#breathing_frequency')
const temperature = document.querySelector('#temperature')
const current_condition = document.querySelector('#current_condition')
const physical_examination = document.querySelector('#physical_examination')
const indications = document.querySelector('#indications')
const print_prescription = document.querySelector('#print_prescription')
const name = document.querySelector('#name')
const age = document.querySelector('#age')
const gender = document.querySelector('#gender')
const height = document.querySelector('#height')
const weight = document.querySelector('#weight')
const allergies = document.querySelector('#allergies')
const pathological_personal_history = document.querySelector('#pathological_personal_history')
const medication = document.querySelector('#medication')
const medicationForm = document.querySelector('#medication-form')
const medicationTable = document.querySelector('#medication-table')
const medicationTableBody = document.querySelector('#medication-table-body')
const medicationPrescriptionTable = document.querySelector('#medication-prescription-table')
const medicationPrescriptionTableBody = document.querySelector('#medication-prescription-table-body')
const diagnostic = document.querySelector('#diagnostic')
const diagnosticForm = document.querySelector('#diagnostic-form')
const diagnosticTable = document.querySelector('#diagnostic-table')
const diagnosticTableBody = document.querySelector('#diagnostic-table-body')
const diagnosticPrescriptionTable = document.querySelector('#diagnostic-prescription-table')
const diagnosticPrescriptionTableBody = document.querySelector('#diagnostic-prescription-table-body')
const addDiagnostic = document.querySelector('#add-diagnostic')
const addMedication = document.querySelector('#add-medication')


const add_prescription = (data) => {
    http.post(`${server}/prescription`, data)
        .then((response) => {
            window.open(`print_prescription.html?id=${response[0].insertId}`)
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
    http.get(`${server}/patient/${patient_id}`)
        .then((response) => {
            const current_date = getCurrentDate()
            name.value = response.name
            age.value = Math.abs(new Date(new Date(response.birth_date) - new Date(current_date)).getUTCFullYear() - 1970)
            gender.value = response.gender
            height.value = response.height
            weight.value = response.weight
            allergies.innerHTML = response.allergies
            pathological_personal_history.innerHTML = response.pathological_personal_history
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const getMedications = (string) => {
    http.get(`${server}/medication/search/${string}`)
        .then((response) => {
            if (response.status === 404) {
                createNotification('No se encontraron medicamentos.', 'warning')
                medicationTable.classList.add('d-none')
                return
            }
            medicationTableBody.innerHTML = ''
            medicationTable.classList.remove('d-none')
            response.forEach((medication) => {
                medicationTableBody.innerHTML += `
                <tr id="${medication.id}">
                    <td>${medication.active_substance}</td>
                    <td>${medication.dose}</td>
                    <td>${medication.presentation}</td>
                    <td>${medication.name}</td>
                    <td>
                        <div class="custom-control custom-checkbox mb-3">
                            <input type="checkbox" class="custom-control-input" name="medication" id="checkbox-${medication.id}">
                            <label class="custom-control-label" for="checkbox-${medication.id}"></label>
                        </div>
                    </td>
                </tr>
                `
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const getDiagnostics = (string) => {
    http.get(`${server}/diagnostic/search/${string}`)
        .then((response) => {
            if (response.status === 404) {
                createNotification('No se encontraron diagnósticos.', 'warning')
                diagnosticTable.classList.add('d-none')
                return
            }
            diagnosticTableBody.innerHTML = ''
            diagnosticTable.classList.remove('d-none')
            response.forEach((diagnostic) => {
                diagnosticTableBody.innerHTML += `
                <tr id="${diagnostic.id}">
                    <td>${diagnostic.name}</td>
                    <td>
                        <div class="custom-control custom-checkbox mb-3">
                            <input type="checkbox" class="custom-control-input" name="diagnostic" id="checkbox-${diagnostic.id}">
                            <label class="custom-control-label" for="checkbox-${diagnostic.id}"></label>
                        </div>
                    </td>
                </tr>
                `
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}


print_prescription.addEventListener('click', (e) => {
    e.preventDefault()
    if (current_condition.value === '' || indications.value === '') {
        createNotification('Favor de ingresar todos los datos.', 'warning')
        return
    }
    const data = {
        blood_pressure: blood_pressure.value,
        oxygen_saturation: oxygen_saturation.value,
        heart_rate: heart_rate.value,
        breathing_frequency: breathing_frequency.value,
        temperature: temperature.value,
        current_condition: current_condition.value,
        indications: indications.value,
        physical_examination: physical_examination.value,
        patient_id,
    }
    data.created_by = getUserID()

    data.medication = []
    for (let i = 0; i < medicationPrescriptionTableBody.rows.length; i++)
        data.medication[i] = medicationPrescriptionTableBody.rows[i].id

    data.diagnostic = []
    for (let i = 0; i < diagnosticPrescriptionTableBody.rows.length; i++)
        data.diagnostic[i] = diagnosticPrescriptionTableBody.rows[i].id

    add_prescription(data)
})

medicationForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (medication.value.length === 0)
        return

    getMedications(medication.value.replaceAll('/', '%2F'))
})

addMedication.addEventListener('click', () => {
    const medications = Array.from(document.querySelectorAll('[name="medication"]:checked'))

    if (medications.length === 0) {
        createNotification('Seleccione al menos una medicina.', 'warning')
        return
    }

    medicationPrescriptionTable.classList.remove('d-none')
    $('#medicationModal').modal('hide')

    medications.map(medication => {
        const tr = medication.parentElement.parentElement.parentElement
        medicationPrescriptionTableBody.appendChild(tr)
    })
})

addDiagnostic.addEventListener('click', () => {
    const diagnostics = Array.from(document.querySelectorAll('[name="diagnostic"]:checked'))

    if (diagnostics.length === 0) {
        createNotification('Seleccione al menos un diagnóstico.', 'warning')
        return
    }

    diagnosticPrescriptionTable.classList.remove('d-none')
    $('#diagnosticModal').modal('hide')

    diagnostics.map(diagnostic => {
        const tr = diagnostic.parentElement.parentElement.parentElement
        diagnosticPrescriptionTableBody.appendChild(tr)
    })
})

$('#medicationModal').on('hidden.bs.modal', function () {
    medicationTable.classList.add('d-none')
    medication.value = ''
})

$('#diagnosticModal').on('hidden.bs.modal', function () {
    diagnosticTable.classList.add('d-none')
    diagnostic.value = ''
})

diagnosticForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (diagnostic.value.length === 0)
        return

    getDiagnostics(diagnostic.value.replaceAll('/', '%2F'))
})

getPatientData()