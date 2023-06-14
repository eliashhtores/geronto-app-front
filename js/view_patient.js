const patient_name = document.querySelector('#patient-name')
const editButton = document.querySelector('#edit-button')
const id = window.location.href.split('?id=').reverse()[0]

const getPatient = () => {
    const birthDate = document.querySelector('#birth_date')
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
            patient_name.innerHTML = response.name
            birthDate.innerHTML = response.birth_date
            gender.innerHTML = response.gender == 'male' ? 'Masculino' : 'Femenino'
            height.innerHTML = response.height
            weight.innerHTML = response.weight
            allergies.innerHTML = response.allergies
            family_history.innerHTML = response.family_history
            pathological_personal_history.innerHTML = response.pathological_personal_history
            non_pathological_personal_history.innerHTML = response.non_pathological_personal_history
            surgical_history_hospitalizations.innerHTML = response.surgical_history_hospitalizations
            gynecological_history.innerHTML = response.gynecological_history
            laboratories_xray.innerHTML = response.laboratories_xray
            editButton.innerHTML = `<a href="edit_patient.html?id=${id}"><button type="button" class="btn btn-secondary btn-xs">Editar información <i class="fa fa-edit"></i></button></a>`
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

getPatient()