const medications = document.querySelector('#medications')
const form = document.querySelector('form')
const string = document.querySelector('#string')
const tbody = document.querySelector('tbody')
const submit_btn = document.querySelector('#submit-btn')
const not_found = document.querySelector('#not-found')
const medicationStatus = document.querySelector('#medication-status')
const medicationName = document.querySelector('#medication-name')
const medicationActiveSubstance = document.querySelector('#medication-active-substance')
const medicationDose = document.querySelector('#medication-dose')
const medicationLab = document.querySelector('#medication-lab')
const medicationPresentation = document.querySelector('#medication-presentation')
const medicationCost = document.querySelector('#medication-cost')
const medicationPrice = document.querySelector('#medication-price')
const medicationEmployeePrice = document.querySelector('#medication-employee-price')
const saveButton = document.querySelector('#save-button')
let id

const fillMedicationModal = (response) => {
    const modalTitle = document.querySelector('.modal-title')
    id = response.id

    modalTitle.innerHTML = response.name
    medicationName.value = response.name
    medicationActiveSubstance.value = response.active_substance
    medicationDose.value = response.dose
    medicationLab.value = response.lab
    medicationPresentation.value = response.presentation
    medicationCost.value = response.cost
    medicationPrice.value = response.price
    medicationEmployeePrice.value = response.employee_price

}

const getMedicationData = (id) => {
    http.get(`${server}/medication/${id}`)
        .then((response) => {
            fillMedicationModal(response)
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const attachMedicationListeners = () => {
    const medications = document.querySelectorAll('.medications')
    medications.forEach(medication => {
        medication.addEventListener('click', () => {
            getMedicationData(medication.id)
        })
    })
}

const getMedications = () => {
    http.get(`${server}/medication/search/${string.value.replaceAll('/', '%2F')}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                medications.classList.add('d-none')
                return
            }
            not_found.classList.add('d-none')
            medications.classList.remove('d-none')
            tbody.innerHTML = ''
            response.forEach((medication) => {
                tbody.innerHTML += `
                <tr>
                    <td><a data-toggle="modal" class="medications" data-target="#editMedication" href='#' id=${medication.id}>${medication.barcode}</a></td>
                    <td>${medication.active_substance}</td>
                    <td>${medication.dose}</td>
                    <td>${medication.presentation}</td>
                    <td>${medication.name}</td>
                    <td>${medication.lab}</td>
                    <td>${medication.cost}</td>
                    <td>${medication.price}</td>
                    <td>${medication.employee_price}</td>
                </tr>
                `
                attachMedicationListeners()
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const updateMedication = (data) => {
    http.patch(`${server}/medication/${id}`, data)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            createNotification('Medicina actualizada.', 'success')
            getMedications()
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}


form.addEventListener('submit', (e) => {
    getMedications()
    e.preventDefault()
})

saveButton.addEventListener('click', (e) => {
    e.preventDefault()

    const data = {
        id,
        name: medicationName.value,
        active_substance: medicationActiveSubstance.value,
        dose: medicationDose.value,
        lab: medicationLab.value,
        presentation: medicationPresentation.value,
        cost: medicationCost.value,
        price: medicationPrice.value,
        employeePrice: medicationEmployeePrice.value,
    }

    updateMedication(data)

})

submit_btn.addEventListener('click', (e) => {
    getMedications()
    e.preventDefault()
})
