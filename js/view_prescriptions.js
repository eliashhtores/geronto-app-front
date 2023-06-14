const url = new URL(window.location.href)
const patient_id = url.searchParams.get('patient_id')
const tbody = document.querySelector('tbody')
const patient_name = document.querySelector('#patient_name')

const getPrescriptions = () => {
    http.get(`${server}/prescription/patient/${patient_id}`)
        .then((response) => {
            if (response.status === 404) {
                createNotification('El paciente seleccionado no cuenta con ninguna consulta registrada.', 'warning')
                return
            }
            tbody.innerHTML = ''
            patient_name.innerHTML = response[0].patient_name
            response.forEach((prescription) => {
                tbody.innerHTML += `
                <tr id="${prescription.id}">
                    <td class="view-message">${prescription.created_at}</td>
                </tr>
                `
            })
        })
        .then(() => {
            const trs = document.querySelectorAll('tr')
            trs.forEach((tr) => {
                tr.addEventListener('click', (e) => {
                    if (e.target.tagName === 'TD' ) {
                    const id = e.target.parentElement.id
                    window.open(`view_prescription.html?id=${id}`, '_blank').focus()
                    }
                })
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

getPrescriptions()