const url = new URL(window.location.href)
const id = url.searchParams.get('id')

const birth_date = document.querySelector('#birth_date')
const edit_patient_form = document.querySelector('#edit-patient-form')
const edit_patient_button = document.querySelector('#edit-patient-button')

const edit_patient = (data) => {
    http.patch(`${server}/patient/${id}`, data)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            createNotification('Información del paciente actualizada.', 'success')
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const getPatient = () => {
    const name = document.querySelector('#name')
    const birth_date = document.querySelector('#birth_date')
    const gender = document.querySelector('#gender')
    const height = document.querySelector('#height')
    const weight = document.querySelector('#weight')
    const allergies = document.querySelector('#allergies')
    const family_history = document.querySelector('#family_history')
    const pathological_personal_history = document.querySelector('#pathological_personal_history')
    const non_pathological_personal_history = document.querySelector('#non_pathological_personal_history')
    const surgical_history_hospitalizations = document.querySelector('#surgical_history_hospitalizations')
    const gynecological_history = document.querySelector('#gynecological_history')
    const laboratories_xray = document.querySelector('#laboratories_xray')
    http.get(`${server}/patient/${id}`)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            name.value = response.name
            birth_date.value = response.birth_date
            gender.value = response.gender
            height.value = response.height
            weight.value = response.weight
            allergies.value = response.allergies
            family_history.value = response.family_history
            pathological_personal_history.value = response.pathological_personal_history
            non_pathological_personal_history.value = response.non_pathological_personal_history
            surgical_history_hospitalizations.value = response.surgical_history_hospitalizations
            gynecological_history.value = response.gynecological_history
            laboratories_xray.value = response.laboratories_xray
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

const validateBirthDate = (e) => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const patient_birth_date = [year, month, day].join('-')
    const age = new Date(new Date(e.target.value) - new Date(patient_birth_date))

    document.querySelector('#height').readonly = true

    if ((Math.abs(age.getUTCFullYear() - 1970)) < 21) {
        document.querySelector('#height').readonly = false
        return
    }
}

birth_date.addEventListener('blur', (e) => {
    validateBirthDate(e)
})

edit_patient_button.addEventListener('click', (e) => {
    e.preventDefault()
    const formData = new FormData(edit_patient_form)
    let data = {}
    for (let pair of formData.entries()) data[pair[0]] = pair[1]
    data.updated_by = getUserID()
    edit_patient(data)
})

getPatient()
