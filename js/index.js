const http = new EasyHTTP()
const username = document.querySelector('#username')
const password = document.querySelector('#password')
const submit = document.querySelector('#submit')

let server = 'http://localhost:3000'
if (window.location.hostname !== '127.0.0.1')
    server = 'https://drab-jade-cricket-tam.cyclic.app'

const createSession = (data) => {
    const storage = localStorage
    let session = []
    session.push(data)
    storage.setItem('session', JSON.stringify(session))
}

const redirect = () => {
    window.location.replace('patient_catalog.html')
}

const createNotification = (text, status) => {
    new Notify({
        text,
        autoclose: true,
        autotimeout: 3000,
        status,
        effect: 'fade',
        speed: 300,
    })
}

submit.addEventListener('click', (e) => {
    let data = {
        username: username.value,
        password: password.value,
    }
    const url = `${server}/user/validate`

    http.post(url, data)
        .then((response) => {
            if (response.status == 500) {
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                console.error(response.message)
                return
            }
            if (response.length == 0) {
                createNotification('Favor de verificar su usuario y contraseña.', 'warning')
                return
            }
            createSession(response)
            redirect()
        })
        .catch((err) => {
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            console.error(err)
        })

    e.preventDefault()
})
