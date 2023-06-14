const diagnostics = document.querySelector('#diagnostics')
const form = document.querySelector('form')
const diagnostic_name = document.querySelector('#diagnostic_name')
const tbody = document.querySelector('tbody')
const submit_btn = document.querySelector('#submit-btn')
const not_found = document.querySelector('#not-found')

const getDiagnostics = () => {
    http.get(`${server}/diagnostic/search/${diagnostic_name.value.replaceAll('/', '%2F')}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                diagnostics.classList.add('d-none')
                return
            }
            not_found.classList.add('d-none')
            diagnostics.classList.remove('d-none')
            tbody.innerHTML = ''
            response.forEach((diagnostic) => {
                tbody.innerHTML += `
                <tr>
                    <td class="text-left">${diagnostic.name}</td>
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
    getDiagnostics()
    e.preventDefault()
})

submit_btn.addEventListener('click', (e) => {
    getDiagnostics()
    e.preventDefault()
})
