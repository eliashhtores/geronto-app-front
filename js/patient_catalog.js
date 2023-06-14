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
                    <td>${patient.name}</td>
                    <td>
                        <a href="view_patient.html?id=${patient.id}"><button type="button" class="btn btn-info btn-xs">Ver información <i class="fa fa-user"></i></button></a>
                    </td>
                    <td>
                        <a href="view_prescriptions.html?patient_id=${patient.id}"><button type="button" class="btn btn-success btn-xs">Ver consultas <i class="fa fa-search"></i></button></a>
                    </td>
                    <td>
                        <a href="add_prescription.html?patient_id=${patient.id}"><button type="button" class="btn btn-primary btn-xs">Nueva consulta <i class="fa fa-file-o"></i></button></a>
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
