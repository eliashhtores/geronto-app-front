const add_patient_form = document.querySelector('#add-patient-form')
const add_patient_button = document.querySelector('#add-patient-button')

const add_patient = (data) => {
    http.post(`${server}/patient`, data)
        .then((response) => {
            if (response[0].affectedRows === 1) {
                createNotification('El paciente ha sido agregado.', 'success')
                clearForm()
                return
            }
            console.error(response)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

add_patient_button.addEventListener('click', (e) => {
    e.preventDefault()
    const formData = new FormData(add_patient_form)
    let data = {}
    for (let pair of formData.entries()) data[pair[0]] = pair[1]
    data.created_by = getUserID()
    add_patient(data)
})
