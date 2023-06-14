const patients = document.querySelector('#patients')
const form = document.querySelector('form')
const name = document.querySelector('#name')
const tbody = document.querySelector('tbody')
const submit_btn = document.querySelector('#submit-btn')
const not_found = document.querySelector('#not-found')

const getPatients = () => {
    http.get(`${server}/patient/patient_name/${name.value}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                patients.classList.add('d-none')
                return
            }
            not_found.classList.add('d-none')
            patients.classList.remove('d-none')
            tbody.innerHTML = ''
            response.forEach((patient) => {
                tbody.innerHTML += `
                <tr>
                    <td class="text-left">${patient.name}</td>
                    <td>
                        <a href="add_prescription.html?id=${patient.id}"><button type="button" class="btn btn-success btn-xs">Crear receta <i class="fa fa-file-text-o"></i></button></a>
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

form.addEventListener('submit', (e) => {
    getPatients()
    e.preventDefault()
})

submit_btn.addEventListener('click', (e) => {
    getPatients()
    e.preventDefault()
})
